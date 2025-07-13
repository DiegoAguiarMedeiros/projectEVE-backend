
import express from 'express';
import { JWTClaims } from '../../../../modules/users/domain/JWT';

export interface DecodedExpressRequest extends express.Request {
  decoded: JWTClaims
}