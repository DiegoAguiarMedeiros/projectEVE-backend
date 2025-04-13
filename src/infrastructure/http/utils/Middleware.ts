import { isProduction } from "../../../config";
import { IAuthService } from "../../services/authService";

const rateLimit = require('express-rate-limit')

export class Middleware {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    private endRequest(status: 400 | 401 | 403, message: string, res: any): any {
        return res.status(status).send({ message });
    }

    public includeDecodedTokenIfExists() {
        return async (req: any, res: any, next: any) => {
            const token = req.headers['authorization']?.replace('Bearer ', '');
            // Confirm that the token was signed with our signature.
            if (token) {
                const decoded = await this.authService.decodeJWT(token);
                //@ts-ignore
                const signatureFailed = !!decoded === false;

                if (signatureFailed) {
                    return this.endRequest(403, 'Token signature expired.', res)
                }

                // See if the token was found
                const { id } = decoded;
                const tokens = await this.authService.getTokens(id);

                // if the token was found, just continue the request.
                if (tokens.length !== 0) {
                    req.decoded = decoded;
                    return next();
                } else {
                    return next();
                }
            } else {
                return next();
            }
        }
    }

    public ensureAuthenticated() {
        return async (req: any, res: any, next: any) => {
            const { accessToken, refreshToken } = req.cookies;
            if (!accessToken || !refreshToken) {
                return res.status(400).json({ message: 'No access token provided' });
            }

            const token = accessToken;
            if (token) {
                const decoded = await this.authService.decodeJWT(token);
                //@ts-ignore
                const signatureFailed = !!decoded === false;

                if (signatureFailed) {
                    return this.endRequest(403, 'Token signature expired.', res)
                }

                const { id } = decoded;
                const tokens = await this.authService.getTokens(id);

                if (tokens.length !== 0) {
                    req.decoded = decoded;
                    return next();
                } else {
                    return this.endRequest(403, 'Auth token not found. User is probably not logged in. Please login again.', res)
                }
            } else {
                return this.endRequest(403, 'No access token provided', res)
            }
        }
    }

    public static createRateLimit(mins: number, maxRequests: number) {
        return rateLimit({
            windowMs: mins * 60 * 1000,
            max: maxRequests,
        })
    }

    public static restrictedUrl(req: any, res: any, next: any) {

        if (!isProduction) {
            return next();
        }

        const approvedDomainList = [
            'https://khalilstemmler.com'
        ]

        const domain = req.headers.origin;

        const isValidDomain = !!approvedDomainList.find((d) => d === domain);
        console.info(`Domain =${domain}, valid?=${isValidDomain}`)

        if (!isValidDomain) {
            return res.status(403).json({ message: 'Unauthorized' })
        } else {
            return next();
        }
    }
}