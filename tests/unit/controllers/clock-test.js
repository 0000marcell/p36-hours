import { moduleFor, test } from 'ember-qunit';
import helper from '../../helpers/store';
import rsvp from 'rsvp';
import { run } from '@ember/runloop';
import Object, { get } from '@ember/object';

moduleFor('controller:clock', 'Unit | Controller | clock', {
  integration: true,
  beforeEach(){
    this.store = this.container.lookup('service:store');
    helper.setStore(this.store);
  }
});

const Clock = Object.extend({});
  

test('timerFinish #cont-clock-test-01', 
  async function(assert) {
  assert.expect(5);
  let clock = Clock.create({});
  clock.set('state', 'active');
  clock.set('start', () => {
    assert.ok(true, 'start action was run again!');
  });
  let controller = this.subject();
  let task = await helper.createModel('task', {
    name: 'task 1'
  });
  controller.set('selectedTask', task);
  await run(() => {
    controller.send('timerFinished', clock);
  });
  return new rsvp.Promise((resolve) => {
    setTimeout(async () => {
      let pomodoros = await task.get('pomodoros');
      assert.equal(pomodoros.get('length'), 1, 
        'task has one pomodoro');
      assert.equal(controller.get('intervals'), 1);
      assert.equal(controller.get('time').pomodoro, '5:00');
      assert.equal(get(clock, 'state'), 'interval');
      await helper.deleteModel(pomodoros.objectAt(0));
      await helper.deleteModel(task);
      resolve();
    }, 300);
  });
});

test('select #cont-clock-test-01', 
  function(assert) {

  let controller = this.subject(),
      item = {
        name: 'task 1'
      };
  controller.set('clock', clock);
  controller.send('select', item);
  assert.ok(true);
  //assert.equal(controller.get(''))
});
