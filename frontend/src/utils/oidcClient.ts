import { env } from './env';

// OAuth 提供商类型
export type OAuthProvider = 'google' | 'facebook' | 'linkedin';

// OAuth 配置
const oauthConfigs = {
  google: {
    authUrl: `${env.VITE_GOOGLE_AUTHORITY}/o/oauth2/v2/auth`,
    clientId: env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: env.VITE_GOOGLE_REDIRECT_URI,
    scope: env.VITE_OAUTH_SCOPE,
    extraParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  },
  facebook: {
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    clientId: env.VITE_FACEBOOK_CLIENT_ID || 'placeholder',
    redirectUri: env.VITE_FACEBOOK_REDIRECT_URI || 'placeholder',
    scope: env.VITE_OAUTH_SCOPE || 'email',
    extraParams: {}
  },
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    clientId: env.VITE_LINKEDIN_CLIENT_ID || 'placeholder',
    redirectUri: env.VITE_LINKEDIN_REDIRECT_URI || 'placeholder',
    scope: env.VITE_OAUTH_SCOPE,
    extraParams: {}
  },
};

// 构建 OAuth URL
const buildOAuthUrl = (provider: OAuthProvider) => {
  const config = oauthConfigs[provider];
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    ...config.extraParams,
  });

  return `${config.authUrl}?${params.toString()}`;
};

export function signIn(provider: OAuthProvider = 'google') {
  const config = oauthConfigs[provider];
  
  // 检查配置是否完整（避免使用占位符）
  if (config.clientId === 'placeholder') {
    console.error(`${provider} OAuth not configured`);
    alert(`${provider} login is not configured yet`);
    return;
  }
  
  const authUrl = buildOAuthUrl(provider);
  window.location.href = authUrl;
}
