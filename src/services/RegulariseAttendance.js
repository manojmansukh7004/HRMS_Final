/* eslint-disable max-len */

async function regulariseAttendance(date, type,typeText,startTime, endTime, reason, user) {
  const payload = {
    loginDetails: {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      LoginEmpGroupId: ''
    },
    attendanceData: {
      UserId: user.UserId,
      CompanyCode: user.LoginEmpCompanyCodeNo,
      EmpId: user.LoginEmpID,
      EmpName: user.LoginEmpName,
      AbsenceDays: '1',
      AttType: type,
      AttTypeText: typeText,
      FromDate: date,
      ToDate: date,
      Reason: reason,
      FromAttPeriod: '1',
      AttPeriod: '1',
      ShiftTypeFrom: '2',
      StartTime: startTime,
      EndTime: endTime,
      AttShiftType: '1',
      ShiftStartTime: '0',
      ShiftEndTime: '0',
      ProcessIdFromTable: '', // ProcessIdFromTable from Calendar day
      StrDynamicQuery: ''
    },
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Attendance/RegularizeAttendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { regulariseAttendance };
