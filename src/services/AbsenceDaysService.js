/* eslint-disable linebreak-style */

async function absenceDaysService(leaveType, fromDate, toDate, user) {
  const payload = {
    loginDetails:
          {
            LoginEmpID: user.LoginEmpID,
            LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
          },
    leaveData:
          {
            EmpId: user.LoginEmpID,
            LeaveType: leaveType,
            FromDate: fromDate,
            ToDate: toDate,
          }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Leave/CalculateAbsenceDays`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { absenceDaysService };
