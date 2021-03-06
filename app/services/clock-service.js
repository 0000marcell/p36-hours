import Service from '@ember/service';
import { inject } from '@ember/service';
import { get, set, setProperties } from '@ember/object';
import clock from '../p36-hours/clock';

/**
 * @service clock-service 
 * @param {Object} time
 * @param {Function} clockHalfFunc
 * @param {Function} finishFunc
 */

const POMODORO = '25:00',
      HALFWAY = '13:00';

export default Service.extend({
  state: 'stopped',
  clock: null,
  store: inject('store'),
  mode: 'task',
  async init(){
    this._super(...arguments);
    let store = get(this, 'store'),
        dayHCount = await clock.getDayHCount(store),
        weekHCount = await clock.getWeekHCount(store);
    let timeObj = {
      day: dayHCount,
      week: weekHCount,
      pomodoro: POMODORO
    };
    set(this, 'time', timeObj);
  },
  start(){
    set(this, '_timeBeforeStart', get(this, 'time'));
    setProperties(this, {
      clock: clock.start(get(this, 'time'), (time) => {
        if(time.pomodoro === HALFWAY)
          get(this, 'clockHalfFunc')(this);

        set(this, 'time', time);
      }, () => {
        get(this, 'finishFunc')(this);
      }),
      state: 'started'
    });
  },
  pause(){
    get(this, 'clock').pause((time) => {
      setProperties(this, {
        time: time,
        state: 'paused'
      });
    })
  },
  reset(){
    get(this, 'clock').reset(() => {
      setProperties(this, {
        time: get(this, '_timeBeforeStart'),
        state: 'stopped'
      });
    });
  },
  resume(){
    get(this, 'clock').resume();
    set(this, 'state', 'started');
  }
});
