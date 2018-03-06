import { moduleForComponent, test } from 'ember-qunit';
//import { run } from '@ember/runloop';
import { click } from 'ember-native-dom-helpers';
//import { click } from "@ember/test-helpers";
import hbs from 'htmlbars-inline-precompile';
import helper from '../../helpers/string';
import rsvp from 'rsvp';

moduleForComponent('default-clock', 'Integration | Component | default clock', {
  integration: true
});

test('show the correct time #int-default-clock-test-01', 
  async function(assert) {

  this.set('time', {
    pomodoro: '25:00',
    day: '01:00:00',
    week: '01:00:00'
  });

  await this.render(hbs`{{default-clock 
                    time=time
                  }}`);
  let result = helper
      .removeSpace(document
        .querySelector('.clock-face').textContent);
  assert.equal(result, "01:0001:0025:00");
});

test('show right button depending on the state clock #int-default-clock-test-02', 
  async function(assert){

  let $startButton = '[data-test-start-button]',
      $pauseButton = '[data-test-pause-button]',
      $resumeButton = '[data-test-resume-button]',
      $resetButton = '[data-test-reset-button]';

  this.set('state', 'stopped'); 

  await this.render(hbs`{{default-clock 
                    state=state
                  }}`);

  assert.ok(document.querySelector($startButton), 
    'show start button');

  this.set('state', 'paused');

  assert.ok(document.querySelector($resumeButton), 
    'show resume button.');

  assert.ok(document.querySelector($resetButton), 
    'show reset button.');

  this.set('state', 'started');

  assert.ok(document.querySelector($pauseButton), 
    'show pause button.');

});
