import { useEffect, useState } from 'react';
import { startChat } from '@/api/chatApi';

const ChatBotPage = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await startChat();
        setData(result);
      } catch (err: any) {
        setError(err?.message || 'Error fetching data');
      }
    })();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>;
};

export default ChatBotPage;
