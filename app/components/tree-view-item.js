import Component from '@ember/component';
import { set, get, computed } from '@ember/object';
import filters from 'p36-hours/p36-hours/filters';

/**
 * @component tree-view-item 
 * @param {Boolean} showAll
 * @param {Object} data 
 * @param {Function} select
 * @param {Function} add 
 */
export default Component.extend({
  tagName: 'li',
  classNames: ['tree-view-item'],
  classNameBindings: ['selected', 'status'],
  async didInsertElement(){
    this._super(...arguments);
    let task = get(this, 'data'),
        pomodoros = await filters.allPomodorosInTree(task),
        hours = Math.floor(pomodoros.get('length') / 2);
    set(this, 'totalTime', `${hours}h`);
  },
  selected: computed.alias('data.selected'),
  status: computed(function() {
    let status = get(this, 'data.status');
    return (status === 'archived') ? true :
                                     false;
  }),
  showChildren: true,
  expandClass: 'icon icon-down-open-big',
  actions: {
    select(item){
      get(this, 'select')(item);
    },
    add(item){
      get(this, 'add')(item);
    },
    edit(item){
      get(this, 'edit')(item);
    },
    expand(){
      set(this, 'showChildren', !get(this, 'showChildren'));
    }
  }
});
