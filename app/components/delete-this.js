import Component from '@ember/component';

export default Component.extend({
  actions: {
    outterAction(){
      console.log('outterAction!'); 
    },
    innerAction(){
      console.log('innerAction!');
    }
  }
});
