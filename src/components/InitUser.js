'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function InitUser() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncUser = async () => {
      try {
        await fetch('/api/users', {
          method: 'POST',
        });
      } catch (error) {
        console.error('User sync failed:', error);
      }
    };

    syncUser();
  }, [isSignedIn]);

  return null;
}
