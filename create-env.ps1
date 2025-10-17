$envContent = @"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production-min-32-chars-long
DATABASE_URL=file:./prisma/dev.db
"@

$envContent | Out-File -FilePath ".env.local" -Encoding utf8 -NoNewline
Write-Host "Created .env.local file successfully!"
