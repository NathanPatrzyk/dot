import { getDb } from "@/adapters/sqlite/client";
import { createSqliteUserRepository } from "@/adapters/sqlite/user-repository-factory";
import { createSqliteTaskRepository } from "@/adapters/sqlite/task-repository-factory";
import { CommonUserRepository } from "@/core/ports/common-user-repository";
import { CommonTaskRepository } from "@/core/ports/common-task-repository";

export { getDb };

export function getUserRepository(): CommonUserRepository {
  return createSqliteUserRepository();
}

export function getTaskRepository(): CommonTaskRepository {
  return createSqliteTaskRepository();
}
