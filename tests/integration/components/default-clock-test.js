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

test('show the correct time and register  #int-default-clock-test-01', 
  async function(assert) {

  assert.expect(2);

  this.set('register', (clock) => {
    assert.ok(clock, 'registers the clock!');
  });

  this.set('time', {
    pomodoro: '25:00',
    day: '01:00:00',
    week: '01:00:00'
  });

  await this.render(hbs`{{default-clock 
                    time=time
                    registerFunc=register
                  }}`);
  let result = helper
      .removeSpace(document
        .querySelector('.clock-face').textContent);
  assert.equal(result, "01:0001:0025:00");
});

test('start, pause, resume and reset the clock #int-default-clock-test-02', 
  async function(assert){

  assert.expect(4);

  let $startButton = '[data-test-start-button]',
      $resetButton = '[data-test-reset-button]',
      $pauseButton = '[data-test-pause-button]',
      $resumeButton = '[data-test-resume-button]';

  this.set('time', {
    pomodoro: '25:00',
    day: '01:00:00',
    week: '01:00:00'
  });

  // the start function doesn't start the clock right away
  let compClock;
  this.set('startFunc', (clock) => {
    compClock = clock;
    clock.start();
  });

  this.render(hbs`{{default-clock 
                    time=time
                    startFunc=startFunc
                  }}`);

  let $clockFace = document.querySelector('.clock-face');

  await click($startButton);

  return new rsvp.Promise((resolve) => {
    setTimeout(async () => {
      let result = helper
        .removeSpace($clockFace.textContent);
      assert.equal(result, "01:0001:0024:59");

      await click($pauseButton);

      setTimeout(async () => {
        result = helper
          .removeSpace($clockFace.textContent);
        assert.equal(result, "01:0001:0024:59")

        await click($resumeButton);

        setTimeout(async () => {
          result = helper
            .removeSpace($clockFace.textContent);
          assert.equal(result, "01:0001:0024:58");

          await click($resetButton);

          setTimeout(async () => {
            result = helper
              .removeSpace($clockFace.textContent);
            assert.equal(result, "01:0001:0025:00");
            resolve();
          });
        }, 1000);
      }, 1000);
    }, 1000)
  });
});


