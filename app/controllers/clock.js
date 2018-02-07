import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  stateHelper: inject('state-helper'),
  tabOptions: [{value: 'active', text: 'active', selected: true}, 
            {value: 'archived', text: 'archived', selected: false}
  ],
  grabName(item, path){
    if(item.get('parent.id'))
      this.grabName(item.get('parent'), path);
    path.push(item.get('name'));
  },
  actions: {
    select(item){
      let path = [];
      this.grabName(item, path);
      set(this, 'taskPath', path);
    },
    taskStatus(option){
      set(this, 'tasks', 
        get(this, 'model').filter((task) => {
          return task.get('status') === option.value;
        })
      );
    },
    add(item){
      get(this, 'stateHelper').set('parentTask', item);
      this.transitionToRoute('tasks.new');
    }
  }
});
