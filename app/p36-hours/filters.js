import rsvp from 'rsvp';

export default {
  rootTasks(store){
    return new rsvp.Promise((resolve) => {
      let results = [],
          proms = [];
      store.findAll('task').then((tasks) => {
        tasks.forEach((task) => {
          proms.push(
            task.get('parent').then((parent) => {
              if(!parent && task.get('status') === 'active')
                results.push(task);
            })
          );
        });
        rsvp.all(proms).then(() => {
          resolve(results); 
        });
      });  
    });
  }
}
