

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);
  const hasScannedRef = useRef(false); // ✅ Track scan state

  useEffect(() => {
    // Prevent multiple scanner instances
    if (scannerRef.current || hasScannedRef.current) {
      return;
    }

    const startScanner = async () => {
      try {
        const config = { fps: 10, qrbox: 250 };
        const cameraId = { facingMode: "environment" };

        scannerRef.current = new Html5Qrcode("qr-reader");
        console.log("QR Code Scanner initialized");

        await scannerRef.current.start(
          cameraId,
          config,
          (decodedText) => {
            if (hasScannedRef.current) {
              return; // ✅ Prevent repeated scans
            }

            console.log("QR Code Scanned:", decodedText);
            hasScannedRef.current = true; // ✅ Mark as scanned

            // ✅ Store in localStorage **without removing it**
            if (!localStorage.getItem("hubId")) {
              localStorage.setItem("hubId", decodedText);
            }

            navigate("/Hub-details", { state: { fromScanner: true } });
          },
          (error) => {
            if (typeof error === "string" && error.includes("NotFoundException")) {
              return; // Ignore NotFoundException errors
            }
            console.error("QR Scan Error:", error);
          }
        );

        isScanningRef.current = true;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            console.log("Scanner stopped successfully.");
            isScanningRef.current = false;
            scannerRef.current = null;
          })
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [navigate]);

  // ✅ Prevent redirection loop
  useEffect(() => {
    if (location.state?.fromScanner) {
      navigate(".", { replace: true, state: {} }); // Remove state after navigation
    }
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "16px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            Scan QR Code
          </h2>
          <div id="qr-reader" style={{ width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
}
