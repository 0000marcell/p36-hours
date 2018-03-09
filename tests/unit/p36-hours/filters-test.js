import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import filters from 'p36-hours/p36-hours/filters';
import mock from 'p36-hours/p36-hours/mock';
import { all } from 'rsvp';
import { get } from '@ember/object';



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
  }
});

test('grab all pomodoros in a date range #unit-filters-01', 
  async function(assert){
    let pomodoros = await this.store.findAll('pomodoro'),
        twoWeeksAgo = new Date();

    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    let results = 
      filters.pomodorosInRange(pomodoros, twoWeeksAgo, new Date());
    assert.equal(results.length, 14);
});

test('grab all pomodoros with a specific date #unit-filters-02', 
  async function(assert){
    let pomodoros = await this.store.findAll('pomodoro'),
        date = new Date();

    date.setDate(date.getDate() - 1);

    let results = filters.pomodorosHaveDate(pomodoros, date);

    assert.equal(results.length, 1);
    date.setHours(0, 0, 0, 0);
    let pomDate = new Date(results[0].get('date'));
    pomDate.setHours(0, 0, 0, 0);
    assert.deepEqual(pomDate, date);
});

test('searchTaskTree  #unit-filters-03', 
  async function(assert){
    let obj = {
      tasks: [
        {
          name: 'task 1',
          status: 'active',
          pomodoros: [
            { date: new Date(2015, 1, 1) },
            { date: new Date(2015, 1, 2) },
            { date: new Date(2015, 1, 3) }
          ],
          tags: ['javascript', 'ruby'],
          children: [{
            name: 'task 3',
            status: 'active',
            pomodoros: [
              { date: new Date(2015, 1, 1) },
              { date: new Date(2015, 1, 2) },
              { date: new Date(2015, 1, 3) }
            ],
            tags: ['javascript', 'ruby']
          }],
        }
      ]
    }
    let tasks;
    await run(async () => {
      tasks = await mock.constructDbFromObj(this.store, obj);
    });    

    let results = filters.searchTaskTree(tasks.objectAt(0), '3');
    assert.equal(results[0].get('name'), 'task 3', 
      'find right task!');
});

test('rootTasks #unit-filters-04', 
  async function(assert){
    let obj = {
      tasks: [
        {
          name: 'task 1',
          status: 'active',
          pomodoros: [
            { date: new Date(2015, 1, 1) },
            { date: new Date(2015, 1, 2) },
            { date: new Date(2015, 1, 3) }
          ],
          tags: ['javascript', 'ruby'],
          children: [{
            name: 'task 3',
            status: 'active',
            pomodoros: [
              { date: new Date(2015, 1, 1) },
              { date: new Date(2015, 1, 2) },
              { date: new Date(2015, 1, 3) }
            ],
            tags: ['javascript', 'ruby']
          }],
        }
      ]
    }

    let tasks;
    await run(async () => {
      tasks = await mock.constructDbFromObj(this.store, obj);
    });    
    
    let results = await filters.rootTasks(tasks);

    assert.equal(get(results, 'length'), 1, 
      'returns only one task');
    assert.equal(results.objectAt(0).get('name'), 'task 1', 
      'returns the right task!');
});
