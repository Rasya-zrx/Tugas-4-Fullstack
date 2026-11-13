import api from "./axios";
import type {
  StallResponse,
  StallDetailResponse,
  StallMenusResponse,
  StallQueryParams,
  StallInput,
} from "../types/stall";

export const getStalls = async (
  params?: StallQueryParams
): Promise<StallResponse> => {
  const response = await api.get<StallResponse>("/stalls", { params });
  return response.data;
};

export const getStallById = async (
  id: number
): Promise<StallDetailResponse> => {
  const response = await api.get<StallDetailResponse>(`/stalls/${id}`);
  return response.data;
};

export const getStallMenus = async (
  id: number
): Promise<StallMenusResponse> => {
  const response = await api.get<StallMenusResponse>(`/stalls/${id}/menus`);
  return response.data;
};

export const createStall = async (
  input: StallInput
): Promise<StallDetailResponse> => {
  const response = await api.post<StallDetailResponse>("/stalls", input);
  return response.data;
};

export const updateStall = async (
  id: number,
  input: StallInput
): Promise<StallDetailResponse> => {
  const response = await api.put<StallDetailResponse>(`/stalls/${id}`, input);
  return response.data;
};

export const deleteStall = async (
  id: number
): Promise<StallDetailResponse> => {
  const response = await api.delete<StallDetailResponse>(`/stalls/${id}`);
  return response.data;
};
