// Use Post Bridge
import postBridge from "post-bridge";

// Object
var bridge = new postBridge();

// Set Bridge
const set = frame => {
  return (bridge = new postBridge(frame));
};

// Receive
const receive = (callback = () => {}, message = "emit:message", frame) => {
  if (frame) {
    set(frame);
  }

  return bridge.receive(message, callback);
};

// Send
const send = (data = {}, message = "emit:message", frame) => {
  if (frame) {
    set(frame);
  }

  return bridge.send(message, data);
};

// Sheet
const sheet = (callback = () => {}, count = 0) => {
  // Get Sheets Object
  const sheets = document.styleSheets[0];

  // Extension API
  sheets.addCss = (selector, rules) => sheets.insertRule(`${selector} { ${rules} }`, count++);

  // Post Bridge
  receive(data => callback(data, sheets), "emit:styles");
};

// Export
export { receive, send, sheet, set };
