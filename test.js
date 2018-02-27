let array = [{name: 'week'}];
let result = array.find((item) => {
  return item.name === 'day';
});
console.log('result: ', result);
