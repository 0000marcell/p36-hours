import Route from '@ember/routing/route';
import mock from '../p36-hours/mock';
import filter from '../p36-hours/filters';

export default Route.extend({
  model(){
    //mock.init(this.store);
    return filter.rootTasks(this.store);
  }
});
