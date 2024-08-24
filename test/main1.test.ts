import { TaskManager, TaskPriority } from "../src";
import puppeteer, { Browser, Page } from "puppeteer";

// Пример использования:
const tm = new TaskManager();

function* gen() {
  let k = 0;
  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < 500_000; j++) {}
    k++;
    yield k;
  }
}

const workerTask = () => {
  for (let i = 0; i < 500_000; i++) {}

  return "workerTask";
};

const simpleTask = () => {
  for (let i = 0; i < 500_000; i++) {}

  return "default";
};

describe("Example Puppeteer Test", () => {
  let browser: undefined | Browser;
  let page: undefined | Page;

  beforeAll(async () => {
    // Запуск браузера и создание новой страницы
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    // Закрытие браузера после завершения тестов
    if (browser) await browser.close();
  });

  it("Задача с генератором должна вернуть последнее поле value итератора", async () => {
    window.onmouseenter = () => "asd";
    console.log(navigator.hardwareConcurrency);

    if (page) {
      await page.goto("http://localhost:3000");

      const result = await page.evaluate(async () => {
        return await tm.addTask({
          priority: TaskPriority.HIGH,
          task: gen,
        });
      });

      expect(result).toBe(10000);
    }
  });

  it("Обычная задача в воркере", async () => {
    if (page) {
      await page.goto("http://localhost:3000");

      const result = await page.evaluate(async () => {
        return await tm.addTask({
          worker: true,
          priority: TaskPriority.HIGH,
          task: workerTask,
          delay: 1000,
        });
      });

      expect(result).toBe("workerTask");
    }
  });

  it("Обычная задача", async () => {
    if (page) {
      await page.goto("http://localhost:3000");

      const result = await page.evaluate(async () => {
        return await tm.addTask({
          priority: TaskPriority.HIGH,
          task: simpleTask,
          delay: 1000,
        });
      });

      expect(result).toBe("default");
    }
  });
});

// let n1 = 0;
// let n2 = 0;

// setTimeout(() => {
//   for (let i = 0; i < 10000; i++) {
//     const task1 = tm.addTask({
//       worker: true,
//       priority: TaskPriority.HIGH,
//       task: workerTask,
//       delay: 1000,
//     });
//     task1.then((res) => {
//       n1++;
//       if (n1 === 10000) console.log(res);
//     });

//     const task2 = tm.addTask({
//       task: () => {
//         for (let i = 0; i < 500_000; i++) {}

//         return "default";
//       },
//     });
//     task2.then((res) => {
//       n2++;
//       if (n2 === 10000) console.log(res);
//     });
//   }
// }, 2000);
