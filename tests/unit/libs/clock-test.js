import { test } from 'ember-qunit';
import clock from 'p36-hours/libs/clock';

test('converts string time to sec #unit-clock-test-01', 
  function(assert) {
  let result = clock.convertToSec('25:00');
  assert.equal(result, 1500);
});

test('converts sec time in to string  #unit-clock-test-02', 
  function(assert) {
  let result = clock.convertToMin(1480);
  assert.equal(result, '24:40');
});
