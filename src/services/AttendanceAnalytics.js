/* eslint-disable linebreak-style */

async function getAttendenceAnalytics(user) {
  const date = new Date();
  const payload = {
    loginDetails:
          {
            LoginEmpID: user.LoginEmpID,
            LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
          },
    attendanceData:
          {
            FromDate: `01/01/${date.getFullYear()}`,
            ToDate: `12/31/${date.getFullYear()}`
          }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Attendance/AttendanceAnalytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { getAttendenceAnalytics };
