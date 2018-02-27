import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  time: DS.attr('string'),
  date: DS.attr('date'),
  rev: DS.attr('string')
});
