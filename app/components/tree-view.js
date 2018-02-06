import Component from '@ember/component';
import { set, get } from '@ember/object'; 

export default Component.extend({
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
