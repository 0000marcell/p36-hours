import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import clock from 'p36-hours/p36-hours/clock';
import rsvp from 'rsvp';

let saveFunc = function(){
  return new rsvp.Promise((resolve) => {
    resolve(this.data);
  });
}


let store = {
  createRecord(model, obj){
    obj['save'] = saveFunc.bind(this);
    this.setData([obj]);
    return {
      save: saveFunc.bind(this)
    }
  },
  setData(data){
    this.data = data;
  },
  findAll(){
    return new rsvp.Promise((resolve) => {
      console.log("gonna resolve with data: ", this.data);
      resolve(this.data);
    });
  }
};

test('converts string time to sec #unit-clock-test-01', 
  function(assert) {
  let result = clock.convertToSec('25:00');
  assert.equal(result, 1500);
});

test('converts sec time in to string min #unit-clock-test-02', 
  function(assert) {
  let result = clock.convertToMin(1480);
  assert.equal(result, '24:40');

});

test('converts sec time in to string hour #unit-clock-test-03', 
  function(assert) {
  assert.equal(clock.convertToHour(3660), '01:01');
  assert.equal(clock.convertToHour(3560), '00:59');
  assert.equal(clock.convertToHour(0), '00:00');
  assert.equal(clock.convertToHour(360000), '100:00');
});

test('getDayHCount  #unit-clock-test-04', 
  async function(assert){
    let timeObj = {
      name: 'week',
      time: '600',
      date: new Date(),
      save(){
        return new rsvp.Promise((resolve) => {
          resolve();
        });
      }
    }
    store.setData([timeObj]);
    let result = await clock.getDayHCount(store);
    assert.equal(result, '00:10');
});

test('getWeekHCount #unit-clock-test-05', 
  async function(assert){
  let timeObj = {
    name: 'week',
    time: '3600',
    date: new Date(),
    save(){
      return new rsvp.Promise((resolve) => {
        resolve();
      });
    }
  }
  store.setData([timeObj]);
  assert.equal(await clock.getWeekHCount(store), '01:00');
});


