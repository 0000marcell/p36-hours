import { get } from '@ember/object';

export default {
  currMonday(d){
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); 
    return new Date(d.setDate(diff));
  },
  grabPathName(item){
    let path = [];
    if(get(item, 'parent.id'))
      path = this.grabPathName(get(item, 'parent'), path);
    path.push(get(item, 'name'));
    return path;
  }
}
