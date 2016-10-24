import {computed, observable} from 'mobx';

class ApplicationStore {
  @observable web3;
  @observable contractAddress = '';
  @observable bytecode;
  @observable sourceCode;
  @observable error;

  @computed get contractAddressValid() {
    if (!this.contractAddress) {
      return null;
    }
    return !!this.contractAddress.match(/^0x[0-9a-fA-F]{40}$/);
  }
}

export default ApplicationStore;
