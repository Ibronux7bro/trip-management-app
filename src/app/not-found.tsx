import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-gray-800">
      <div className="max-w-md text-center bg-card shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-violet-400 mb-4">
          404 - Not Found
        </h2>
        <p className="text-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <p className="inline-block px-6 py-3 text-gray-50 bg-gradient-to-r from-[hsl(var(--gradient-purple-start))] to-[hsl(var(--gradient-purple-end))] rounded-md shadow-sidebar-menu-shadow transition">
            Return to Dashboard
          </p>
        </Link>
      </div>
    </div>
  );
}
