import * as moment from 'moment';

export const getDates = (startDate, endDate, dayNum) => {
  let current = moment(startDate);
  const end = moment(endDate);
  const results = [];

  // If current is on the wrong weekday, move it forward to the first matching weekday:
  if (current.weekday() !== dayNum) {
    current.add(
      dayNum >= current.weekday()
        ? dayNum - current.weekday()
        : 7 - (current.weekday() - dayNum),
      'day',
    );
  }

  while (current.isSameOrBefore(end)) {
    results.push(current.clone());
    current.add(7, 'day');
  }

  return results;
};
