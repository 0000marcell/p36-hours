import rsvp from 'rsvp';
import { run } from '@ember/runloop';
import { get, set } from '@ember/object';

export default {
  async deleteTask(task, delIds = []){
    let children = get(task, 'children');
    if(get(children, 'length')){
      for(let child of children.toArray()){
        delIds = delIds.concat(...await this.deleteTask(child));
      }
    }
    
    let pomodoros = await get(task, 'pomodoros');
    if(get(pomodoros, 'length')){
      for(let pomodoro of pomodoros.toArray()){
        await run(async () => {
          await pomodoro.destroyRecord();
        });
      }
    }

    let tags = await get(task, 'tags');
    if(get(tags, 'length')){
      for(let tag of tags.toArray()){
        let tasks = await get(tag, 'tasks'),
            results = tasks.filter((tagTask) => {
              return get(tagTask, 'id') !== get(task, 'id');
            });
        await run(async () => {
          await set(tag, 'tasks', results);
        });
      }
    }
    
    await run(async () => {
      await set(task, 'tags', []);
      set(task, 'parent', null) 
    });

    await run(async () => {
      delIds.push(task.get('id'));
      await task.destroyRecord();  
    });
    return delIds;
  },
  async deleteAll(store){
    let tasks = await store.findAll('task'),
        delIds = [];
    for(let task of tasks.toArray())
      if(!delIds.find((id) => ( id === task.get('id'))))
        delIds = delIds.concat(...await this.deleteTask(task));
    
    let tags = await store.findAll('tag');

    for(let tag of tags.toArray()){
      await run(async () => {
        tag.destroyRecord();
      });
    }
  },
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
  deleteAll3(store){
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
  async createTask(store, task, parent = null){
    let newTask;
    await run(async () => {
      newTask = await store.createRecord('task', {
        name: task.name,
        status: 'active',
        parent: parent
      }).save();
    });
    
    if(task['pomodoros']){
      for(let pomodoro of task['pomodoros']){
        await run(async () => {
          await store.createRecord('pomodoro', {
            date: new Date(pomodoro.date),
            task: newTask
          }).save();
        });
      }
    }

    if(task['tags']){
      let tags = await store.findAll('tag'),
          tagsToInclude = [];
      for(let tag of task['tags']){
        let newTag = tags.findBy('name', tag);
        if(!newTag){
          await run(async () => {
            newTag = await store.createRecord('tag', {
              name: tag
            }).save();
          });
        }
        newTag.get('tasks').pushObject(newTask);
        tagsToInclude.push(newTag);
      }
      set(newTask, 'tags', tagsToInclude);
    }

    if(task['children']){
      let children = [];
      for(let child of task['children']){
        children.push(
          await this.createTask(store, child, newTask)
        );
      }
      set(newTask, 'children', children);
    }
    return newTask;
  },
  createTask2(store, task, savedTagsNames){
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
                  this.createTask2(store, child, savedTagsNames)
                );
              });
            }
            return rsvp.all(savedChildren).then(
              async (children) => {
              if(children){
                for(let child of children){
                  newTask.get('children').pushObject(child);
                  child.set('parent', newTask);
                  await run(async () => {
                    await newTask.save();
                  });
                  await run(async () => {
                    await child.save();
                  });
                }
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
      let promises = [];
      obj.tasks.forEach((task) => {
        promises.push(
          this.createTask(store, task)
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
        let id = process.env.AWS_ACCESS_KEY_ID,
            key = process.env.AWS_SECRET_ACCESS_KEY,
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
