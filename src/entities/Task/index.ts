import { TaskPriority } from "../../types";

/** Класс выполняемых задач с приоритетом */
export class Task {
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
  constructor(
    public readonly worker: boolean,
    public readonly priority: TaskPriority,
    public readonly delay: number | undefined,
    public iteratorValue: unknown,
    public readonly timeCreated: DOMHighResTimeStamp,
    public readonly task: Iterator<unknown, any, undefined> | (() => unknown),
    public readonly resolve: (value: unknown) => void,
    public readonly reject: (reason?: any) => void,
  ) {}

  /**
   * Выполняет задачу. Далее либо выполняет Promise с результатом выполнения задачи, либо отклоняет его с ошибкой.
   * Также умеет обрабатывать итераторы.
   */
  execute() {
    if (this.iteratorValue) {
      const iterator = this.task as Iterator<unknown>;

      try {
        const nextValue = iterator.next();

        if (nextValue.done) {
          this.resolve(this.iteratorValue || nextValue.value);
          return;
        }

        this.iteratorValue = nextValue.value;

        return iterator;
      } catch (e) {
        this.reject(e);
      }
    } else {
      try {
        const task = this.task as () => unknown;

        this.resolve(task());
      } catch (e) {
        this.reject(e);
      }
    }
  }
}
