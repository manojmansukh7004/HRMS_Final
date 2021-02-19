async function getSundryInboxData(user, UWLId) {
  const payload = {
    loginDetails:
        {
          loginEmpID: user.LoginEmpID,
          loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
        },
    ExpenseData: {
      UWLId
    }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/SundryExpense/FetchSundryInboxData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody
  });

  const responseJson = await response.json();
  return responseJson;
}

export { getSundryInboxData };
