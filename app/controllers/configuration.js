import Controller from '@ember/controller';
import { set, setProperties } from '@ember/object'
import { inject } from '@ember/service';

export default Controller.extend({
  modalService: inject('modal-dialog'),
  actions: {
    save(model){
      model.save().then(() => {
        this.transitionToRoute('clock');
      }).catch((err) => {
        alert('error: ', err);
      });
    },
    sync(){
      let modal = this.get('modalService.modal'),
          db = this.store.adapterFor('application').db,
          model = this.get('model');
      set(this, 'modal', modal);
      db.sync(model.url).on('complete', () => {
        setProperties(modal, {
          showDialog: true,
          infoMode: true,
          trueDialogText: 'ok',
          dialogFunc: () => {
            set(this, 'modal.showDialog', false);
          },
          dialogMsg: 
            `sync was succefull!`
        });
      }).on('error', (err) => {
        setProperties(modal, {
          showDialog: true,
          infoMode: true,
          trueDialogText: 'ok',
          dialogFunc: () => {
            set(this, 'modal.showDialog', false);
          },
          dialogMsg: 
            `error trying to sync db with ${model.url}: ${err}`
        });
      });
    }
  }
});
