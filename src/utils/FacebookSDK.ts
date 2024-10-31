import { useEffect } from 'react';

export const useFacebookSDK = () => {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB?.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };

    // Load Facebook SDK if not already loaded
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById('facebook-jssdk');
      if (script) {
        script.remove();
      }
    };
  }, []);
}; 