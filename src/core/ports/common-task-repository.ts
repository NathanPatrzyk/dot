import { CreateTaskInput, UpdateTaskInput } from "@/types/tasks";

export type TaskRecord = {
  id: number;
  name: string;
  isCompleted: boolean;
};

export interface CommonTaskRepository {
  findById(id: number, userId: string): Promise<TaskRecord | null>;

  findAllByUser(userId: string): Promise<TaskRecord[]>;

  create(input: CreateTaskInput, userId: string): Promise<TaskRecord>;

  update(id: number, userId: string, input: UpdateTaskInput): Promise<void>;
}
