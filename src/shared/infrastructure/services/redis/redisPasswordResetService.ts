
import { RedisClientType } from '@redis/client';

export class RedisPasswordResetService {
  private client: RedisClientType;
  private readonly prefix = 'pwd-reset-token';
  private readonly ttl = 3600;

  constructor(client: RedisClientType) {
    this.client = client;
  }

  private buildKey(token: string): string {
    return `${this.prefix}.${token}`;
  }

  public async saveToken(token: string, userId: string): Promise<void> {
    await this.client.set(this.buildKey(token), userId, { EX: this.ttl });
  }

  public async getUserIdByToken(token: string): Promise<string | null> {
    return this.client.get(this.buildKey(token));
  }

  public async deleteToken(token: string): Promise<void> {
    await this.client.del(this.buildKey(token));
  }
}
