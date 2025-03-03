import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-secondary text-gray-900 dark:text-gray-100">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-lg">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        href="/"
        className="mt-5 px-6 py-2 bg-black text-white rounded-lg transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
