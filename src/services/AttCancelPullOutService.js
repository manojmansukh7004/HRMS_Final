
async function cancelPullOutAtt(user, uwlId, date) {
  const payload = {
    loginDetails:
      {
        LoginEmpID: user.LoginEmpID,
        LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
        loginEmpGroupId: '',
      },
    attendanceData:
      {
        EmpId: user.LoginEmpID,
        EmpName: user.LoginEmpName,
        CompanyCode: user.LoginEmpCompanyCodeNo,
        UwlId: uwlId,
        Process: 'ATTENDANCEPULL',
        FromDate: date,
        ToDate: date
      }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Attendance/AttendanceCancelPullOut`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { cancelPullOutAtt };
