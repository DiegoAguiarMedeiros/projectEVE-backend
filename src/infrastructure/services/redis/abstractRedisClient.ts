
import { RedisClientType } from '@redis/client';
import { RedisCommandArgument } from '@redis/client/dist/lib/commands';

export abstract class AbstractRedisClient {
  private tokenExpiryTime: number = 604800;
  protected client: RedisClientType;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  public async count(key: RedisCommandArgument): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.count(key)
        .then((count) => {
          return resolve(count >= 1 ? true : false)
        })
        .catch((err) => {
          return reject(err);
        })
    })
  }

  public getOne<T>(key: RedisCommandArgument): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const data = await this.client.get(key)
        .catch((err) => reject(err));
      if (data != null) {
        return resolve(<T>data);
      } else {
        return reject('error')
      }
    })
  }

  public getAllKeys(wildcard: RedisCommandArgument): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const data = await this.client.keys(wildcard)
        .catch((err) => reject(err)) || null;
      if (data != null) {
        return resolve(data);
      } else {
        return reject('error')
      }
    })
  }

  public getAllKeyValue(wildcard: RedisCommandArgument): Promise<any[]> {
    return new Promise(async (resolve, reject) => {

      const data = await this.client.keys(wildcard)
        .catch((err) => reject(err)) || null;
      if (data !== null) {
        const allResults = await Promise.all(
          data?.map(async (key) => {
            const value = await this.getOne(key);
            return { key, value }
          })
        );
        return resolve(allResults);
      } else {
        return reject('error')
      }
    })
  }

  public set(key: RedisCommandArgument, value: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = await this.client.set(key, value)
        .catch((err) => reject(err)) || null;
      if (data != null) {
        this.client.expire(key, this.tokenExpiryTime)
        return resolve(data);
      } else {
        return reject('error')
      }
    })
  }

  public deleteOne(key: RedisCommandArgument): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const data = await this.client.del(key)
        .catch((err) => reject(err)) || null;
      if (data != null) {
        this.client.expire(key, this.tokenExpiryTime)
        return resolve(data);
      } else {
        return reject('error')
      }
    })
  }

  public testConnection(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const data = await this.client.set('test', 'connected')
        .catch((err) => reject(err)) || null;
      if (data != null) {
        return resolve(data);
      } else {
        return reject('error')
      }
    })
  }
}

