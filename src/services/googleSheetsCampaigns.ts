import { Campaign, ProductCategory } from '../types/product';

// Google Sheets CSV URL for Campaigns
const CAMPAIGNS_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXwT5WKsZki1qfjygvnKvJhbJDNciveomj5PSYNJ_8ASHz9nx6uLdkANuGo9k29EzuV-kGKMTCmUqC/pub?output=csv';

// Enhanced CSV parsing helper
function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n');
  const result: string[][] = [];
  
  for (let line of lines) {
    if (line.trim()) {
      // Enhanced CSV parsing that handles quoted fields with commas
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last field
      row.push(current.trim());
      
      // Clean up quotes from fields
      const cleanRow = row.map(field => field.replace(/^"|"$/g, ''));
      result.push(cleanRow);
    }
  }
  
  return result;
}

// Convert spreadsheet row to Campaign object
function rowToCampaign(row: string[], headers: string[]): Campaign | null {
  try {
    // Enhanced field getter with better matching
    const getField = (fieldName: string): string => {
      const fieldLower = fieldName.toLowerCase();
      let index = -1;
      
      if (fieldName === 'bannerimage' || fieldName === 'commission') {
        console.log(`🔍 getField("${fieldName}") - looking for field: "${fieldLower}"`);
      }
      
      // Try exact match first (including spaces)
      index = headers.findIndex(h => h.toLowerCase().trim() === fieldLower);
      
      if (fieldName === 'bannerimage' || fieldName === 'commission') {
        console.log(`🔍 Exact match attempt: ${index >= 0 ? `FOUND at index ${index}` : 'NOT FOUND'}`);
      }
      
      // Try exact match without spaces
      if (index === -1) {
        const fieldNoSpaces = fieldLower.replace(/\s+/g, '');
        index = headers.findIndex(h => h.toLowerCase().replace(/\s+/g, '') === fieldNoSpaces);
        
        if (fieldName === 'bannerimage' || fieldName === 'commission') {
          console.log(`🔍 No-spaces match attempt: ${index >= 0 ? `FOUND at index ${index}` : 'NOT FOUND'}`);
        }
      }
      
      // Try partial match if exact fails
      if (index === -1) {
        index = headers.findIndex(h => h.toLowerCase().includes(fieldLower));
        
        if (fieldName === 'bannerimage' || fieldName === 'commission') {
          console.log(`🔍 Partial match attempt: ${index >= 0 ? `FOUND at index ${index}` : 'NOT FOUND'}`);
        }
      }
      
      // Try alternative field names
      if (index === -1) {
        const alternatives: { [key: string]: string[] } = {
          'title': ['name', 'campaign_name', 'campaign_title'],
          'description': ['desc', 'details', 'info'],
          'sellername': ['seller', 'brand', 'company', 'partner'],
          'sellerlogo': ['logo', 'brand_logo', 'seller_image'],
          'bannerimage': ['banner url', 'banner_url', 'bannerurl', 'banner', 'header_image', 'campaign_image', 'bannerimage', 'banner image', 'campaign banner', 'header url', 'headerurl'],
          'productimage': ['image url', 'imageurl', 'image_url', 'product_image', 'product_photo', 'productimage'],
          'commission': ['commission', 'your commission', 'your_commission', 'total_commission', 'max_commission', 'rate'],
          'rating': ['product_rating', 'average_rating', 'avg_rating', 'score'],
          'category': ['cat', 'type'],
          'active': ['is_active', 'status', 'live'],
          'startdate': ['start', 'launch_date', 'begin_date'],
          'enddate': ['end', 'finish_date', 'expiry', 'campaign_end_date'],
          'campaignlink': ['campaign_link', 'link', 'url', 'join_url'],
          'offers': ['special_offers', 'benefits', 'perks'],
          'requirements': ['req', 'requirement', 'criteria'],
          'paymentterms': ['payment', 'terms', 'payout'],
          'producttypes': ['products', 'product_type', 'items'],
          'targetaudience': ['audience', 'target', 'demographic'],
          'contentguidelines': ['guidelines', 'content_rules', 'instructions'],
          'bonuscommission': ['bonus', 'extra_commission', 'incentive'],
          'applicationdeadline': ['deadline', 'apply_by', 'cutoff'],
          'expecteddeliverables': ['deliverables', 'output', 'content_required'],
          'campaignbudget': ['budget', 'spend', 'investment'],
          'exclusivityterms': ['exclusivity', 'exclusive', 'non_compete'],
          'performancemetrics': ['metrics', 'kpi', 'goals'],
          'contactemail': ['contact', 'email', 'support'],
          'additionalnotes': ['notes', 'additional_info', 'misc']
        };
        
        if (alternatives[fieldLower]) {
          if (fieldName === 'bannerimage' || fieldName === 'commission') {
            console.log(`🔍 Trying alternatives for ${fieldName}:`, alternatives[fieldLower]);
          }
          
          for (const alt of alternatives[fieldLower]) {
            index = headers.findIndex(h => h.toLowerCase().includes(alt));
            
            if (fieldName === 'bannerimage' || fieldName === 'commission') {
              console.log(`🔍 Alternative "${alt}" search: ${index >= 0 ? `FOUND at index ${index} (${headers[index]})` : 'NOT FOUND'}`);
            }
            
            if (index !== -1) break;
          }
        }
      }
      
      return index !== -1 ? (row[index] || '').toString().trim() : '';
    };

    const getNumberField = (fieldName: string, defaultValue: number = 0): number => {
      const value = getField(fieldName);
      if (!value || value.trim() === '') return defaultValue;
      
      // Remove any non-numeric characters except decimal point and percentage
      const cleanValue = value.replace(/[^\d.%-]/g, '');
      
      // Handle percentage values
      if (cleanValue.includes('%')) {
        const numericValue = cleanValue.replace('%', '');
        const parsed = parseFloat(numericValue);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? defaultValue : parsed;
    };

    const getBooleanField = (fieldName: string, defaultValue: boolean = true): boolean => {
      const value = getField(fieldName);
      if (!value || value.trim() === '') {
        return defaultValue; // Default to active if no status specified
      }
      const lowerValue = value.toLowerCase();
      return lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes' || lowerValue === 'active' || lowerValue === 'live';
    };

    // Map category to ProductCategory enum
    const mapCategory = (category: string): ProductCategory => {
      const cat = category.toLowerCase();
      if (cat.includes('beauty') || cat.includes('skincare') || cat.includes('makeup')) return 'beauty';
      if (cat.includes('fashion') || cat.includes('clothing') || cat.includes('apparel')) return 'fashion';
      if (cat.includes('tech') || cat.includes('electronic') || cat.includes('gadget')) return 'tech';
      if (cat.includes('health') || cat.includes('fitness') || cat.includes('wellness')) return 'health';
      if (cat.includes('home') || cat.includes('house') || cat.includes('decor')) return 'home';
      if (cat.includes('sport') || cat.includes('outdoor')) return 'sports';
      if (cat.includes('pet') || cat.includes('animal')) return 'pets';
      if (cat.includes('food') || cat.includes('snack') || cat.includes('drink')) return 'food';
      if (cat.includes('toy') || cat.includes('game')) return 'toys';
      if (cat.includes('auto') || cat.includes('car')) return 'automotive';
      return 'beauty'; // default fallback
    };

    // Parse special offers from comma-separated string
    const parseSpecialOffers = (offersString: string): string[] => {
      if (!offersString) return [];
      return offersString.split(',').map(offer => offer.trim()).filter(offer => offer);
    };

    // Format date string
    const formatDate = (dateString: string): string => {
      if (!dateString) return new Date().toISOString().split('T')[0];
      
      // Try to parse the date and return in YYYY-MM-DD format
      try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      } catch {
        return new Date().toISOString().split('T')[0];
      }
    };

    const title = getField('title');
    const sellerName = getField('sellername');
    const productImageUrl = getField('productimage');
    
    // Get banner and commission with detailed debugging
    console.log(`🔍 Looking for bannerimage field...`);
    const bannerImageUrl = getField('bannerimage');
    console.log(`🔍 Looking for commission field...`);
    const commission = getNumberField('commission', 15);
    
    // Debug logging - show all headers first
    console.log(`📋 Available headers (${headers.length}): ${headers.join(', ')}`);
    console.log(`📊 Row data (${row.length}): ${row.join(', ')}`);
    
    // Debug specific field matching
    const bannerFieldIndex = headers.findIndex(h => h.toLowerCase().trim() === 'banner url');
    const commissionFieldIndex = headers.findIndex(h => h.toLowerCase().trim() === 'commission');
    
    console.log(`🔍 "Banner URL" field index: ${bannerFieldIndex}, header: "${bannerFieldIndex >= 0 ? headers[bannerFieldIndex] : 'NOT FOUND'}"`);
    console.log(`🔍 "Commission" field index: ${commissionFieldIndex}, header: "${commissionFieldIndex >= 0 ? headers[commissionFieldIndex] : 'NOT FOUND'}"`);
    
    if (bannerFieldIndex >= 0) {
      console.log(`🖼️ Raw Banner URL value: "${row[bannerFieldIndex] || 'EMPTY'}"`);
    }
    if (commissionFieldIndex >= 0) {
      console.log(`💰 Raw Commission value: "${row[commissionFieldIndex] || 'EMPTY'}"`);
    }
    
    // Debug getField results
    console.log(`🔍 getField('bannerimage') result: "${bannerImageUrl}"`);
    console.log(`🔍 getField('commission') result: "${commission}"`);
    
    // Show header-to-data mapping for debugging
    headers.forEach((header, index) => {
      console.log(`📍 Column ${index}: "${header}" = "${row[index] || 'EMPTY'}"`);
    });
    
    console.log(`🖼️ Campaign ${title} - Product Image URL: "${productImageUrl}"`);
    console.log(`🖼️ Campaign ${title} - Banner Image URL: "${bannerImageUrl}"`);
    console.log(`💰 Campaign ${title} - Commission: ${commission}%`);
    
    if (!title || !sellerName) {
      return null; // Skip invalid rows
    }

    const campaign: Campaign = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title,
      description: getField('description') || 'Partner campaign with exclusive offers',
      sellerName: sellerName,
      sellerLogo: getField('sellerlogo') || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      bannerImage: bannerImageUrl || 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
      totalCommission: commission,
      averageRating: getNumberField('rating', 4.5),
      category: mapCategory(getField('category')),
      isActive: getBooleanField('active', true), // Default to active for new campaigns
      startDate: formatDate(getField('startdate')),
      endDate: getField('enddate') ? formatDate(getField('enddate')) : undefined,
      specialOffers: parseSpecialOffers(getField('offers')),
      campaignLink: getField('campaignlink') || undefined,
      productImageUrl: productImageUrl || undefined,
      bannerUrl: bannerImageUrl || undefined,
      // Default admin-editable fields
      moreNotes: undefined,
      moreInfoOptions: {
        freeSample: false,
        trending: false,
        topSelling: false,
        highOpportunity: false,
        videoOnly: false,
        liveOnly: false,
        videoOrLive: false
      },
      // Additional fields from spreadsheet
      requirements: getField('requirements') || undefined,
      paymentTerms: getField('paymentterms') || undefined,
      productTypes: getField('producttypes') || undefined,
      targetAudience: getField('targetaudience') || undefined,
      contentGuidelines: getField('contentguidelines') || undefined,
      bonusCommission: getField('bonuscommission') || undefined,
      applicationDeadline: getField('applicationdeadline') || undefined,
      expectedDeliverables: getField('expecteddeliverables') || undefined,
      campaignBudget: getField('campaignbudget') || undefined,
      exclusivityTerms: getField('exclusivityterms') || undefined,
      performanceMetrics: getField('performancemetrics') || undefined,
      contactEmail: getField('contactemail') || undefined,
      additionalNotes: getField('additionalnotes') || undefined
    };

    return campaign;
  } catch (error) {
    console.error('Error parsing campaign row:', error);
    return null;
  }
}

// Main function to fetch campaigns from Google Sheets
export async function fetchCampaignsFromSheets(): Promise<Campaign[]> {
  const debugInfo = {
    url: CAMPAIGNS_SHEETS_URL,
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    console.log('🔄 Fetching campaigns from Google Sheets...');
    debugInfo.steps.push('Started fetch request');
    
    const response = await fetch(CAMPAIGNS_SHEETS_URL, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Cache-Control': 'no-cache'
      }
    });
    
    debugInfo.steps.push(`HTTP Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      // Handle common cases more gracefully
      if (response.status === 400 || response.status === 404) {
        throw new Error(`Campaigns spreadsheet not found or not accessible (${response.status})`);
      }
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
      console.warn('⚠️ Not enough data in campaigns spreadsheet');
      debugInfo.steps.push('Warning: Insufficient data rows');
      return [];
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    console.log('📊 Campaigns spreadsheet headers:', headers);
    console.log('📝 Processing', dataRows.length, 'campaign rows');
    
    debugInfo.steps.push(`Headers: ${headers.join(', ')}`);
    debugInfo.steps.push(`Data rows to process: ${dataRows.length}`);
    
    const campaigns: Campaign[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      try {
        const campaign = rowToCampaign(dataRows[i], headers);
        if (campaign) {
          campaigns.push(campaign);
        } else {
          errors.push(`Row ${i + 2}: Failed to parse (missing title or seller)`);
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }
    
    debugInfo.steps.push(`Successfully parsed: ${campaigns.length} campaigns`);
    if (errors.length > 0) {
      debugInfo.steps.push(`Parsing errors: ${errors.length}`);
      console.warn('⚠️ Campaign parsing errors:', errors);
    }
    
    console.log('✅ Successfully processed Campaigns Google Sheets data:', {
      totalRows: dataRows.length,
      successfulCampaigns: campaigns.length,
      errors: errors.length
    });
    
    return campaigns;
    
  } catch (error) {
    debugInfo.steps.push(`ERROR: ${error.message}`);
    // Only log detailed errors for debugging, not in production
    console.log('📋 Campaigns fetch failed:', error.message);
    throw error;
  }
}

// Fallback function
export async function fetchCampaignsWithFallback(): Promise<Campaign[]> {
  try {
    const campaigns = await fetchCampaignsFromSheets();
    return campaigns.length > 0 ? campaigns : [];
  } catch (error) {
    // Silently handle campaigns fetch errors since it's optional
    console.log('📋 Campaigns spreadsheet not available, using empty array');
    return [];
  }
}

// Debug utility functions
export async function getCampaignsSheetDebugInfo() {
  try {
    const response = await fetch(CAMPAIGNS_SHEETS_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    return {
      success: true,
      url: CAMPAIGNS_SHEETS_URL,
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
      url: CAMPAIGNS_SHEETS_URL,
      timestamp: new Date().toISOString()
    };
  }
}

export async function validateCampaignsSheetStructure() {
  try {
    const response = await fetch(CAMPAIGNS_SHEETS_URL);
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
    const essentialFields = ['title', 'sellername'];
    const recommendedFields = ['description', 'commission', 'category', 'active', 'bannerimage'];
    
    essentialFields.forEach(field => {
      const found = headers.some(h => h.toLowerCase().includes(field.toLowerCase()));
      if (!found) {
        issues.push(`Missing essential field: ${field}`);
      }
    });
    
    recommendedFields.forEach(field => {
      const found = headers.some(h => h.toLowerCase().includes(field.toLowerCase()));
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