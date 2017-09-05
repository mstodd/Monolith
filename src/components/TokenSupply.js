import React from 'react'

export class TokenSupply extends React.Component {
  constructor(props) {
    const { total, remaining } = props;
    super(props);
    this.state = {
      total: total,
      remaining: remaining,
    };
  }

  render() {
    return (
        <div>
            <h2>{this.props.remaining} Remaining Monolith Tokens (of {this.props.total})</h2>
        </div>
    );
  }
}