import filters from './filters';
import { timeFormat } from 'd3-time-format';
import helpers from './helpers';
import { get } from '@ember/object';

export default {
  lineChart(pomodoros, startDate, endDate){
    let formatTime = timeFormat("%d-%b-%y"),
        results = filters.pomodorosInRange(pomodoros, 
          startDate, endDate),
        resultObj = {};
    results.forEach((pomodoro) => {
      let pomDate = new Date(get(pomodoro, 'date'));
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
  formatComparison(result){
    let text,
        hours = Math.round(Math.abs(result) / 2);
    if(result >= 1){
      text = `${hours} ${(hours > 1) ? 'hours' : 'hour'} more`; 
    }else if(result === 0){
      text = `about the same time`;
    }else{
      text = 
        `${hours} ${(hours > 1) ? 'hours' : 'hour'} less`; 
    }
    return text;
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
        lastMPomodoros = filters.pomodorosInRange(pomodoros, 
                                  firstDayLastMonth, 
                                  thisDayLastMonth);
    return currPomodoros.length - lastMPomodoros.length;
  },
  calendarChart(pomodoros){
    let formatTime = timeFormat("%Y-%m-%d"),
        resultObj = {};
    pomodoros.forEach((pomodoro) => {
      let pomDate = new Date(get(pomodoro, 'date'));
      pomDate.setHours(0, 0, 0, 0);
      pomDate = formatTime(pomDate);
      resultObj[pomDate] = 
        resultObj[pomDate] ? 
          resultObj[pomDate] + 1 : 1
    });
    return resultObj;
  }
}
