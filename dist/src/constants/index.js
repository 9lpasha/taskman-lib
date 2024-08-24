"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerCode = void 0;
/**
 * Код веб-воркера. Передается строкой чтобы можно было на лету создавать веб-воркер.
 */
exports.workerCode = `
  self.onmessage = function ({ data: { task } }) {
  try {
    const result = eval(task)()
    self.postMessage({ result })
  } catch (error) {
    self.postMessage({ error })
  }
}
`;
