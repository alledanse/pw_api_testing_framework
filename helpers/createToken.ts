import { request } from '@playwright/test';
import { config } from '../api-test.config';
import { APILogger } from '../utils/logger';
import { RequestHandler } from '../utils/requestHandler';

export async function createToken(email: string, password: string) {
  const context = await request.newContext();
  const logger = new APILogger();
  const api = new RequestHandler(context, config.apiUrl, logger);

  try {
    const tokenResponse = await api
      .path('/users/login')
      .body({
        user: {
          email: email,
          password: password,
        },
      })
      .postRequest(200);
    return `Token ${tokenResponse.user.token}`;
  } catch (error) {
    if (error instanceof Error) {
      Error.captureStackTrace(error, createToken);
      throw error;
    } else {
      const err = new Error(String(error));
      Error.captureStackTrace(err, createToken);
      throw err;
    }
  } finally {
    await context.dispose();
  }
}
