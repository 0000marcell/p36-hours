import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  live: DS.attr('boolean'),
  retry: DS.attr('boolean'),
  rev: DS.attr('string')
});
