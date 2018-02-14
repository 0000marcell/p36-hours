import Controller from '@ember/controller';
import { set, get, computed } from '@ember/object';

export default Controller.extend({
  defaultDate: new Date(),
  selectedMode: 'tasks',
  modes: ['tasks', 'tags'],
  selectedItems: [],
  modeItems: ['all', 'task 1', 'task 2'],
  lineChartData2: [
      {date: '24-Apr-07', value: 93.24},
      {date: '25-Apr-07', value: 94.36},
      {date: '26-Apr-07', value: 99.80},
      {date: '27-Apr-07', value: 99.47},
      {date: '30-Apr-07', value: 100.39},
      {date: '31-Apr-07', value: 100.40},
      {date: '10-May-07', value: 106.88},
      {date: '12-May-07', value: 107.35},
      {date: '14-May-07', value: 111.54},
  ],
  performanceText1: '2 hours more compared to last week',
  performanceText2: '6 hours more compared to last month',
  actions: {
    selectMode(option){
      set(this, 'selectedMode', option);
    },
    selectItems(selection){
      set(this, 'selectedItems', selection);
    }
  }
});
