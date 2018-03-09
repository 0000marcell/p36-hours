import Component from '@ember/component';
import { get } from '@ember/object';
import { run } from '@ember/runloop';

/*
 * @component search-input
 * @param {Func} search
 */
export default Component.extend({
  keyUp(){
    run.debounce(this, this.search(get(this, 'searchTerm')), 500);
  }
});
