const processENV = process.env.TEST_ENV;
const env = processENV || 'dev';

const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'pw123456test@test.com',
  userPassword: 'Welcome123',
};

if (env === 'qa') {
  (config.userEmail = 'pw123456test@test.com'), (config.userPassword = 'Welcome123');
}
if (env === 'prod') {
  (config.userEmail = 'pw123456789test@test.com'), (config.userPassword = 'Welcome1234');
}

export { config };
