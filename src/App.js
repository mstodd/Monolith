import React, { Component } from 'react'
import MonolithTokenContract from '../build/contracts/MonolithToken.json'
import getWeb3 from './utils/getWeb3'
import {AccountSelector} from './components/AccountSelector.js'
import {AccountsList} from './components/AccountsList.js'
import {TokenSupply} from './components/TokenSupply.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      selectedAccountAddress: null,
      accounts: [],
      totalSupply: '',
      remainingSupply: ''
    }

    this.tokenInstance = null;
    this.handleAccountSelected = this.handleAccountSelected.bind(this);
  }

  componentWillMount() {

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      });
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    });
  }

  instantiateContract() {
    var self = this;

    const token = contract(MonolithTokenContract);
    token.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.accounts = accounts;
      this.setSelectedAccount(this.state.accounts[0]);
        token.deployed()
      .then((instance) => {
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