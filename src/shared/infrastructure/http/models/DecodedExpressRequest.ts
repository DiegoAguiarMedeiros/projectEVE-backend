
import express from 'express';
import { JWTClaims } from '../../../../modules/account/user/domain/JWT';

export interface DecodedExpressRequest extends express.Request {
  decoded: JWTClaims
}