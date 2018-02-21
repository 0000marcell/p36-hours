let obj = [
  {
    name: 'tag 1',
    tasks: [
      {
        name: 'task 1',
        pomodoros: [
          { date: '1'},
          { date: '2'},
          { date: '2'}
        ]
      },
      {
        name: 'task 2',
        pomodoros: [
          { date: '1'},
          { date: '2'},
          { date: '2'}
        ]
      }
    ]
  },
  {
    name: 'tag 2',
    tasks: [
      {
        name: 'task 1',
        pomodoros: [
          { date: '1'},
          { date: '2'},
          { date: '2'}
        ]
      },
      {
        name: 'task 2',
        pomodoros: [
          { date: '1'},
          { date: '2'},
          { date: '2'}
        ]
      }
    ]
  }
  
];

let result = obj.map((item) => (
  item.tasks
));

console.log(result);
