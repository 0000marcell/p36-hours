import Route from '@ember/routing/route';

export default Route.extend({
  async setupController(controller){
    this._super(...arguments);
    this.store.findRecord('task', 1, { reload: true }).then((model) => {
      controller.set('model', model);
    }).catch(() => {
      controller.set('model', 
        this.store.createRecord('configuration'));
    });
  }
});
