// src/user/interfaces/user.interface.ts
export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: Date; // Date object for timestamp of creation
  updatedAt: Date; // Date object for timestamp of last update
}
