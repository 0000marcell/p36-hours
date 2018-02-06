export default {
  start(time, cb){
    this.cb = cb;
    this.time = time; 
    this.interval = setInterval(this.clockTick.bind(this), 1000);
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
    this.time = this.convertToMin(result);
    this.cb(this.time);
  },
  convertToSec(time){
    let splitTime = time.split(':');
    splitTime = splitTime.map((val) => ( parseInt(val)));
    return splitTime[0] * 60 + splitTime[1];
  },
  convertToMin(time){
    let min = Math.floor(time/ 60),
        sec = time % 60;
    return `${min}:${sec}`;
  }
}
