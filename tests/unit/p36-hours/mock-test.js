import { moduleFor, test } from 'ember-qunit';
import mock from 'p36-hours/p36-hours/mock';
import { all } from 'rsvp';

moduleFor('mock',
  'Unit | p36-hours | mock',{
    integration: true,
    beforeEach(){
      this.store = this.container.lookup('service:store');
      let saving = [],
          pomodoros = [];
      for (var i = 0; i < 3; i++) {
        let newTask = this.store.createRecord('task', {
          name: `task ${i}` 
        }),
        newPomodoro = this.store.createRecord('pomodoro', {
          date: new Date()
        });

        newTask.get('pomodoros').pushObject(newPomodoro);
        newPomodoro.set('task', newTask);
        pomodoros.push(newPomodoro);
        saving.push(
          newTask.save()
        );
      }
      return all(saving).then(() => {
        saving = [];
        pomodoros.forEach((pomodoro) => {
          saving.push(
            pomodoro.save()
          );
        });
        return all(saving);
      });
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
