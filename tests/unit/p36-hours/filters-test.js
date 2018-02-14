import { moduleFor, test } from 'ember-qunit';
import filters from 'p36-hours/p36-hours/filters';
import { all } from 'rsvp';

let dates = [],
    date = new Date(new Date().getFullYear(), 0, 1);
for (var i = 0; i < 60; i++) {
  dates.push(new Date(date.getTime()));
  date.setDate(date.getDate() + 1)
}

moduleFor('filters', 
  'Unit | p36-hours | filters', {
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
  },
  afterEach(){
  }
});

test('grab all pomodoros in a date range #unit-filters-test-01', 
  async function(assert){
    await this.store.findAll('pomodoro').then((pomodoros) => {
      let twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      let results = 
        filters.pomodorosInRange(pomodoros, twoWeeksAgo, new Date);
      assert.equal(results.length, 14);
    });
});

test('grab all pomodoros with a specific date #unit-filters-test-02', 
  async function(assert){
    await this.store.findAll('pomodoro').then((pomodoros) => {
      let date = new Date(new Date().getFullYear(), 0, 3),
          results = filters.pomodorosHaveDate(pomodoros, date);
      assert.equal(results.length, 1);
      assert.deepEqual(new Date(results[0].get('date')), date);
    });  
})
