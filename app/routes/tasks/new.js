import Route from '@ember/routing/route';
import saveOnExit from 'p36-hours/mixins/save-on-exit';

export default Route.extend(saveOnExit, {
  model(){
    return this.store.createRecord('task', {
      status: 'active'
    });
  }
});
