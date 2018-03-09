import Component from '@ember/component';
import { set, get } from '@ember/object'; 

/**
 * @component tree-view
 * @param {Boolean} showAll
 * @param {Object} data 
 * @param {Function} select
 * @param {Function} add 
 */
export default Component.extend({
  classNames: ['tree-view'],
  loadChildren(item, proms){
    proms.push(
      item.get('children').then((children) => {
        children.forEach((child) => {
          this.loadChildren(child, proms);
        });
      })
    );
    return proms;
  },
  actions: {
    select(item){
      let prev = get(this, 'selected');
      if(prev)
        prev.set('selected', false)
      set(this, 'selected', item);
      item.set('selected', true);
      this.get('select')(item);
    }
  }
});
