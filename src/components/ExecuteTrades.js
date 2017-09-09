import React from 'react'

export class ExecuteTrades extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
      this.props.onExecuteClicked();
  }

  render() {
    return (
        <div className={'balances'}>
            <h2>Execute Pending Trades</h2>
            <div>
                <button onClick={this.handleClick}>Execute!</button>
            </div>
        </div>
    );
  }
}