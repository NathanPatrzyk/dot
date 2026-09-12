import { UsersRepository } from "@/core/ports/users.repository";

export function createUsersService(usersRepository: UsersRepository) {
  async function findUserById(id: string) {
    return usersRepository.findById(id);
  }

  return { findUserById };
}
