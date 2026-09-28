import type {
  CreateTaskInput,
  Task,
  TaskView,
  UpdateTaskInput,
} from "@/core/entities/task";

export interface TaskRepository {
  findById(id: number, userId: string): Promise<TaskView | null>;

  findAllByUser(userId: string): Promise<TaskView[]>;

  create(input: CreateTaskInput, userId: string): Promise<Task>;

  update(id: number, userId: string, input: UpdateTaskInput): Promise<void>;
}
