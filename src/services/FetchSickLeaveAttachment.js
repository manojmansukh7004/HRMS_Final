/* eslint-disable linebreak-style */


async function fetchSickLeaveAttachment(processIdFromTable, uwlId, user) {
  const payload = {
    loginDetails: {
      loginempid: user.LoginEmpID,
      loginempcompanycodeno: user.LoginEmpCompanyCodeNo,
    },
    leaveDetails: {
      ProcessIdFromTable: processIdFromTable,
      UWLId: uwlId
    }
  };

  const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Inbox/fetchSickLeaveAttachments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { fetchSickLeaveAttachment };
