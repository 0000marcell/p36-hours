import { get } from '@ember/object';

export default {
  currMonday(d){
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); 
    return new Date(d.setDate(diff));
  },
  currSunday(d){
    d = new Date(d);
    let day = d.getDay(),
        diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  },
  grabPathName(item){
    let path = [];
    if(get(item, 'parent.id'))
      path = this.grabPathName(get(item, 'parent'), path);
    path.push(get(item, 'name'));
    return path;
  },
  compareDates(date1, date2){
    date1 = new Date(date1);
    date2 = new Date(date2);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    return date1.getTime() === date2.getTime();
  }
}
