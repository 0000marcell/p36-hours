import Component from '@ember/component';
import { set, get, computed } from '@ember/object';

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
