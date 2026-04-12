'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CheeseBg from './CheeseBg';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideBg = pathname === '/tools/pomodoro';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {!hideBg && <CheeseBg key={pathname} />}
      <div className="page-content">
        {children}
      </div>
    </>
  );
}