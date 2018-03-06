import Component from '@ember/component';
import { set, get } from '@ember/object';

/**
 * @component default-clock
 * @param {Object} time
 * @param {String} state
 * @param {Function} startFunc
 * @param {Function} pauseFunc
 * @param {Function} resetFunc
 * @param {Function} resumeFunc
 */
export default Component.extend({
  intervals: 0,
  classNames: ['default-clock'],
  init(){
    this._super(...arguments);
    if(!get(this, 'time')){
      set(this, 'time', { 
        day: '00:00',
        week: '00:00',
        pomodoro: '00:00'
      });
    }
  },
  actions: {
    startClock(){
      get(this, 'startFunc')(this);
    },
    pauseClock(){
      get(this, 'pauseFunc')(this);
    },
    resetClock(){
      get(this, 'resetFunc')(this);
    },
    resumeClock(){
      get(this, 'resumeFunc')(this);
    }
  }
});
