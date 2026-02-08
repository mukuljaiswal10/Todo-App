import "./globals.css";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: "Pro Todo — Premium workspace",
    template: "%s — Pro Todo",
  },
  description: "Advanced Pro Todo app to manage tasks like a pro.",
  openGraph: {
    title: "Pro Todo — Premium workspace",
    description: "Advanced Pro Todo app to manage tasks like a pro.",
    url: "/",
    siteName: "Pro Todo",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Pro Todo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Todo — Premium workspace",
    description: "Advanced Pro Todo app to manage tasks like a pro.",
    images: ["/twitter-image"],
  },
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