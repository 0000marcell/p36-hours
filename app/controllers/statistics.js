import Controller from '@ember/controller';
import { set, setProperties, get } from '@ember/object';
import statistics from '../p36-hours/statistics';
import filters from '../p36-hours/filters';
import helpers from '../p36-hours/helpers';

export default Controller.extend({
  async afterSeup(){

    if(get(this, 'selectedItems.length'))
      return;

    let pomodoros = this.get('model.pomodoros'),
        task = await filters.lastTaskDone(pomodoros);

    if(task.get('parent'))
      task = task.get('parent');

    setProperties(this, {
      selectedItems: [{
        id: task.get('id'),
        name: task.get('name'),
        model: task
      }],
      selectedMode: 'tasks'
    });
    this._buildData();
  },
  async _buildData(){
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
      setProperties(this, {
        isLoading: false,
        radarChartData: radarChartData,
        calendarChartData: calendarChartData,
      });
  },
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
      this._buildData(); 
    }
  }
});
