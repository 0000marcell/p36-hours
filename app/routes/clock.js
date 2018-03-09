import Route from '@ember/routing/route';
import filter from '../p36-hours/filters';
import fakeData from '../p36-hours/fake-data';
import mock from '../p36-hours/mock';
import { get } from '@ember/object';

export default Route.extend({
  async setupController(controller, model){
    this._super(...arguments);
    if(!get(model.tasks, 'length'))
      model.tasks = await mock.constructDbFromObj(this.store, 
        fakeData);
    filter.rootTasks(model.tasks).then((tasks) => {
      controller.set('filteredTasks', tasks);
      controller.set('_tabTasks', tasks);
    });
  }
});
