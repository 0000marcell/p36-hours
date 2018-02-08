import Route from '@ember/routing/route';
import filter from '../p36-hours/filters';

export default Route.extend({
  setupController(controller, model){
    this._super(...arguments);
    //controller.set('filteredTasks', model.tasks);
    filter.rootTasks(model.tasks, 'active').then((tasks) => {
      controller.set('filteredTasks', tasks);
    });
  }
});
