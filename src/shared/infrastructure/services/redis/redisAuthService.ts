
import { RedisClientType } from '@redis/client';
import * as jwt from 'jsonwebtoken'
import * as uuid from "uuid"
import randtoken from 'rand-token'
import { AbstractRedisClient } from './abstractRedisClient';
import { IAuthService } from '../authService';
import { authConfig } from '../../../../config';
import { RefreshToken, JWTClaims, JWTToken } from '../../../../modules/account/user/domain/JWT';
import { User } from '../../../../modules/account/user/domain/User';


/**
 * @class JWTClient
 * @extends AbstractRedisClient
 * @desc This class is responsible for persisting jwts to redis
 * and for signing tokens. It should also be responsible for determining their
 * validity.
 */

export class RedisAuthService extends AbstractRedisClient implements IAuthService {

  public jwtHashid: string = 'activeJwtClients';

  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  public async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getIdFromRefreshToken(refreshToken: RefreshToken): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error("id not found for refresh token.");

    const key = keys[0];

    return key.substring(key.indexOf(this.jwtHashid) + this.jwtHashid.length + 1)
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(user.id.toString(), user.refreshToken, user.accessToken);
    }
  }

  public async deAuthenticateUser(id: string): Promise<void> {
    await this.clearAllSessions(id);
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  /**
   * @function signJWT
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      id: props.id,
      name: props.name,
      isEmailVerified: false,
      adminUser: false
    };
  
    if (!authConfig.secret) {
      throw new Error("JWT secret is not defined in authConfig.");
    }
    
    // Forçamos a tipagem para os tipos esperados:
    return jwt.sign(claims, authConfig.secret as jwt.Secret, {
      expiresIn: authConfig.tokenExpiryTime as jwt.SignOptions["expiresIn"],
    });
  }
  

  /**
   * @method decodeJWT
   * @desc Decodes the JWT using the server secret. If successful decode,
   * it returns the data from the token.
   * @param {token} string
   * @return Promise<any>
   */

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      if (!authConfig.secret) {
        return resolve({} as JWTClaims);
      }
      jwt.verify(token, authConfig.secret, {}, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
        if (err) return resolve({} as JWTClaims);
        return resolve(decoded as JWTClaims);
      });
    })
  }

  private constructKey(id: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashid}.${id}`
  }

  /**
   * @method addToken
   * @desc Adds the token for this user to redis.
   * 
   * @param {id} string
   * @param {refreshToken} string
   * @param {token} string
   * @return Promise<any>
   */

  public addToken(id: string, refreshToken: RefreshToken, token: JWTToken): Promise<any> {
    return this.set(this.constructKey(id, refreshToken), token);
  }

  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashid}*`);
    return Promise.all(
      allKeys.map((key) => this.deleteOne(key))
    )
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @param {id} string
   * @return Promise<number>
   */

  public countSessions(id: string): Promise<number> {
    return this.count(`*${this.jwtHashid}.${id}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  public countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashid}*`);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  public async getTokens(id: string): Promise<string[]> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashid}*`);
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashid}.${id}`);
    return keyValues.map((kv) => kv.value);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @param {id} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async getToken(id: string, refreshToken: string): Promise<string> {
    return this.getOne(this.constructKey(id, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @param {id} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async clearToken(id: string, refreshToken: string): Promise<any> {
    return this.deleteOne(this.constructKey(id, refreshToken));
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @param {id} string
   * @return Promise<any>
   */

  public async clearAllSessions(id: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashid}.${id}`);
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(
      keys.map((key) => this.deleteOne(key))
    )
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @param {id} string
   * @param {refreshToken} string
   * @return Promise<boolean>
   */

  public async sessionExists(id: string, refreshToken: string): Promise<boolean> {
    const token = await this.getToken(id, refreshToken);
    if (!!token) {
      return true;
    } else {
      return false;
    }
  }
}