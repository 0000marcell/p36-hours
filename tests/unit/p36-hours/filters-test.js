import PouchDB from 'pouchdb';
import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import filters from 'p36-hours/p36-hours/filters';
import dateHelper from 'p36-hours/p36-hours/date-helper';
import helper from '../../helpers/store';
import fakeData from 'p36-hours/p36-hours/fake-data';
import mock from 'p36-hours/p36-hours/mock';
import { get } from '@ember/object';



moduleFor('filters', 
  'Unit | p36-hours | filters', {
  integration: true,
  async beforeEach(){
    this.store = this.container.lookup('service:store');
    helper.setStore(this.store);
    this.adapter = this.store.adapterFor('application'); 
    this.adapter
        .changeDb(new PouchDB(`test-${new Date().getTime()}`));
  }
});

test('grab all pomodoros in a date range #unit-filters-01', 
  async function(assert){

    let dates = dateHelper.lastXDays(14);
    for(let date of dates){
      await helper.createModel('pomodoro', {
        date: date
      });
    }

    let twoWeeksAgo = new Date(),
        today = new Date();

    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    today.setHours(0, 0, 0, 0);
    twoWeeksAgo.setHours(0, 0, 0, 0);

    let pomodoros = await this.store.findAll('pomodoro');

    let results = filters
      .pomodorosInRange(pomodoros, twoWeeksAgo, today);
    assert.equal(results.length, 14, 'has 14 dates');
    assert.deepEqual(results[0].get('date'), twoWeeksAgo, 
      'first date is two weeks ago');
});

test('grab all pomodoros with a specific date #unit-filters-02', 
  async function(assert){

    let pomodoro = await helper.createModel('pomodoro', {
      date: new Date() 
    });

    let pomodoros = await this.store.findAll('pomodoro'),
        date = new Date();

    let results = filters.pomodorosHaveDate(pomodoros, date);
    assert.equal(results.length, 1);
    date.setHours(0, 0, 0, 0);
    let pomDate = new Date(results[0].get('date'));
    pomDate.setHours(0, 0, 0, 0);
    assert.deepEqual(pomDate, date);
    await helper.deleteModel(pomodoro);
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

test('grab last task done #unit-filters-05', 
  async function(assert){
    await mock.constructDbFromObj(this.store, fakeData);

    let pomodoros = await this.store.findAll('pomodoro');
    
    let result = await filters.lastTaskDone(pomodoros);

    assert.equal(get(result, 'name'), 'polishing', 
      'return the right task');
});
