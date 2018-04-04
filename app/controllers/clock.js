import Controller from '@ember/controller';
import { get, set, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import filter from '../p36-hours/filters';
import { inject } from '@ember/service';

const icon = "https://s3-sa-east-1.amazonaws.com/marcell-assets/p36-hours-png-logo.png";

const POMODORO = '25:00';

export default Controller.extend({
  breakTitle: '',
  time: alias('clock.time'),
  modalService: inject('modal-dialog'),
  clock: inject('clock-service'),
  push: inject(),
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
    let path = [],
        clock = get(this, 'clock'),
        time = get(clock, 'time');

    this.grabName(item, path);
    setProperties(this, {
      taskPath: path,
      selectedTask: item,
      breakTitle: ''
    });
    set(clock, 'mode', 'task');
    set(time, 'pomodoro', POMODORO);
  },
  async timerFinished(){
    let selectedTask = get(this, 'selectedTask'),
        clock = get(this, 'clock'),
        time = get(clock, 'time'),
        title;
    if(get(clock, 'mode') === 'task'){
      let pomodoro = await this.get('store')
        .createRecord('pomodoro', {
          date: new Date(),
          task: selectedTask
      });

      selectedTask.get('pomodoros').pushObject(pomodoro);

      await selectedTask.save().then(async () => {
        await pomodoro.save();
      });

      title = 'Interval started';
      let pomodoros = await this.get('store').findAll('pomodoro'),
          todayPomodoros = filter
            .pomodorosHaveDate(pomodoros, new Date());

      set(time, 'pomodoro', 
        !(todayPomodoros.length % 3) ? '10:00' : '05:00');
      
      setProperties(clock, {
        time: time,
        mode: 'interval'
      });
      set(this, 'breakTitle', 'break time...');
    }else{
      title = 'Pomodoro started';
      set(time, 'pomodoro', POMODORO);
      setProperties(clock, {
        time: time,
        mode: 'task'
      });
      set(this, 'breakTitle', null);
    }
    this.get('push').create(title, {
      body: selectedTask.get('name'), 
      icon: icon, 
      time: 5000
    });
    clock.start();
  },
  clockHalfWay(){
    let selectedTask = get(this, 'selectedTask');
    this.get('push').create('Clock Halfway', {
      body: selectedTask.get('name'), 
      icon: icon, 
      time: 5000
    });
  },
  actions: {
    start(){
      let clock = get(this, 'clock');

      if(!get(clock, 'finishFunc'))
        set(clock, 'finishFunc', this.timerFinished.bind(this));

      if(!get(clock, 'clockHalfFunc'))
        set(clock, 'clockHalfFunc', this.clockHalfWay.bind(this));

      if(get(this, 'selectedTask')){
        clock.start();
        this.get('push').create('Pomodoro started!', {
          body: get(this, 'selectedTask.name'), 
          icon: icon, 
          time: 5000
        });
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
