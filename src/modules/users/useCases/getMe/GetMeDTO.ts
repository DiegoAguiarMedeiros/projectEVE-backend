
import { JWTToken, RefreshToken } from "../../domain/jwt";

export interface GetMeDTO {
  email: string;
  password: string;
}

export interface GetMeDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}