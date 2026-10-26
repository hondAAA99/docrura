# Docura Server Postman Setup

This directory contains the Postman collection and environment files for testing all HTTP endpoints of the `docura_server` NestJS backend.

---

## Deliverables

1. [**`postman/collection.json`**](file:///home/mohanad/programming/side_projects/docura/docura_server/postman/collection.json): Postman Collection in v2.1 format covering all HTTP endpoints.
2. [**`postman/environment.json`**](file:///home/mohanad/programming/side_projects/docura/docura_server/postman/environment.json): Environment variables containing default connection parameters and placeholders for runtime tokens.
3. [**`postman/README.md`**](file:///home/mohanad/programming/side_projects/docura/docura_server/postman/README.md): Setup instructions, endpoint documentation, execution order, and open questions / assumptions.

---

## Overview & Architecture Discovery

Based on analysis of `src/main.ts`, `src/app.module.ts`, and controller files:
- **Global Prefix / Versioning**: None configured. Endpoints are mounted directly at `/` and `/auth`.
- **Port**: Default is `3000` (from `.env` or fallback to `8000`).
- **Response Structure**: Responses return JSON objects directly (e.g. `{ message: '...' }` or `{ accessToken: '...', refreshToken: '...' }`). There is no global response wrapper interceptor.
- **Microservices / Non-HTTP Handlers**:
  - `NotificationConsumer` in `src/module/notification/notification.controller.ts` listens to `@EventPattern(messageEventsEnum.email)` (`email`) over RabbitMQ (`Transport.RMQ`) to cache OTPs in Redis and send email notifications. This is out of scope for direct HTTP Postman testing.

---

## Endpoints Covered (13 HTTP Endpoints)

### Health / Root (`AppController`)
1. `GET /`: Health check / greeting (`Hello World!`)

### Authentication (`AuthController`)
2. `POST /auth/signup`: User registration with validation (`signUpDTO`)
3. `POST /auth/signup/confirm`: Registration OTP verification (`confirmEmailDTO`)
4. `POST /auth/login`: User login, returning `accessToken` and `refreshToken` (`signInDTO`)
5. `GET /auth/refresh`: Issues new tokens using existing refresh token in `authorization` header
6. `POST /auth/forget-password`: Initiates password reset OTP generation (`forgetPasswordDTO`)
7. `POST /auth/resend-otp`: Resends password reset OTP with Redis attempt tracking/rate-limiting
8. `POST /auth/confirm-otp`: Verifies password reset OTP and issues session tokens (`confirmEmailDTO`)
9. `GET /auth/reset-password`: Resets password using authenticated session (`resetPasswordDTO`)
10. `POST /auth/guest`: Registers an anonymous guest user account and generates guest tokens
11. `POST /auth/guest/user`: Upgrades an authenticated guest to a registered user (`registerGuestAsUserDTO`)
12. `GET /auth/google`: Initiates Google OAuth2 authentication flow (`GoogleAuthGuard`)
13. `GET /auth/google/callback`: Google OAuth2 callback endpoint (`GoogleAuthGuard`)
14. `GET /auth/logout`: Revokes single session or all sessions (using `?flag=all`)

---

## Non-HTTP Handlers Skipped

- **`NotificationConsumer.consumeEmailMessages`** (`src/module/notification/notification.controller.ts`):
  - Listens to RabbitMQ event pattern `email` (`Transport.RMQ`). It cannot be called via HTTP and is omitted from the Postman collection.

---

## Recommended Execution Order

To run through the collection with automated variable chaining:

```text
1. Health / Root -> Get Hello
2. Auth -> 1. Sign Up (creates user in database, publishes OTP event to RabbitMQ)
3. Auth -> 2. Confirm Email (enter OTP from Redis or set in environment {{otpCode}})
4. Auth -> 3. Sign In (Login) (captures {{accessToken}} and {{refreshToken}})
5. Auth -> 4. Refresh Token (rotates and updates {{accessToken}} and {{refreshToken}})
6. Auth -> 5. Forget Password (triggers reset OTP)
7. Auth -> 6. Resend OTP (tests rate limiting and OTP resend)
8. Auth -> 7. Confirm OTP (verifies reset OTP and updates session tokens)
9. Auth -> 8. Reset Password (updates user password)
10. Auth -> 9. Register Guest (captures {{guestAccessToken}} and {{guestRefreshToken}})
11. Auth -> 10. Register Guest as User (converts guest account to user)
12. Auth -> 11. Google OAuth Initiate (browser redirect)
13. Auth -> 12. Google OAuth Callback (OAuth callback)
14. Auth -> 13. Logout (Single Session) (revokes session token)
15. Auth -> 14. Logout All Sessions (cleans up and unsets session tokens)
```

---

## How to Import and Run

### In Postman
1. Open Postman.
2. Click **Import** in the top-left corner.
3. Select `postman/collection.json` and `postman/environment.json`.
4. In the top-right environment selector, choose **Docura Server Environment**.
5. Set `otpCode` in the environment if testing OTP confirmation endpoints, or run requests in order.

### Using Newman (CLI)
```bash
npx newman run postman/collection.json -e postman/environment.json
```

---

## Assumptions / Open Questions

1. **OTP Delivery & Asynchronous Message Broker**:
   - `signUp`, `registerGuestAsUser`, `forgetPassword`, and `resendOTP` publish messages to RabbitMQ (`NOTIFICATION_SERVICE`).
   - The OTP is stored in Redis under key `confirm-sign-up::<email>` for signups or `forget-password::<email>` for password resets with a TTL of 3 minutes.
   - For automated end-to-end runs in Postman/Newman without a mail reader or direct Redis hook, the `{{otpCode}}` environment variable can be set manually or populated from Redis.
2. **`tokenVerificationGuard` User Injection**:
   - In `src/common/guard/authentication/tokenVerification.guard.ts`, line 28 decodes the token into `request.decode`, but lines 29-30 have commented out the user lookup (`// request.user =`).
   - Consequently, endpoints relying on `@User() user: UserModel` (`/auth/guest/user`, `/auth/logout`, `/auth/reset-password`) expect `req.user` to be populated. If the user object is not attached by the guard, NestJS will pass `undefined` as `user`.
3. **HTTP Verb for Reset Password**:
   - `resetPassword` in `src/module/auth/auth.controller.ts` is annotated with `@Get('/reset-password')` but consumes a request body `@Body() dto: resetPasswordDTO`. The collection sends a `GET` request with a JSON body matching the controller declaration.
4. **Google OAuth Callback**:
   - Google OAuth (`/auth/google` and `/auth/google/callback`) requires an active interactive browser session or valid OAuth authorization code from Google, and will return an error or redirect if called directly without an OAuth exchange.

