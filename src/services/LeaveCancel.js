
async function cancelLeave(UWLId, LeaveType, Reason, user) {
  const payload = {
    loginDetails:
      {
        LoginEmpID: user.LoginEmpID,
        LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      },
    leaveCancelData: {
      EmpId: user.LoginEmpID,
      UWLId,
      LeaveType,
      Reason
    }
  };
  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Leave/LeaveCancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });
  const responseJson = await response.json();
  return responseJson;
}

export { cancelLeave };
