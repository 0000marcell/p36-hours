import PouchDB from 'pouchdb';
import { moduleFor, test } from 'ember-qunit';
import helper from '../../helpers/store';
import rsvp from 'rsvp';
import { run } from '@ember/runloop';
import { get } from '@ember/object';

moduleFor('controller:clock', 'Unit | Controller | clock', {
  integration: true,
  beforeEach(){
    this.store = this.container.lookup('service:store');
    helper.setStore(this.store);
    this.adapter = this.store.adapterFor('application'); 
    this.adapter
      .changeDb(new PouchDB(`test-${new Date().getTime()}`));
  }
});

function initializeController(_this){
   return _this.subject({
    modalService: {
      modal: {
        showDialog: false,
        hideButtons: false,
        dialogFunc: function() {
        },
        trueDialogText: 'load',
        falseDialogText: 'cancel',
        infoMode: false
      }
    }
  });
}

test('timerFinish #unit-con-clock-01', 
  async function(assert) {
  assert.expect(5);
  let controller = initializeController(this); 

  let clock = controller.get('clock');
  clock.set('state', 'started');
  clock.set('time', {
    pomodoro: null,
    day: null,
    week: null
  });
  clock.set('start', () => {
    assert.ok(true, 'start action was run again!');
  });
  let task = await helper.createModel('task', {
    name: 'task 1'
  });
  controller.set('selectedTask', task);
  await run(() => {
    controller.timerFinished();
  });
  return new rsvp.Promise((resolve) => {
    setTimeout(async () => {
      let pomodoros = await task.get('pomodoros');
      assert.equal(pomodoros.get('length'), 1, 
        'task has one pomodoro');
      assert.equal(get(clock, 'time').pomodoro, '5:00');
      assert.equal(get(clock, 'state'), 'started');
      assert.equal(get(clock, 'mode'), 'interval');
      resolve();
    }, 300);
  });
});

test('show modal if clock already running #unit-con-clock-02', 
  async function(assert) {

  let controller = initializeController(this),
      clock = controller.get('clock'),
      modal = controller.get('modalService.modal');


  clock.set('state', 'started');


  let task = await helper.createModel('task', {
    name: 'task 1'
  });

  controller.send('select', task);

  assert.ok(get(modal, 'showDialog'));

});

test('show dialog if on start if no task is selected #unit-con-clock-03', 
  async function(assert) {

  let controller = initializeController(this),
      modal = controller.get('modalService.modal');


  controller.send('start');

  assert.ok(get(modal, 'showDialog'));

});

test('start clock if a task is selected  #unit-con-clock-04', 
  async function(assert) {

  let controller = initializeController(this),
      clock = controller.get('clock');

  let task = await helper.createModel('task', {
    name: 'task 1'
  });

  controller.send('select', task);

  controller.send('start');

  assert.equal(clock.get('state'), 'started');

  clock.reset();
});

test('controller time observes clock time #unit-con-clock-05', 
  async function(assert) {

  let controller = initializeController(this),
      clock = controller.get('clock');

  let obj = {
    pomodoro: '24:59',
    day: '01:10:00',
    week: '02:10:20'
  };
  
  clock.set('time', obj);
  
  assert.deepEqual(controller.get('time'), obj);
});
