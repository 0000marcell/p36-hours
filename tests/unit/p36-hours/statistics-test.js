import PouchDB from 'pouchdb';
import { moduleFor, test } from 'ember-qunit';
import statistics from 'p36-hours/p36-hours/statistics';
import dateHelper from 'p36-hours/p36-hours/date-helper';
import fakeData from 'p36-hours/p36-hours/fake-data';
import helper from '../../helpers/store';
import mock from 'p36-hours/p36-hours/mock';

moduleFor('statistics',
  'Unit | p36-hours | statistics',{
    integration: true,
    async beforeEach(){
      this.store = this.container.lookup('service:store');
      helper.setStore(this.store);
      this.adapter = this.store.adapterFor('application'); 
      this.adapter
        .changeDb(new PouchDB(`test-${new Date().getTime()}`));
    }
});

let tagsTaskObj = {
  tasks: [
    {
      name: 'task 1',
      status: 'active',
      pomodoros: [
        { date: new Date() },
        { date: new Date() }, 
        { date: new Date() }
      ],
      tags: [],
      children: [
        {
          name: 'task 11',
          status: 'active',
          pomodoros: [
            { date: new Date() }, 
            { date: new Date() }, 
            { date: new Date() }
          ],
          tags: ['tag1']
        },
        {
          name: 'task 12',
          status: 'active',
          pomodoros: [
            { date: new Date() }, 
            { date: new Date() }, 
            { date: new Date() }
          ],
          tags: ['tag2']
        },
        {
          name: 'task 13',
          status: 'active',
          pomodoros: [
            { date: new Date() }, 
            { date: new Date() }, 
            { date: new Date() }
          ],
          tags: ['tag3']
        }
      ]
    },
    {
      name: 'task 2',
      status: 'active',
      pomodoros: [
        { date: new Date() }, 
        { date: new Date() }, 
        { date: new Date() }
      ],
      tags: ['tag3']
    }
  ]
};

const radarChartResult = [
  {
    "axis": "planning",
    "value": 0.07
  },
  {
    "axis": "buying material",
    "value": 0.15
  },
  {
    "axis": "cutting",
    "value": 0.23
  },
  {
    "axis": "assembling",
    "value": 0.23
  },
  {
    "axis": "polishing",
    "value": 0.3
  }
];

test('construct line chart object data #unit-statistics-01', 
  async function(assert){
    let twoWeekDates = dateHelper.lastXDays(14);
    for(let date of twoWeekDates){
      await helper.createModel('pomodoro', {
        date: date
      });
    }

    let pomodoros = await this.store.findAll('pomodoro'),
        results = statistics.lineChart(pomodoros, 
      twoWeekDates[0], new Date());

    assert.equal(Object.keys(results).length, 14, 
      'return 14 days of the last two weeks');
    assert.equal(results[0].value, 0.5, 
      '0.5 for each day');
});

test('construct week comparison #unit-statistics-02', 
  async function(assert){
    let today = new Date(),
        lastWeekDate = new Date();
    lastWeekDate.setDate(today.getDate() - 7);

    let thisWeekDates = dateHelper
          .datesRange(dateHelper.currMonday(today), 
            dateHelper.currSunday(today)),
        lastWeekDates = dateHelper
          .datesRange(dateHelper.currMonday(lastWeekDate), 
            dateHelper.currSunday(lastWeekDate));

    for(let date of thisWeekDates){
      await helper.createModel('pomodoro', {
        date: date
      });
    }

    await helper.createModel('pomodoro', {
      date: new Date()
    });

    for(let date of lastWeekDates){
      await helper.createModel('pomodoro', {
        date: date
      });
    }

    let pomodoros = await this.store.findAll('pomodoro'),
        result = statistics.lastWeekComparison(pomodoros);
    assert.equal(result, 1);
  });

test('format text from the comparison #unit-statistics-03', 
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

test('build calendar chart data #unit-statistics-04', 
  async function(assert){
  let tasks = await mock.constructDbFromObj(this.store, fakeData),
      childrenTasks = tasks.objectAt(0).get('children');

  let results = 
      await statistics
        .calendarChartBasedOnTasks(childrenTasks.toArray());

  assert.deepEqual(Object.keys(results).length, 12, 
    'return 12 different dates');
});

test('build calendar chart based on tags #unit-statistics-05', 
  async function(assert){

  await mock.constructDbFromObj(this.store, tagsTaskObj);

  let tags = await this.store.findAll('tag');

  let results = 
      await statistics
        .calendarChartBasedOnTags(tags.toArray());

  assert.equal(Object.keys(results).length, 1, 'just one item');
  assert.equal(results[Object.keys(results)[0]], 12, 
    'first item has 12 pomodoros');
});



test('getAllPomodoros from a task #unit-statistics-06', 
  async function(assert){
  
  let tasks = await mock.constructDbFromObj(this.store, fakeData);

  let allPomodoros = 
      await statistics.getAllPomodoros(tasks.objectAt(0));

  assert.equal(allPomodoros.get('length'),
    39, 'build radar chart data');
});



test('build radar chart data #unit-statistics-07', 
  async function(assert){
  
  let tasks = await mock.constructDbFromObj(this.store, fakeData),
      childrenTasks = tasks.objectAt(0).get('children');

  

  let result = await statistics
      .buildRadarData(childrenTasks.toArray());

  assert.deepEqual(result[0], 
    radarChartResult, 'build radar chart data');
});

test('build radar chart #unit-statistics-08', 
  async function(assert){
  
  let tasks = await mock.constructDbFromObj(this.store, fakeData),
      task = tasks.objectAt(0);

  let results = await statistics.radarChartBasedOnTasks([task]);

  assert.deepEqual(results[0], radarChartResult, 
    'create radar chart based on one task');
});

test('build radar chart children #unit-statistics-09', 
  async function(assert){
  
  let tasks = await mock.constructDbFromObj(this.store, fakeData),
      task = tasks.objectAt(0),
      children = task.get('children');

  let results = await statistics
      .radarChartBasedOnTasks(children.toArray());

  assert.deepEqual(results[0], radarChartResult, 
    'create radar chart based on multiple tasks');
});

test('get children ids #unit-statistics-10', 
  async function(assert){

  let tasks = await mock.constructDbFromObj(this.store, fakeData);

  let allIds = 
        await statistics.getChildrenIds(tasks.objectAt(0));

  assert.equal(allIds.length,
    6, 'number of ids received');
});



test('radarPercentage #unit-statistics-11', 
  async function(assert){
    let results = [
      {
        name: 'task 1',
        value: 3
      }, 
      {
        name: 'task 2',
        value: 3
      },
      {
        name: 'task 3',
        value: 3
      },
    ];

    let expect = [
      {
        name: 'task 1',
        value: 0.33 
      }, 
      {
        name: 'task 2',
        value: 0.33
      },
      {
        name: 'task 3',
        value: 0.33
      },
    ];
    assert.deepEqual(statistics.radarPercentage(results), expect, 
      'returns percentage of the pomodoros');
});

test('radar chart from tags #unit-statistics-12', 
  async function(assert){

    await mock.constructDbFromObj(this.store, 
      tagsTaskObj);

    let tags = await this.store.findAll('tag'),
        results = await statistics
          .radarChartBasedOnTags(tags.toArray());

    assert.equal(results[0].length, 3);
    assert.equal(results[0][0].value, 0.5, 
      'calculates the right amount');
});

test('radar chart from tags #unit-statistics-13', 
  async function(assert){

    await mock.constructDbFromObj(this.store, 
      tagsTaskObj);

    let tags = await this.store.findAll('tag'),
        results = await statistics
          .radarChartBasedOnTags(tags.toArray());

    assert.equal(results[0].length, 3);
    assert.equal(results[0][0].value, 0.5, 
      'calculates the right amount');
});
