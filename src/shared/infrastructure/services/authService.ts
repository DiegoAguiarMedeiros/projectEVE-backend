import { JWTClaims, JWTToken, RefreshToken } from "../../../modules/users/domain/JWT";
import { User } from "../../../modules/users/domain/User";




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