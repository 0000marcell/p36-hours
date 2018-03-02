import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model(){
    return hash({
      tasks: this.store.findAll('task'),
      pomodoros: this.store.findAll('pomodoro'),
      tags: this.store.findAll('tag')
    });
  }
});
