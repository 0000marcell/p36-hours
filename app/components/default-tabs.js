import Component from '@ember/component';
import { get, set } from  '@ember/object';

export default Component.extend({
  classNames: ['default-tabs'],
  actions: {
    select(sOption){
      get(this, 'options').forEach((option) => {
        set(option, 'selected', option.value == sOption.value ? 
          true : false);
      });
      this.get('select')(sOption);
    }
  }
});
