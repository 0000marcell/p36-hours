import rsvp from 'rsvp';

export default {
  deleteAll(store){
    return new rsvp.Promise((resolve) => {
      store.findAll('task').then((tasks) => {
        let deleting = [];
        tasks.forEach((task) => {
          task.get('pomodoros').forEach((pomodoro) => {
            deleting.push(
              pomodoro.destroyRecord()
            );
          });
        });
        rsvp.all(deleting).then(() => {
          deleting = [];
          tasks.forEach((task) => {
            deleting.push(
              task.destroyRecord()
            );
          });
          rsvp.all(deleting).then(() => {
            resolve();
          });
        });
      });
    });
  },
  init(store){
    this.deleteAll(store).then(() => {
      let saving = [];
      for(let i = 0; i < 5; i++){
        saving.push(
          store.createRecord('task', {
            name: `task ${i}`,
            status: 'active'
          }).save()
        );
      }
      rsvp.all(saving).then(() => {
        let tasks = store.peekAll('task');
        tasks.objectAt(0).get('children')
          .pushObject(tasks.objectAt(1));
        tasks.objectAt(1).set('parent', tasks.objectAt(0));
        tasks.objectAt(0).save().then(() => {
          tasks.objectAt(1).save();
        });
      });
    });
  },
  // CORS needs to be disabled
  grabOldInfo(store){
    return new rsvp.Promise((resolve) => {
      this.deleteAll(store).then(() => {
        let id = 'AKIAJDACZGEP7FBSSHGA',
            key = 'LdeWj0jY4//Zhd+nLKpUBvimJo1svIqtdjMJQ6ps',
            region = 'sa-east-1';
        AWS.config.update({accessKeyId: id,
          secretAccessKey: key,
          region: region});
        let bucket = new AWS.S3({params: {Bucket: 'pomodorog'}});
        bucket.getObject({Key: 'new.json'}, (error, data) => {
          let obj = JSON.parse(data.Body.toString()),
              pomodoros = [],
              tasks = [];
          obj.tasks.forEach((taskObj) => {
            let task = store.createRecord('task', {
              name: taskObj.name,
              status: 'active' 
            });
            taskObj.pomodoros.forEach((pomodoro) => {
              let createdPomodoro = store.createRecord('pomodoro', {
                                  date: new Date(pomodoro.date),
                                  task: task
                                });
              createdPomodoro.set('task', task);
              pomodoros.push(createdPomodoro);
            });
            task.set('pomodoros', pomodoros);
            tasks.push(task);
          });
          let saving = [];
          tasks.forEach((task) => {
            saving.push(
              task.save()
            );
          });
          rsvp.all(saving).then(() => {
            saving = [];
            pomodoros.forEach((pomodoro) => {
              saving.push(
                pomodoro.save()
              );
            });
            rsvp.all(saving).then(() => {
              resolve();
            });
          });
        });
      });
    });
  }
}
