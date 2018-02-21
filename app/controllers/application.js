import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({
  showDialog: true,
  actions: {
    closeDialog(result){
      set(this, 'showDialog', false);
    },
    showDialog(){
      set(this, 'showDialog', true);
    }
  }
});
