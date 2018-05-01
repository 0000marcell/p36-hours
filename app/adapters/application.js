import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

PouchDB.debug.enable('pouchdb:http');

let db = new PouchDB('p36-hours-test');

/*
let remote = new 
  PouchDB('https://p36-pouchdb-server.herokuapp.com/p36-hours');
db.sync(remote, {
  live: false,   
  retry: false
});
*/

export default Adapter.extend({
  db: db
});
