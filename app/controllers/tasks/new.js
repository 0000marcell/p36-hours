import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  stateHelper: inject('state-helper'),
  saveTaskWithParent(model){
    let parent = get(this, 'stateHelper').get('parentTask');
    model.set('parent', parent);
    parent.get('children').pushObject(model);
    parent.save().then(() => {
      model.save().then(() => {
        console.log('task created!');
        this.transitionToRoute('clock');
      }).catch((err) => {
        console.log('problem trying to save the child', err);
      });
    }).catch((err) => {
      console.log('problem trying to save the parent ', err);
    });
  },
  saveTask(model){
    model.save().then(() => {
      console.log('task created!');
      this.transitionToRoute('clock');
    }).catch((err) => {
      console.log('something went wrong when creating a task', 
        err);
    });
  },
  actions: {
    submit(){
      let model = get(this, 'model');
      if(get(this, 'stateHelper').get('parentTask')){
        this.saveTaskWithParent(model);  
      }else{
        this.saveTask(model);  
      }
    }
  }
});
