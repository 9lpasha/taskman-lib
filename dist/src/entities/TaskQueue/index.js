"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueue = void 0;
/**
 * Очередь задач с приоритетом.
 */
class TaskQueue {
    constructor() {
        /**
         * Функция сравнения Task по наивысшему приоритету.
         *
         * @param {number} a - первая задача.
         *
         * @param {number} b - вторая задача.
         */
        this.tasksSort = (a, b) => {
            if (this.heap[a].priority === this.heap[b].priority) {
                return this.heap[a].timeCreated < this.heap[b].timeCreated;
            }
            return this.heap[a].priority > this.heap[b].priority;
        };
        this.heap = [];
    }
    /** Возвращает индекс родителя для элемента по индексу i. */
    parent(i) {
        return Math.floor((i - 1) / 2);
    }
    /** Возвращаем индекс левого потомка для элемента по индексу i. */
    leftChild(i) {
        return 2 * i + 1;
    }
    /** Возвращаем индекс правого потомка для элемента по индексу i. */
    rightChild(i) {
        return 2 * i + 2;
    }
    /**
     * Просеивание вверх (подъем).
     *
     * @param i - индекс элемента, который нужно поднять.
     */
    heapifyUp(i) {
        let parentIndex = this.parent(i);
        while (i > 0 && this.tasksSort(i, parentIndex)) {
            [this.heap[parentIndex], this.heap[i]] = [this.heap[i], this.heap[parentIndex]];
            i = parentIndex;
            parentIndex = this.parent(i);
        }
    }
    /**
     * Просеивание вниз (спуск).
     *
     * @param i - индекс элемента, который нужно спустить.
     */
    heapifyDown(i) {
        let maxIndex = i;
        const left = this.leftChild(i);
        const right = this.rightChild(i);
        if (left < this.heap.length && this.tasksSort(left, maxIndex)) {
            maxIndex = left;
        }
        if (right < this.heap.length && this.tasksSort(right, maxIndex)) {
            maxIndex = right;
        }
        if (i !== maxIndex) {
            [this.heap[i], this.heap[maxIndex]] = [this.heap[maxIndex], this.heap[i]];
            this.heapifyDown(maxIndex);
        }
    }
    /**
     * Добавление задачи в очередь.
     *
     * @param task - новая задача.
     */
    insert(task) {
        this.heap.push(task);
        this.heapifyUp(this.heap.length - 1);
    }
    /**
     * Извлечение элемента с наивысшим приоритетом.
     */
    extractMax() {
        if (this.heap.length === 0) {
            return null;
        }
        const result = this.heap[0];
        if (this.heap.length === 1) {
            this.heap.pop();
        }
        else {
            this.heap[0] = this.heap.pop();
            this.heapifyDown(0);
        }
        return result;
    }
}
exports.TaskQueue = TaskQueue;
