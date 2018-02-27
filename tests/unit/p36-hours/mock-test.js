import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import { get } from '@ember/object';
import mock from 'p36-hours/p36-hours/mock';
import rsvp from 'rsvp';

moduleFor('mock',
  'Unit | p36-hours | mock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
    },
    async afterEach(){
      await run(async () => {
        await mock.deleteAll(this.store);
        return "done";
      });
    }
});

const obj = {
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
      },
      {
        name: 'task 2',
        status: 'active',
        pomodoros: [
          { date: new Date(2015, 1, 1) },
          { date: new Date(2015, 1, 2) },
          { date: new Date(2015, 1, 3) }
        ],
        tags: ['javascript', 'ruby']
      }
    ]
  };

test('create one task in the store based on a object #unit-mock-test-01', async function(assert) {
  await run(async () => {
    let taskObj = obj.tasks[0],
        task = await mock.createTask(this.store, taskObj, []);
    assert.equal(task.get('name'), 
      'task 1', 'created task have a name');

    let storedTask = await this.store.find('task', task.get('id'));
    assert.equal(storedTask.get('name'), task.get('name'), 
      'crated task have the same name')
    let taskChild = await storedTask.get('children');
    assert.equal(taskChild.objectAt(0).get('name'), 'task 3', 
      'task child has the right name');
  });
});

test('build store from obj #unit-mock-test-02', async function(assert){
  await run(async () => {
    let returnedValues = 
      await mock.constructDbFromObj(this.store, obj);
    assert.equal(returnedValues.get('length'), 2);
    let tasks = await this.store.findAll('task'),
        prevTags = [],
        taskChild = tasks.objectAt(0).get('children').objectAt(0);
    assert.equal(await taskChild.get('pomodoros.length'), 3);
    for(let task of tasks.toArray()){
      assert.equal(task.get('pomodoros.length'), 3);
      assert.equal(task.get('tags.length'), 2);
      let tags = await task.get('tags');
      assert.equal(tags.objectAt(0).get('name'), 'javascript');
      assert.equal(tags.objectAt(1).get('name'), 'ruby');
      if(get(prevTags, 'length') > 0){
        assert.equal(tags.objectAt(0).get('id'), 
          prevTags.objectAt(0).get('id'))
      }else{
        prevTags = tags;
      }
    }
  });
});

test('delete all tasks, pomodoros and tags #unit-mock-test-03', 
  async function(assert){
    await run(async () => {
      await mock.constructDbFromObj(this.store, obj);
      await mock.deleteAll(this.store)
      console.log('gonna test the cases!');
      let tasks = await this.store.findAll('task');
      assert.equal(tasks.get('length'), 0, 'no tasks');

      let pomodoros = await this.store.findAll('pomodoro')
      assert.equal(pomodoros.get('length'), 0, 
        'no pomodoros');

      let tags = await this.store.findAll('tag');
      assert.equal(tags.get('length'), 0, 'no tags');
    });
});

function createTaskwithTag(store){
  return new rsvp.Promise((resolve) => {
    return store.createRecord('task', {
      name: 'task 1'
    }).save().then((firstTask) => {
      return store.createRecord('task', {
        name: 'task 2'
      }).save().then((secondTask) => {
        let newTag = store.createRecord('tag', {
          name: 'javascript'
        });
        newTag.get('tasks').pushObject(firstTask);
        newTag.get('tasks').pushObject(secondTask);
        return newTag.save().then((tag) => {
          resolve(tag);
        });
      });
    })
  });
}

test('build tag relationships #unit-mock-test-04', 
  async function(assert){
    await run(async () => {
      let tag = await createTaskwithTag(this.store);
      let tasks = await tag.get('tasks');
      assert.equal(tasks.get('length'), 2);
      assert.equal(tasks.objectAt(0).get('name'), 'task 1');
      assert.equal(tasks.objectAt(1).get('name'), 'task 2');
    });
});

test('backup one task from the store #unit-mock-test-05', 
  async function(assert){
    await run(async () => {
      let tasks = await mock.constructDbFromObj(this.store, obj),
          json = await mock.backupTask(tasks.objectAt(0));
      assert.equal(json.name, 'task 1');
      assert.equal(json.pomodoros.length, 3);
      assert.equal(json.tags[0], 'javascript');
      assert.equal(json.children.length, 1);
      assert.equal(json.children[0].pomodoros.length, 3);
    });
});

test('backup all data from the store #unit-mock-test-06', 
  async function(assert){
    
    await run(async () => {
      await mock.constructDbFromObj(this.store, obj);
      let json = await mock.backupData(this.store);
      assert.equal(json.tasks.length, 2);
      assert.equal(json.tasks[0].pomodoros.length, 3);
      assert.equal(json.tasks[1].tags.length, 2);
      assert.equal(json.tasks[0].tags[0], 'javascript');
    });
});


