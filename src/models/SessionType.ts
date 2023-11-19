// eslint-disable-next-line import/prefer-default-export
export const toSessionValue = (sessionType: string): string => {
  switch (sessionType) {
    case 'LEC':
      return 'Lecture';
    case 'TUT':
      return 'Tutorial';
    case 'LAB':
      return 'Laboratory';
    case 'OTH':
      return 'Other';
    default:
      return 'Unknown';
  }
};
