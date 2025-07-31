import { Product, ProductCategory, ProductTag } from '../types/product';

// Google Sheets CSV URL
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTx4p4UadVuqUx9ZVTnvNpHrdCV0XN1nN_HQYpmHYE4GwdQuDIT1WVl2X_hjVfocCMR9rlqZVF0V-3/pub?output=csv';

// CSV parsing helper
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  const result: string[][] = [];
  
  for (let line of lines) {
    if (line.trim()) {
      // Simple CSV parsing - handles basic cases
      const row = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
      result.push(row);
    }
  }
  
  return result;
}

// Convert spreadsheet row to Product object with detailed error handling
function rowToProduct(row: string[], headers: string[]): Product | null {
  try {
    // Enhanced field getter with better matching
    const getField = (fieldName: string): string => {
      const fieldLower = fieldName.toLowerCase();
      let index = -1;
      
      // Try exact match first
      index = headers.findIndex(h => h.toLowerCase() === fieldLower);
      
      // Try partial match if exact fails
      if (index === -1) {
        index = headers.findIndex(h => h.toLowerCase().includes(fieldLower));
      }
      
      // Try alternative field names
      if (index === -1) {
        const alternatives: { [key: string]: string[] } = {
          'name': ['product', 'title', 'product_name', 'item'],
          'price': ['cost', 'amount', 'value'],
          'image': ['images', 'photo', 'picture', 'img'],
          'category': ['cat', 'type', 'genre'],
          'shop': ['store', 'seller', 'brand'],
          'rating': ['stars', 'score', 'review'],
          'productlink': ['product link', 'product_link', 'url', 'link', 'tiktok_url', 'shop_url']
        };
        
        if (alternatives[fieldLower]) {
          for (const alt of alternatives[fieldLower]) {
            index = headers.findIndex(h => h.toLowerCase().includes(alt));
            if (index !== -1) break;
          }
        }
      }
      
      return index !== -1 ? (row[index] || '').toString().trim() : '';
    };

    const getNumberField = (fieldName: string, defaultValue: number = 0): number => {
      const value = getField(fieldName);
      if (!value) return defaultValue;
      
      // Remove any non-numeric characters except decimal point
      const cleanValue = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    // Special function for ratings that returns null if no data
    const getRatingField = (fieldName: string): number | null => {
      const value = getField(fieldName);
      if (!value || value.trim() === '') return null;
      
      // Remove any non-numeric characters except decimal point
      const cleanValue = value.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? null : parsed;
    };

    // Map common category variations to our ProductCategory enum
    const mapCategory = (category: string): ProductCategory => {
      const cat = category.toLowerCase();
      if (cat.includes('fashion') || cat.includes('clothing') || cat.includes('apparel') || cat.includes('clothes')) return 'fashion';
      if (cat.includes('accessories') || cat.includes('accessory') || cat.includes('jewelry') || cat.includes('watch') || cat.includes('bag')) return 'accessories';
      if (cat.includes('beauty') || cat.includes('skincare') || cat.includes('makeup') || cat.includes('cosmetic')) return 'beauty';
      if (cat.includes('personal care') || cat.includes('hygiene') || cat.includes('bath') || cat.includes('body care')) return 'personal care';
      if (cat.includes('health') || cat.includes('fitness') || cat.includes('wellness') || cat.includes('supplement')) return 'health';
      if (cat.includes('food') || cat.includes('snack') || cat.includes('drink') || cat.includes('nutrition')) return 'food';
      if (cat.includes('home') || cat.includes('house') || cat.includes('decor') || cat.includes('kitchen') || cat.includes('furniture')) return 'home';
      if (cat.includes('pet') || cat.includes('animal') || cat.includes('dog') || cat.includes('cat')) return 'pet';
      if (cat.includes('toy') || cat.includes('game') || cat.includes('puzzle') || cat.includes('play')) return 'toys';
      if (cat.includes('tech') || cat.includes('electronic') || cat.includes('gadget') || cat.includes('device')) return 'tech';
      return 'fashion'; // default fallback
    };

    // Parse tags from comma-separated string
    const parseTags = (tagsString: string): ProductTag[] => {
      if (!tagsString) return [];
      const tags = tagsString.toLowerCase().split(',').map(t => t.trim());
      const validTags: ProductTag[] = [];
      
      tags.forEach(tag => {
        if (tag.includes('trend')) validTags.push('trending');
        if (tag.includes('search')) validTags.push('most-searched');
        if (tag.includes('top')) validTags.push('top-product');
        if (tag.includes('deal') || tag.includes('hot')) validTags.push('hot-deal');
        if (tag.includes('new')) validTags.push('new-arrival');
      });
      
      return validTags;
    };

    // Parse image URLs from comma or semicolon separated string
    const parseImages = (imagesString: string): string[] => {
      if (!imagesString) return ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'];
      
      const images = imagesString.split(/[,;]/).map(url => url.trim()).filter(url => url);
      return images.length > 0 ? images : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'];
    };

    const name = getField('name') || getField('product') || getField('title');
    const shopName = getField('shop') || getField('store') || getField('seller') || 'TikTok Shop';
    const price = getNumberField('price', 29.99);
    
    if (!name || price === 0) {
      return null; // Skip invalid rows
    }

    const baseCommission = getNumberField('commission', 10);
    const higherCommission = getNumberField('higher') || baseCommission + 5;
    const commissionIncrease = higherCommission > baseCommission ? `+${higherCommission - baseCommission}%` : undefined;

    const product: Product = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name,
      images: parseImages(getField('image') || getField('images') || getField('photo')),
      starRating: getRatingField('rating'),
      positiveReviewPercentage: Math.round(getNumberField('reviews', 90)),
      shopRating: getRatingField('shop_rating'),
      baseCommission: baseCommission,
      higherCommission: higherCommission > baseCommission ? higherCommission : undefined,
      commissionIncrease: commissionIncrease,
      category: mapCategory(getField('category')),
      tiktokShopUrl: getField('productlink') || getField('product_link') || `https://shop.tiktok.com/product/${Date.now()}`,
      sampleRequestUrl: getField('sample') || undefined,
      tags: parseTags(getField('tags')),
      shopName: shopName,
      price: price,
      originalPrice: getNumberField('original') || undefined
    };

    return product;
  } catch (error) {
    console.error('Error parsing product row:', error);
    return null;
  }
}

// Enhanced function to fetch products from Google Sheets with detailed logging
export async function fetchProductsFromSheets(): Promise<Product[]> {
  const debugInfo = {
    url: SHEETS_URL,
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    console.log('🔄 Fetching products from Google Sheets...');
    debugInfo.steps.push('Started fetch request');
    
    const response = await fetch(SHEETS_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Cache-Control': 'no-cache'
      }
    });
    
    debugInfo.steps.push(`HTTP Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    debugInfo.steps.push(`Received CSV data: ${csvText.length} characters`);
    
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Empty CSV response received');
    }
    
    const rows = parseCSV(csvText);
    debugInfo.steps.push(`Parsed CSV into ${rows.length} rows`);
    
    if (rows.length < 2) {
      console.warn('⚠️ Not enough data in spreadsheet (need header + data rows)');
      debugInfo.steps.push('Warning: Insufficient data rows');
      return [];
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    console.log('📊 Spreadsheet headers:', headers);
    console.log('📝 Processing', dataRows.length, 'data rows');
    
    debugInfo.steps.push(`Headers: ${headers.join(', ')}`);
    debugInfo.steps.push(`Data rows to process: ${dataRows.length}`);
    
    const products: Product[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      try {
        const product = rowToProduct(dataRows[i], headers);
        if (product) {
          products.push(product);
        } else {
          errors.push(`Row ${i + 2}: Failed to parse (empty or invalid data)`);
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }
    
    debugInfo.steps.push(`Successfully parsed: ${products.length} products`);
    if (errors.length > 0) {
      debugInfo.steps.push(`Parsing errors: ${errors.length}`);
      console.warn('⚠️ Parsing errors:', errors);
    }
    
    console.log('✅ Successfully processed Google Sheets data:', {
      totalRows: dataRows.length,
      successfulProducts: products.length,
      errors: errors.length
    });
    
    return products;
    
  } catch (error) {
    debugInfo.steps.push(`ERROR: ${error.message}`);
    console.error('❌ Error fetching products from sheets:', {
      error: error.message,
      debugInfo
    });
    throw error;
  }
}

// Fallback to mock data if sheets fetch fails
export async function fetchProductsWithFallback(): Promise<Product[]> {
  try {
    const products = await fetchProductsFromSheets();
    return products.length > 0 ? products : [];
  } catch (error) {
    console.error('Failed to fetch from sheets, using empty array:', error);
    return [];
  }
}

// Debug utility functions for admin panel
export async function getSheetDebugInfo() {
  try {
    const response = await fetch(SHEETS_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    return {
      success: true,
      url: SHEETS_URL,
      status: response.status,
      statusText: response.statusText,
      dataLength: csvText.length,
      totalRows: rows.length,
      headers: rows.length > 0 ? rows[0] : [],
      sampleRow: rows.length > 1 ? rows[1] : [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url: SHEETS_URL,
      timestamp: new Date().toISOString()
    };
  }
}

export async function validateSheetStructure() {
  try {
    const response = await fetch(SHEETS_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) {
      return {
        valid: false,
        issues: ['Not enough rows (need header + data)'],
        headers: []
      };
    }
    
    const headers = rows[0];
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for essential fields
    const essentialFields = ['name', 'price'];
    const recommendedFields = ['image', 'category', 'shop', 'rating'];
    
    essentialFields.forEach(field => {
      const found = headers.some(h => h.toLowerCase().includes(field));
      if (!found) {
        issues.push(`Missing essential field: ${field}`);
      }
    });
    
    recommendedFields.forEach(field => {
      const found = headers.some(h => h.toLowerCase().includes(field));
      if (!found) {
        recommendations.push(`Consider adding field: ${field}`);
      }
    });
    
    return {
      valid: issues.length === 0,
      issues,
      recommendations,
      headers,
      totalRows: rows.length - 1
    };
    
  } catch (error) {
    return {
      valid: false,
      issues: [`Connection error: ${error.message}`],
      headers: []
    };
  }
}