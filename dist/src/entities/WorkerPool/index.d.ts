import { Task, TaskQueue } from "..";
/** Обработчик задач в воркерах. */
export declare class WorkerPool {
    /** Набор воркеров */
    readonly workers: Map<Worker, undefined | Task>;
    /** Очередь задач в веб-воркерах */
    readonly workerTaskQueue: TaskQueue;
    /** Флаг запрета на добавление задач в воркеры */
    closed: boolean;
    constructor();
    /**
     * Запускает одну задачу в воркер, если есть свободные воркеры.
     *
     * @param {Task} task - задача.
     */
    runTask(task: Task): void;
}
