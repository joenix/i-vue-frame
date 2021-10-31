// Use Post Bridge
import postBridge from 'post-bridge';

// Receive
const receive = (callback = () => {}, message = 'emit:message') => new postBridge().receive(message, callback);

// Send
const send = (data = {}, message = 'emit:message') => new postBridge().send(message, data);

// Sheet
const sheet = (callback = () => {}, count = 0) => {
  // Get Sheets Object
  const sheets = document.styleSheets[0];

  // Extension API
  sheets.addCss = (selector, rules) => sheets.insertRule(`${selector} { ${rules} }`, count++);

  // Post Bridge
  receive((data) => callback(data, sheets), 'emit:styles');
};

// Export
export { receive, send, sheet };
