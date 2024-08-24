"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
/** Класс выполняемых задач с приоритетом */
class Task {
    /**
     * @param worker - признак выполнения задачи в веб воркере
     * @param priority - приоритет
     * @param delay - тайм-аут (время в мс, после которого запускается задача)
     * @param iteratorValue - текущее значение, если задача с итератором
     * @param timeCreated - время создания задачи
     * @param task - задача
     * @param resolve - функция для завершения задачи и вывода из очереди
     * @param reject - функция для отклонения промиса
     */
    constructor(worker, priority, delay, iteratorValue, timeCreated, task, resolve, reject) {
        this.worker = worker;
        this.priority = priority;
        this.delay = delay;
        this.iteratorValue = iteratorValue;
        this.timeCreated = timeCreated;
        this.task = task;
        this.resolve = resolve;
        this.reject = reject;
    }
    /**
     * Выполняет задачу. Далее либо выполняет Promise с результатом выполнения задачи, либо отклоняет его с ошибкой.
     * Также умеет обрабатывать итераторы.
     */
    execute() {
        if (this.iteratorValue) {
            const iterator = this.task;
            try {
                const nextValue = iterator.next();
                if (nextValue.done) {
                    this.resolve(this.iteratorValue || nextValue.value);
                    return;
                }
                this.iteratorValue = nextValue.value;
                return iterator;
            }
            catch (e) {
                this.reject(e);
            }
        }
        else {
            try {
                const task = this.task;
                this.resolve(task());
            }
            catch (e) {
                this.reject(e);
            }
        }
    }
}
exports.Task = Task;
