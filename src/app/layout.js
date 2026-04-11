import ClientLayout from './ClientLayout.js';
import './globals.css';

export const metadata = {
  title: 'TrashChute',
  description: "Do whatever you'd like",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}