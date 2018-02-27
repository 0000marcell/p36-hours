import Component from '@ember/component';
import clock from '../p36-hours/clock';
import { set, setProperties, get } from '@ember/object';
import { inject } from '@ember/service';

/**
 * @component default-clock
 * @param {Function} finished 
 * @param {String} time 
 * @param {Function} register 
 */
export default Component.extend({
  store: inject('store'),
  classNames: ['default-clock'],
  state: 'stopped',
  clock: null,
  parentController: null,
  async didReceiveAttrs(){
    this._super(...arguments);
    let weekTime = clock.verifyWeekTime(this.get('store')),
        dayTIme = clock.verifyDayTime(this.get('store'));
    
    set(this, '_internalTime', get(this, 'time'));
    get(this, 'register')(this);
  },
  start(startTime){
    setProperties(this, {
      _internalTime: startTime,
      clock: clock.start(startTime, (time) => {
        set(this, '_internalTime', time);
      }, () => {
        get(this, 'finished')();
      }),
      state: 'started'
    });
  },
  reset(){
    get(this, 'clock').reset(() => {
      setProperties(this, {
        _internalTime: get(this, 'time'),
        state: 'stopped'
      });
    });
  },
  actions: {
    startClock(){
      get(this, 'parentController').requestStart();
    },
    pauseClock(){
      get(this, 'clock').pause((time) => {
        setProperties(this, {
          _internalTime: time,
          state: 'paused'
        });
      })
    },
    resetClock(){
      this.reset();
    },
    resumeClock(){
      get(this, 'clock').resume();
      set(this, 'state', 'started');
    }
  }
});
