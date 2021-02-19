
async function onLeaveChange(LeaveType, user){
const payload={
    loginDetails:
	{
		LoginEmpID: user.LoginEmpID,
		LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
		loginEmpGroupId:''
	},
    leaveData:
    {
        EmpId : user.LoginEmpID,
        LeaveType       
	}
}

const formBody = JSON.stringify(payload, (key, value) => {
    if (value !== null) {
      return value;
    }
    return {};
  });

  const response = await fetch(`${user.baseUrl}/Leave/LeaveTypeChange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: formBody,
  });

  const responseJson = await response.json();
  return responseJson;
}

export { onLeaveChange };