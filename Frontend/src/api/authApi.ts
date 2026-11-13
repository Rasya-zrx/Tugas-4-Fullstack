import api from "./axios";
import type {
  AuthResponse,
  UserResponse,
  RegisterInput,
  LoginInput,
} from "../types/auth";

export const register = async (input: RegisterInput) => {
  const response = await api.post<UserResponse>(
    "/auth/register",
    input
  );

  return response.data;
};

export const login = async (input: LoginInput) => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    input
  );

  return response.data;
};

export const getMe = async () => {
  const response = await api.get<UserResponse>("/auth/me");

  return response.data;
};
