/* eslint-disable max-len */
import {
  SET_USER,
  SET_IS_LOGGEDIN,
  SET_PUNCH,
  SET_PUNCH_OUT,
  SET_PUNCHIN_TIME,
  SET_PUNCHOUT_TIME,
  SET_SKIP,
  SET_SERVER_TIME,
  SET_NOTIFICATIONS,
  SET_DASHBOARD_DATA,
  SET_RULESPOLICIES_LINKS,
  SET_UNREAD_NOTIFICATIONS,
  SET_PENDING_TASKS,
  SET_COMPLETED_TASKS,
} from '../actions/actionTypes';

const defaultState = {
  user: {},
  isLoggedIn: false,
  isPunched: false,
  isPunchOut: false,
  isPunchSkip: false,
  punchInTime: null,
  punchOutTime: null,
  serverTime: null,
  skip: false,
  notifications: [],
  dashBoardData: null,
  rulesLinks: [],
  unReadNotifications: 0,
  completedTasks: [],
  pendingTasks: [],
};

export default function reducer(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user, };
    case SET_IS_LOGGEDIN:
      return { ...state, isLoggedIn: action.isLoggedIn, };
    case SET_PUNCH:
      return { ...state, isPunched: action.isPunched, };
    case SET_PUNCH_OUT:
      return { ...state, isPunchOut: action.isPunchOut, };
    case SET_SKIP:
      return { ...state, skip: action.skip, };
    case SET_PUNCHIN_TIME:
      return { ...state, punchInTime: action.time, };
    case SET_PUNCHOUT_TIME:
      return { ...state, punchOutTime: action.time, };
    case SET_SERVER_TIME:
      return { ...state, serverTime: action.time, };
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.notifications, };
    case SET_DASHBOARD_DATA:
      return { ...state, dashBoardData: action.dashBoardData, };
    case SET_RULESPOLICIES_LINKS:
      return { ...state, rulesLinks: action.links, };
    case SET_UNREAD_NOTIFICATIONS:
      return { ...state, unReadNotifications: action.count, };
    case SET_PENDING_TASKS:
      return { ...state, pendingTasks: action.tasks, };
    case SET_COMPLETED_TASKS:
      return { ...state, completedTasks: action.tasks, };
    default:
      return state;
  }
}
