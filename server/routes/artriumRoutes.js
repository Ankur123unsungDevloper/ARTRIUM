// routes/artriumRoutes.js

import express from 'express';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate image
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Generate image from OpenAI API
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    // Check if response is correct
    if (aiResponse.data && aiResponse.data.length > 0) {
      const image = aiResponse.data[0].b64_json;
      console.log('Generated image base64:', image);  // Log the generated base64 string
      res.status(200).json({ photo: image });
    } else {
      res.status(500).json({ message: 'No image generated' });
    }
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({
      message: error?.message || 'Something went wrong with image generation',
    });
  }
});

export default router;
