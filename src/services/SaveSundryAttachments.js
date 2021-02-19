/* eslint-disable no-undef */

async function saveSundryAttachments(user, fData) {
  const response = await fetch(`${user.baseUrl}/SundryExpense/saveSundryAttachments`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data;'
    },
    body: fData,
  });
  const responseJson = await response.json();
  return responseJson;
}

export { saveSundryAttachments };
