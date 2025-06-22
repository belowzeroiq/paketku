import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use server-side environment variables as fallback
    const botToken = req.body.botToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = req.body.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('Missing Telegram configuration');
    }

    // Here you would actually call the Telegram API
    // For now we'll just simulate success
    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}