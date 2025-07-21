const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary'); // ✅ FIXED
const streamifier = require('streamifier');

// POST /api/upload-profile
router.post('/upload-profile', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const uploadFromBuffer = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'employee-profiles',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer(req.file.buffer);
    res.status(200).json({ url: result.secure_url });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

module.exports = router;
