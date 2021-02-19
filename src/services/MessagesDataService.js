
async function getMessagesData(user, menuLink, baseUrl) {
  const payload = {
    loginDetails:
          {
            LoginEmpID: user.LoginEmpID,
            LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
          },
    messagesData: {
      MenuLink: menuLink
    }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${baseUrl}/Messages/GetMessagesData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });
  const responseJson = await response.json();
  return responseJson;
}

export { getMessagesData };
