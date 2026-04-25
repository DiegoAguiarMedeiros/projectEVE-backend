export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  isAdminUser: boolean;
  isDeleted: boolean;
  isRegistrationComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetailDTO extends AdminUserDTO {
  totalEnvelopes: number;
  totalIncomes: number;
  totalTransactions: number;
  totalProcessedIncomes: number;
}

export interface AdminStatsDTO {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  deletedUsers: number;
  usersRegisteredThisMonth: number;
  totalEnvelopes: number;
  totalTransactions: number;
  totalProcessedIncomes: number;
}

export interface MonthlyStatDTO {
  month: number;
  year: number;
  count: number;
}

export interface AdminBaseEnvelopeDTO {
  id: string;
  name: string;
  color: string;
  order: number;
  percentage: number;
}

export interface UpdateAdminUserDTO {
  userId: string;
  isDeleted?: boolean;
  isAdminUser?: boolean;
  isEmailVerified?: boolean;
}

export interface CreateBaseEnvelopeDTO {
  name: string;
  color: string;
  order: number;
  percentage: number;
}

export interface UpdateBaseEnvelopeDTO {
  id: string;
  name?: string;
  color?: string;
  order?: number;
  percentage?: number;
}

export interface UserSummaryDTO {
  totalEnvelopes: number;
  totalIncomes: number;
  totalTransactions: number;
  totalProcessedIncomes: number;
}
