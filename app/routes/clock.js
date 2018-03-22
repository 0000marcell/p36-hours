import Route from '@ember/routing/route';
import filter from '../p36-hours/filters';

export default Route.extend({
  async setupController(controller, model){
    this._super(...arguments);
    filter.rootTasks(model.tasks).then((tasks) => {
      controller.set('filteredTasks', tasks);
      controller.set('_tabTasks', tasks);
    });
  }
});
