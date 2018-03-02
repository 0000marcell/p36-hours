import { moduleFor, test } from 'ember-qunit';
import clock from 'p36-hours/p36-hours/clock';
import helper from '../../helpers/store';
import rsvp from  'rsvp';

moduleFor('clock',
  'Unit | p36-hours | clock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
      helper.setStore(this.store);
    }
});

test('converts string time to sec #unit-clock-test-01', 
  function(assert) {
  let min = clock.convertToSec('25:00', 'min'),
      hour = clock.convertToSec('01:00', 'hour');
  assert.equal(min, 1500);
  assert.equal(hour, 3600);
});

test('converts sec time in to string min #unit-clock-test-02', 
  function(assert) {
  let result = clock.convertToMin(1480);
  assert.equal(result, '24:40');
});

test('converts sec time in to string hour #unit-clock-test-03', 
  function(assert) {
  assert.equal(clock.convertToHour(3661), '01:01:01');
  assert.equal(clock.convertToHour(3543), '00:59:03');
  assert.equal(clock.convertToHour(0), '00:00:00');
  assert.equal(clock.convertToHour(360002), '100:00:02');
});

test('getDayHCount  value non zero #unit-clock-test-04', 
  async function(assert){
    let time = await helper.createModel('time', {
      name: 'day',
      date: new Date(),
      time: 600
    });

    let result = await clock.getDayHCount(this.store);
    assert.equal(result, '00:10');
    await helper.deleteModel(time);
});

test('getDayHCount  value is zero #unit-clock-test-05', 
  async function(assert){
    let time = await helper.createModel('time', {
      name: 'day',
      date: new Date(),
      time: 0
    });

    let result = await clock.getDayHCount(this.store);
    assert.equal(result, '00:00');
    await helper.deleteModel(time);
});

test('getDayHCount  date has passed #unit-clock-test-06', 
  async function(assert){
    let time = await helper.createModel('time', {
      name: 'day',
      date: new Date(2015, 1, 1),
      time: 6000
    });
    
    let result = await clock.getDayHCount(this.store);

    assert.equal(result, '00:00');
    
    await helper.deleteModel(time);
});

test('getDayHCount  no day count yet #unit-clock-test-07', 
  async function(assert){
    let result = await clock.getDayHCount(this.store);
    assert.equal(result, '00:00');
    let times = await this.store.findAll('time');
    for(let time of times.toArray())
      await helper.deleteModel(time);
});

test('getWeekHCount #unit-clock-test-08', 
  async function(assert){

  let time = await helper.createModel('time', {
    name: 'week',
    date: new Date(),
    time: 3600
  });

  assert.equal(await clock.getWeekHCount(this.store), '01:00');
  await helper.deleteModel(time);

});

test('getWeekHCount week has passed #unit-clock-test-09', 
  async function(assert){

  let time = await helper.createModel('time', {
    name: 'week',
    date: new Date(2015, 1, 1),
    time: 3600
  });
  assert.equal(await clock.getWeekHCount(this.store), '00:00');
  await helper.deleteModel(time);
});

test('getDayHCount  no day count yet #unit-clock-test-10', 
  async function(assert){
    let result = await clock.getWeekHCount(this.store);
    assert.equal(result, '00:00');
    let times = await this.store.findAll('time');
    for(let time of times.toArray())
      await helper.deleteModel(time);
});

test('start  and resets the clock #unit-clock-test-11', 
  async function(assert){
    return new rsvp.Promise((resolve) => {
      let times = {
        pomodoro: '25:00',
        day: '01:59:59',
        week: '05:59:59'
      };
      clock.start(times, (time) => {
        assert.equal(time.pomodoro, '24:59', 'pom time');
        assert.equal(time.day, '02:00:00', 'day time');
        assert.equal(time.week, '06:00:00', 'week time');
        clock.reset(() => {});
        resolve();
      }, () => {});
    });
});
