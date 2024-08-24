import { Task } from "..";

/**
 * Очередь задач с приоритетом.
 */
export class TaskQueue {
  /** Бинарная куча для хранения задач. */
  readonly heap: Task[];

  constructor() {
    this.heap = [];
  }

  /** Возвращает индекс родителя для элемента по индексу i. */
  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }

  /** Возвращаем индекс левого потомка для элемента по индексу i. */
  private leftChild(i: number) {
    return 2 * i + 1;
  }

  /** Возвращаем индекс правого потомка для элемента по индексу i. */
  private rightChild(i: number) {
    return 2 * i + 2;
  }

  /**
   * Функция сравнения Task по наивысшему приоритету.
   *
   * @param {number} a - первая задача.
   *
   * @param {number} b - вторая задача.
   */
  private tasksSort = (a: number, b: number) => {
    if (this.heap[a].priority === this.heap[b].priority) {
      return this.heap[a].timeCreated < this.heap[b].timeCreated;
    }

    return this.heap[a].priority > this.heap[b].priority;
  };

  /**
   * Просеивание вверх (подъем).
   *
   * @param i - индекс элемента, который нужно поднять.
   */
  private heapifyUp(i: number) {
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
  private heapifyDown(i: number) {
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
  insert(task: Task) {
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
    } else {
      this.heap[0] = this.heap.pop() as Task;
      this.heapifyDown(0);
    }

    return result;
  }
}
