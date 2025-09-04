import './globals.css';


export const metadata = {
  title: "Lifewood Data Technology",
  description: "Always On Never Off",
  icons: {
    icon: '/title_logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/title_logo.png" />
      </head>
      {/* REVERT: The body tag should be clean */}
      <body>{children}</body>
    </html>
  );
}