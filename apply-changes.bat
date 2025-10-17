@echo off
echo Applying database changes...
npx prisma generate
npx prisma db push --force-reset

echo Copying updated files...
copy /Y src\app\api\orders\route.new.ts src\app\api\orders\route.ts
copy /Y src\lib\auth-config.new.ts src\lib\auth-config.ts
copy /Y src\app\api\auth\[...nextauth]\route.ts.new src\app\api\auth\[...nextauth]\route.ts

echo Setup complete! Please restart your development server with: npm run dev
