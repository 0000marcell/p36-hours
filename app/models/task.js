import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  tags: DS.hasMany('tag', {inverse: 'tasks'}),
  parent: DS.belongsTo('task', {inverse: 'children'}),
  children: DS.hasMany('task', {inverse: 'parent'}),
  status: DS.attr('string'),
  rev: DS.attr('string')
});
