import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import mock from 'p36-hours/p36-hours/mock';
import { inject } from '@ember/service';

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
  actions: {
    didSelectFiles(files){
      if(files[0]){
        set(this, 'selectedFile', files[0]);
        set(this, 'showDialog', true);
        set(this, 'dialogMsg', 
          `Do you really wish to load this data, 
           all your previous data will be deleted. 
           the app will automatically refresh after the 
           data is loaded`)
      }
    },
    confirmLoad(load){
      if(load){
        set(this, 'loadingData', true);
        let file = get(this, 'selectedFile'),
            read = new FileReader(),
            store = get(this, 'store');
        read.readAsBinaryString(file);
        read.onloadend = async () => {
          let json = JSON.parse(read.result);
          await mock.deleteAll(store);
          await mock.constructDbFromObj(store, json);
          //window.location.reload();
        }
      }
    },
    async downloadData(){
      set(this, 'showDialog', true);
      set(this, 'loadingData', true);
      let json = await mock.backupData(get(this, 'store'));
      download('backup.json', JSON.stringify(json));
      set(this, 'showDialog', false);
      set(this, 'loadingData', false);
    }
  }
});
