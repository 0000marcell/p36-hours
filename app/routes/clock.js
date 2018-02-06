import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller, model){
    this._super(...arguments);
    controller.set('tasks', model);
  }
});
