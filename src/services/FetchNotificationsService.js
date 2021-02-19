
async function fetchNotifications(user) {
  const payload = {
    loginDetails:
    {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
    }
  };

  const formBody = JSON.stringify(payload, (kay, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Notifications/FetchNotifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { fetchNotifications };
