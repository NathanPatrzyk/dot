import { UserRepository } from "@/core/ports/user-repository.port";

export function createUserService(userRepository: UserRepository) {
  async function findUserById(id: string) {
    return userRepository.findById(id);
  }

  return { findUserById };
}
