export type UserRole = "admin" | "owner" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
    user: User;
  };
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
