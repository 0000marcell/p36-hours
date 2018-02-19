import rsvp from 'rsvp';

export default {
  deleteTask(task){
    return new rsvp.Promise((resolve) => {
      let deletedPomodoros = [];
      task.get('pomodoros').then((pomodoros) => {
        pomodoros.map((pomodoro) => {
          deletedPomodoros.push(pomodoro.destroyRecord());
        });
      });
      rsvp.all(deletedPomodoros).then(() => {
        task.destroyRecord().then(() => {
          resolve();
        });
      });
    });
  },
  deleteAll(store){
    return new rsvp.Promise((resolve) => {
      store.findAll('task').then((tasks) => {
        let deleting = [];
        tasks.forEach((task) => {
          deleting.push(
            new rsvp.Promise((resolve) => {
              task.get('pomodoros').then((pomodoros) => {
                let deletedPomodoros = [];
                pomodoros.map((pomodoro) => {
                  deletedPomodoros.push(pomodoro.destroyRecord());
                });
                rsvp.all(deletedPomodoros).then(() => {
                  resolve();
                });
              })
            })
          );
        });
        rsvp.all(deleting).then(() => {
          let deletedTask = [];
          tasks.map((task) => {
            deletedTask.push(task.destroyRecord());
          });
          rsvp.all(deletedTask).then(() => {
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
  constructDbFromObj(store, obj){
    return new rsvp.Promise((resolve) => {
      let promises = [];
      obj.tasks.forEach((task) => {
        promises.push(
          new rsvp.Promise((resolve) => {
            return store.createRecord('task', {
              name: task.name,
              status: 'active'
            }).save().then((newTask) => {
              let savedPomodoros = [];
              task.pomodoros.forEach((pomodoro) => {
                savedPomodoros.push(
                  store.createRecord('pomodoro', {
                    date: new Date(pomodoro.date),
                    task: newTask
                  }).save()
                );
              });
              return rsvp.all(savedPomodoros).then(() => {
                resolve()
              });
            });
          })
        );
      });
      return rsvp.all(promises).then(() => {
        resolve();
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
          let obj = JSON.parse(data.Body.toString());
          this.constructDbFromObj(store, obj).then(() => {
            resolve('db data saved!');
          });
        });
      });
    });
  }
}
