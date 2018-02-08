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
  }
}
