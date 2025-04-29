// app/components/QRCodeClient.jsx
"use client";

import QRCode from "react-qr-code";

export default function QRCodeClient({ value }) {
  return (
    <div className="bg-white p-4 rounded-xl inline-block">
      <QRCode value={value} />
    </div>
  );
}
