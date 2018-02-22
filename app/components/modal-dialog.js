import Component from '@ember/component';
import { get, set } from '@ember/object';

export default Component.extend({
  classNames: ['modal-dialog'],
  showButtons: true,
  actions: {
    close(result){
      set(this, 'showButtons', false);
      get(this, 'close')(result); 
    }
  }
});
