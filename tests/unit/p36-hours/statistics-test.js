import { moduleFor, test } from 'ember-qunit';
import statistics from 'p36-hours/p36-hours/statistics';
import { all } from 'rsvp';


function lastThreeMonthsDates(){
  let today = new Date(),
      threeMonthsAgo = new Date(today.getFullYear(), 
        today.getMonth() - 3),
      newDate = threeMonthsAgo,
      dates = [];
  while(newDate < today){
    dates.push(newDate);
    newDate.setDate(newDate.getDate() + 1);
  }
  return dates;
}

let dates = lastThreeMonthsDates();


moduleFor('statistics',
  'Unit | p36-hours | statistics',{
    integration: true,
    async beforeEach(){
      this.store = this.container.lookup('service:store');
      let saving = [];
      dates.forEach(async (date) => {
        saving.push(
          this.store.createRecord('pomodoro', {
            date: date
          }).save()
        )
      });
      await all(saving);
    }
});

test('construct line chart object data #unit-statistics-test-01', 
  async function(assert){
    await this.store.findAll('pomodoro').then((pomodoros) => {
      let twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      let results = statistics.lineChart(pomodoros, 
        twoWeeksAgo, new Date());
      assert.equal(Object.keys(results).length, 14);
      assert.equal(results[0].value, 2);
    });
});

test('construct week comparison #unit-statistics-test-02', 
  async function(assert){
    await this.store.findAll('pomodoro').then((pomodoros) => {
      let result = statistics.lastWeekComparison(pomodoros);
      assert.equal(result, 0);
    });
  });

test('construct month comparison #unit-statistics-test-03', 
  async function(assert){
    await this.store.findAll('pomodoro').then((pomodoros) => {
      let result = statistics.lastMonthComparison(pomodoros);
      assert.equal(result, 0);
    });
  });

test('format text from the comparison #unit-statistics-test-04', 
  function(assert){
  assert.equal(statistics.formatComparison(0), 
    'about the same time');
  assert.equal(statistics.formatComparison(1), '1 hour more');
  assert.equal(statistics.formatComparison(2), '1 hour more');
  assert.equal(statistics.formatComparison(3), '2 hours more');
  assert.equal(statistics.formatComparison(4), '2 hours more');
  assert.equal(statistics.formatComparison(-1), '1 hour less');
  assert.equal(statistics.formatComparison(-2), '1 hour less');
  assert.equal(statistics.formatComparison(-3), '2 hours less');
  assert.equal(statistics.formatComparison(-4), '2 hours less');
});

test('build calendar chart data #unit-statistics-test-05', 
  function(assert){
  let pomodoros = [
    {date: new Date(2013, 1, 2).toString()},
    {date: new Date(2013, 1, 2).toString()},
    {date: new Date(2013, 1, 3).toString()},
    {date: new Date(2013, 1, 4).toString()}
  ];
  let result = statistics.calendarChart(pomodoros),
      expected = {
        '2013-02-02': 2,
        '2013-02-03': 1,
        '2013-02-04': 1
      };
  assert.deepEqual(result, expected);
});
