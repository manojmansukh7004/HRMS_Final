/* eslint-disable linebreak-style */
/* eslint-disable max-len */

async function leaveApplicationService(fromDate, toDate, reason, leavePeriodFrom, leavePeriodTo, leaveType,
  leaveTypeText, absenceDays, strDynamicQuery, user, attachments) {
  const payload = {
    loginDetails: {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      LoginEmpGroupId: ''
    },
    leaveData: {
      EmpId: user.LoginEmpID,
      FromDate: fromDate,
      ToDate: toDate,
      Reason: reason,
      LeavePeriodFrom: leavePeriodFrom,
      LeavePeriodTo: leavePeriodTo,
      LeaveType: leaveType,
      LeaveTypeText: leaveTypeText,
      AbsenceDays: absenceDays,
      StrDynamicQuery: strDynamicQuery
    },
    leaveAttachmentData: attachments
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Leave/SubmitLeave`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { leaveApplicationService };
