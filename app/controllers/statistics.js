import Controller from '@ember/controller';
import { set, get } from '@ember/object';
import statistics from '../p36-hours/statistics';
import { all } from 'rsvp';

export default Controller.extend({
  actions: {
    selectMode(option){
      set(this, 'selectedMode', option);
    },
    selectItems(selection){
      set(this, 'selectedItems', selection);
    },
    buildData(){
      let items = get(this, 'selectedItems'),
          mode = get(this, 'selectedMode');
      if(mode === 'tasks'){
        let requests = [],
            allPomodoros = [];
        items.forEach((item) => {
          requests.push(
            item.model.get('pomodoros').then((pomodoros) => {
              allPomodoros = 
                allPomodoros.concat(...pomodoros.toArray());
            })
          );
        });
        all(requests).then(() => {
          set(this, 'calendarChartData', 
            statistics.calendarChart(allPomodoros));
        });
      }
    }
  }
});
