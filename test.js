let obj = { name: 'marcell' }
let obj2 = {
  name: obj.name
}

console.log(obj2.name);

obj.name = 'monteiro';

console.log(obj2.name);

