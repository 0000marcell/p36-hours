import { moduleFor, test } from 'ember-qunit';
import statistics from 'p36-hours/p36-hours/statistics';
import { all } from 'rsvp';

let dates = [],
    date = new Date(),
    j = 0;
date.setDate(date.getDate() - 70);
for (var i = 0; i < 125; i++) {
  dates.push(new Date(date.getTime()));
  if(j > 1){
    date.setDate(date.getDate() + 1)
    j = 0;
  }
  j++;
}

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

