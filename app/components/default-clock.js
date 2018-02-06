import Component from '@ember/component';
import clock from '../p36-hours/clock';
import { set, setProperties, get } from '@ember/object';

export default Component.extend({
  classNames: ['default-clock'],
  defaultTime: '25:00',
  time: '25:00',
  clockState: 'stopped',
  clock: null,
  actions: {
    startClock(){
      setProperties(this, {
        'clock': clock.start(get(this, 'defaultTime'), (time) => {
          set(this, 'time', time);
        }),
        'clockState': 'started'
      });
    },
    pauseClock(){
      get(this, 'clock').pause((time) => {
        setProperties(this, {
          'time': time,
          'clockState': 'paused'
        });
      })
    },
    resetClock(){
      get(this, 'clock').reset(() => {
        setProperties(this, {
          'time': get(this, 'defaultTime'),
          'clockState': 'stopped'
        });
      });
    },
    resumeClock(){
      get(this, 'clock').resume();
      set(this, 'clockState', 'started');
    }
  }
});
