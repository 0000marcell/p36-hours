import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject('store'),
  classNames: ['task-form'],
  selectedTags: computed(async function(){
    return await get(this, 'model.tags');
  }),
  tags: computed(async function(){
    return await get(this, 'store').findAll('tag');
  }),
  actions: {
    selectTag(selection){
      set(this, 'selectedTags', selection);
    },
    async handleKeydown(dropdown, e) {
      let text = e.target.value;
      if (e.keyCode !== 13 || text.length < 1) { return; }

      let tags = await get(this, 'tags'),
          selectedTags = await get(this, 'selectedTags');
      
      let foundTag = tags.find((tag) => (
        get(tag, 'name') === text)
      ),
      isSelected = selectedTags.find((tag) => (
        get(tag, 'name') === text)
      );
      if(!foundTag && !isSelected){
        let newTag = await get(this, 'store').createRecord('tag', {
          name: text
        }).save();
        selectedTags.pushObject(newTag);
      }
    },
    async submit(){
      let selectedTags = await get(this, 'selectedTags'),
          model = get(this, 'model');
      if(selectedTags.length){
        for(let tag of selectedTags){
          //tag.get('tasks').pushObject(model);
          //tag = await tag.save()
          model.get('tags').pushObject(tag);
        }
      }
      get(this, 'submit')(model);
    }
  }
});
