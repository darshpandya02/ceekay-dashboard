import express from 'express';
import { prisma } from '../index';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get available years
router.get('/years', async (req: AuthRequest, res) => {
  try {
    const years = await prisma.salesData.findMany({
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'desc' }
    });

    res.json({
      success: true,
      years: years.map(y => y.year)
    });
  } catch (error) {
    logger.error('Get years error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard data for specific year
router.get('/:year', async (req: AuthRequest, res) => {
  try {
    const year = parseInt(req.params.year);

    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }

    // Get all sales data for the year
    const salesData = await prisma.salesData.findMany({
      where: { year },
      orderBy: { salesAmount: 'desc' }
    });

    if (salesData.length === 0) {
      return res.json({
        success: true,
        year,
        data: {
          totalRevenue: 0,
          totalProducts: 0,
          totalCategories: 0,
          topProducts: [],
          topCategories: [],
          monthlyTrend: [],
          categoryBreakdown: []
        }
      });
    }

    // Calculate KPIs
    const totalRevenue = salesData.reduce((sum, item) => sum + Number(item.salesAmount), 0);
    const totalProducts = new Set(salesData.map(item => item.productName)).size;
    const totalCategories = new Set(salesData.map(item => item.category)).size;

    // Top 5 products by revenue
    const productRevenue = salesData.reduce((acc, item) => {
      const product = item.productName;
      acc[product] = (acc[product] || 0) + Number(item.salesAmount);
      return acc;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(productRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));

    // Top 5 categories by revenue
    const categoryRevenue = salesData.reduce((acc, item) => {
      const category = item.category ?? 'Uncategorized';
      acc[category] = (acc[category] || 0) + Number(item.salesAmount);
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));

    // Monthly trend
    const monthlyData = salesData.reduce((acc, item) => {
      const month = item.month;
      acc[month] = (acc[month] || 0) + Number(item.salesAmount);
      return acc;
    }, {} as Record<number, number>);

    const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: monthlyData[i + 1] || 0
    }));

    // Category breakdown for pie chart
    const categoryBreakdown = Object.entries(categoryRevenue)
      .map(([name, revenue]) => ({
        name,
        value: revenue,
        percentage: (revenue / totalRevenue) * 100
      }))
      .sort((a, b) => b.value - a.value);

    // Calculate inventory turnover (simplified)
    const inventoryTurnover = salesData.reduce((acc, item) => {
      const product = item.productName;
      if (!acc[product]) {
        acc[product] = { totalSales: 0, avgStock: 0, count: 0 };
      }
      acc[product].totalSales += Number(item.salesAmount);
      acc[product].count += 1;
      return acc;
    }, {} as Record<string, any>);

    const turnoverData = Object.entries(inventoryTurnover)
      .map(([product, data]) => ({
        product,
        turnover: data.count > 0 ? data.totalSales / data.count : 0
      }))
      .sort((a, b) => b.turnover - a.turnover)
      .slice(0, 10);

    res.json({
      success: true,
      year,
      data: {
        totalRevenue,
        totalProducts,
        totalCategories,
        topProducts,
        topCategories,
        monthlyTrend,
        categoryBreakdown,
        turnoverData
      }
    });
  } catch (error) {
    logger.error('Get dashboard data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product details
router.get('/:year/products/:productName', async (req: AuthRequest, res) => {
  try {
    const year = parseInt(req.params.year);
    const productName = decodeURIComponent(req.params.productName);

    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year parameter' });
    }

    const productData = await prisma.salesData.findMany({
      where: {
        year,
        productName
      },
      orderBy: { month: 'asc' }
    });

    if (productData.length === 0) {
      return res.status(404).json({ error: 'Product not found for this year' });
    }

    const totalRevenue = productData.reduce((sum, item) => sum + Number(item.salesAmount), 0);
    const monthlyData = productData.map(item => ({
      month: item.month,
      revenue: Number(item.salesAmount),
      quantity: item.quantity ? Number(item.quantity) : null,
      unitPrice: item.unitPrice ? Number(item.unitPrice) : null
    }));

    res.json({
      success: true,
      product: {
        name: productName,
        year,
        totalRevenue,
        monthlyData,
        category: productData[0].category
      }
    });
  } catch (error) {
    logger.error('Get product details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
