import Route from '@ember/routing/route';
import mock from '../p36-hours/mock';
import { hash } from 'rsvp';

export default Route.extend({
  model(){
    //mock.init(this.store);
    /*
    mock.grabOldInfo(this.store).then(() => {
      console.log('finish!');
    });
    */
    return hash({
      tasks: this.store.findAll('task'),
      pomodoros: this.store.findAll('pomodoro') 
    });
  }
});
