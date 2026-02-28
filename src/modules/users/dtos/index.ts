
export interface UserDTO {
  id: string;
  email: string;
  name: string;
  password: string;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  accessToken?: string;
  refreshToken?: string;
  lastLogin?: Date;
  isRegistrationComplete?: boolean;
}


export interface UserUpdateFiledDTO extends Omit<
  UserDTO, 'id' | 'email'
> { }

export interface UserIdDTO extends Omit<
  UserDTO, 'name' | 'email' | 'password' | 'isEmailVerified' | 'isAdminUser' | 'accessToken' | 'refreshToken' | 'lastLogin'
> { }
export interface LoginDTO extends Omit<
  UserDTO, 'id' | 'name' | 'isEmailVerified' | 'isAdminUser' | 'accessToken' | 'refreshToken' | 'lastLogin'
> {
  locale?: string;
}
export interface LoginResponseDTO extends Omit<
  UserDTO, 'id' | 'name' | 'email' | 'password' | 'isEmailVerified' | 'isAdminUser' | 'lastLogin'
> { }

export interface CreateDTO extends Omit<UserDTO, 'id'> {
  locale?: string;
}

export interface DeleteDTO extends UserIdDTO { }

export interface GetByIdDTO extends UserIdDTO { }

export interface UpdateDTO {
  request: GetByIdDTO;
  fieldUpdate: UserUpdateFiledDTO;
}