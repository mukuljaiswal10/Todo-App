import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Pro Todo",
  description: "Advanced Pro Todo App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}