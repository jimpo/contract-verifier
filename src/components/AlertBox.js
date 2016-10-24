import React from 'react';


export default function AlertBox(props) {
  if (!props.store.web3) {
    return (
      <div className="alert alert-warning">
        <a href="https://metamask.io/" target="_blank">MetaMask</a> is required to run this application. Install the extension to continue.
      </div>
    );
  }
  else {
    return null;
  }
}
