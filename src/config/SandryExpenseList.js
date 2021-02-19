const expenseTypes = [
  {
    text: 'Select',
    value: '0'
  },
  {
    text: 'Briefcase/Bag',
    value: 'CL25$75'
  },
  {
    text: 'Personal 2 wheeler vehicle expense',
    value: 'CL15$75'
  },
  {
    text: 'Travel fare',
    value: 'CL01$75'
  },
  {
    text: 'Local Conveyance',
    value: 'CL02$75'
  },
  {
    text: 'Guest Entertainment',
    value: 'CL03$75'
  },
  {
    text: 'Refreshments',
    value: 'CL04$75'
  },
  {
    text: 'Printing and Stationary',
    value: 'CL05$75'
  },
  {
    text: 'Documentation Charges',
    value: 'CL06$75'
  },
  {
    text: 'Personal 4 wheeler petrol expense',
    value: 'CL07$75'
  },
  {
    text: 'personal 4 wheeler diesel expense',
    value: 'CL08$75'
  },
  {
    text: 'Vehicle hire charges',
    value: 'CL09$75'
  },
  {
    text: 'Foreign travel',
    value: 'CL10$75'
  },
  {
    text: 'Household Materials Expense (Transfer)',
    value: 'CL11$75'
  },
  {
    text: 'Postage and Telegram',
    value: 'CL12$75'
  },
  {
    text: 'Internet Charges',
    value: 'CL13$75'
  },
  {
    text: 'Helmet ',
    value: 'CL14$75'
  },
  {
    text: 'Raincoat',
    value: 'CL16$75'
  },
  // {
  //   text: 'Personal phone bill',
  //   value: 'CL17$75'
  // },
  // {
  //   text: 'Official phone bill',
  //   value: 'CL18$75'
  // },
  {
    text: 'Driver Salary',
    value: 'CL19$75'
  },
  {
    text: 'Uniform',
    value: 'CL20$75'
  },
  {
    text: 'Safety shoes',
    value: 'CL21$75'
  }
];

export default expenseTypes;

export const paidBy = [
  {}, {}
];

function getExpenseByText(text) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < expenseTypes.length; i++) {
    if (expenseTypes[i].text === text) {
      return expenseTypes[i];
    }
  }
  return null;
}

export { getExpenseByText };
