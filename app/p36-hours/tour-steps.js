let builtInButtons = [
  {
    classes: 'shepherd-button-secondary',
    text: 'next',
    type: 'next'
  },
  {
    classes: 'shepherd-button-secondary',
    text: 'exit',
    type: 'cancel'
  }
];

let globalSteps = [
  {
    id: 'upload', 
    options: { 
      attachTo: '.upload-button bottom',
      text: 'If you have a backup file you can upload your data here',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'download', 
    options: { 
      attachTo: '.download-button bottom',
      text: 'You can download your all your data and easily upload in another computer',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'clock-button', 
    options: { 
      attachTo: '.clock-button bottom',
      text: 'You can see the whole clock and select tasks here, the clock will keep running even if you are not in this page',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'statistics-button bottom', 
    options: { 
      attachTo: '.statistics-button bottom',
      text: 'You can see informaiton and graphs about your tasks here',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'new-task-button', 
    options: { 
      attachTo: '.new-task-button bottom',
      text: 'You can create root tasks here, to create subtasks you need to click the plus assign, inside the task list',
      builtInButtons: builtInButtons
    }
  }
];

let clockSteps = [
  {
    id: 'clock-face h3', 
    options: { 
      attachTo: '.clock-face h3 bottom',
      text: 'This is the time that you spend in the current week',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'clock-face h2', 
    options: { 
      attachTo: '.clock-face h2 bottom',
      text: 'This is the time that you spend today',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'clock-face h1', 
    options: { 
      attachTo: '.clock-face h1 bottom',
      text: 'This is your current pomodoro',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'default-tabs', 
    options: { 
      attachTo: '.default-tabs bottom',
      text: 'You can switch between active and arquived tasks here',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'tree-view', 
    options: { 
      attachTo: '.tree-view-item bottom',
      text: 'Here is your task list, you can nest and select tasks, usually you gonna select a child task, unless the task is pretty simple and do not need to be broken up into multiple smaller tasks',
      builtInButtons: [builtInButtons[1]]
    }
  }
]

let statisticsSteps = [
  {
    id: 'line-chart',
    options: {
      attachTo: '.line-chart-container bottom',
      text: 'line chart of the amount of hours of the last two months ',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'performance-info',
    options: {
      attachTo: '.performance-info bottom',
      text: 'information about your performance compared to the same period of the previous week',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'mode-select',
    options: {
      attachTo: '.mode-select bottom',
      text: 'select between tag or task mode to filter your data',
      builtInButtons: builtInButtons
    }
  },
  {
    id: 'item-select',
    options: {
      attachTo: '.item-select bottom',
      text: 'select one or multiple tags or tasks to filter your data, some charts will not show up depending on the number of items that you choose',
      builtInButtons: [builtInButtons[1]]
    }
  }
];

export default {
  clock: globalSteps.concat(clockSteps),
  statistics: globalSteps.concat(statisticsSteps) 
}
