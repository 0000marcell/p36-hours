import Route from '@ember/routing/route';
import statistics from '../p36-hours/statistics';

export default Route.extend({
  setupController(controller, model){
    this._super(...arguments);
    let twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 30);
    let lineChartData = statistics.lineChart(model.pomodoros, 
      twoWeeksAgo, new Date());
    controller.set('lineChartData', lineChartData);
  }
});
