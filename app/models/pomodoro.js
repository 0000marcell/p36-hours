import DS from 'ember-data';

export default DS.Model.extend({
  date: DS.attr('date'),
  task: DS.belongsTo('task', { inverse: 'pomodoros'}),
  rev: DS.attr('string')
});
