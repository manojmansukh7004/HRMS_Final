/* eslint-disable max-len */
async function submitSandryExpense(user, expenseData, expenseEligibility, totalClaimedAmt, totalBudget, usedAmt) {
  const payload = {
    loginDetails: {
      LoginEmpID: user.LoginEmpID,
      LoginEmpCompanyCodeNo: user.LoginEmpCompanyCodeNo,
      LoginEmpGroupId: ''
    },
    ExpenseData: expenseData,
    ExpenseEligibility: expenseEligibility,
    ExpensesAmtData: {
      TotalClaimedAmt: totalClaimedAmt,
      TotalBudgetAmt: totalBudget,
      UsedBudgetAmt: usedAmt
    }
  };
  const response = await fetch(`${user.baseUrl}/SundryExpense/SubmitSundryExpense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const responseJson = await response.json();
  return responseJson;
}

export { submitSandryExpense };
