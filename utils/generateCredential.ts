import * as dotenv from 'dotenv';

// Load environment variables from `.env.local`
dotenv.config({ path: '.env.local' });

export const getServiceAccount = (): string => {
  // Create a service account object from environment variables
  const token = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'), // Correctly format private key with newlines
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  };

  return JSON.stringify(token)
};

