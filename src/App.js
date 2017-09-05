import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import MonolithTokenContract from '../build/contracts/MonolithToken.json'
import getWeb3 from './utils/getWeb3'
import {AccountSelector} from './components/AccountSelector.js'
import {AccountsList} from './components/AccountsList.js'
import {TokenSupply} from './components/TokenSupply.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      selectedAccountAddress: null,
      accounts: [],
      totalSupply: '',
      remainingSupply: ''
    }

    this.simpleStorageInstance = null;
    this.tokenInstance = null;
    this.handleAccountSelected = this.handleAccountSelected.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    var self = this;

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract);
    const token = contract(MonolithTokenContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);
    token.setProvider(this.state.web3.currentProvider);


    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.accounts = accounts;
      this.setSelectedAccount(this.state.accounts[0]);
      simpleStorage.deployed().then((instance) => {
        self.simpleStorageInstance = instance;
        return self.storeValue(9);
      }).then(() => {
        return token.deployed();
      }).then((instance) => {
        self.tokenInstance = instance;
        return self.updateTokenValues();
      });
    });
  }

  updateTokenValues() {
    var self = this;

    return this.tokenInstance.remainingSupply.call().then((result) => {
      this.setState({remainingSupply: result.c[0]});
      return self.tokenInstance.totalSupply.call();
    }).then((result) => {
      this.setState({totalSupply: result.c[0]});
    });
  }

  storeValue(value){
    var self = this;
    return this.simpleStorageInstance.set(value, {from: this.state.selectedAccountAddress})
      .then((result) => {
        return self.simpleStorageInstance.get.call(self.state.selectedAccountAddress)
      })
      .then((result) => {
        return self.setState({ storageValue: result.c[0]});
      });
  }

  handleAccountSelected(event, account){
    this.setSelectedAccount(account.state.address);
  }

  setSelectedAccount(accountAddress){
    var self = this;
    if(this.simpleStorageInstance){
      this.simpleStorageInstance.get.call(accountAddress, {from: accountAddress})
          .then((result) => {
            return self.setState({
              storageValue: result.c[0],
              selectedAccountAddress: accountAddress
            });
          })
    } else {
      self.setState({
        selectedAccountAddress: accountAddress
      });
    }
  }

  render() {
    var self = this;
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Monolith INC</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Start investing in The Monolith!</h1>
              <TokenSupply total={this.state.totalSupply} remaining={this.state.remainingSupply}></TokenSupply>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
          <div className="">
              {Object.keys(self.state.accounts).map(function(account) {
                return (
                  <div style={{display: 'block'}} key={self.state.accounts[account]}>
                    <AccountSelector isSelected={self.state.selectedAccountAddress == self.state.accounts[account]} onAccountSelected={self.handleAccountSelected} address={self.state.accounts[account]} />
                  </div>
                );
              })}
            </div>
            <AccountsList selectedAddress={self.state.selectedAccountAddress} onAccountSelected={self.handleAccountSelected} addresses={self.state.accounts}></AccountsList>
        </main>
      </div>
    );
  }
}

export default App