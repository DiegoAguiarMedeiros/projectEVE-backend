import http from 'http';
import express from 'express';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { authService } from './index';
import { DecodedExpressRequest } from '../http/models/DecodedExpressRequest';

export interface SyncInvalidatePayload {
  resource: string;
  method: string;
  keys: string[][];
  timestamp: number;
}

const RESOURCE_QUERY_KEYS: Record<string, string[][]> = {
  transactions: [
    ['transactions'],
    ['envelopes'],
    ['debts'],
    ['goals'],
    ['goals-cumulative'],
    ['graph-analytics-current-envelopes'],
    ['graph-analytics-envelopes-month-overview'],
    ['graph-analytics-envelopes-by-year'],
  ],
  envelopes: [
    ['envelopes'],
    ['transactions'],
    ['processed-incomes'],
    ['goals'],
    ['goals-cumulative'],
    ['graph-analytics-current-envelopes'],
    ['graph-analytics-envelopes-month-overview'],
    ['graph-analytics-envelopes-by-year'],
  ],
  incomes: [
    ['incomes'],
    ['incomes-total'],
    ['envelopes'],
  ],
  'processed-incomes': [
    ['processed-incomes'],
    ['processed-incomes-month'],
    ['processed-incomes-total'],
    ['envelopes'],
    ['transactions'],
    ['debts'],
    ['goals'],
    ['goals-cumulative'],
    ['graph-analytics-current-envelopes'],
    ['graph-analytics-envelopes-month-overview'],
    ['graph-analytics-envelopes-by-year'],
  ],
  goals: [
    ['goals'],
    ['goals-cumulative'],
    ['envelopes'],
  ],
  debts: [
    ['debts'],
    ['envelopes'],
    ['transactions'],
  ],
  'fixed-expenses': [
    ['fixed-expenses'],
    ['envelopes'],
  ],
  'credit-cards': [
    ['credit-cards'],
    ['transactions'],
  ],
  users: [
    ['user'],
  ],
};

function parseCookies(cookieHeader?: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey && rest.length > 0) {
      result[rawKey] = decodeURIComponent(rest.join('='));
    }
  }
  return result;
}

class SocketService {
  private io: SocketIOServer | null = null;

  public init(server: http.Server, allowedOrigins: string[]): SocketIOServer {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          // Allow mobile apps (no origin header) or allowed web origins
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(null, true);
          }
        },
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.io.use(async (socket: Socket, next) => {
      try {
        const authToken =
          (typeof socket.handshake.auth?.token === 'string' && socket.handshake.auth.token) ||
          socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
          parseCookies(socket.handshake.headers?.cookie).accessToken;

        if (!authToken) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = await authService.decodeJWT(authToken);
        if (!decoded || !decoded.id) {
          return next(new Error('Authentication error: Invalid token'));
        }

        const activeTokens = await authService.getTokens(decoded.id);
        if (!activeTokens.includes(authToken)) {
          return next(new Error('Authentication error: Session expired'));
        }

        socket.data.userId = decoded.id;
        return next();
      } catch {
        return next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId: string | undefined = socket.data.userId;
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    return this.io;
  }

  public emitToUser(userId: string, event: string, payload: SyncInvalidatePayload): void {
    if (!this.io || !userId) return;
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  public createSyncMiddleware(): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
      if (!mutatingMethods.includes(req.method)) {
        return next();
      }

      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const decodedReq = req as DecodedExpressRequest;
          const userId = decodedReq.decoded?.id;
          if (!userId) return;

          // Extract resource segment from /api/<resource>/...
          const cleanPath = (req.originalUrl || req.url || '')
            .split('?')[0]
            .replace(/^\/api\/?/, '');
          const resource = cleanPath.split('/')[0] || '';

          if (!resource || resource === 'auth') return;

          const keys = RESOURCE_QUERY_KEYS[resource] || [[resource]];
          this.emitToUser(userId, 'sync:invalidate', {
            resource,
            method: req.method,
            keys,
            timestamp: Date.now(),
          });
        }
      });

      return next();
    };
  }
}

export const socketService = new SocketService();
