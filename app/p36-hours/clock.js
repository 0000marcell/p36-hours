import { run } from '@ember/runloop';
import helpers from 'p36-hours/p36-hours/helpers';
import { set, get } from '@ember/object';

const HOUR = 3600,
      MIN = 60;

export default {
  start(time, cb, finished){
    this.cb = cb;
    this.time = time; 
    this.interval = setInterval(this.clockTick.bind(this), 1000);
    this.finished = finished;
    return this;
  },
  reset(cb){
    clearInterval(this.interval);
    this.time = null;
    cb();
  },
  pause(cb){
    clearInterval(this.interval);
    cb(this.time);
  },
  resume(){
    this.interval = setInterval(this.clockTick.bind(this), 1000);
  },
  clockTick(){
    let pom = this.convertToSec(this.time.pomodoro, 'min') - 1,
        day = this.convertToSec(this.time.day, 'hour') + 1,
        week = this.convertToSec(this.time.week, 'hour') + 1;
    if(pom < 0){
      clearInterval(this.interval);
      this.finished()
    }else{
      this.time = {
        pomodoro: this.convertToMin(pom),
        day: this.convertToHour(day),
        week: this.convertToHour(week)
      }
      this.cb(this.time);
    }
  },
  convertToSec(time, format){
    let splitTime = time.split(':');
    splitTime = splitTime.map((val) => ( parseInt(val)));
    if(format === 'min'){
      return splitTime[0] * MIN + splitTime[1];
    }else if(format === 'hour'){
      return splitTime[0] * HOUR + splitTime[1] * MIN + splitTime[2];
    }
    
  },
  convertToMin(time){
    let min = Math.floor(time/ MIN),
        sec = time % MIN,
        paddingZero = '';
    if(sec < 10)
      paddingZero = '0';
    return `${min}:${paddingZero}${sec}`;
  },
  convertToHour(time){
    let splitStr = this.convertToMin(time).split(':'),
        min = +splitStr[0],
        sec = +splitStr[1],
        hours = 0;

    if(min > 59){
      hours = Math.floor(min/ MIN),
          min = min % MIN;
    }
    if(hours < 10)
      hours = `0${hours}`;
    if(min < 10)
      min = `0${min}`;
    if(sec < 10)
      sec = `0${sec}`;
    return `${hours}:${min}:${sec}`;
  },
  async getDayHCount(store){
    let dayCount;
    let times = await store.findAll('time');
    dayCount = times.findBy('name', 'day');
  
    if(!dayCount){
      await run(async () => {
        dayCount = await store.createRecord('time', {
          name: 'day',
          date: new Date(),
          time: 0
        }).save();
      });
    }

    let dayCountDate = new Date(get(dayCount, 'date')),
        today = new Date();
    if(!helpers.compareDates(dayCountDate, today)){
      await run(async () => {
        set(dayCount, 'date', new Date());
        set(dayCount, 'time', 0);
        await dayCount.save();
      });
    }
    return this.convertToHour(get(dayCount, 'time'));
  },
  async getWeekHCount(store){
    let weekCount;
    let times = await store.findAll('time');

    weekCount = times.findBy('name', 'week');

    if(!weekCount){
      await run(async () => {
        weekCount = await store.createRecord('time', {
          name: 'week',
          date: new Date(),
          time: 0
        }).save();
      });
    } 
      
    let weekCountDate = new Date(weekCount.get('date')),
        today = new Date(),
        weekCountSunday = helpers.currSunday(weekCountDate),
        thisWeekSunday = helpers.currSunday(today);

    if(!helpers.compareDates(weekCountSunday, thisWeekSunday)){
      await run(async () => {
        set(weekCount, 'date', new Date());
        set(weekCount, 'time', 0);
        await weekCount.save();
      });
    }

    return this.convertToHour(get(weekCount, 'time'));
  }
}
