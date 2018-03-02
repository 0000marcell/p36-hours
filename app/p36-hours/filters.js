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
    return pomodoros.filter((pomodoro) => {
      let date = new Date(pomodoro.get('date'));
      return (date >= startDate) && (date <= endDate); 
    });
  },
  pomodorosHaveDate(pomodoros, date){
    return pomodoros.filter((pomodoro) => {
      let pomDate = new Date(pomodoro.get('date'));
      return pomDate.getTime() === date.getTime();
    });
  }
}
