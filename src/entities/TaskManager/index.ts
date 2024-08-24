import { TaskPriority, TypeToAddTask } from "../../types";
import { Task, TaskQueue, WorkerPool } from "..";

/**
 * Менеджер задач. Ставит задачи в очередь и выполняет их.
 */
export class TaskManager {
  /** Очередь задач. */
  private taskQueue: TaskQueue;
  /** Обработчик задач в воркерах. */
  private workerPool: WorkerPool;

  constructor() {
    this.taskQueue = new TaskQueue();
    this.workerPool = new WorkerPool();
  }

  /**
   * Добавляет новую задачу в очередь задач. Если у задачи есть delay, ее добавление будет запланировано после задержки.
   *
   * @param {TypeToAddTask} options - Поля для создания задачи.
   * @return {Promise<unknown>} - Promise, который выполняется в соответствии с результатом выполнения задачи или отклоняется с ошибкой.
   */
  addTask<T>({ worker = false, priority = TaskPriority.DEFAULT, delay = 0, task }: TypeToAddTask<T>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const isIterator = task.constructor.name === "GeneratorFunction";
      const readyTask = isIterator ? (task() as Iterator<unknown>) : task;
      const newTask = new Task(worker, priority, delay, isIterator, performance.now(), readyTask, resolve, reject);

      const enqueue = () => {
        if (newTask.worker) {
          if (newTask.iteratorValue) {
            console.error("Запрещено передавать функции-генераторы в worker");

            return;
          }

          this.workerPool.workerTaskQueue.insert(newTask);

          if (!this.workerPool.closed) {
            this.workerPool.runTask(newTask);
          }
        } else {
          this.taskQueue.insert(newTask);

          if (this.taskQueue.heap.length === 1) {
            requestIdleCallback(this.runTask.bind(this));
          }
        }
      };

      if (delay) {
        setTimeout(enqueue, delay);
      } else {
        enqueue();
      }
    });
  }

  /**
   * Запускает задачи из очереди пока есть свободное время или очередь задач не опустеет.
   *
   * @param {IdleDeadline} deadline - Крайний срок окончания свободного времени.
   */
  private runTask(deadline: IdleDeadline) {
    const tasks = this.taskQueue.heap;

    while (deadline.timeRemaining() > 0.5 && tasks.length > 0) {
      const task = this.taskQueue.extractMax() as Task;
      const result = task.execute();

      if (result) {
        const newTask = new Task(
          task.worker,
          task.priority,
          task.delay,
          task.iteratorValue,
          performance.now(),
          result,
          task.resolve,
          task.reject,
        );

        this.taskQueue.insert(newTask);
      }
    }

    // Если остались задачи, продолжаем выполнение
    if (tasks.length > 0) {
      requestIdleCallback(this.runTask.bind(this));
    }
  }
}
