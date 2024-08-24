"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = void 0;
const constants_1 = require("../../constants");
const __1 = require("..");
/** Обработчик задач в воркерах. */
class WorkerPool {
    constructor() {
        const that = this;
        const mapWorkers = new Map();
        for (let i = 0; i < (navigator.hardwareConcurrency || 16); i++) {
            const blob = new Blob([constants_1.workerCode], { type: "application/javascript" });
            const worker = new Worker(URL.createObjectURL(blob));
            worker.onmessage = function (e) {
                const { result, error } = e.data;
                const task = mapWorkers.get(worker);
                if (task) {
                    error ? task.reject(error) : task.resolve(result);
                    mapWorkers.set(worker, undefined);
                    const newTask = that.workerTaskQueue.extractMax();
                    if (newTask) {
                        that.workers.set(worker, newTask);
                        worker.postMessage({ task: newTask.task.toString() });
                    }
                    else {
                        that.closed = false;
                    }
                }
            };
            mapWorkers.set(worker, undefined);
        }
        this.closed = false;
        this.workers = mapWorkers;
        this.workerTaskQueue = new __1.TaskQueue();
    }
    /**
     * Запускает одну задачу в воркер, если есть свободные воркеры.
     *
     * @param {Task} task - задача.
     */
    runTask(task) {
        let freeWorker;
        for (let one of this.workers.entries()) {
            if (!one[1]) {
                freeWorker = one[0];
                break;
            }
        }
        if (freeWorker) {
            this.workers.set(freeWorker, task);
            freeWorker.postMessage({ task: task.task.toString() });
        }
        else {
            this.closed = true;
        }
    }
}
exports.WorkerPool = WorkerPool;
