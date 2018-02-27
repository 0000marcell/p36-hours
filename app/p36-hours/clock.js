import helpers from 'p36-hours/p36-hours/helpers';
import { set, get } from '@ember/object';

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
    let sec = this.convertToSec(this.time),
        result  = sec - 1;
    if(result < 0){
      clearInterval(this.interval);
      this.finished()
    }else{
      this.time = this.convertToMin(result);
      this.cb(this.time);
    }
  },
  convertToSec(time){
    let splitTime = time.split(':');
    splitTime = splitTime.map((val) => ( parseInt(val)));
    return splitTime[0] * 60 + splitTime[1];
  },
  convertToMin(time){
    let min = Math.floor(time/ 60),
        sec = time % 60,
        paddingZero = '';
    if(sec < 10)
      paddingZero = '0';
    return `${min}:${paddingZero}${sec}`;
  },
  convertToHour(time){
    let min = +this.convertToMin(time).split(':')[0],
        hours = 0;
    if(min > 59){
      hours = Math.floor(min/ 60),
          min = min % 60;
    }
    if(hours < 10)
        hours = `0${hours}`;
    if(min < 10)
        min = `0${min}`;
    return `${hours}:${min}`;
  },
  async getDayHCount(store){
    let times = await store.findAll('time'),
        dayCount = times.find((time) => {
          return get(time, 'name') === 'day';
        }); 
    console.log('dayCount: ', dayCount);
    if(!dayCount){
      dayCount = await store.createRecord('time', {
        name: 'day',
        date: new Date(),
        time: 0
      }).save();
    }

    let dayCountDate = new Date(get(dayCount, 'date')),
        today = new Date();
    today.setHours(0, 0, 0, 0);
    dayCountDate.setHours(0, 0, 0, 0);
    if(dayCountDate.getTime() !== today.getTime()){
      set(dayCount, 'date', new Date());
      set(dayCount, 'time', 0);
      await dayCount.save()
    }
    return this.convertToHour(get(dayCount, 'time'));
  },
  async getWeekHCount(store){
    let times = await store.findAll('time'),
        weekCount = times.findBy('name', 'week'),
        weekCountDate = new Date(weekCount.get('date')),
        today = new Date(),
        weekCountSunday = helpers.currSunday(weekCountDate),
        thisWeekSunday = helpers.currSunday(today);
    weekCountSunday.setHours(0, 0, 0, 0);
    thisWeekSunday.setHours(0, 0, 0, 0);
    if(weekCountSunday.getTime() !== thisWeekSunday.getTime()){
      weekCount.set('date', new Date());
      weekCount.set('time', 0);
      await weekCount.save();
    }
    return this.convertToHour(weekCount.get('time'));
  }
}
