async function getSundryData(user) {
  const payload = {
    loginDetails:
          {
            loginEmpID: user.LoginEmpID,
            loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
          },
    sundryDetails:
          {
            ProcessText: 'Claims',
            SubProcessText: 'Sundry Expense'
          }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/SundryExpense/GetSundryData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: formBody
  });

  const responseJson = await response.json();
  return responseJson;
}

export { getSundryData };
