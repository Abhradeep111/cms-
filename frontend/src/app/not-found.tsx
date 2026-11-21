import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-slate-700">Page Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested admin page does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
