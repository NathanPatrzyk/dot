export type UserRecord = {
  id: string;
  name: string;
  email: string;
};

export interface CommonUserRepository {
  findById(id: string): Promise<UserRecord | null>;
}
