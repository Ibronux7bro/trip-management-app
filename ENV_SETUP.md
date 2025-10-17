# Environment Variables Setup

Create a `.env` or `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database Configuration
DATABASE_URL=file:./prisma/dev.db
```

## Generate NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or in Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Important Notes

1. Never commit `.env` files to version control
2. Change the `NEXTAUTH_SECRET` in production
3. Update `NEXTAUTH_URL` to match your production domain
