import * as types from './actionTypes';

export const setPrimaryColor = color => ({
  type: types.SET_PRIMARY_COLOR,
  color,
});

export const setSecondaryColor = color => ({
  type: types.SET_SECONDARY_COLOR,
  color,
});

export const setPresentColor = color => ({
  type: types.SET_PRESENT_COLOR,
  color,
});

export const setAbsentColor = color => ({
  type: types.SET_ABSENT_COLOR,
  color,
});

export const setHolidayColor = color => ({
  type: types.SET_HOLIDAY_COLOR,
  color,
});

export const setLeaveColor = color => ({
  type: types.SET_LEAVE_COLOR,
  color,
});

export const setWeeklyOffColor = color => ({
  type: types.SET_WEEKLYOFF_COLOR,
  color,
});

export const setMissedPunchColor = color => ({
  type: types.SET_MISSEDPUNCH_COLOR,
  color,
});

export const setCalenderLegends = legends => ({
  type: types.SET_CALENDER_LEGEND,
  legends,
});
