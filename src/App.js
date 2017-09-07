import React, { Component } from 'react'
import MonolithTokenContract from '../build/contracts/MonolithToken.json'
import MonolithTokenExchangeContract from '../build/contracts/MonolithTokenExchange.json'
import getWeb3 from './utils/getWeb3'
import {AccountSelector} from './components/AccountSelector.js'
import {AccountsList} from './components/AccountsList.js'
import {TokenSupply} from './components/TokenSupply.js'
import {FaucetRegistration} from './components/FaucetRegistration.js'
import {Balances} from './components/Balances.js'

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
      remainingSupply: '',
      balance: '',
      tokenBalance: 0,
      sharesBalance: 0,
      tokenAdmin: ''
    }

    this.tokenInstance = null;
    this.tokenExchangeInstance = null;
    this.handleAccountSelected = this.handleAccountSelected.bind(this);
    this.handleFaucetRegistrationClicked = this.handleFaucetRegistrationClicked.bind(this);
    this.handleExchangeTokens = this.handleExchangeTokens.bind(this);
  }

  handleFaucetRegistrationClicked() {
    this.tokenInstance.registerFaucetRecipient({from: this.state.selectedAccountAddress})
      .then((success) =>{

      });
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      });
      return this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    });
  }

  instantiateContract() {
    var self = this;

    const token = contract(MonolithTokenContract);
    token.setProvider(this.state.web3.currentProvider);

    const tokenExchange = contract(MonolithTokenExchangeContract);
    tokenExchange.setProvider(this.state.web3.currentProvider);

    return this.state.web3.eth.getAccounts((error, accounts) => {
      this.state.accounts = accounts;
      this.setSelectedAccount(this.state.accounts[0]);
        return token.deployed()
      .then((tokenInstance) => {
        self.tokenInstance = tokenInstance;
        return tokenExchange.deployed();
      })
      .then((exchangeInstance) => {
        self.tokenExchangeInstance = exchangeInstance;
        self.startBalanceUpdater();
        self.updateTokenValues();
        return self.updateTokenAdmin();
      });
    });
  }

  updateTokenAdmin() {
    var self = this;
    return this.tokenInstance.administrator.call().then((result) => {
      self.setState({tokenAdmin: result});
    });
  }

  updateTokenValues() {
    var self = this;

    return this.tokenInstance.remainingSupply.call().then((result) => {
      this.setState({remainingSupply: result.c[0]});
      return self.tokenInstance.totalSupply.call();
    }).then((result) => {
      return this.setState({totalSupply: result.c[0]});
    });
  }

  startBalanceUpdater() {
    var self = this;
    self.updateBalances();
    setInterval(function updateBalancesInterval() {
      self.updateBalances();
    }, 1000 * 30);
  }

  updateBalances() {
    var self = this;
    this.tokenInstance.balanceOf.call(this.state.selectedAccountAddress).then((result) => {
      self.setState({tokenBalance: result.c[0]});
      return self.tokenExchangeInstance.getPurchasedSharesCount.call(self.state.selectedAccountAddress);
    }).then((exchangeResult) => {
      self.setState({sharesBalance: exchangeResult.c[0]});
    });
  }

  handleExchangeTokens() {
    var self = this;
    this.tokenInstance.approve(this.tokenExchangeInstance.address, this.state.tokenBalance, {from: this.state.selectedAccountAddress})
      .then((result) => {
        return self.tokenExchangeInstance.buyShares(self.state.tokenBalance, {from: self.state.selectedAccountAddress});
      })
      .then((result) => {
          return self.updateBalances();
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
              <FaucetRegistration onRegisterClicked={this.handleFaucetRegistrationClicked}></FaucetRegistration>
              <Balances tokenCount={this.state.tokenBalance} sharesCount={this.state.sharesBalance} handleTokenExchange={this.handleExchangeTokens}></Balances>
            </div>
          </div>
            <AccountsList selectedAddress={self.state.selectedAccountAddress} onAccountSelected={self.handleAccountSelected} addresses={self.state.accounts}></AccountsList>
        </main>
      </div>
    );
  }
}

export default App