import filters from './filters';
import { timeFormat } from 'd3-time-format';
import dateHelper from './date-helper';
import { get } from '@ember/object';
import rsvp from 'rsvp';

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
        currMonday = dateHelper.currMonday(new Date()),
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
  },
  buildRadarData(obj){
    let results = [],
        promises = [];
    return new rsvp.Promise((resolve) => {
      obj.forEach((item) => {
        promises.push(
          Promise.resolve(get(item, 'pomodoros'))
            .then((pomodoros) => {
            results.push({ axis: get(item, 'name'),
              value: pomodoros.length });
          })
        );
      });
      rsvp.all(promises).then(() => { 
        let itemsTotal = results.reduce((acc, item) => {
          return item.value + acc;
        }, 0);
        results = results.map((item) => {
          item.value = Math.trunc(item.value * 100/itemsTotal)/100;
          return item;
        });
        resolve([results]) 
      });
    });
  },
  radarChart(obj){
    return new rsvp.Promise((resolve) => {
      let promises = [];
      if(get(obj, 'length') > 2){
          promises.push(
            this.buildRadarData(obj).then((results) => {
              resolve(results);
            })
          );
      }else{
        obj.forEach((item) => {
          if(get(item, 'children.length') > 2){
            promises.push(
              this.buildRadarData(obj).then((results) => {
                resolve(results);
              })
            );
          }
        });
      }
      rsvp.all(promises).then((results) => { resolve(results)});
    });
  },
  async radarChartDataBasedOnTags(tags){
    let resultObj = [],
        completedTasks = [];
    for(let tag of tags){
      let tasks = await tag.get('tasks').toArray(),
          allPomodoros = [];
      for(let task of tasks){
        if(completedTasks.indexOf(task.get('id')) === -1){
          let pomodoros = await task.get('pomodoros');
          allPomodoros = 
                allPomodoros.concat(...pomodoros.toArray());
          completedTasks.push(task.get('id'));
        }
      }
      resultObj.push({
        name: get(tag, 'name'),
        pomodoros: allPomodoros 
      });
    }
    return resultObj;
  }
}
