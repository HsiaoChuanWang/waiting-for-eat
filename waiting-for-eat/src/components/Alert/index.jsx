import { Toaster } from "react-hot-toast";

function Alert() {
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 1000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#fff",
              border: "1px solid #ff6e06",
              color: "#ff6e06",
            },
            iconTheme: {
              primary: "#ff850e",
              secondary: "#fff",
            },
          },
          error: {
            duration: 2000,
            style: {
              background: "#fff",
              border: "1px solid #ff4b4b",
              color: "#ff4b4b",
            },
          },
        }}
      />
    </>
  );
}

export default Alert;
