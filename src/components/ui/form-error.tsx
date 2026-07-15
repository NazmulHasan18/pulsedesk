export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-danger">
      {message}
    </p>
  );
}
