import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  tags: DS.hasMany('tag', {inverse: 'tasks', save: true}),
  parent: DS.belongsTo('task', {inverse: 'children', async: false}),
  children: DS.hasMany('task', {inverse: 'parent', async: false}),
  pomodoros: DS.hasMany('pomodoro', 
    { inverse: 'task'}),
  status: DS.attr('string'),
  rev: DS.attr('string')
});
