import { TaskPriority } from "../../types";
/** Класс выполняемых задач с приоритетом */
export declare class Task {
    readonly worker: boolean;
    readonly priority: TaskPriority;
    readonly delay: number | undefined;
    iteratorValue: unknown;
    readonly timeCreated: DOMHighResTimeStamp;
    readonly task: Iterator<unknown, any, undefined> | (() => unknown);
    readonly resolve: (value: unknown) => void;
    readonly reject: (reason?: any) => void;
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
    constructor(worker: boolean, priority: TaskPriority, delay: number | undefined, iteratorValue: unknown, timeCreated: DOMHighResTimeStamp, task: Iterator<unknown, any, undefined> | (() => unknown), resolve: (value: unknown) => void, reject: (reason?: any) => void);
    /**
     * Выполняет задачу. Далее либо выполняет Promise с результатом выполнения задачи, либо отклоняет его с ошибкой.
     * Также умеет обрабатывать итераторы.
     */
    execute(): Iterator<unknown, any, undefined> | undefined;
}
