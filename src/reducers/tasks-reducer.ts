import { TaskView } from "@/types/tasks";

export type OptimisticAction =
  | { type: "create"; task: TaskView }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number };

const reducers: {
  [T in OptimisticAction["type"]]: (
    state: TaskView[],
    action: Extract<OptimisticAction, { type: T }>,
  ) => TaskView[];
} = {
  create: (state, action) => [action.task, ...state],
  toggle: (state, action) =>
    state.map((task) =>
      task.id === action.id
        ? { ...task, isCompleted: !task.isCompleted }
        : task,
    ),
  delete: (state, action) => state.filter((task) => task.id !== action.id),
};

export function tasksReducer(
  state: TaskView[],
  action: OptimisticAction,
): TaskView[] {
  return reducers[action.type](state, action as never);
}
