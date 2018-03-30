import { moduleFor, test } from 'ember-qunit';
import helper from '../../helpers/store';
import rsvp from 'rsvp';
import dateHelper from 'p36-hours/p36-hours/date-helper';

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
  
  let last4days = dateHelper.lastXDays(3); 
  last4days.push(new Date());

  for(let date of last4days){
    await helper.createModel('pomodoro', {
      date: date 
    });
  }

  let service = this.subject();
  await service.init();
  assert.equal(service.get('time.day'), '00:30:00');
  assert.equal(service.get('time.week'), '02:05:00');
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

test('count week/day in interval #unit-clock-service-04', 
  async function(assert){
    let service = this.subject();
    await service.init();
    service.set('mode', 'interval');
    service.start();
    return new rsvp.Promise((resolve) => {
      setTimeout(() => {
        assert.equal(service.get('time.week'), '00:00:01', 
          'week time changed');
        assert.equal(service.get('time.day'), '00:00:01', 
          'day time changed');
        service.reset();
        resolve();
      }, 1100)
    });
});
