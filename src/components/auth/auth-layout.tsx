import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
  className?: string;
};

export function AuthLayout({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
  className,
}: AuthLayoutProps) {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {footerText}{' '}
            <Link 
              href={footerLink} 
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
