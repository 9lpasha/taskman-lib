"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = void 0;
/** Приоритеты задач. */
var TaskPriority;
(function (TaskPriority) {
    /** Низкий приоритет (можно выполнять в фоне) */
    TaskPriority[TaskPriority["BACKGROUND"] = 0] = "BACKGROUND";
    /** Приоритет по умолчанию */
    TaskPriority[TaskPriority["DEFAULT"] = 1] = "DEFAULT";
    /** Высокий приоритет */
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
