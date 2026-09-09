export type UserRecord = {
  id: string;
  name: string;
  email: string;
};

export interface UsersRepository {
  findById(id: string): Promise<UserRecord | null>;
}
