import classnames from 'classnames';
import React from 'react';
import {observer} from 'mobx-react';

function ContractSourceCodeInput(props) {
  let error = props.store.error;

  let warning = null;
  // if (props.store.contractAddress && !props.store.contractAddressValid) {
  //   warning = "Contract address is not a valid Ethereum address";
  // }

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

  return (
      <div className={classes}>
      <label htmlFor="contract_source_code">Contract Source Code</label>
      <input
        type="text"
        className="form-control"
        id="contract_source_url"
        value={props.store.contractSourceUrl}
        onChange={(e) => props.store.contractSourceUrl = e.target.value}
      />
      <input
        type="text"
        className="form-control"
        id="contract_name"
        value={props.store.contractName}
        onChange={(e) => props.store.contractName = e.target.value}
      />
      {helpBlock}
    </div>
  );
}

export default observer(ContractSourceCodeInput);
