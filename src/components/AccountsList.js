import React from 'react'
import {AccountSelector} from './AccountSelector.js'

export class AccountsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showList: false
    };

    this.handleAccountSelected = this.handleAccountSelected.bind(this);
    this.handleChangeAccountClick = this.handleChangeAccountClick.bind(this);
  }

  handleChangeAccountClick(e) {
    this.setState({
      showList: true
    })
  }

  handleAccountSelected(e, accountSelector) {
    this.setState({
      showList: false
    });
    this.props.onAccountSelected(e, accountSelector.state.address);
  }

  render() {
      var self = this;
    return (
        <div className="">
          {
            !self.state.showList ?
          <a href="#" onClick={self.handleChangeAccountClick}>Change account</a> :
          <ul>
            {
              self.props.addresses.length > 0 && Object.keys(self.props.addresses).map(function(address) {
              return (
                  <li style={{display: 'block'}} key={self.props.addresses[address]}>
                  <AccountSelector isSelected={self.props.selectedAddress === self.props.addresses[address]} onAccountSelected={self.handleAccountSelected} address={self.props.addresses[address]} />
                  </li>
                );
              })
            }
            </ul>
          }
        </div>
    );
  }
}