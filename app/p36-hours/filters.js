import rsvp from 'rsvp';

export default {
  rootTasks(tasks, status){
    return new rsvp.Promise((resolve) => {
      resolve(
        tasks.filter((task) => {
          return (!task.get('parent') && 
            task.get('status') === status)
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
  }
}
