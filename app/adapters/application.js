import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';


let remote = new PouchDB('https://fierce-brook-21102.herokuapp.com/db');

let db = new PouchDB('p36-hours-test');

db.sync(remote, {
   live: true,   // do a live, ongoing sync
   retry: true   // retry if the connection is lost
});

//db.destroy();

//window.localStorage.clear();

export default Adapter.extend({
  db: db
});
