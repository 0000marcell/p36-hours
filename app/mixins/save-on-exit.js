import Mixin from '@ember/object/mixin';
import { set, setProperties } from '@ember/object'
import { inject } from '@ember/service';

export default Mixin.create({
  modalService: inject('modal-dialog'),
  afterModel(model){
    this._super(...arguments);
    this.set('_canTransition', false);
    model.startTrack();
    let modal = this.get('modalService.modal');
    set(this, 'modal', modal);
    setProperties(modal, {
      trueDialogText: 'yes',
      falseDialogText: 'no',
      dialogFunc: (exit) => {
        if(exit){
          if(!model.get('isNew')){
            model.rollback();
          }else{
            model.rollbackAttributes();
          }
          this.set('_canTransition', true);
          this.get('_transition').retry();
        }
        set(this, 'modal.showDialog', false);
      },
      dialogMsg: "Your modifications were not saved yet, do you wish to exit anyway"
    });
  },
  actions: {
    willTransition(transition) {
      let model = this.get('controller.model');

      if(!model || this.get('_canTransition')){ return }

      if(model.get('hasDirtyAttributes') ||
         model.get('hasDirtyRelations') || model.get('isNew')){
        transition.abort();
        this.set('_transition', transition);
        set(this, 'modal.showDialog', true);
      }
    }
  }
});
