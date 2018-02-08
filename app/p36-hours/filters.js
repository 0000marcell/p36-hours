import rsvp from 'rsvp';

export default {
  rootTasks(tasks, status){
    return new rsvp.Promise((resolve) => {
      tasks.then((tasks) => {
        resolve(
          tasks.filter((task) => {
            return (!task.get('parent') && 
              task.get('status') === status)
          })
        );
      });
    });
  }
}
