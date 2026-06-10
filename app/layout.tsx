//app\layout.tsx

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
