import { MoralisNextApi } from '@moralisweb3/next';

if (!process.env.MORALIS_API_KEY) throw new Error("Missing API key");
if (!process.env.NEXTAUTH_URL) throw new Error("Missing URL");

export default MoralisNextApi({
    apiKey: process.env.MORALIS_API_KEY,
    authentication: {
        domain: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).host : '',
        uri: process.env.NEXTAUTH_URL,
        timeout: 120,
    },
});