import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import path from 'path';
import { Readable } from 'stream';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Keep uploads in memory: serverless disks are ephemeral
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Upload CSV file
router.post('/', upload.single('csvFile'), [
  body('year').isInt({ min: 2020, max: 2030 }),
], async (req: AuthRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' });
    }

    const { year } = req.body;
    const fileBuffer = req.file.buffer;

    // Parse CSV file
    const salesData: any[] = [];
    const parseErrors: string[] = [];

    await new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Validate required fields
            if (!row['Product Name'] || !row['Sales Amount']) {
              parseErrors.push(`Row missing required fields: ${JSON.stringify(row)}`);
              return;
            }

            const salesRecord = {
              productName: row['Product Name'].trim(),
              category: row['Category']?.trim() || 'Uncategorized',
              salesAmount: parseFloat(row['Sales Amount']) || 0,
              month: parseInt(row['Month']) || 1,
              year: parseInt(year),
              quantity: row['Quantity'] ? parseFloat(row['Quantity']) : null,
              unitPrice: row['Unit Price'] ? parseFloat(row['Unit Price']) : null,
            };

            if (salesRecord.salesAmount > 0) {
              salesData.push(salesRecord);
            }
          } catch (error) {
            parseErrors.push(`Error parsing row: ${error}`);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (salesData.length === 0) {
      return res.status(400).json({ 
        error: 'No valid sales data found in CSV file',
        details: parseErrors
      });
    }

    // Delete existing data for the year
    await prisma.salesData.deleteMany({
      where: { year: parseInt(year) }
    });

    // Insert new data in batches
    const batchSize = 1000;
    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize);
      await prisma.salesData.createMany({
        data: batch
      });
    }

    // Log upload
    await prisma.uploadLog.create({
      data: {
        fileName: req.file.originalname,
        year: parseInt(year),
        recordCount: salesData.length,
        uploadedBy: req.user!.id,
        status: 'completed'
      }
    });

    logger.info(`CSV uploaded successfully: ${salesData.length} records for year ${year} by ${req.user?.email}`);

    res.json({
      success: true,
      message: `Successfully uploaded ${salesData.length} sales records for year ${year}`,
      recordCount: salesData.length,
      errors: parseErrors.length > 0 ? parseErrors : undefined
    });
  } catch (error) {
    logger.error('Upload error:', error);
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upload history
router.get('/history', async (req: AuthRequest, res) => {
  try {
    const uploads = await prisma.uploadLog.findMany({
      orderBy: { uploadedAt: 'desc' },
      take: 20
    });

    res.json({
      success: true,
      uploads
    });
  } catch (error) {
    logger.error('Get upload history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
