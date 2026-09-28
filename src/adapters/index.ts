import { createAuthProvider } from "@/adapters/auth/auth-provider.adapter";
import { getDb } from "@/adapters/db/client";
import { createCategoryRepository } from "@/adapters/repositories/category.repository";
import { createTaskRepository } from "@/adapters/repositories/task.repository";
import { createUserRepository } from "@/adapters/repositories/user.repository";
import type { AuthProvider } from "@/core/ports/auth-provider.port";
import type { CategoryRepository } from "@/core/ports/category-repository.port";
import type { TaskRepository } from "@/core/ports/task-repository.port";
import type { UserRepository } from "@/core/ports/user-repository.port";

export function getAuthProvider(): AuthProvider {
  return createAuthProvider();
}

export function getTaskRepository(): TaskRepository {
  return createTaskRepository(getDb);
}

export function getCategoryRepository(): CategoryRepository {
  return createCategoryRepository(getDb);
}

export function getUserRepository(): UserRepository {
  return createUserRepository(getDb);
}
