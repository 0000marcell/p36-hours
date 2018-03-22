import Controller from '@ember/controller';
import { get, set, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import filter from '../p36-hours/filters';
import { inject } from '@ember/service';

export default Controller.extend({
  time: alias('clock.time'),
  modalService: inject('modal-dialog'),
  clock: inject('clock-service'),
  showAll: false,
  async init(){
    this._super(...arguments);
    let modal = get(this, 'modalService.modal');
    get(this, 'clock');
    set(this, 'modal', modal);
    setProperties(modal, {
      trueDialogText: 'yes',
      falseDialogText: 'no'
    });
  },
  stateHelper: inject('state-helper'),
  tabOptions: [{value: false, text: 'active', selected: true}, 
            {value: true, text: 'show all', selected: false}
  ],
  grabName(item, path){
    if(item.get('parent.id'))
      this.grabName(item.get('parent'), path);
    path.push(item.get('name'));
  },
  selectTask(item){
    let path = [];
    this.grabName(item, path);
    set(this, 'taskPath', path);
    set(this, 'selectedTask', item);
  },
  async timerFinished(){
    let selectedTask = get(this, 'selectedTask'),
        pomodoro = await this.get('store')
      .createRecord('pomodoro', {
        date: new Date(),
        task: selectedTask
    });

    selectedTask.get('pomodoros').pushObject(pomodoro);

    await selectedTask.save().then(async () => {
      await pomodoro.save();
    });

    let clock = get(this, 'clock'),
        time = get(clock, 'time');
    if(get(clock, 'state') === 'started'){
      let pomodoros = await this.get('store').findAll('pomodoro'),
          todayPomodoros = filter
            .pomodorosHaveDate(pomodoros, new Date());

      set(time, 'pomodoro', 
        !(todayPomodoros.length % 3) ? '10:00' : '5:00');

      set(clock, 'time', time);
    }else{
      set(time, 'pomodoro', '25:00');
      set(clock, 'time', time);
    }
    clock.start();
  },
  actions: {
    start(){
      let clock = get(this, 'clock');

      if(!get(clock, 'finishFunc'))
        set(clock, 'finishFunc', this.timerFinished.bind(this));

      if(get(this, 'selectedTask')){
        clock.start();
      }else{
        let modal = get(this, 'modal');
        setProperties(modal, {
          infoMode: true,
          trueDialogText: "Ok",
          dialogFunc: () => {
            set(this, 'modal.showDialog', false);
          },
          dialogMsg: 'You need to select a task before starting the clock!',
          showDialog: true
        });
      }
    },
    pause(){
      get(this, 'clock').pause();
    },
    resume(){
      get(this, 'clock').resume();
    },
    reset(){
      get(this, 'clock').reset();
    },
    select(item){
      let clock = get(this, 'clock'),
          modal = get(this, 'modal');
      if(clock.get('state') === 'started'){
        setProperties(modal, {
          infoMode: false,
          trueDialogText: "Yes",
          dialogFunc: (select) => {
            if(select){
              clock.reset();
              this.selectTask(item);
            }
            set(this, 'modal.showDialog', false);
          },
          dialogMsg: "If you change the task while the clock is running the current spent time will be lost, do you wish to proceed?",
          showDialog: true
        });
      }else{
        this.selectTask(item);
      }
    },
    taskStatus(option){
      set(this, 'showAll', option.value);
    },
    add(item){
      get(this, 'stateHelper').set('parentTask', item);
      this.transitionToRoute('tasks.new');
    },
    search(term){
      let tabTasks = get(this, '_tabTasks');
      if(term){
        let results = [];
        tabTasks.forEach((task) => {
          results = 
            results.concat(...filter.searchTaskTree(task, term));
        });
        if(results.get('length'))
          set(this, 'filteredTasks', results);
      }else{
        set(this, 'filteredTasks', 
          get(this, '_tabTasks'));
      }
    }
  }
});
