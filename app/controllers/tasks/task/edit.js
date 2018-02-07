import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    submit(){
      let model = this.get('model');
      model.save().then(() => {
        console.log('model saved!');
        this.transitionToRoute('clock');
      }).catch((err) => {
        console.log('problem saving the model ', err);
      });
    }
  }
});
