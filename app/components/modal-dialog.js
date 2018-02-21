import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  classNames: ['modal-dialog'],
  actions: {
    close(result){
      get(this, 'close')(result); 
    }
  }
});
