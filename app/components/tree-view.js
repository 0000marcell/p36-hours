import Component from '@ember/component';
import { set, get } from '@ember/object'; 
import { all } from 'rsvp';

export default Component.extend({
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
  didReceiveAttrs(){
    this._super(...arguments);
    /*
    let data = get(this, 'data'),
        proms = [];
    data.forEach((item) => {
      this.loadChildren(item, proms); 
    });
    all(proms).then(() => {
      set(this, 'data2', get(this, 'data'));
    });
    */
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
