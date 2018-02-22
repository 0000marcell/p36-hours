import Mixin from '@ember/object/mixin';

export default Mixin.create({
  afterModel(model){
    this._super(...arguments);
    this.set('_canTransition', false);
    model.startTrack();
  },
  actions: {
    willTransition(transition) {
      let model = this.get('controller.model');
      if(!model || this.get('_canTransition')){ return }
      if(model.get('hasDirtyAttributes') ||
         model.get('hasDirtyRelations') || model.get('isNew')){
        transition.abort();
        this.set('_transition', transition);
        this.set('controller.showDialog', true);
      }
    },
    closeDialog(exit){
      let model = this.get('controller.model');
      this.set('controller.showDialog', false);
      if(exit){
        if(!model.get('isNew')){
          model.rollback();
        }else{
          model.rollbackAttributes();
        }
        this.set('_canTransition', true);
        this.get('_transition').retry();
      }
    }
  }
});
