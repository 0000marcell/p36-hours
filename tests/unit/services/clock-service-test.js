import { moduleFor, test } from 'ember-qunit';
import helper from '../../helpers/store';
import rsvp from 'rsvp';

moduleFor('service:clock-service', 'Unit | Service | clock service', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  integration: true,
  beforeEach(){
    this.store = this.container.lookup('service:store');
    helper.setStore(this.store);
  },
  async afterEach(){
  }
});

test('init clock with right values #unit-clock-service-01', 
  async function(assert) {

  await helper.createModel('time', {
    name: 'day',
    date: new Date(),
    time: 600
  });

  await helper.createModel('time', {
    name: 'week',
    date: new Date(),
    time: 610
  });

  let service = this.subject();
  await service.init();
  assert.equal(service.get('time.day'), '00:10:00');
  assert.equal(service.get('time.week'), '00:10:10');
});

test('start and reset the clock with #unit-clock-service-02', 
  async function(assert) {

  let service = this.subject();
  await service.init();
  service.start();
  return new rsvp.Promise((resolve) => {
    setTimeout(() => {
      assert.equal(service.get('time.pomodoro'), '24:59', 
        'pomodoro changed');
      service.reset();
      resolve();
    }, 1100)
  });
});

test('pause and resume the clock with #unit-clock-service-03', 
  async function(assert) {

  let service = this.subject();
  await service.init();
  service.start();
  return new rsvp.Promise((resolve) => {
    setTimeout(() => {
      assert.equal(service.get('time.pomodoro'), '24:59', 
        'pomodoro changed');
      service.pause();
      setTimeout(() => {
        assert.equal(service.get('time.pomodoro'), '24:59', 
          'clock is paused');
        service.resume();
        setTimeout(() => {
          assert.equal(service.get('time.pomodoro'), '24:58', 
            'clock is running');
          service.reset();
          resolve();
        }, 1100);
      }, 1100)
    }, 1100)
  });
});

test('do not count week/day in interval #unit-clock-service-04', 
  async function(assert){
    let service = this.subject();
    await service.init();
    service.set('mode', 'interval');
    service.start();
    return new rsvp.Promise((resolve) => {
      setTimeout(() => {
        assert.equal(service.get('time.week'), '00:00:00', 
          'week time did not changed');
        assert.equal(service.get('time.day'), '00:00:00', 
          'day time did not changed');
        service.reset();
        resolve();
      }, 1100)
    });
});
