/* eslint-disable react/prop-types */
function ErrorState({ message = "資料載入失敗，請稍後再試。" }) {
  return (
    <div
      role="alert"
      className="min-h-52 flex w-full items-center justify-center px-6 text-center text-lg font-bold text-red-600"
    >
      {message}
    </div>
  );
}

export default ErrorState;
