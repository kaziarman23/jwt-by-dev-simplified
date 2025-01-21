## JWT ~ JSON_WEB_TOKEN

## Middleware Setup | (PART ONE)

Purpose: Prepares the application to handle requests.
Steps:

1. `dotenv`: Loads environment variables (`ACCESS_TOKEN`).
2. `cors`: Enables Cross-Origin Resource Sharing (useful for frontend-backend communication).
3. `express.json()`: Parses incoming JSON payloads in the request body.
4. `cookie-parser`: Parses cookies from the `Cookie` header and attaches them to `req.cookies`.

---

## Login Route | (PART TWO)

Purpose: Generates and returns a JWT token for a user.
Steps:

1. Extracts the `username` from the request body.
2. Creates a `user` object with the username (e.g., `{ name: username }`).
3. Signs the user object with a secret key (`process.env.ACCESS_TOKEN`) to generate a JWT token with a 1-hour expiration time.
4. Sends the token as an HTTP-only cookie using `res.cookie()`:
   - `httpOnly`: Prevents client-side JavaScript access.
   - `maxAge`: Sets the cookie's lifespan to 1 hour.
   - `sameSite`: Protects against CSRF attacks.
5. Responds with:
   - The token in the JSON payload.
   - A success message.

---

## Custom Authentication Middleware | (PART THREE)

Purpose: Protect routes by requiring a valid JWT token.
Steps:

1. Extracts the token from `req.cookies.token`.
2. If no token is found, responds with `401 Unauthorized` and an error message.
3. Verifies the token using `jwt.verify` with the secret key from `process.env.ACCESS_TOKEN`.
4. Handles errors:
   - If the token is expired, responds with `403 Forbidden` and "Token expired."
   - If the token is invalid, responds with `403 Forbidden` and "Token is invalid."
5. If the token is valid:
   - Decodes the token payload (e.g., `{ name: username }`).
   - Sets `req.user` to the payload.
   - Calls `next()` to proceed to the protected route.

---

## Protected Route | (PART FOUR)

Purpose: Returns posts that belong to the authenticated user.
Steps:

1. Protects the route using the `authintication` middleware.
2. Accesses the authenticated user’s `name` from `req.user.name`.
3. Filters posts to include only those where `post.username` matches the authenticated user's name.
4. Responds with the filtered posts as a JSON payload.

---
