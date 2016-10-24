import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';

import {observe} from 'mobx';

import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';


const sourceLinkedABI = [{"constant":true,"inputs":[],"name":"sourceURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

window.addEventListener('load', () => {
  const store = new ApplicationStore();

  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    store.web3 = new Web3(web3.currentProvider);
  }

  observe(store, 'contractAddress', (address) => {
    if (store.contractAddressValid) {
      store.error = null;
      store.bytecode = null;
      store.sourceCode = null;

      // Fetch bytecode
      store.web3.eth.getCode(address, (error, bytecode) => {
        if (error) {
          console.error(error);
          store.error = error;
          return;
        }

        store.bytecode = bytecode;
      });

      // Fetch source code
      const SourceLinked = web3.eth.contract(sourceLinkedABI);
      SourceLinked.at(address).sourceURL.call((error, sourceURL) => {
        if (error) {
          store.error = error;
          return;
        }

        fetch(sourceURL)
          .then((response) => response.text())
          .then((sourceCode) => store.sourceCode = sourceCode)
          .catch((error) => store.error = error);
      });
    }
  });

  ReactDOM.render(
    <Application store={store}/>,
    document.getElementById('root')
  );
});
