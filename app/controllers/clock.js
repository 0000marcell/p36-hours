import Controller from '@ember/controller';
import { get, set, setProperties } from '@ember/object';
import filter from '../p36-hours/filters';
import clock from '../p36-hours/clock';
import { inject } from '@ember/service';

export default Controller.extend({
  modalService: inject('modal-dialog'),
  intervals: 0, 
  async init(){
    this._super(...arguments);
    set(this, 'time', {
      day: "00:00:00",
      week: "00:00:00",
      pomodoro: "25:00"
    });
    let store = get(this, 'store'),
        dayHCount = await clock.getDayHCount(store),
        weekHCount = await clock.getWeekHCount(store);
    let timeObj = {
      day: dayHCount,
      week: weekHCount,
      pomodoro: '25:00'
    };
    set(this, 'time', timeObj);
    let modal = get(this, 'modalService.modal');
    set(this, 'modal', modal);
    setProperties(modal, {
      trueDialogText: 'yes',
      falseDialogText: 'no',
      
    });
  },
  stateHelper: inject('state-helper'),
  tabOptions: [{value: 'active', text: 'active', selected: true}, 
            {value: 'archived', text: 'archived', selected: false}
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
  actions: {
    start(clock){
      if(get(this, 'selectedTask')){
        clock.start();
      }else{
        let modal = get(this, 'modal');
        modal.set
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
      filter.rootTasks(get(this, 'model.tasks'), 
        option.value).then((tasks) => {
        set(this, 'filteredTasks', tasks);
      });
    },
    add(item){
      get(this, 'stateHelper').set('parentTask', item);
      this.transitionToRoute('tasks.new');
    },
    async timerFinished(clock){
      let pomodoro = this.get('store').createRecord('pomodoro'),
          selectedTask = get(this, 'selectedTask');
      pomodoro.set('date', new Date());
      selectedTask.get('pomodoros').pushObject(pomodoro);

      await selectedTask.save().then(async () => {
        await pomodoro.save();
      });

      let time = get(this, 'time');
      if(get(clock, 'state') === 'active'){
        set(this, 'intervals', get(this, 'intervals') + 1);
        time.pomodoro = !(get(this, 'intervals') % 3) ? '10:00' :
                                                        '5:00'
        set(clock, 'state', 'interval');
        set(this, 'time', time);
      }else{
        time.pomodoro = '25:00';
        set(this, 'time', time);
      }
      clock.start();
    },
    register(clock){
      set(this, 'clock', clock);
    }
  }
});
