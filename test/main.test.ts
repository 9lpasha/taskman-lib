import { TaskManager, TaskPriority } from "../src";

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
  beforeAll(async () => {
    await page.goto("http://localhost:3000");
  });

  it("Задача с генератором должна вернуть последнее поле value итератора", async () => {
    const task = await tm.addTask({
      priority: TaskPriority.HIGH,
      task: gen,
    });

    expect(task).toBe(10000);
  });

  it("Обычная задача в воркере", async () => {
    const task = await tm.addTask({
      worker: true,
      priority: TaskPriority.HIGH,
      task: workerTask,
      delay: 1000,
    });

    expect(task).toBe("workerTask");
  });

  it("Обычная задача", async () => {
    const task = await tm.addTask({
      priority: TaskPriority.HIGH,
      task: simpleTask,
      delay: 1000,
    });

    expect(task).toBe("default");
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
