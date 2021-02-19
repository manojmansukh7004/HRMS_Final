async function getLeaveHistory(user) {
  const payload = {
    loginDetails:
      {
        loginEmpID: user.LoginEmpID,
        loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
      }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Leave/GetLeaveHistoryByEmployee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { getLeaveHistory };
