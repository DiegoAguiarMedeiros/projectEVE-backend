
import express from 'express';
import { JWTClaims } from '../../../../domain/entities/user/JWT';

export interface DecodedExpressRequest extends express.Request {
  decoded: JWTClaims
}