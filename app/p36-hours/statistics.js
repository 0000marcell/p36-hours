import filters from './filters';
import { timeFormat } from 'd3-time-format';
import dateHelper from './date-helper';
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
          resultObj[pomDate] + 0.5 : 0.5
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
  
  calendarChartData(pomodoros){
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
  async calendarChartBasedOnTasks(tasks){
    let pomodoros = [];
    for(let task of tasks){
      pomodoros = pomodoros
        .concat(...await this.getAllPomodoros(task));
    }
    return this.calendarChartData(pomodoros); 
  },
  async calendarChartBasedOnTags(tags){
    let allPomodoros = [];
    for(let tag of tags){
      let tasks = await tag.get('tasks'),
          completedTasks = [];
      for(let task of tasks.toArray()){
        if(completedTasks.indexOf(task.get('id')) === -1){
          let pomodoros = await this.getAllPomodoros(task),
              ids = await this.getChildrenIds(task);
          allPomodoros = 
                allPomodoros.concat(...pomodoros.toArray());
          completedTasks = completedTasks.concat(...ids);
        }
      }
    }
    return this.calendarChartData(allPomodoros);
  },
  // get all ids from all children tasks
  async getChildrenIds(task){
    let ids = [];
    ids.push(task.get('id'));
    if(task.get('children.length')){
      for(let child of task.get('children').toArray()){
        ids = 
          ids.concat(...await this.getChildrenIds(child));
      }
    }
    return ids;
  },
  // get all pomodoros of a task and child tasks
  async getAllPomodoros(task){
    let pomodoros = await task.get('pomodoros');
    pomodoros = pomodoros.toArray();
    if(task.get('children.length')){
      for(let child of task.get('children').toArray()){
        pomodoros = 
          pomodoros.concat(...await this.getAllPomodoros(child));
      }
    }
    return pomodoros;
  },
  radarPercentage(results){
    let itemsTotal = results.reduce((acc, item) => {
      return item.value + acc;
    }, 0);

    results = results.map((item) => {
      item.value = Math.trunc(item.value * 100/itemsTotal)/100;
      return item;
    });

    return results;
  },
  async buildRadarData(taskArr){
    let results = [];

    for(let task of taskArr){
      let pomodoros = await this.getAllPomodoros(task);
      results.push({ axis: get(task, 'name'),
            value: pomodoros.length });
    }

    return [this.radarPercentage(results)];
  },
  async radarChartBasedOnTasks(taskArr){
    let results;
    if(get(taskArr, 'length') > 2){
      results = await this.buildRadarData(taskArr);
    }else{
      for(let task of taskArr){
        let children = get(task, 'children');
        if(children.get('length') > 2){
          results = await this.buildRadarData(children.toArray());
          break;
        }
      }
    }
    
    return results;
  },
  async radarChartBasedOnTags(tags){
    let resultObj = [];
    for(let tag of tags){
      let tasks = await tag.get('tasks'),
          allPomodoros = [],
          completedTasks = [];
      for(let task of tasks.toArray()){
        if(completedTasks.indexOf(task.get('id')) === -1){
          let pomodoros = await this.getAllPomodoros(task),
              ids = await this.getChildrenIds(task);
          allPomodoros = 
                allPomodoros.concat(...pomodoros.toArray());
          completedTasks = completedTasks.concat(...ids);
        }
      }

      resultObj.push({
        name: get(tag, 'name'),
        value: allPomodoros.get('length')
      });
    }

    return [this.radarPercentage(resultObj)];
  }
}
