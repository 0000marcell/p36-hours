import { moduleFor, test } from 'ember-qunit';
import mock from 'p36-hours/p36-hours/mock';
import rsvp from 'rsvp';

function createModels(store){
  return new rsvp.Promise((resolve) => {
    let promises = []; 
    for (var i = 0; i < 3; i++) {
      let newTask = store.createRecord('task', {
        name: `task ${i}` 
      }),
      newPomodoro = store.createRecord('pomodoro', {
        date: new Date()
      });

      newTask.get('pomodoros').pushObject(newPomodoro);
      newPomodoro.set('task', newTask);
      promises.push(
        new rsvp.Promise((resolve) => {
          newPomodoro.save().then(() => {
            newTask.save().then(() => {
              resolve();
            });
          })
        })
      );
    }
    rsvp.all(promises).then(() => { 
      resolve();
    });
  });
}

moduleFor('mock',
  'Unit | p36-hours | mock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
    }
});

test('delete all tasks and pomodoros #unit-mock-test-01', 
  function(assert){
    return mock.deleteAll(this.store).then(() => {
      return this.store.findAll('pomodoro').then((pomodoros) => {
        assert.equal(pomodoros.toArray().length, 0, 'no pomodoros');
        return this.store.findAll('task').then((tasks) => {
          assert.equal(tasks.toArray().length, 0, 'no tasks');
        });
      });
    });
});

test('build store from obj #unit-mock-test-02', function(assert){
  return createModels(this.store).then(() => {
    let obj = {
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
    return mock.constructDbFromObj(this.store, obj).then(() => {
      return this.store.findAll('task').then((tasks) => {
        return tasks.get('pomodoros').then((pomodoros) => {
          assert.equal(pomodoros.length, 3);
        });
      });
    });
  });
});
