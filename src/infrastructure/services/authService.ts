import { JWTClaims, JWTToken, RefreshToken } from "../../domain/entities/user/JWT";
import { User } from "../../domain/entities/user/User";



export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(id: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(id: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getIdFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}