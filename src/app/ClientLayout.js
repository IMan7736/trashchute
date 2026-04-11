'use client';

import { usePathname } from 'next/navigation';
import CheeseBg from './CheeseBg';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <>
      <CheeseBg key={pathname} />
      <div className="page-content">
        {children}
      </div>
    </>
  );
}