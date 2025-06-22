import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use server-side environment variables as fallback
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('Missing Telegram configuration');
    }

    // Here you would actually call the Telegram API
    // For now we'll just simulate success
    return res.status(200).json({ message: 'Success' });

  } catch (error) {
    let errorMessage = 'Failed to send Telegram notification';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ message: errorMessage });
  }
}