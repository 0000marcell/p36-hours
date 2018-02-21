import Controller from '@ember/controller';
import { set, get } from '@ember/object';
import statistics from '../p36-hours/statistics';
import { all } from 'rsvp';
import helpers from '../p36-hours/helpers';

export default Controller.extend({
  actions: {
    async selectMode(option){
      set(this, 'selectedMode', option);
      set(this, 'selectedItems', []);
      if(option === 'tasks'){
        let tasks = await get(this, 'model.tasks'),
            modeItems = tasks.map((task) => (
              {
                id: task.get('id'),
                name: helpers.grabPathName(task).join(" | "),
                model: task
              }
            ));
        set(this, 'modeItems', modeItems);
      }else if(option === 'tags'){
        set(this, 'modeItems', await get(this, 'model.tags'));
      }
    },
    selectItems(selection){
      set(this, 'selectedItems', selection);
    },
    async buildData(){
      let items = get(this, 'selectedItems'),
          mode = get(this, 'selectedMode');
      if(mode === 'tasks'){
        let requests = [],
            allPomodoros = [],
            allTasks = [];
        items.forEach((item) => {
          allTasks.push(item.model);
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
          statistics.radarChart(allTasks).then((radarChartData) => {
            set(this, 'radarChartData',
              radarChartData);
          });
        });
      }else{
        let tags = get(this, 'selectedItems');
        
        statistics.radarChartDataBasedOnTags(tags)
          .then((data) => {
            statistics.radarChart(data).then((radarChartData) => {
              set(this, 'radarChartData', radarChartData);
            });
          });

        let allPomodoros = [];
        for(let tag of tags){
          let tasks = await tag.get('tasks').toArray();
          for(let task of tasks){
            let pomodoros = await task.get('pomodoros');
            allPomodoros = 
              allPomodoros.concat(...pomodoros.toArray());
          }
        }
        set(this, 'calendarChartData', 
          statistics.calendarChart(allPomodoros));
      }
    }
  }
});
