import { Task } from "..";
/**
 * Очередь задач с приоритетом.
 */
export declare class TaskQueue {
    /** Бинарная куча для хранения задач. */
    readonly heap: Task[];
    constructor();
    /** Возвращает индекс родителя для элемента по индексу i. */
    private parent;
    /** Возвращаем индекс левого потомка для элемента по индексу i. */
    private leftChild;
    /** Возвращаем индекс правого потомка для элемента по индексу i. */
    private rightChild;
    /**
     * Функция сравнения Task по наивысшему приоритету.
     *
     * @param {number} a - первая задача.
     *
     * @param {number} b - вторая задача.
     */
    private tasksSort;
    /**
     * Просеивание вверх (подъем).
     *
     * @param i - индекс элемента, который нужно поднять.
     */
    private heapifyUp;
    /**
     * Просеивание вниз (спуск).
     *
     * @param i - индекс элемента, который нужно спустить.
     */
    private heapifyDown;
    /**
     * Добавление задачи в очередь.
     *
     * @param task - новая задача.
     */
    insert(task: Task): void;
    /**
     * Извлечение элемента с наивысшим приоритетом.
     */
    extractMax(): Task | null;
}
