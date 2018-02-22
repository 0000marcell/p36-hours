import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import statistics from 'p36-hours/p36-hours/statistics';
import rsvp from 'rsvp';
import mock from 'p36-hours/p36-hours/mock';


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

const obj = {
    tasks: [
      {
        name: 'task 1',
        status: 'active',
        pomodoros: [
          { date: new Date(2015, 1, 1) },
          { date: new Date(2015, 1, 2) },
          { date: new Date(2015, 1, 3) }
        ]
      },
      {
        name: 'task 2',
        status: 'active',
        pomodoros: [
          { date: new Date(2015, 1, 1) },
          { date: new Date(2015, 1, 2) },
          { date: new Date(2015, 1, 3) }
        ]
      }
    ]
  };


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
      await rsvp.all(saving);
    },
    async afterEach(){
      await run(async () => {
        await mock.deleteAll(this.store);
      });
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

test('build radar chart data #unit-statistics-test-06', 
  async function(assert){

  let pomodoros = new rsvp.Promise((resolve) => {
    let results = dates.map((date) => ({ date: date }));
    resolve(results);
  });

  let threeTasks = [],
      twoTasks = [],
      nestedTasks = [];
  for (var i = 0; i < 3; i++) {
    threeTasks.push(
      {
        id: i,
        name: `task ${i}`,
        pomodoros: pomodoros
      }
    );

    if(i < 2){
      twoTasks.push(
        {
          id: i,
          name: `task ${i}`,
          pomodoros: pomodoros
        }
      );
    }
  }

  nestedTasks = [
    {id: 5, name: 'task 3'},
    {id: 6, name: 'task 4'}
  ];
  nestedTasks[0]['children'] = threeTasks;

  let expected = [
    [ 
      {axis:'task 0', value: 0.33},
      {axis:'task 1', value: 0.33},
      {axis:'task 2', value: 0.33},
    ]
  ];
  assert.deepEqual(await statistics.radarChart(threeTasks), 
      expected, 'load data for three tasks!');
  assert.deepEqual(await statistics.radarChart(twoTasks), 
    [], 'return a empty array if the data is not valid');
  assert.deepEqual(await statistics.radarChart(threeTasks), 
    expected, 'load data for nestedTasks!');
});

let tagsObj = [
  {name: 'tag 1'},
  {name: 'tag 2'},
  {name: 'tag 3'}
];


async function createTagsData(store){
  let tasks;
  await run(async () => {
    tasks = await mock.constructDbFromObj(store, obj);
  });
  let tags = [];
  for(let tag of tagsObj){
    await run(async () => {
      tags.push(
        await store.createRecord('tag', {
          name: tag.name,
          tasks: tasks
        }).save()
      );
    });
  }
  return tags;
}

test('radar chart from tags #unit-statistics-test-07', 
  async function(assert){
    let expected = [
      [
        {
          "axis": "tag 1",
          "value": 0.33
        },
        {
          "axis": "tag 2",
          "value": 0.33
        },
        {
          "axis": "tag 3",
          "value": 0.33
        }
      ]
    ];
    let tags = await createTagsData(this.store),
        results = await statistics.radarChartDataBasedOnTags(tags);
    assert.equal(results.length, 3);
    assert.equal(results[0].pomodoros.length, 6) 
    assert.deepEqual(await statistics.radarChart(results), expected);
});
