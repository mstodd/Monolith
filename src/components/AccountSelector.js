import React from 'react'

export class AccountSelector extends React.Component {
  constructor(props) {
    const { address, isSelected } = props;
    super(props);
    this.state = {
      address: address,
      isSelected: isSelected,
      isToggleOn: false,
      enabled: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  setEnabled(enabled){
    this.setState(prevState => ({
      enabled: enabled
    }));
  }

  handleClick(e) {
    this.props.onAccountSelected(e, this);
  }

  render() {
    return (
      <div className={'account'} >
        <span className={[this.props.isSelected && 'active']} onClick={this.handleClick}>{this.state.address}</span>
      </div>
    );
  }
}