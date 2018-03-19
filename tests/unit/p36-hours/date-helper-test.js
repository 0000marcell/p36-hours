import dateHelper from 'p36-hours/p36-hours/date-helper';
import { test } from 'ember-qunit';

test('get lastXDays #unit-date-helper-01', function(assert){
  let dates = dateHelper.lastXDays(14);
  
  assert.equal(dates.length, 14, '14 dates');
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  assert.equal(dates[13].getTime(), yesterday.getTime(), 
    'last day is equal to today');
});

test('get monday of the given date #unit-date-helper-02', 
  function(assert){
  let date = new Date(2015, 1, 3);
  let result = dateHelper.currMonday(date);
  assert.deepEqual(result, 
    new Date(2015, 1, 2));
});

test('get sunday of the given date #unit-date-helper-03', 
  function(assert){
  let date = new Date(2015, 1, 3);
  let result = dateHelper.currSunday(date);
  assert.deepEqual(result, 
    new Date(2015, 1, 8));
});

test('compare two dates #unit-date-helper-04', function(assert){
  let date1 = new Date(2015, 1, 1),
      date2 = new Date(2015, 1, 1);
  date1.setHours(1, 1, 1, 1);
  assert.ok(dateHelper.compareDates(date1, date2));
  assert.notEqual(date1.getTime(), date2.getTime());
});

test('get dates in a range #unit-date-helper-05', 
  function(assert){
  let startDate = new Date(2015, 0, 5),
      endDate = new Date(2015, 0, 11),
      results = dateHelper.datesRange(startDate, endDate);

  assert.equal(results.length, 7, 'return seven dates');
  assert.deepEqual(results[0], startDate, 
    'first date equal start date');
  assert.deepEqual(results[6], endDate, 
    'last date equals end date');
});
