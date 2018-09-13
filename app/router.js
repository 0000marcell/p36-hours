import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('clock');
  this.route('statistics');
  this.route('tasks', function() {
    this.route('new');
    this.route('task', {
      path: ':id'
    }, function() {
      this.route('edit');
    });
  });
  this.route('configuration');
});

export default Router;
