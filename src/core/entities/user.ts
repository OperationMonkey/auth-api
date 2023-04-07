export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  admin: boolean;
  locked: boolean;
  deleted: boolean;
  createdOn: Date;
  modifiedOn: Date;
}

export interface UserWithPassword extends User {
  password: string;
}
