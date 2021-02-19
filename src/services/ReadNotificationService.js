
async function readNotification(user, notificationId) {
  const payload = {
    loginDetails:
    {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
    },
    notificationDetails: {
      LoginEmpID: user.LoginEmpID,
      notificationId
    }
  };

  const formBody = JSON.stringify(payload, (kay, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Notifications/readNotifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { readNotification };
