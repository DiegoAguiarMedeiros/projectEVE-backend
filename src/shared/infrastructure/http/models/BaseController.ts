
import * as express from 'express'
import { MESSAGES } from '../../../constants/messages';

export abstract class BaseController {

  protected abstract executeImpl(req: express.Request, res: express.Response): Promise<void | any>;

  public async execute(req: express.Request, res: express.Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      console.error(`[BaseController]: Uncaught controller error`);
      console.error(err);
      this.fail(res, 'An unexpected error occurred')
    }
  }

  public static jsonResponse(res: express.Response, code: number, message: string) {
    return res.status(code).json({ message })
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: express.Response) {
    return res.sendStatus(201);
  }

  public clientError(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 400, message ? message : MESSAGES.ERRORS.UNAUTHORIZED);
  }

  public unauthorized(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 401, message ? message : MESSAGES.ERRORS.UNAUTHORIZED);
  }

  public paymentRequired(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 402, message ? message : MESSAGES.ERRORS.PAYMENT_REQUIRED);
  }

  public forbidden(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 403, message ? message : MESSAGES.ERRORS.FORBIDDEN);
  }

  public notFound(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message ? message : MESSAGES.ERRORS.NOT_FOUND);
  }

  public conflict(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 409, message ? message : MESSAGES.ERRORS.CONFLICT);
  }

  public unprocessable(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 422, message ? message : 'Unprocessable entity');
  }

  public tooMany(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 429, message ? message : MESSAGES.ERRORS.TOO_MANY_REQUESTS);
  }

  public todo(res: express.Response) {
    return BaseController.jsonResponse(res, 400, 'TODO');
  }

  public fail(res: express.Response, error: Error | string | any) {
    console.error(error);
    const message =
      typeof error === 'string'
        ? error
        : error?.message ?? error?.toString() ?? 'An unexpected error occurred';
    return res.status(500).json({ message })
  }
}