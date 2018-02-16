import Route from '@ember/routing/route';
import mock from '../p36-hours/mock';
import { hash } from 'rsvp';

export default Route.extend({
  async model(){
    //mock.init(this.store);
    /*
    mock.grabOldInfo(this.store).then(() => {
      console.log('finish!');
    });
    */
    /*
    await mock.deleteAll(this.store);
    let task = this.store.createRecord('task', {
      name: 'task 1',
      status: 'active'
    }); 
    let pomodoro = this.store.createRecord('pomodoro', {
      date: new Date(),
      task: task
    });
    task.get('pomodoros').pushObject(pomodoro);
    await pomodoro.save().then(() => {
      task.save();
    });
    */
    return hash({
      tasks: this.store.findAll('task'),
      pomodoros: this.store.findAll('pomodoro') 
    });
  }
});
