import classnames from 'classnames';
import React from 'react';
import {observer} from 'mobx-react';

function ContractAddressInput(props) {
  let error = props.store.error;
  let success = props.store.success;

  let warning = null;
  if (props.store.contractAddress && !props.store.contractAddressValid) {
    warning = "Contract address is not a valid Ethereum address";
  }

  let helpBlock = null;
  let classes = ['form-group'];
  if (error) {
    helpBlock = <span className="help-block">{error}</span>;
    classes.push('has-error');
  }
  else if (warning) {
    helpBlock = <span className="help-block">{warning}</span>;
    classes.push('has-warning');
  }
  else if (success == true) {
    classes.push('has-success');
  }

  return (
      <div className={classes}>
      <label htmlFor="contract_address">Contract Address</label>
      <input
        type="text"
        className="form-control"
        id="contract_address"
        value={props.store.contractAddress}
        onChange={(e) => props.store.contractAddress = e.target.value}
      />
      {helpBlock}
    </div>
  );
}

export default observer(ContractAddressInput);
