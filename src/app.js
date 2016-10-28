import {observe} from 'mobx';
import wrapper from 'solc/wrapper';
import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';

import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';

// 0xAEEDe7a82D377EBA0CC9Eee7d12f6bdde7aEFfeD

const SOURCE_LINKED_ABI = [{"constant":true,"inputs":[],"name":"sourceURL","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"}];

window.addEventListener('load', () => {
  const store = new ApplicationStore();

  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    store.web3 = new Web3(web3.currentProvider);
  }

  const solc = wrapper(window.Module);
  console.log(solc);

  observe(store, 'contractAddress', (address) => {
    if (store.contractAddressValid) {
      store.error = null;
      store.success = null;
      store.bytecode = null;
      store.sourceCode = null;

      const sourceCodePromise = getSourceCode(store.web3, store.contractAddress);
      const bytecodePromise = getBytecode(store.web3, store.contractAddress);

      sourceCodePromise.then((sourceCode) => store.sourceCode = sourceCode);
      bytecodePromise.then((bytecode) => store.bytecode = bytecode);

      Promise.all([sourceCodePromise, bytecodePromise])
        .then(([sourceCode, bytecode]) => {
          const result = solc.compile(sourceCode);
          if (result.errors) {
          }
          else {
            console.log(result);
            let found = false;
            Object.keys(result.contracts).forEach((contractName) => {
              let contract = result.contracts[contractName];
              console.log(`Checking ${contractName} ${(('0x' + contract.bytecode) === bytecode)}`);
              console.log(`${contract.bytecode.length} ; ${bytecode.length - 2}`);
              if (('0x' + contract.bytecode) === bytecode) {
                found = true;
                store.contractName = contractName;
              }
            });
            if (found) {
              store.success = true;
            }
            else {
              store.error = 'No matching contract found';
            }
          }
        })
        .catch((error) => store.error = error);
    }
  });

  observe(store, 'contractSourceUrl', (url) => {
    store.error = null;
    store.success = null;
    store.bytecode = null;
    store.sourceCode = null;

    let contractName = store.contractName;
    if (contractName) {
      getSourceCodeFromUrl(url)
        .then((sourceCode) => {
          store.sourceCode = sourceCode;
          const result = solc.compile(sourceCode);
          if (result.errors) {
            console.log(result.errors);
          }
          else {
            console.log(result);
            let contract = result.contracts[contractName];
            if (!contract) {
              store.error = 'No contract found by that name';
            }
            else {
              let NewContract = web3.eth.contract(contract.interface);
              let instance = NewContract.new('', {
                data: '0x' + contract.bytecode
              }, (error, myContract) => {
                if (error) {
                  console.log('deploy error', error);
                  // store.error = error;
                }
                else if (myContract.address) {
                  console.log('contract address', myContract.address);
                  store.contractAddress = myContract.address;
                }
                else {
                  console.log('contract deploying');
                }
              });
            }
          }
        })
        .catch((error) => {
          console.log('caught error', error);
          store.error = error;
        });
    }
    else {
      store.error = 'Enter a contract name';
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

function getSourceCodeFromUrl(url) {
  return fetch(url).then((response) => response.text());
}
