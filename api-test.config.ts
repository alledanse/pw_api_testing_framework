import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const processENV = process.env.TEST_ENV;
const env = processENV || 'dev';

const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'pw123456test@test.com',
  userPassword: 'Welcome123',
};

if (env === 'qa') {
  (config.userEmail = 'pw123456789test@test.com'), (config.userPassword = 'Welcome1234');
}
if (env === 'prod') {
  if (!process.env.PROD_USERNAME || !process.env.PROD_PASSWORD) {
    throw new Error(`Missing required environemnt variables`);
  }
  (config.userEmail = process.env.PROD_USERNAME), (config.userPassword = process.env.PROD_PASSWORD);
}

export { config };
