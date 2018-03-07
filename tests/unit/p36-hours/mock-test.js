import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import { get } from '@ember/object';
import mock from 'p36-hours/p36-hours/mock';
import rsvp from 'rsvp';
import helper from '../../helpers/store';

moduleFor('mock',
  'Unit | p36-hours | mock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
      this.adapter = this.container.lookup('adapter:application');
      debugger;
      helper.setStore(this.store);
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

test('create one task in the store based on a object #unit-mock-01', async function(assert) {
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

    let tags = await storedTask.get('tags');
    assert.equal(tags.get('length'), 2, 'task has 2 tags');
    
    let pomodoros = await storedTask.get('pomodoros');
    assert.equal(pomodoros.get('length'), 3, 
      'task has 4 pomodoros');
  });
});

test('create one task without children pomodoros or tags #unit-mock-02', 
  async function(assert) {
  await run(async () => {
    let taskObj = {
      name: 'task 2',
      status: 'active'
    };
    
    let task = await mock.createTask(this.store, taskObj, []);
    assert.equal(task.get('name'), 
      'task 2', 'created task have a name');

    let storedTask = await this.store.find('task', task.get('id'));
    assert.equal(storedTask.get('name'), task.get('name'), 
      'crated task have the same name')
    let taskChild = await storedTask.get('children');
    assert.equal(taskChild.get('length'), 0, 
      'have no children');
  });
});

test('delete one task with associations #unit-mock-03', 
  async function(assert) {
  await run(async () => {
    let taskObj = {
      name: 'task 1',
      status: 'active',
      pomodoros: [
        { date: new Date(2015, 1, 1) },
        { date: new Date(2015, 1, 2) },
        { date: new Date(2015, 1, 3) }
      ],
      tags: ['javascript', 'ruby']
    };

    let task = await mock.createTask(this.store, taskObj, []);
    
    let pomodoros = await task.get('pomodoros');
    for(let pomodoro of pomodoros.toArray()){
      await run(async () => {
        await pomodoro.destroyRecord();
      });
    }

    let tags = await task.get('tags');
    for(let tag of tags.toArray()){
      await run(async () => {
        await tag.destroyRecord();
      });
    }

    await run(async () => {
      await task.destroyRecord();
    });

    return new rsvp.Promise((resolve) => {
      setTimeout(async () => {
        let tasks = await this.store.findAll('task');
        assert.equal(tasks.get('length'), 0, 
          'no tasks in the store');

        let pomodoros = await this.store.findAll('pomodoro');
        assert.equal(pomodoros.get('length'), 0, 
          'has no pomodoros');
        
        let tags = await this.store.findAll('tag');
        assert.equal(tags.get('length'), 0, 
          'no tags in the store');

        resolve();
      }, 100);
    });
  });
});


test('load all data in to the store #unit-mock-04', 
  async function(assert){
    await run(async () => {
      await mock.constructDbFromObj(this.store, obj);

      return new rsvp.Promise((resolve) => {
        setTimeout(async () => {
          let tasks = await this.store.findAll('task');
          assert.equal(tasks.get('length'), 3, 
            '2 tasks in the store');

          let pomodoros = await this.store.findAll('pomodoro');

          assert.equal(pomodoros.get('length'), 9, 
            '6 pomodoros in the store');

          let tags = await this.store.findAll('tag');
          assert.equal(tags.get('length'), 2, 
            '2 tags in the store');

          resolve();
        }, 1000);
      });
    });
});


/*
test('unload all data from the store #unit-mock-05', 
  async function(assert){
    await run(async () => {
      await mock.constructDbFromObj(this.store, obj);
      let json = await mock.backupData(this.store);
      assert.equal(json.tasks.length, 2, 
        'have the right number of tasks');
      assert.equal(json.tasks[0].pomodoros.length, 3, 
        'task has the right number of pomodoros');
      assert.equal(json.tasks[0].name, 'task 1', 
        'task has the right name');
      assert.equal(json.tasks[1].tags.length, 2, 
        'task has the right number of tags');
      assert.equal(json.tasks[0].tags[0], 'javascript', 
        'tag has the right name');
    });
});

test('delete all tasks #unit-mock-00', 
  async function(assert) {
  await run(async () => {
    let tasksObj = {
      tasks: 
        [
          {
            name: 'task 1',
            status: 'active',
            pomodoros: [
              { date: new Date(2015, 1, 1) },
              { date: new Date(2015, 1, 2) },
              { date: new Date(2015, 1, 3) }
            ],
            tags: ['javascript', 'ruby']
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
    

    let task = await mock.createTask(this.store, tasksObj, []);
    
    let pomodoros = await task.get('pomodoros');
    for(let pomodoro of pomodoros.toArray()){
      await run(async () => {
        await pomodoro.destroyRecord();
      });
    }

    let tags = await task.get('tags');
    for(let tag of tags.toArray()){
      await run(async () => {
        await tag.destroyRecord();
      });
    }

    await run(async () => {
      await task.destroyRecord();
    });

    return new rsvp.Promise((resolve) => {
      setTimeout(async () => {
        let tasks = await this.store.findAll('task');
        assert.equal(tasks.get('length'), 0, 
          'no tasks in the store');

        let pomodoros = await this.store.findAll('pomodoro');
        assert.equal(pomodoros.get('length'), 0, 
          'has no pomodoros');
        
        let tags = await this.store.findAll('tag');
        assert.equal(tags.get('length'), 0, 
          'no tags in the store');

        resolve();
      }, 100);
    });
  });
});



test('build store from obj #unit-mock-00', async function(assert){
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

test('delete one task with relationships #unit-mock-00', 
  async function(assert){

    await mock.constructDbFromObj(this.store, obj.tasks[1]);

    let pomodoros = await this.store.findAll('pomodoro');
    for(let pomodoro of pomodoros.toArray()){
      helper.deleteModel(pomodoro);
    }

    let tags = await this.store.findAll('tag');
    for(let tag of tags.toArray()){
      helper.deleteModel(tag);
    }

    let tasks = await this.store.findAll('task');
    for(let task of tasks.toArray()){
      helper.deleteModel(task);
    }

    assert.ok(true);


    let resultStore = await helper.checkStore(models);

    assert.equal(resultStore.pomodoro.length, 0, 'no pomodoros');
    assert.equal(resultStore.tag.length, 0, 'no tags');
    assert.equal(resultStore.task.length, 0, 'no tasks');
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

test('build tag relationships #unit-mock-00', 
  async function(assert){
    await run(async () => {
      let tag = await createTaskwithTag(this.store);
      let tasks = await tag.get('tasks');
      assert.equal(tasks.get('length'), 2);
      assert.equal(tasks.objectAt(0).get('name'), 'task 1');
      assert.equal(tasks.objectAt(1).get('name'), 'task 2');
    });
});



*/
