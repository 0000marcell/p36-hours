import Component from '@ember/component';
import { get, set, computed, setProperties } from '@ember/object';
import { inject } from '@ember/service';

export default Component.extend({
  store: inject('store'),
  classNames: ['task-form'],
  selectedStatus: computed(function() {
    return get(this, 'model.status');
  }),
  status: ['active', 'archived'],
  modalService: inject('modal-dialog'),
  selectedTags: computed(async function(){
    return await get(this, 'model.tags').toArray();
  }),
  tags: computed(async function(){
    return await get(this, 'store').findAll('tag');
  }),
  actions: {
    selectTag(selection){
      set(this, 'selectedTags', selection);
    },
    selectStatus(selection){
      set(this, 'selectedStatus', selection);
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
          status = get(this, 'selectedStatus'),
          model = get(this, 'model');
      model.set('status', status);
      if(selectedTags.length){
        for(let tag of selectedTags){
          model.get('tags').pushObject(tag);
        }
      }
      get(this, 'submit')(model);
    },
    stopPropagation(e){
      e.stopPropagation();
    },
    removeTag(tag){
      let modal = get(this, 'modalService.modal'),
          msg = `Do you really wish to delete ${tag.get('name')}`;
      set(this, 'modal', modal);
      setProperties(modal, {
        showDialog: true,
        dialogMsg: msg,
        trueDialogText: 'yes',
        falseDialogText: 'no',
        dialogFunc: (del) => {
          if(del)
            tag.destroyRecord();
          set(this, 'modal.showDialog', false);
        }
      });
    }
  }
});
