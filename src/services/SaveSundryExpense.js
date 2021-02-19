/* eslint-disable max-len */

async function saveSundryExpense(user, sundryData, deletedAttachments) {
  const payload = {
    loginDetails: {
      loginEmpID: user.LoginEmpID,
      loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
    },
    SundryData: sundryData,
    DeletedAttachments: deletedAttachments
  };
  console.log('saveSundryExpense', payload);
  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/SundryExpense/SaveSundryExpense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  }).catch(e => console.log(e));

  const responseJson = await response.json();
  return responseJson;
}

export { saveSundryExpense };
