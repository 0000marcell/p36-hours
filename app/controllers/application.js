import Controller from '@ember/controller';
import { get, set, setProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import mock from 'p36-hours/p36-hours/mock';
import { inject } from '@ember/service';
import tourSteps from 'p36-hours/p36-hours/tour-steps';

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
    encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default Controller.extend({
  store: inject('store'),
  clock: inject('clock-service'),
  tour: inject('tour'),
  time: alias('clock.time'),
  modalService: inject('modal-dialog'),
  init(){
    this._super(...arguments);
    let modalService = get(this, 'modalService');
    let modal = {
      showDialog: false,
      hideButtons: false,
      dialogFunc: function() {
        console.error('no dialog func as set yet!');    
      },
      trueDialogText: 'load',
      falseDialogText: 'cancel',
      infoMode: false
    }
    set(this, 'modal', modal);
    modalService.set('modal', modal);

    this.get('tour').setProperties({
      steps: tourSteps,
      autoStart: false,
      modal: true,   
      defaults: {
        classes: 'shepherd shepherd-step shepherd-element shepherd-open shepherd-theme-arrows'
      }
    });
  },
  actions: {
    didSelectFiles(files){
      let modal = this.get('modal');
      if(files[0]){
        set(this, 'selectedFile', files[0]);
        setProperties(modal, {
          showDialog: true,
          dialogMsg: "Do you really wish to load this data, all your previous data will be deleted, the app will automatically refresh after the data is loaded",
          dialogFunc: (load) => {
            if(load){
              set(this, 'dialogMsg', 'loading...');
              let file = get(this, 'selectedFile'),
                  read = new FileReader(),
                  store = get(this, 'store');
              read.readAsBinaryString(file);
              read.onloadend = async () => {
                let json = JSON.parse(read.result);
                await mock.deleteAll(store);
                await mock.constructDbFromObj(store, json);
                window.location.reload();
              }
            }
            set(this, 'modal.showDialog', false);
          }
        });
      }
    },
    async downloadData(){
      let modal = get(this, 'modal');
      setProperties(modal, {
        showDialog: true,
        hideButtons: true,
        dialogMsg: 'creating backup file...'
      });
      let json = await mock.backupData(get(this, 'store')),
          today = new Date(),
          date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

      download(`p36-${date}.json`, JSON.stringify(json));

      setProperties(modal, {
        showDialog: false,
        hideButtons: false 
      });
    },
    showHelp(){
      this.get('tour').show('upload');
    }
  }
});
