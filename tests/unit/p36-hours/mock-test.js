import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import mock from 'p36-hours/p36-hours/mock';
import rsvp from 'rsvp';

moduleFor('mock',
  'Unit | p36-hours | mock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
    },
    async afterEach(){
      await mock.deleteAll(this.store);
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

test('build store from obj #unit-mock-test-01', function(assert){
  return run(() => {
    return mock.constructDbFromObj(this.store, obj).then(() => {
      return this.store.findAll('task').then((tasks) => {
        let promises = [];
        tasks.forEach((task) => {
          promises.push(
            task.get('pomodoros').then((pomodoros) => {
              assert.equal(pomodoros.length, 3);
            })
          );
        });
        return rsvp.all(promises);
      });
    });
  });
});

test('delete all tasks and pomodoros #unit-mock-test-02', 
  function(assert){
    return run(() => {
      return mock.constructDbFromObj(this.store, obj).then(() => {
        return mock.deleteAll(this.store).then(() => {
          return this.store.findAll('task').then((tasks) => {
            assert.equal(tasks.get('length'), 0, 'no tasks');
            return this.store
              .findAll('pomodoro').then((pomodoros) => {
                assert.equal(pomodoros.get('length'), 0, 
                  'no pomodoros');
              })
          });
        })
      });
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

test('build tag relationships #unit-mock-test-03', 
  function(assert){
    return run(() => {
      return createTaskwithTag(this.store).then((tag) => {
        return tag.get('tasks').then((tasks) => {
          assert.equal(tasks.get('length'), 2);
          assert.equal(tasks.objectAt(0).get('name'), 'task 1');
          assert.equal(tasks.objectAt(1).get('name'), 'task 2');
        });
      });
    });
});
