import { JWTToken, RefreshToken } from "../../../../domain/entities/user/JWT";

export interface GetByIdDTO {
  email: string;
  password: string;
}

export interface GetByIdDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}