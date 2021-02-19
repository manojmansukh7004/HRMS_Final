async function getAttendenceRegAnalytics(user) {
  const payload = {
    loginDetails:
    {
      loginEmpID: user.LoginEmpID,
      loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      currentRole: ''
    },
    attendanceData: {
      EmpId: ''
    }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Attendance/AttRegAnalytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { getAttendenceRegAnalytics };
