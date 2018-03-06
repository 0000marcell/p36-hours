import rsvp from 'rsvp';
import { run } from '@ember/runloop';

export default {
  /*
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
  */
  async deleteAll2(store, models){
    for(let model of models){
      let records = await store.findAll(model);
      for(let record of records.toArray()){
        await run(async () => {
          await record.destroyRecord();
        });
      }
    }
  },
  deleteAll(store){
    return new rsvp.Promise((resolve) => {
      let deleting = [];
      deleting.push(
        new rsvp.Promise((resolve) => {
          let deletedPomodoros = [];
          return store.findAll('pomodoro').then((pomodoros) => {
            if(pomodoros.get('length')){
              pomodoros.map((pomodoro) => {
                deletedPomodoros.push(pomodoro.destroyRecord());
              });
            }
            rsvp.all(deletedPomodoros).then(() => {
              resolve();
            });
          })
        })
      );
      deleting.push(
        new rsvp.Promise((resolve) => {
          let deletedTags = [];
          return store.findAll('tag').then((tags) => {
            if(tags.get('length')){
              tags.map((tag) => {
                deletedTags.push(
                  tag.destroyRecord()
                );
              });
            }
            rsvp.all(deletedTags).then(() => {
              resolve();
            });
          });
        })
      );
      return rsvp.all(deleting).then(() => {
        return store.findAll('task').then((tasks) => {
          let deletedTask = [];
          /*
          if(tasks.get('length')){
            console.log('gonna delete all tasks');
            tasks.map((task) => {
              deletedTask.push(task.destroyRecord());
            });
          }
          */
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
  createTask(store, task, savedTagsNames){
    return new rsvp.Promise((resolve) => {
      return store.createRecord('task', {
        name: task.name,
        status: 'active'
      }).save().then((newTask) => {
        let savedPomodoros = [],
            savedTags = [],
            tagObjects = [],
            savedChildren = [];
        if(task['pomodoros']){
          task.pomodoros.forEach((pomodoro) => {
            savedPomodoros.push(
              store.createRecord('pomodoro', {
                date: new Date(pomodoro.date),
                task: newTask
              }).save()
            );
          });
        } 
        
        if(task['tags']){
          task.tags.forEach((tagName) => {
            if(savedTagsNames.indexOf(tagName) === -1){
              savedTags.push(
                store.createRecord('tag', {
                  name: tagName
                }).save().then((tag) => {
                  tagObjects.push(tag);
                }) 
              );
              savedTagsNames.push(tagName);
            }else{
              savedTags.push(
                new rsvp.Promise((resolve) => {
                  store.findAll('tag').then((tags) => {
                    tagObjects
                      .push(tags.findBy('name', tagName))
                    resolve();
                  });
                })
              );
            }
          });
        }
        
        return rsvp.all(savedPomodoros).then(() => {
          return rsvp.all(savedTags).then(() => {
            if(task['children']){
              task.children.forEach((child) => {
                savedChildren.push(
                  this.createTask(store, child, savedTagsNames)
                );
              });
            }
            return rsvp.all(savedChildren).then((children) => {
              if(children){
                children.forEach((child) => {
                  newTask.get('children').pushObject(child);
                });
              }
              
              if(tagObjects){
                tagObjects.forEach((tag) => {
                  newTask.get('tags').pushObject(tag);
                });
              }
              
              newTask.save().then((task) => {
                resolve(task);
              });
            });
          });
        });
      });
    });
  },
  constructDbFromObj(store, obj){
    return new rsvp.Promise((resolve) => {
      let promises = [],
          savedTagsNames = [];
      obj.tasks.forEach((task) => {
        promises.push(
          this.createTask(store, task, savedTagsNames)
        );
      });
      return rsvp.all(promises).then((tasks) => {
        resolve(tasks);
      });
    });
  },
  // CORS needs to be disabled
  grabOldInfo(store){
    return new rsvp.Promise((resolve) => {
      this.deleteAll(store).then(() => {
        let id = 'ENV',
            key = 'ENV',
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
  },
  backupTask(task){
    let promises = [];
    return new rsvp.Promise((resolve) => {
      let taskObj = {
        name: task.get('name'),
        pomodoros: [],
        status: task.get('status'),
        tags: []
      };
      promises.push(
        new rsvp.Promise((resolve) => {
          task.get('pomodoros').then((pomodoros) => {
            pomodoros.forEach((pomodoro) => {
              taskObj.pomodoros.push({
                date: pomodoro.get('date')
              });
            });
            resolve();
          })
        })
      );
      promises.push(
        new rsvp.Promise((resolve) => {
          task.get('tags').then((tags) => {
            tags.forEach((tag) => {
              taskObj.tags.push(tag.get('name'));
            });
            resolve();
          });
        })
      );
      return rsvp.all(promises).then(() => {
        let savedChildren = [],
            children = task.get('children').toArray();
        if(children.length){
          children.forEach((child) => {
            savedChildren.push(
              this.backupTask(child)
            );
          });
        }
        return rsvp.all(savedChildren).then((children) => {
          taskObj.children = children;
          resolve(taskObj);
        });
      });
    });
  },
  backupData(store){
    let resultObj = {
      tasks: []
    };
    let promises = [];
    return new rsvp.Promise((resolve) => {
      return store.findAll('task').then((tasks) => {
        tasks.forEach((task) => {
          if(!task.get('parent')){
            promises.push(
              this.backupTask(task)
            );
          }
        });
        return rsvp.all(promises).then((tasks) => {
          resultObj.tasks = tasks;
          resolve(resultObj);
        });
      });
    });
  }
}
