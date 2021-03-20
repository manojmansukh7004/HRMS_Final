/* eslint-disable max-len */

async function SundryExpenseHistory(user) {
    console.log("user",user);
    const payload = {
      loginDetails: {
        loginEmpID: user.LoginEmpID,
        loginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
        currentRole: user.LoginEmpRoles
      },
      sundryDetails:
            {
            	ProcessText: "Claims",
            	SubProcessText: "Sundry Expense"
            }
    };
    console.log('saveSundryExpenseHistory', payload);
    const formBody = JSON.stringify(payload, (key, value) => {
      if (value !== null) {
        return value;
      }
      return {};
    });
  
    const response = await fetch(`${user.baseUrl}/SundryExpense/GetSundryData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formBody,
    }).catch(e => console.log(e));
  
    const responseJson = await response.json();
    return responseJson;
  }
  
  export { SundryExpenseHistory };
  