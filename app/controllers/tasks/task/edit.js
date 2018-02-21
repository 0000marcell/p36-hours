import Controller from '@ember/controller';
import { get } from '@ember/object';

export default Controller.extend({
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
      let model = get(this, 'model');
      model.destroyRecord().then(() => {
        this.transitionToRoute('clock');
      });
    }
  }
});
