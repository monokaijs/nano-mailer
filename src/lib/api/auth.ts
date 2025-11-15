import {apiClient} from './client'
import {ApiResponse, LoginResponseDto, RegisterDto, RegisterResponseDto,} from './types'
import {LoginDto} from "@/lib/validations/login";

export const authApi = {
  login: async (data: LoginDto) => {
    const response = await apiClient.post<ApiResponse<LoginResponseDto>>('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterDto) => {
    const response = await apiClient.post<ApiResponse<RegisterResponseDto>>('/auth/register', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}

