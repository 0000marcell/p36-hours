import { all } from 'rsvp';

export default {
  init(store){
    store.findAll('task').then((tasks) => {
      let deletedTasks = [];
      tasks.forEach((task) => {
        deletedTasks.push(task.destroyRecord());
      });
      all(deletedTasks).then(() => {
        let saving = [];
        for(let i = 0; i < 5; i++){
          saving.push(
            store.createRecord('task', {
              name: `task ${i}`,
              status: 'active'
            }).save()
          );
        }
        all(saving).then(() => {
          let tasks = store.peekAll('task');
          tasks.objectAt(0).get('children')
            .pushObject(tasks.objectAt(1));
          tasks.objectAt(1).set('parent', tasks.objectAt(0));
          tasks.objectAt(0).save().then(() => {
            tasks.objectAt(1).save();
          });
        });
      });
    });
  }
}
