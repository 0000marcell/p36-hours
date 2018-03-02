import { test } from 'ember-qunit';
import helpers from 'p36-hours/p36-hours/helpers';

test('get monday of the given date #unit-helpers-test-01', 
  function(assert){
  let date = new Date(2015, 1, 3);
  let result = helpers.currMonday(date);
  assert.deepEqual(result, 
    new Date(2015, 1, 2));
});

test(`return string of the 
  full path of the task #unit-helpers-test-02`, 
  function(assert){
  let withParents = {
    id: 3,
    name: 'task 3',
    parent: {
      id: 2,
      name: 'task 2',
      parent: {
        id: 1,
        name: 'task 1'
      }
    }
  };

  let withNoParents = {
    id: 1,
    name: 'task 1'
  };

  assert.deepEqual(['task 1', 'task 2', 'task 3'], 
    helpers.grabPathName(withParents));

  assert.deepEqual(['task 1'], 
    helpers.grabPathName(withNoParents))
});

test('get sunday of the given date #unit-helpers-test-03', function(assert){
  let date = new Date(2015, 1, 3);
  let result = helpers.currSunday(date);
  assert.deepEqual(result, 
    new Date(2015, 1, 1));
});

test('compare two dates #unit-helpers-test-04', function(assert){
  let date1 = new Date(2015, 1, 1),
      date2 = new Date(2015, 1, 1);
  date1.setHours(1, 1, 1, 1);
  assert.ok(helpers.compareDates(date1, date2));
  assert.notEqual(date1.getTime(), date2.getTime());
});
