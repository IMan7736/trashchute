import CheeseBg from './CheeseBg';
import './globals.css';

export const metadata = {
  title: 'TrashChute',
  description: 'Do whatever you\'d like',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="cheese-bg" id="cheese-bg" />
        <CheeseBg />
        <div className="page-content">
          {children}
        </div>
      </body>
    </html>
  );
}