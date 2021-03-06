import Route from '@ember/routing/route';
import statistics from '../p36-hours/statistics';
import helpers from '../p36-hours/helpers';

export default Route.extend({
  async setupController(controller, model){
    this._super(...arguments);
    let twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 30);
    let lineChartData = statistics.lineChart(model.pomodoros, 
      twoWeeksAgo, new Date());
    controller.set('lineChartData', lineChartData);

    let lastWeekComparison = statistics
            .lastWeekComparison(model.pomodoros),
        wcomparisonText = statistics
          .formatComparison(lastWeekComparison),
        lastWeekText = `${wcomparisonText} than the previous week`;
    
    controller.setProperties({
      lineChartData: lineChartData,
      lastWeekText: lastWeekText,
      lastWeekComparison: lastWeekComparison,
      selectedMode: 'tasks',
      modes: ['tasks', 'tags'],
      modeItems: model.tasks.map((task) => (
        {
          id: task.get('id'),
          name: helpers.grabPathName(task).join(" | "),
          model: task
        }
      ))
    });
    controller.afterSeup();
  }
});
