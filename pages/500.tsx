// app/500/page.tsx
export default function Error500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-red-600">500</h1>
      <p className="text-xl mt-4 text-gray-600">
        Oops! Something went wrong. Please try again later.
      </p>
    </div>
  );
}
