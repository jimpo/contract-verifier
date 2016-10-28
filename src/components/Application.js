import React from 'react';
import {observer} from 'mobx-react';

import AlertBox from './AlertBox';
import ContractAddressInput from './ContractAddressInput';
import ContractSourceCodeInput from './ContractSourceCodeInput';

require('bootstrap/less/bootstrap.less');
require('../style.less');

function Application(props) {
  return (
    <div className="container">
      <h1>Contract Source Verifier</h1>
      <AlertBox store={props.store}/>
      <ContractAddressInput store={props.store}/>
      <div className="form-group">
        <label htmlFor="contract_source">Source Code</label>
        <pre id="contract_source" className="pre-scrollable">
          {props.store.sourceCode}
        </pre>
      </div>
      <div className="form-group">
        <label htmlFor="contract_source">Bytecode</label>
        <pre id="contract_source" className="pre-scrollable">
          {props.store.bytecode}
        </pre>
      </div>

      <h2>Contract Uploader</h2>
      <ContractSourceCodeInput store={props.store}/>
    </div>
  );
}

export default observer(Application);
