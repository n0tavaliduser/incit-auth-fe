interface Window {
  google?: {
    accounts?: {
      oauth2?: any;
    };
  };
  FB?: {
    init(params: {
      appId: string;
      cookie?: boolean;
      xfbml?: boolean;
      version: string;
    }): void;
    login(
      callback: (response: {
        authResponse?: {
          accessToken: string;
          userID: string;
        };
        status: string;
      }) => void,
      params: { scope: string }
    ): void;
  };
  fbAsyncInit?: () => void;
} 