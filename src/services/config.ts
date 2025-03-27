export const checkConfig = () => {
  const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
  console.log('Environment check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    nodeEnv: process.env.NODE_ENV
  });
  return !!apiKey;
}; 