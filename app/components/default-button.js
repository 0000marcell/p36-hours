import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({
  tagName: "button",
  classNames: ["default-button"],
  click(){
    get(this, 'onClick')();
  }
});
