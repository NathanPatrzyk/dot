import { getDb } from "@/adapters/d1/client";
import {
  createD1UserRepository,
  createD1UserDeletionRepository,
} from "@/adapters/d1/user-repository-factory";
import { createD1TaskRepository } from "@/adapters/d1/task-repository-factory";
import { CommonUserRepository } from "@/core/ports/common-user-repository";
import { UserDeletionRepository } from "@/core/ports/user-deletion-repository";
import { CommonTaskRepository } from "@/core/ports/common-task-repository";

export { getDb };

export function getUserRepository(): CommonUserRepository {
  return createD1UserRepository();
}

export function getUserDeletionRepository(): UserDeletionRepository {
  return createD1UserDeletionRepository();
}

export function getTaskRepository(): CommonTaskRepository {
  return createD1TaskRepository();
}
