import EmberObject from '@ember/object';
import SaveOnExitMixin from 'p36-hours/mixins/save-on-exit';
import { module, test } from 'qunit';

module('Unit | Mixin | save on exit');

// Replace this with your real tests.
test('it works', function(assert) {
  let SaveOnExitObject = EmberObject.extend(SaveOnExitMixin);
  let subject = SaveOnExitObject.create();
  assert.ok(subject);
});
