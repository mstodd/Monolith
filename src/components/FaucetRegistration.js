import React from 'react'

export class FaucetRegistration extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    this.props.onAccountSelected(e, this);
  }

  render() {
    return (
        <div>
            <h2>Click <a onClick={this.handleClick}>here</a> for free Monolith tokens!</h2>
        </div>
    );
  }
}