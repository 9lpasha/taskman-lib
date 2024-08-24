"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
// Пример использования:
const tm = new src_1.TaskManager();
function* gen() {
    let k = 0;
    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < 500000; j++) { }
        k++;
        yield k;
    }
}
test("Задача с генератором должна вернуть последнее поле value итератора", () => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield tm.addTask({
        priority: src_1.TaskPriority.HIGH,
        task: gen,
    });
    expect(task).toBe(10000);
}));
const workerTask = () => {
    for (let i = 0; i < 500000; i++) { }
    return "workerTask";
};
test("Обычная задача в воркере", () => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield tm.addTask({
        worker: true,
        priority: src_1.TaskPriority.HIGH,
        task: workerTask,
        delay: 1000,
    });
    expect(task).toBe("workerTask");
}));
const simpleTask = () => {
    for (let i = 0; i < 500000; i++) { }
    return "default";
};
test("Обычная задача", () => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield tm.addTask({
        priority: src_1.TaskPriority.HIGH,
        task: simpleTask,
        delay: 1000,
    });
    expect(task).toBe("default");
}));
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
