import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('format-time', 'helper:format-time', {
  integration: true
});

// Replace this with your real tests.
test('removes seconds from time #help-format-time-test-01', 
  function(assert) {
  this.set('inputValue', '01:00:00');

  this.render(hbs`{{format-time inputValue}}`);

  assert.equal(this.$().text().trim(), '01:00');
});
