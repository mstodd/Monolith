import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import {AccountSelector} from './components/AccountSelector.js'

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
      accounts: []
    }

    this.simpleStorageInstance = null;
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
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.accounts = accounts;
      this.setSelectedAccount(this.state.accounts[0]);
      simpleStorage.deployed().then((instance) => {
        self.simpleStorageInstance = instance;

        // Stores a given value, 5 by default.
        //return self.simpleStorageInstance.set(8, { from: self.state.selectedAccountAddress });
        return self.storeValue(9);
      })/*.then((result) => {
        // Get the value from the contract to prove it worked.
        return self.simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })*/
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
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
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
        </main>
      </div>
    );
  }
}

export default App
