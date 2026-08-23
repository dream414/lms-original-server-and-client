const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 w-full rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
};

export default ErrorMessage;