import { CommonUserRepository } from "../ports/common-user-repository";

export function createAuthService(userRepository: CommonUserRepository) {
  async function findUserById(id: string) {
    return userRepository.findById(id);
  }

  return { findUserById };
}
