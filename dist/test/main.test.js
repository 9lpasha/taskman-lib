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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const puppeteer_1 = __importDefault(require("puppeteer"));
function* gen() {
    let k = 0;
    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < 500000; j++) { }
        k++;
        yield k;
    }
}
const workerTask = () => {
    for (let i = 0; i < 500000; i++) { }
    return "workerTask";
};
const simpleTask = () => {
    for (let i = 0; i < 500000; i++) { }
    return "default";
};
describe("Example Puppeteer Test", () => {
    let browser;
    let page;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Запуск браузера и создание новой страницы
        browser = yield puppeteer_1.default.launch();
        page = yield browser.newPage();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Закрытие браузера после завершения тестов
        if (browser)
            yield browser.close();
    }));
    it("Задача с генератором должна вернуть последнее поле value итератора", () => __awaiter(void 0, void 0, void 0, function* () {
        if (page) {
            const tm = new src_1.TaskManager();
            yield page.goto("http://localhost:3000");
            const result = yield page.evaluate(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield tm.addTask({
                    priority: src_1.TaskPriority.HIGH,
                    task: gen,
                });
            }));
            expect(result).toBe(10000);
        }
    }));
    it("Обычная задача в воркере", () => __awaiter(void 0, void 0, void 0, function* () {
        if (page) {
            const tm = new src_1.TaskManager();
            yield page.goto("http://localhost:3000");
            const result = yield page.evaluate(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield tm.addTask({
                    worker: true,
                    priority: src_1.TaskPriority.HIGH,
                    task: workerTask,
                    delay: 1000,
                });
            }));
            expect(result).toBe("workerTask");
        }
    }));
    it("Обычная задача", () => __awaiter(void 0, void 0, void 0, function* () {
        if (page) {
            const tm = new src_1.TaskManager();
            yield page.goto("http://localhost:3000");
            const result = yield page.evaluate(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield tm.addTask({
                    priority: src_1.TaskPriority.HIGH,
                    task: simpleTask,
                    delay: 1000,
                });
            }));
            expect(result).toBe("default");
        }
    }));
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
