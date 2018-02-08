import Component from '@ember/component';
import { set, get, computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['tree-view-item'],
  classNameBindings: ['selected'],
  selected: computed.alias('data.selected'),
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
