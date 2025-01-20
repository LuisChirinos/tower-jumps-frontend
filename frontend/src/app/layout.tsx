import "./globals.css";

export const metadata = {
  title: "Location Tracker",
  description:
    "Analyze and visualize location data with confidence levels, powered by Next.js and Python.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
