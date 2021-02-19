/* eslint-disable no-plusplus */
export default function getMessage(response, messageList) {
  const split = response.split('$');
  const type = split[0];
  const msg = split[1];
  for (let i = 0; i < messageList.length; i++) {
    if (messageList[i].MessageType === type && messageList[i].PageAction === msg) {
      if (split.length > 2) {
        let messageText = messageList[i].MessageText;
        for (let j = 2; j < split.length; j++) {
          const start = messageText.indexOf('#');
          const end = messageText.indexOf('#', start + 1);
          const substr = messageText.substring(start, end + 1);
          if (start !== -1 && end !== -1) {
            messageText = messageText.replace(substr, split[j].toString());
          }
        }
        return {
          message: messageText,
          type,
        };
      }
      return {
        message: messageList[i].MessageText,
        type,
      };
    }
  }
  return null;
}
