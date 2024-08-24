import { TypeToAddTask } from "../../types";
/**
 * Менеджер задач. Ставит задачи в очередь и выполняет их.
 */
export declare class TaskManager {
    /** Очередь задач. */
    private taskQueue;
    /** Обработчик задач в воркерах. */
    private workerPool;
    constructor();
    /**
     * Добавляет новую задачу в очередь задач. Если у задачи есть delay, ее добавление будет запланировано после задержки.
     *
     * @param {TypeToAddTask} options - Поля для создания задачи.
     * @return {Promise<unknown>} - Promise, который выполняется в соответствии с результатом выполнения задачи или отклоняется с ошибкой.
     */
    addTask<T>({ worker, priority, delay, task }: TypeToAddTask<T>): Promise<unknown>;
    /**
     * Запускает задачи из очереди пока есть свободное время или очередь задач не опустеет.
     *
     * @param {IdleDeadline} deadline - Крайний срок окончания свободного времени.
     */
    private runTask;
}
