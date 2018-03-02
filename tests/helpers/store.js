import { run } from '@ember/runloop';
import rsvp from 'rsvp';

export default {
  setStore(store){
    this.store = store;
  },
  async createModel(model, obj){
    let record;
    await run(async () => {
      record = await this.store.createRecord(model, obj);
    }); 
    return record;
  },
  async _deleteModel(model){
    await run(async () => {
      await model.destroyRecord();
    });
  },
  deleteModel(model){
    return new rsvp.Promise((resolve) => {
      setTimeout(async () => {
        await this._deleteModel(model);
        resolve();
      }, 100);
    });
  },
  async checkStore(models){
    let resultObj = {},
        result;
    for(let model of models){
      result = await this.store.findAll(model);
      resultObj[model] = result.toArray();
    }
    return resultObj;
  }
}
