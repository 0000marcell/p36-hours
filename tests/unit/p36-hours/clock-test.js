import { moduleFor, test } from 'ember-qunit';
import clock from 'p36-hours/p36-hours/clock';
import dateHelper from 'p36-hours/p36-hours/date-helper';
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

test('converts string time to sec #unit-clock-mod-01', 
  function(assert) {
  let min = clock.convertToSec('25:00', 'min'),
      hour = clock.convertToSec('01:00:00', 'hour');
  assert.equal(min, 1500, 'convert type min');
  assert.equal(hour, 3600, 'convert type hour');
});

test('converts sec time in to string min #unit-clock-mod-02', 
  function(assert) {
  let result = clock.convertToMin(1480);
  assert.equal(result, '24:40');
});

test('converts sec time in to string hour #unit-clock-mod-03', 
  function(assert) {
  assert.equal(clock.convertToHour(3661), '01:01:01');
  assert.equal(clock.convertToHour(3543), '00:59:03');
  assert.equal(clock.convertToHour(0), '00:00:00');
  assert.equal(clock.convertToHour(360002), '100:00:02');
});

test('getDayHCount  value non zero #unit-clock-mod-04', 
  async function(assert){
    for (var i = 0; i < 3; i++) {
      await helper.createModel('pomodoro', {
        date: new Date(),
      });  
    }
    let result = await clock.getDayHCount(this.store);
    assert.equal(result, '01:15:00');
});

test('getDayHCount  value is zero #unit-clock-mod-05', 
  async function(assert){
    let result = await clock.getDayHCount(this.store);
    assert.equal(result, '00:00:00');
});

test('getWeekHCount #unit-clock-mod-06', 
  async function(assert){

  let currMonday = dateHelper.currMonday(new Date),
      currSunday = dateHelper.currSunday(new Date),
      weekDates = dateHelper.datesRange(currMonday, currSunday);

  for(let day of weekDates){
    await helper.createModel('pomodoro', {
      date: day
    });
  }

  assert.equal(await clock.getWeekHCount(this.store), '02:55:00');
});

test('getWeekHCount  no week count yet #unit-clock-mod-07', 
  async function(assert){
    let result = await clock.getWeekHCount(this.store);
    assert.equal(result, '00:00:00');
    let times = await this.store.findAll('time');
    for(let time of times.toArray())
      await helper.deleteModel(time);
});

test('start  and resets the clock #unit-clock-mod-08', 
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
