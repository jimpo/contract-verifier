import React from 'react';
import ReactDOM from 'react-dom';

import Application from './Application';


const sourceLinkedABI = [{"constant":true,"inputs":[],"name":"sourceURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

window.addEventListener('load', () => {
  const SourceLinked = web3.eth.contract(sourceLinkedABI);

  ReactDOM.render(
    <Application/>,
    document.getElementById('root')
  );
});
