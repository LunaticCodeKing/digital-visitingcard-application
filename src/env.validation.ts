import * as Joi from '@hapi/joi';

export const EnvSchemaValidator = Joi.object({
    NODE_ENV: Joi.string().valid('local', 'development', 'staging', 'production').default('local'),
    PORT: Joi.number().default(3001),
    MONGODB_URL: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRY: Joi.string().default('15m'),
    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
    AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),  
    ADMIN_FRONTEND_URL: Joi.string().required(),
    ADMIN_MAIL_TO: Joi.string().required(),
    DEFAULT_MAIL_FROM: Joi.string().required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.string().required(),
    SMTP_SECURE: Joi.boolean().required(),
    SMTP_USERNAME: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
})