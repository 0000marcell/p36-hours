import Route from '@ember/routing/route';
import mock from '../p36-hours/mock';
import { hash } from 'rsvp';

export default Route.extend({
  async model(){
    /*
    mock.grabOldInfo(this.store).then((msg) => {
      console.log(msg);
    });
    */
    return hash({
      tasks: this.store.findAll('task'),
      pomodoros: this.store.findAll('pomodoro'),
      tags: this.store.findAll('tag')
    });
  }
});
