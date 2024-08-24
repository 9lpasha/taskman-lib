import { workerCode } from "../../constants";
import { Task, TaskQueue } from "..";

/** Обработчик задач в воркерах. */
export class WorkerPool {
  /** Набор воркеров */
  readonly workers: Map<Worker, undefined | Task>;
  /** Очередь задач в веб-воркерах */
  readonly workerTaskQueue: TaskQueue;
  /** Флаг запрета на добавление задач в воркеры */
  closed: boolean;

  constructor() {
    const that = this;
    const mapWorkers = new Map<Worker, undefined | Task>();

    for (let i = 0; i < (navigator.hardwareConcurrency || 16); i++) {
      const blob = new Blob([workerCode], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));

      worker.onmessage = function (e: any) {
        const { result, error } = e.data;
        const task = mapWorkers.get(worker);

        if (task) {
          error ? task.reject(error) : task.resolve(result);
          mapWorkers.set(worker, undefined);

          const newTask = that.workerTaskQueue.extractMax();

          if (newTask) {
            that.workers.set(worker, newTask);
            worker.postMessage({ task: newTask.task.toString() });
          } else {
            that.closed = false;
          }
        }
      };

      mapWorkers.set(worker, undefined);
    }

    this.closed = false;
    this.workers = mapWorkers;
    this.workerTaskQueue = new TaskQueue();
  }

  /**
   * Запускает одну задачу в воркер, если есть свободные воркеры.
   *
   * @param {Task} task - задача.
   */
  runTask(task: Task) {
    let freeWorker: Worker | undefined;

    for (let one of this.workers.entries()) {
      if (!one[1]) {
        freeWorker = one[0];
        break;
      }
    }

    if (freeWorker) {
      this.workers.set(freeWorker, task);
      freeWorker.postMessage({ task: task.task.toString() });
    } else {
      this.closed = true;
    }
  }
}
