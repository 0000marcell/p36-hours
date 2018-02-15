import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject } from '@ember/service';
import filter from '../p36-hours/filters';
import helpers from '../p36-hours/helpers';

export default Controller.extend({
  intervals: 0, 
  time: "00:10",
  _clockStatus: 'active',
  stateHelper: inject('state-helper'),
  tabOptions: [{value: 'active', text: 'active', selected: true}, 
            {value: 'archived', text: 'archived', selected: false}
  ],
  requestStart(){
    if(get(this, 'selectedTask')){
      get(this, 'clock').start(get(this, 'time'));
    }else{
      console.error('you need to select a task first');
    }
  },
  grabName(item, path){
    if(item.get('parent.id'))
      this.grabName(item.get('parent'), path);
    path.push(item.get('name'));
  },
  actions: {
    select(item){
      let clock = get(this, 'clock');
      if(clock.get('state') === 'started'){
        clock.reset();
      }
      let path = [];
      this.grabName(item, path);
      set(this, 'taskPath', path);
      set(this, 'selectedTask', item);
    },
    taskStatus(option){
      filter.rootTasks(get(this, 'model.tasks'), 
        option.value).then((tasks) => {
        set(this, 'filteredTasks', tasks);
      });
    },
    add(item){
      get(this, 'stateHelper').set('parentTask', item);
      this.transitionToRoute('tasks.new');
    },
    timerFinished(){
      let pomodoro = this.store.createRecord('pomodoro'),
          selectedTask = get(this, 'selectedTask');
      pomodoro.set('date', new Date());
      selectedTask.get('pomodoros').pushObject(pomodoro);
      selectedTask.save().then(() => {
        pomodoro.save();
      });

      if(get(this, '_clockStatus') === 'active'){
        set(this, 'intervals', get(this, 'intervals') + 1);
        set(this, 'time', 
          !(get(this, 'intervals') % 3) ? '10:00' :
                                          '5:00');
        set(this, '_clockStatus', 'interval');
      }else{
        set(this, 'time', '25:00');
        set(this, '_clockStatus', 'active');
      }
      get(this, 'clock').start(get(this, 'time'));
    },
    registerClock(clock){
      set(this, 'clock', clock);
      clock.set('parentController', this);
    }
  }
});
