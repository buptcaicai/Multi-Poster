A next.js based simple poster with jwt token authentication.

Note: Nextjs middleware is weak due to edge runtime. Things previously done in middleware in express.js cannot be put there.
NextAuth callbacks cannot manipulate cookies. It's interesting if you intend to do everything with server actions rather than rest APIs.

