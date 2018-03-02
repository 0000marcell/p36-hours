import { helper } from '@ember/component/helper';

export function formatTime(params) {
  let time = params[0].split(':');
  return `${time[0]}:${time[1]}`;
}

export default helper(formatTime);
