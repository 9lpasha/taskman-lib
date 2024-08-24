/**
 * Код веб-воркера. Передается строкой чтобы можно было на лету создавать веб-воркер.
 */
export declare const workerCode = "\n  self.onmessage = function ({ data: { task } }) {\n  try {\n    const result = eval(task)()\n    self.postMessage({ result })\n  } catch (error) {\n    self.postMessage({ error })\n  }\n}\n";
