// @/app/(pages)/dashboard/reports/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:max-w-[86rem] max-w-[100dvw] overflow-clip overflow-y-auto p-4">
      {children}
    </div>
  );
}
