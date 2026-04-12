'use client';

import { usePathname } from 'next/navigation';
import CheeseBg from './CheeseBg';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideBg = pathname.startsWith('/tools/');

  return (
    <>
      {!hideBg && <CheeseBg key={pathname} />}
      <div className="page-content">
        {children}
      </div>
    </>
  );
}