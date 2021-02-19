import * as types from '../actions/actionTypes';

const defaultColors = {
  primaryColor: '#061e47',
  secondaryColor: '#f27024',
  presentColor: '#008000',
  absentColor: '#ff0000',
  holidayColor: '#3131a9',
  weeklyOffColor: '#d9c5c5',
  leaveColor: '#e41df2',
  missingPunchColor: '#a81022',
  calenderLegends: [],
};

export default function reducer(state = defaultColors, action) {
  switch (action.type) {
    case types.SET_PRIMARY_COLOR:
      return { ...state, primaryColor: action.color, };
    case types.SET_SECONDARY_COLOR:
      return { ...state, secondaryColor: action.color, };
    case types.SET_PRESENT_COLOR:
      return { ...state, presentColor: action.color, };
    case types.SET_HOLIDAY_COLOR:
      return { ...state, holidayColor: action.color, };
    case types.SET_WEEKLYOFF_COLOR:
      return { ...state, weeklyOffColor: action.color, };
    case types.SET_LEAVE_COLOR:
      return { ...state, leaveColor: action.color, };
    case types.SET_MISSEDPUNCH_COLOR:
      return { ...state, missingPunchColor: action.color, };
    case types.SET_CALENDER_LEGEND:
      return { ...state, calenderLegends: action.legends, };
    default:
      return state;
  }
}
