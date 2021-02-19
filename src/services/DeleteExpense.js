async function deleteExpense(user, sundryId) {
  const payload = {
    loginDetails:
    {
      loginEmpID: user.LoginEmpID,
      loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      currentRole: ''
    },
    DeleteDetails: {
      SundryId: sundryId
    }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/SundryExpense/DeleteExpense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { deleteExpense };
