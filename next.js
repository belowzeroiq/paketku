// pages/api/packages/index.js
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const packages = await db.collection('packages').find({}).toArray();
        res.status(200).json({ success: true, data: packages });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    case 'POST':
      try {
        const { trackingNumber, ownerId } = req.body;
        
        if (!trackingNumber || !ownerId) {
          return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        // Check if tracking number already exists
        const existingPackage = await db.collection('packages').findOne({ trackingNumber });
        if (existingPackage) {
          return res.status(400).json({ success: false, error: 'Tracking number already exists' });
        }
        
        const newPackage = {
          trackingNumber,
          ownerId,
          status: 'expected',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await db.collection('packages').insertOne(newPackage);
        res.status(201).json({ success: true, data: { ...newPackage, _id: result.insertedId } });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/packages/[id].js
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  const { db } = await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const package = await db.collection('packages').findOne({ _id: new ObjectId(id) });
        if (!package) {
          return res.status(404).json({ success: false, error: 'Package not found' });
        }
        res.status(200).json({ success: true, data: package });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        const updateData = { ...req.body, updatedAt: new Date() };
        const result = await db.collection('packages').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ success: false, error: 'Package not found' });
        }
        
        res.status(200).json({ success: true, message: 'Package updated successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    case 'DELETE':
      try {
        const result = await db.collection('packages').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, error: 'Package not found' });
        }
        res.status(200).json({ success: true, message: 'Package deleted successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/packages/scan.js
import { connectToDatabase } from '../../../lib/mongodb';
import { sendTelegramNotification } from '../../../lib/telegram';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { db } = await connectToDatabase();
  const { trackingNumber, boxId } = req.body;
  
  if (!trackingNumber || !boxId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  
  try {
    // Find the package with this tracking number
    const package = await db.collection('packages').findOne({ 
      trackingNumber, 
      status: 'expected' 
    });
    
    if (!package) {
      // Log failed attempt
      await db.collection('delivery_attempts').insertOne({
        trackingNumber,
        boxId,
        status: 'failed',
        reason: 'Invalid tracking number',
        timestamp: new Date()
      });
      
      // Send security alert
      const owner = await db.collection('users').findOne({ _id: package?.ownerId });
      if (owner?.telegramChatId) {
        await sendTelegramNotification(
          owner.telegramChatId,
          `🚨 *SECURITY ALERT!*\n\n❌ *Unauthorized Delivery Attempt*\n📦 *Invalid Tracking:* \`${trackingNumber}\`\n🕐 *Time:* ${new Date().toLocaleString()}\n📍 *Location:* Smart Resi Box ${boxId}\n\n⚠️ Someone tried to deliver a package that wasn't expected. Box remains locked for security.`
        );
      }
      
      return res.status(404).json({ 
        success: false, 
        error: 'Invalid tracking number',
        action: 'reject'
      });
    }
    
    // Valid package found - update status
    await db.collection('packages').updateOne(
      { _id: package._id },
      { 
        $set: { 
          status: 'delivered', 
          deliveredAt: new Date(),
          boxId: boxId
        } 
      }
    );
    
    // Log successful delivery
    await db.collection('delivery_attempts').insertOne({
      trackingNumber,
      boxId,
      packageId: package._id,
      status: 'success',
      timestamp: new Date()
    });
    
    // Get owner information for notification
    const owner = await db.collection('users').findOne({ _id: package.ownerId });
    
    // Send success notification
    if (owner?.telegramChatId) {
      await sendTelegramNotification(
        owner.telegramChatId,
        `🎉 *Package Delivered Successfully!*\n\n📦 *Tracking:* \`${trackingNumber}\`\n🕐 *Time:* ${new Date().toLocaleString()}\n📍 *Location:* Smart Resi Box ${boxId}\n\n✅ Your package has been securely delivered and the box is now locked.`
      );
    }
    
    res.status(200).json({ 
      success: true, 
      action: 'unlock',
      message: 'Package verified and box unlocked',
      package: {
        trackingNumber: package.trackingNumber,
        deliveredAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Scan processing error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// pages/api/boxes/[boxId]/status.js
import { connectToDatabase } from '../../../../lib/mongodb';

export default async function handler(req, res) {
  const { boxId } = req.query;
  const { db } = await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const box = await db.collection('boxes').findOne({ boxId });
        if (!box) {
          return res.status(404).json({ success: false, error: 'Box not found' });
        }
        res.status(200).json({ success: true, data: box });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        const { status, isLocked } = req.body;
        const updateData = {
          status,
          isLocked,
          lastUpdated: new Date()
        };
        
        const result = await db.collection('boxes').updateOne(
          { boxId },
          { $set: updateData },
          { upsert: true }
        );
        
        res.status(200).json({ success: true, message: 'Box status updated' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/users/[userId]/settings.js
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { userId } = req.query;
  const { db } = await connectToDatabase();
  
  switch (req.method) {
    case 'GET':
      try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ 
          success: true, 
          data: {
            telegramBotToken: user.telegramBotToken || '',
            telegramChatId: user.telegramChatId || '',
            notificationsEnabled: user.notificationsEnabled || false
          }
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        const { telegramBotToken, telegramChatId, notificationsEnabled } = req.body;
        
        const updateData = {
          telegramBotToken,
          telegramChatId,
          notificationsEnabled,
          updatedAt: new Date()
        };
        
        const result = await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: updateData },
          { upsert: true }
        );
        
        res.status(200).json({ success: true, message: 'Settings updated successfully' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/notifications/test.js
import { sendTelegramNotification } from '../../../lib/telegram';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user || !user.telegramChatId) {
      return res.status(400).json({ success: false, error: 'Telegram not configured for this user' });
    }
    
    const testMessage = `🧪 *Test Notification*\n\n✅ Your Smart Resi Box is working perfectly!\n🕐 *Time:* ${new Date().toLocaleString()}\n📱 *Status:* All systems operational\n\n🔧 This is a test message to verify your Telegram bot configuration.`;
    
    await sendTelegramNotification(user.telegramChatId, testMessage);
    
    res.status(200).json({ success: true, message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ success: false, error: 'Failed to send test notification' });
  }
}

// pages/api/statistics/[userId].js
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { userId } = req.query;
  
  try {
    const { db } = await connectToDatabase();
    
    // Get package statistics
    const expectedCount = await db.collection('packages').countDocuments({ 
      ownerId: new ObjectId(userId), 
      status: 'expected' 
    });
    
    const deliveredCount = await db.collection('packages').countDocuments({ 
      ownerId: new ObjectId(userId), 
      status: 'delivered' 
    });
    
    const rejectedCount = await db.collection('delivery_attempts').countDocuments({ 
      status: 'failed' 
    });
    
    // Get recent deliveries
    const recentDeliveries = await db.collection('packages').find({ 
      ownerId: new ObjectId(userId), 
      status: 'delivered' 
    }).sort({ deliveredAt: -1 }).limit(10).toArray();
    
    // Get failed attempts
    const failedAttempts = await db.collection('delivery_attempts').find({ 
      status: 'failed' 
    }).sort({ timestamp: -1 }).limit(10).toArray();
    
    res.status(200).json({
      success: true,
      data: {
        expectedCount,
        deliveredCount,
        rejectedCount,
        recentDeliveries,
        failedAttempts
      }
    });
    
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}

// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('smart_resi_box');
  return { client, db };
}

// lib/telegram.js
import axios from 'axios';

export async function sendTelegramNotification(chatId, message, botToken = null) {
  try {
    // Use provided bot token or get from environment
    const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      throw new Error('Telegram bot token not configured');
    }
    
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    
    if (response.data.ok) {
      console.log('Telegram notification sent successfully');
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data.description || 'Failed to send notification');
    }
    
  } catch (error) {
    console.error('Telegram notification error:', error.message);
    throw error;
  }
}

export async function sendTelegramNotificationWithUserToken(chatId, message, userBotToken) {
  return sendTelegramNotification(chatId, message, userBotToken);
}

// middleware/auth.js
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// package.json dependencies to add:
/*
{
  "dependencies": {
    "mongodb": "^5.7.0",
    "axios": "^1.4.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
*/

// .env.local example:
/*
MONGODB_URI=mongodb://localhost:27017/smart_resi_box
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_resi_box

TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
JWT_SECRET=your_jwt_secret_here_should_be_very_long_and_random
NEXTAUTH_URL=http://localhost:3000
*/
