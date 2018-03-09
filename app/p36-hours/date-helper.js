export default {
  lastXDays(num){
    let days = num - 1,
        dates = [],
        date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - days);

    for (var i = 0; i < days; i++) {
      dates.push(new Date(date.getTime()));
      date.setDate(date.getDate() + 1)
    }
    dates.push(new Date(date.getTime()));
    return dates;
  },
  datesRange(startDate, endDate){
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let results = [];
    while(startDate < endDate){
      results.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    results.push(new Date(startDate));
    return results;
  },
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
  compareDates(date1, date2){
    date1 = new Date(date1);
    date2 = new Date(date2);
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    return date1.getTime() === date2.getTime();
  }
}
