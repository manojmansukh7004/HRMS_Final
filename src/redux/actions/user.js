import {
  SET_USER,
  SET_IS_LOGGEDIN,
  SET_PUNCH,
  SET_PUNCH_OUT,
  SET_PUNCHOUT_TIME,
  SET_PUNCHIN_TIME,
  SET_SKIP,
  SET_SERVER_TIME,
  SET_NOTIFICATIONS,
  SET_DASHBOARD_DATA,
  SET_RULESPOLICIES_LINKS,
  SET_UNREAD_NOTIFICATIONS,
  SET_COMPLETED_TASKS,
  SET_PENDING_TASKS,
} from './actionTypes';

export const setUser = user => ({
  type: SET_USER,
  user,
});

export const setLoggedIn = isLoggedIn => ({
  type: SET_IS_LOGGEDIN,
  isLoggedIn,
});

export const setPunchStatus = isPunched => ({
  type: SET_PUNCH,
  isPunched,
});

export const setPunchOut = isPunchOut => ({
  type: SET_PUNCH_OUT,
  isPunchOut,
});

export const setSkip = skip => ({
  type: SET_SKIP,
  skip,
});

export const setPunchInTime = time => ({
  type: SET_PUNCHIN_TIME,
  time,
});

export const setPunchOutTime = time => ({
  type: SET_PUNCHOUT_TIME,
  time,
});

export const setServerTime = time => ({
  type: SET_SERVER_TIME,
  time,
});

export const setNotifications = notifications => ({
  type: SET_NOTIFICATIONS,
  notifications,
});

export const setDashboardData = dashBoardData => ({
  type: SET_DASHBOARD_DATA,
  dashBoardData,
});

export const setRulesLinks = links => ({
  type: SET_RULESPOLICIES_LINKS,
  links,
});

export const setUnreadNotifications = count => ({
  type: SET_UNREAD_NOTIFICATIONS,
  count,
});

export const setCompletedTasks = tasks => ({
  type: SET_COMPLETED_TASKS,
  tasks,
});

export const setPendingTasks = tasks => ({
  type: SET_PENDING_TASKS,
  tasks,
});
