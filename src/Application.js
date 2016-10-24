import React from 'react';

class Application extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Contract Source Verifier</h1>
        <div className="form-group">
          <label htmlFor="contract_address">Contract Address</label>
          <input type="text" className="form-control" id="contract_address"/>
        </div>
        <div className="form-group">
          <label htmlFor="contract_source">Source Code</label>
          <pre id="contract_source" className="pre-scrollable"/>
        </div>
      </div>
    );
  }
}

export default Application;
