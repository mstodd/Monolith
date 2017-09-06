import React from 'react'

export class Balances extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
      this.props.handleTokenExchange();
  }

  render() {
    return (
        <div className={'balances'}>
            <h2>Your Balances</h2>
            <div>
                <h3 className={'label'}>Monolith Tokens: </h3><span>{this.props.tokenCount}</span> <button onClick={this.handleClick}>Exchange</button>
            </div>
            <div>
                <h3 className={'label'}>Monolith Inc Shares: </h3><span>{this.props.sharesCount}</span>
            </div>
        </div>
    );
  }
}