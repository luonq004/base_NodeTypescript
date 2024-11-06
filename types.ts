export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

export type UnsavedUser = Omit<User, "id">;
export type UserChanges = Partial<Omit<User, "id">>;

export type Db = {
  users: User[];
};
