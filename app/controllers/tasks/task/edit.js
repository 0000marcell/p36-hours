import Controller from '@ember/controller';
import { set, get, setProperties } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  modalService: inject('modal-dialog'),
  actions: {
    submit(model){
      //let model = get(this, 'model');
      model.save().then(() => {
        this.transitionToRoute('clock');
      }).catch((err) => {
        console.log('problem saving the model ', err);
      });
    },
    delete(){
      let model = get(this, 'model'),
          modal = this.get('modalService.modal'),
          msg = `Do you really wish to delete ${model.get('name')}
        all data will be lost.`;
      set(this, 'modal', modal);
      setProperties(modal, {
        showDialog: true,
        dialogMsg: msg,
        trueDialogText: 'yes',
        falseDialogText: 'no',
        dialogFunc: (del) => {
          if(del){
            model.destroyRecord().then(() => {
              this.transitionToRoute('clock');
            });
          }
          set(this, 'modal.showDialog', false);
        }
      });
      
    }
  }
});
