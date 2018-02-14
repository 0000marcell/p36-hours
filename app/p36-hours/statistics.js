import filters from './filters';
import { timeFormat } from 'd3-time-format';
import helpers from './helpers';

export default {
  lineChart(pomodoros, startDate, endDate){
    let formatTime = timeFormat("%d-%b-%y"),
        results = filters.pomodorosInRange(pomodoros, 
          startDate, endDate),
        resultObj = {};
    results.forEach((pomodoro) => {
      let pomDate = new Date(pomodoro.get('date'));
      pomDate.setHours(0, 0, 0, 0).toString();
      resultObj[pomDate] = 
        resultObj[pomDate] ? 
          resultObj[pomDate] + 1 : 1
    });
    let sortedKeys = Object.keys(resultObj).map((key) => {
      return new Date(key).getTime();
    }).sort()
    return sortedKeys.reduce((acc, key) => {
      let date = new Date(key);
      acc.push({date: formatTime(date), 
        value: resultObj[date.toString()]});
      return acc;
    }, []);
  },
  lastWeekComparison(pomodoros){
    let today = new Date(),
        currMonday = helpers.currMonday(new Date()),
        lastMonday = new Date(),
        thisDayLastWeek = new Date();
    lastMonday.setDate(currMonday.getDate() - 7);
    thisDayLastWeek.setDate(today.getDate() - 7);
    let currPomodoros = filters.pomodorosInRange(pomodoros, 
                                  currMonday, today),
        lastWPomodoros = filters.pomodorosInRange(pomodoros, 
                                  lastMonday, thisDayLastWeek);
    return currPomodoros.length - lastWPomodoros.length;
  },
  lastMonthComparison(pomodoros){
    let today = new Date(),
        firstDayMonth = new Date(today.getFullYear(), 
          today.getMonth(), 1),
        firstDayLastMonth = new Date(today.getFullYear(), 
          today.getMonth() - 1, 1),
        thisDayLastMonth = new Date(today.getFullYear(), 
          today.getMonth() - 1, today.getDate());
    let currPomodoros = filters.pomodorosInRange(pomodoros, 
                                  firstDayMonth, today),
        lastWPomodoros = filters.pomodorosInRange(pomodoros, 
                                  firstDayLastMonth, 
                                  thisDayLastMonth);
    return currPomodoros.length - lastWPomodoros.length;
  }
}
