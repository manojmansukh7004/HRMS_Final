
async function getDynamicFieldsData(action, fieldId, tableName, user) {
  const payload = {
    loginDetails:
      {
        LoginEmpID: user.LoginEmpID,
        LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo
      },
    dynamicFieldsData:
      {
        Action: action,
        FieldId: fieldId,
        TableName: tableName,
        EmployeeId: user.LoginEmpID,
      }
  };
  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/CommonFunc/GetDynamicFieldsData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });
  const responseJson = await response.json();
  return responseJson;
}

export { getDynamicFieldsData };
