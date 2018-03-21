import Controller from '@ember/controller';
import { set, setProperties, get } from '@ember/object';
import statistics from '../p36-hours/statistics';
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
      set(this, 'isLoading', true);
      let items = get(this, 'selectedItems'),
          mode = get(this, 'selectedMode'),
          calendarChartData,
          radarChartData;
      if(mode === 'tasks'){
        items = items.map((item) => ( item.model ));
        calendarChartData = await statistics
          .calendarChartBasedOnTasks(items);
        radarChartData = await statistics
          .radarChartBasedOnTasks(items);
      }else{
        calendarChartData = 
          await statistics.calendarChartBasedOnTags(items);
        radarChartData = 
          await statistics.radarChartBasedOnTags(items);
      }
      console.log('calendarChartData: ', calendarChartData);
      setProperties(this, {
        isLoading: false,
        radarChartData: radarChartData,
        calendarChartData: calendarChartData,
      });

    }
  }
});
