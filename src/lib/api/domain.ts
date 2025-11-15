import {apiClient} from './client'
import {ApiResponse} from './types'
import {Domain} from '@/lib/types/models/domain'
import {CreateDomainDto, UpdateDomainDto} from "@/lib/validations/domain";

export const domainApi = {
  list: async (): Promise<Domain[]> => {
    const response = await apiClient.get<ApiResponse<Domain[]>>('/domains')
    return response.data.data
  },
  create: async (data: CreateDomainDto): Promise<Domain> => {
    const response = await apiClient.post<ApiResponse<Domain>>('/domains', data)
    return response.data.data
  },
  update: async (id: string, data: UpdateDomainDto): Promise<Domain> => {
    const response = await apiClient.patch<ApiResponse<Domain>>('/domains', data)
    return response.data.data
  },
}

