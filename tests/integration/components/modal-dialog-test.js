import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { setProperties, set } from '@ember/object';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('modal-dialog', 'Integration | Component | modal dialog', {
  integration: true
});

test('show and close #int-modal-dialog-test-01', 
  async function(assert) {
  
  assert.expect(2);
  
  let $closeButton = '[data-test-close-button]';

  set(this, 'showDialog', true); 
  set(this, 'close', (val) => {
    assert.ok(!val, 'closes the dialog!');
  });

  this.render(hbs`{{modal-dialog close=close
    showDialog=showDialog}}`);
  
  assert.ok(document.querySelector($closeButton), 'show dialog!');
  await click($closeButton);
});

test('show dialog info only #int-modal-dialog-test-02', 
  async function(assert) {
  
  setProperties(this, {
    infoMode: true,
    showDialog: true,
    trueOptionText: 'Ok'
  })

  let $okButton = '[data-test-ok-button]';

  this.render(hbs`{{modal-dialog 
                      trueOptionText=trueOptionText
                      infoMode=infoMode
                      showDialog=showDialog}}`);
  
  assert.ok(document.querySelector($okButton), 
    'show dialog only!');

  assert.equal(document.querySelector($okButton).textContent.trim(), 
    'Ok', 'show right text!');
});
