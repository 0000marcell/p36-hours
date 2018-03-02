import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

let db = new PouchDB('p36-hours3', { adapter: 'idb'});

//db.destroy();

export default Adapter.extend({
  db: db
});
