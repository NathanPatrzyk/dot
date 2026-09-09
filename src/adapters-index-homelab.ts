import { getDb } from "@/adapters/sqlite/client";
import { UsersRepository } from "@/core/ports/users.repository";
import { createUsersRepository } from "@/adapters/shared/users.repository";
import { TasksRepository } from "@/core/ports/tasks.repository";
import { createTasksRepository } from "@/adapters/shared/tasks.repository";
import { createUsersDeletionRepository } from "@/adapters/shared/users-deletion.repository";
import { UsersDeletionRepository } from "@/core/ports/users-deletion.repository";

export { getDb };

export function getUsersRepository(): UsersRepository {
  return createUsersRepository(getDb);
}

export function getTasksRepository(): TasksRepository {
  return createTasksRepository(getDb);
}

export function getUsersDeletionRepository(): UsersDeletionRepository {
  return createUsersDeletionRepository(getDb);
}
