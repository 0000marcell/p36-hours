let dates = [],
    date = new Date();

date.setDate(date.getDate() - 14);

for (var i = 0; i < 14; i++) {
  dates.push(new Date(date));
  date.setDate(date.getDate() + 1)
}

export default {
  tasks: [
    {
      name: 'Building a table',
      status: 'active',
      pomodoros: [],
      tags: [],
      children: [
        {
          name: 'planning',
          status: 'active',
          pomodoros: [
            { date: dates[12] },
            { date: dates[11] },
            { date: dates[10] }
          ],
          tags: ['carpentry']
        },
        {
          name: 'buying material',
          status: 'active',
          pomodoros: [
            { date: dates[12] },
            { date: dates[11] },
            { date: dates[10] },
            { date: dates[9] },
            { date: dates[8] },
            { date: dates[7] }
          ],
          tags: ['carpentry']
        },
        {
          name: 'cutting',
          status: 'active',
          pomodoros: [
            { date: dates[12] },
            { date: dates[11] },
            { date: dates[10] },
            { date: dates[9] },
            { date: dates[8] },
            { date: dates[7] },
            { date: dates[6] },
            { date: dates[5] },
            { date: dates[4] }
          ],
          tags: ['carpentry']
        },
        {
          name: 'assembling',
          status: 'active',
          pomodoros: [
            { date: dates[12] },
            { date: dates[11] },
            { date: dates[10] },
            { date: dates[9] },
            { date: dates[8] },
            { date: dates[7] },
            { date: dates[6] },
            { date: dates[5] },
            { date: dates[4] }
          ],
          tags: ['carpentry']
        },
        {
          name: 'polishing',
          status: 'active',
          pomodoros: [
            { date: dates[12] },
            { date: dates[11] },
            { date: dates[10] },
            { date: dates[9] },
            { date: dates[8] },
            { date: dates[7] },
            { date: dates[6] },
            { date: dates[5] },
            { date: dates[4] },
            { date: dates[3] },
            { date: dates[2] },
            { date: dates[1] }
          ],
          tags: ['carpentry']
        }
      ],
    }
  ]
};
