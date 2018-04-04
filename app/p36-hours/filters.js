import rsvp from 'rsvp';
import { get } from '@ember/object';

export default {
  rootTasks(tasks){
    return new rsvp.Promise((resolve) => {
      resolve(
        tasks.filter((task) => {
          return !task.get('parent')
        })
      );
    });
  },
  pomodorosInRange(pomodoros, startDate, endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return pomodoros.filter((pomodoro) => {
      let date = new Date(pomodoro.get('date'));
      date.setHours(0, 0, 0, 0);
      return (date.getTime() >= startDate.getTime()) && 
        (date.getTime() <= endDate.getTime()); 
    });
  },
  pomodorosHaveDate(pomodoros, date){
    date.setHours(0, 0, 0, 0);
    return pomodoros.filter((pomodoro) => {
      let pomDate = new Date(pomodoro.get('date'));
      pomDate.setHours(0, 0, 0, 0);
      return pomDate.getTime() === date.getTime();
    });
  },
  searchTaskTree(task, term){
    let results = [],
        regexp = new RegExp(term, 'i');
    if(get(task, 'name').match(regexp)){
      results.push(task);
    }
    let children = get(task, 'children');
    if(children.get('length')){
      children.forEach((child) => {
        results = 
          results.concat(...this.searchTaskTree(child, term));
      });
    }
    return results;
  },
  async lastTaskDone(pomodoros){
    let pomodoro = pomodoros.get('lastObject');
    return await pomodoro.get('task');
  },
  // return all pomodoros in the task three
  async allPomodorosInTree(task){
    let pomodoros = await task.get('pomodoros').toArray();
    let children = task.get('children');
    if(children.get('length')){
      for(let child of children.toArray()){
        pomodoros = pomodoros
          .concat(...await this.allPomodorosInTree(child));
      }
    }
    return pomodoros;
  }
}
