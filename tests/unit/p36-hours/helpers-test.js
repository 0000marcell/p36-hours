import { test } from 'ember-qunit';
import helpers from 'p36-hours/p36-hours/helpers';

test('get monday of the given date #unit-helpers-test-01', 
  function(assert){
  let date = new Date(2015, 1, 3);
  let result = helpers.currMonday(date);
  assert.deepEqual(result, 
    new Date(2015, 1, 2));
});
