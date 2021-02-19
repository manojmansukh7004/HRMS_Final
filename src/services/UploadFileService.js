/* eslint-disable no-undef */

async function uploadFile(user, fromDate, leaveType, files) {
  const data = new FormData();
  files.forEach(element => {
    data.append('file', element);
  });

  data.append('EmpId', user.LoginEmpID);
  data.append('FromDate', fromDate);
  data.append('LeaveType', leaveType);
  data.append('loginEmpID', user.LoginEmpID);
  data.append('loginEmpCompanyCodeNo', user.LoginEmpCompanyCodeNo);
  console.log(data);
  const response = await fetch(`${user.baseUrl}/Leave/UploadAttachments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data;'
    },
    body: data,
  });
  console.log(response);

  const responseJson = await response.json();
  return responseJson;
}

export { uploadFile };
