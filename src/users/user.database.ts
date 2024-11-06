import { UnsavedUser, User, UserChanges } from "../../types";

import { v4 as uuid } from "uuid";
import { hash } from "bcrypt";
import { getDb, updateDb } from "../../dbManager";

export const findAll = async (): Promise<User[]> => {
  const data = await getDb();
  return data.users;
};

export const findByEmail = async (email: string): Promise<null | User> => {
  const users = await findAll();

  const user = users.find((user) => user.email === email);

  return user ?? null;
};

export const findById = async (id: string): Promise<null | User> => {
  const users = await findAll();

  const user = users.find((user) => user.id === id);

  return user ?? null;
};

export const create = async (
  unsavedUser: UnsavedUser
): Promise<User | null> => {
  const hashedPassword = await hash(unsavedUser.password, 10);
  const userToCreate: User = {
    ...unsavedUser,
    id: uuid(),
    password: hashedPassword,
  };

  const db = await getDb();
  const updatedDb = {
    ...db,
    users: [...db.users, userToCreate],
  };
  updateDb(updatedDb);

  return userToCreate;
};

export const update = async (
  id: string,
  userChanges: UserChanges
): Promise<User> => {
  const userToUpdate = await findById(id);

  if (!userToUpdate) {
    throw new Error("User doesnt exist");
  }

  let hashedPassword = userToUpdate.password;
  if (userChanges.password) {
    hashedPassword = await hash(userChanges.password, 10);
  }

  const updatedUser: User = {
    ...userToUpdate,
    ...userChanges,
    password: hashedPassword,
  };

  const db = await getDb();
  const updatedDb = {
    ...db,
    users: db.users.map((user) => {
      if (user.id === userToUpdate.id) {
        return updatedUser;
      }
      return user;
    }),
  };
  updateDb(updatedDb);

  return updatedUser;
};

export const remove = async (id: string): Promise<void> => {
  const userToRemove = await findById(id);

  if (!userToRemove) {
    throw new Error("User doesnt exist");
  }

  const db = await getDb();
  const updatedDb = {
    ...db,
    users: db.users.filter((user) => user.id !== id),
  };
  updateDb(updatedDb);
};