
## Username constrains
Username validation is done in [resolvers.ts](https://git.cs.sun.ac.za/Computer-Science/rw334/2023_sem2/project2/25201247/-/blob/main/backend/src/resolvers.ts)
- Usernames may not contain whitespace
  - Motivation: user expectations
- Usernames may not contain @ symbols
  - Motivation: To allow the user to sign in using either a username or email, a username cannot be look like to an email. Furthermore, if this were allowed, a user with email x@example.com could sign up for an account with the username g@example.com (not their email).