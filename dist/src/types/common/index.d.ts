import { TaskPriority } from "../enum";
/** Любой тип кроме итератора. */
type NotIterator<T> = T extends Iterator<any> ? never : T;
/** Тип для создания задачи (поле task зависит от поля worker). */
export type TypeToAddTask<T> = {
    worker: true;
    priority?: TaskPriority;
    delay?: number;
    task: () => NotIterator<T>;
} | {
    worker?: false;
    priority?: TaskPriority;
    delay?: number;
    task: () => unknown;
};
export {};
