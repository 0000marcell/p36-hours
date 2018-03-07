import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

let db = new PouchDB('p36-hours2');

//db.destroy();

//window.localStorage.clear();

export default Adapter.extend({
  db: db
});
