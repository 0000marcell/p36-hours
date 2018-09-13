import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { get } from '@ember/object';
import fakeData from '../p36-hours/fake-data';
import mock from '../p36-hours/mock';

export default Route.extend({
  async model(){
    //await mock.grabOldInfo(this.store);
    let tasks = await this.store.findAll('task');
    if(!get(tasks, 'length')){
      await mock.constructDbFromObj(this.store, fakeData);
      tasks = await this.store.findAll('task');
    }

    return hash({
      tasks: tasks,
      pomodoros: this.store.findAll('pomodoro'),
      tags: this.store.findAll('tag')
    });
  },
  afterModel(){
    if(window.history.state.path === "/")
      this.transitionTo('clock');
  }
});
