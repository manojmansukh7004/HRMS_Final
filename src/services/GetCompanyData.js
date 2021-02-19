async function getCompanyData() {
  const payload = {
    loginDetails:
      {
        LoginEmpID: '30000070',
        LoginEmpCompanyCodeNo: '1000',
      },
  };
  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch('http://hrmsapi.orgtix.com/api/Company/GetData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });
  const responseJson = await response.json();
  return responseJson;
}

export { getCompanyData };
