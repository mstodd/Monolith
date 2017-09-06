import React from 'react'

export class FaucetRegistration extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onRegisterClicked(e, this);
  }

  render() {
    return (
        <div className={'faucet-registration'}>
            <h2>Click <a href="#" onClick={this.handleClick}>here</a> for free Monolith tokens!</h2>
        </div>
    );
  }
}