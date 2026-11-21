'use client';

import { useAtom } from 'jotai';
import { demoModalOpenAtom, demoModalPreselectedAtom } from '@/store/atoms';

export function useDemoModal() {
  const [open, setOpen] = useAtom(demoModalOpenAtom);
  const [preselected, setPreselected] = useAtom(demoModalPreselectedAtom);

  const openModal = (preselectedIds?: string[]) => {
    if (preselectedIds && preselectedIds.length) setPreselected(preselectedIds);
    else setPreselected([]);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    // keep preselected until next open? clear after animation
    setTimeout(() => setPreselected([]), 300);
  };

  return { open, preselected, openModal, closeModal, setOpen };
}
