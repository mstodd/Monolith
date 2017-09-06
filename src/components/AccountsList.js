import React from 'react'
import {AccountSelector} from './AccountSelector.js'

export class AccountsList extends React.Component {
  constructor(props) {
    super(props);

    this.handleAccountSelected = this.handleAccountSelected.bind(this);
  }

  handleAccountSelected(e) {
    this.props.onAccountSelected(e, this);
  }

  render() {
      var self = this;
    return (
        <div className="">
            {self.props.addresses.length > 0 && Object.keys(self.props.addresses).map(function(address) {
            return (
                <div style={{display: 'block'}} key={self.props.addresses[address]}>
                <AccountSelector isSelected={self.props.selectedAddress === self.props.addresses[address]} onAccountSelected={self.handleAccountSelected} address={self.props.addresses[address]} />
                </div>
            );
            })}
        </div>
    );
  }
}