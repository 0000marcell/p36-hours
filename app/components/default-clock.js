import Component from '@ember/component';
import clock from '../p36-hours/clock';
import { set, setProperties, get } from '@ember/object';
import { inject } from '@ember/service';

/**
 * @component default-clock
 * @param {Object} time
 * @param {Function} startFunc
 * @param {Function} finishFunc
 */
export default Component.extend({
  intervals: 0,
  store: inject('store'),
  classNames: ['default-clock'],
  state: 'stopped',
  clock: null,
  parentController: null,
  init(){
    this._super(...arguments);
    get(this, 'registerFunc')(this);
  },
  start(){
    set(this, '_timeBeforeStart', get(this, 'time'));
    setProperties(this, {
      clock: clock.start(get(this, 'time'), (time) => {
        set(this, 'time', time);
      }, () => {
        get(this, 'finishFunc')(this);
      }),
      state: 'started'
    });
  },
  reset(){
    get(this, 'clock').reset(() => {
      setProperties(this, {
        time: get(this, '_timeBeforeStart'),
        state: 'stopped'
      });
    });
  },
  actions: {
    startClock(){
      get(this, 'startFunc')(this);
    },
    pauseClock(){
      get(this, 'clock').pause((time) => {
        setProperties(this, {
          time: time,
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
