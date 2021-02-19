/* eslint-disable max-len */
/* eslint-disable linebreak-style */

async function submitApprovalRejection(user, uwlId, process, processIDFromTable, empId, transactionId,
  remarks, actionTaken) {
    if(process === "ATTENDANCEAPP"){
      process = "Attendance"
    }
    else if(process === "LEAVEAPP"){
      process = "Leave"
    }
    else if(process === "SUNDRY"){
      process = "Sundry Expense"
    }
  const payload = {
    loginDetails: {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      LoginEmpGroupId: ''
    },
    inboxData: [{
      UWLId: uwlId,
      Process: process,
      ProcessIDFromTable: processIDFromTable,
      EmpId: empId,
      TransactionId: transactionId,
      Remarks: remarks,
      ActionTaken: actionTaken
    }],
    verifiedAmt: [{
      UWLId: uwlId
    }]
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Inbox/SubmitApprovalRejection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { submitApprovalRejection };
