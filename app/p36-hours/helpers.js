import { get } from '@ember/object';

export default {
  grabPathName(item){
    let path = [];
    if(get(item, 'parent.id'))
      path = this.grabPathName(get(item, 'parent'), path);
    path.push(get(item, 'name'));
    return path;
  }
}
