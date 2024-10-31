import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function GoogleCallback() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      window.opener.postMessage(
        { type: 'google-auth', code },
        window.location.origin
      );
      window.close();
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing Google Sign-In...</p>
    </div>
  );
} 