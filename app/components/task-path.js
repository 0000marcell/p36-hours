import Component from '@ember/component';
import { get, computed } from '@ember/object';

export default Component.extend({
  classNames: ['task-path'],
  concatPath: computed('paths', function() {
    let paths = get(this, 'paths');
    if(!paths)
      return `SELECT A TASK`;

    let result = paths.reduce((acc, path, i) => {
      acc += path.toUpperCase();
      if(paths.length > (i + 1))
        acc += ' | ';
      return acc;
    }, '');
    return result;
  })
});
