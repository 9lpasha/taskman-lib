/**
 * Код веб-воркера. Передается строкой чтобы можно было на лету создавать веб-воркер.
 */
export const workerCode = `
  self.onmessage = function ({ data: { task } }) {
  try {
    const result = eval(task)()
    self.postMessage({ result })
  } catch (error) {
    self.postMessage({ error })
  }
}
`;
