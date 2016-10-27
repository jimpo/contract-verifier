import {observe} from 'mobx';
//import solc from 'solc/wrapper';
import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';

import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';


const SOURCE_LINKED_ABI = [{"constant":true,"inputs":[],"name":"sourceURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

window.addEventListener('load', () => {
  const store = new ApplicationStore();

  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    store.web3 = new Web3(web3.currentProvider);
  }

    //solc.loadRemoteVersion('latest', () => console.log('loaded'));

  observe(store, 'contractAddress', (address) => {
    if (store.contractAddressValid) {
      store.error = null;
      store.bytecode = null;
      store.sourceCode = null;

      const sourceCodePromise = getSourceCode(store.web3, store.contractAddress);
      const bytecodePromise = getBytecode(store.web3, store.contractAddress);

      sourceCodePromise.then((sourceCode) => store.sourceCode = sourceCode);
      bytecodePromise.then((bytecode) => store.bytecode = bytecode);

      Promise.all([sourceCodePromise, bytecodePromise])
        .then(([sourceCode, bytecode]) => {
          console.log(solc.compile(sourceCode));
        })
        .catch((error) => store.error = error);
    }
  });

  ReactDOM.render(
    <Application store={store}/>,
    document.getElementById('root')
  );
});

function getBytecode(web3, address) {
  return new Promise((resolve, reject) => {
    web3.eth.getCode(address, (error, bytecode) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(bytecode);
      }
    });
  });
}

function getSourceURL(web3, address) {
  return new Promise((resolve, reject) => {
    const SourceLinked = web3.eth.contract(SOURCE_LINKED_ABI);
    SourceLinked.at(address).sourceURL.call((error, sourceURL) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(sourceURL);
      }
    });
  });
}

function getSourceCode(web3, address) {
  return getSourceURL(web3, address)
    .then((sourceURL) => fetch(sourceURL))
    .then((response) => response.text());
}
