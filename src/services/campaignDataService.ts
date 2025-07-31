import { Campaign, ProductCategory } from '../types/product';

const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXwT5WKsZki1qfjygvnKvJhbJDNciveomj5PSYNJ_8ASHz9nx6uLdkANuGo9k29EzuV-kGKMTCmUqC/pub?output=csv';

interface CampaignCSVRow {
  [key: string]: string;
}

// CSV parsing utility
const parseCSV = (csvText: string): CampaignCSVRow[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: CampaignCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: CampaignCSVRow = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    rows.push(row);
  }

  return rows;
};

// Map CSV row to Campaign object
const mapCSVRowToCampaign = (row: CampaignCSVRow, index: number): Campaign => {
  // Common mappings - adjust these based on your actual CSV columns
  const title = row['Campaign Title'] || row['Title'] || row['Campaign Name'] || `Campaign ${index + 1}`;
  const sellerName = row['Seller Name'] || row['Seller'] || row['Brand'] || 'Unknown Seller';
  const description = row['Description'] || row['Campaign Description'] || `Partnership campaign with ${sellerName}`;
  const category = (row['Category'] || row['Product Category'] || 'beauty').toLowerCase() as ProductCategory;
  const commission = parseInt(row['Commission'] || row['Commission Rate'] || '15') || 15;
  const rating = parseFloat(row['Rating'] || row['Average Rating'] || '4.5') || 4.5;
  const isActive = (row['Status'] || row['Active'] || 'true').toLowerCase() === 'true' || 
                   (row['Status'] || '').toLowerCase() === 'active';
  
  // Handle dates
  const startDate = row['Start Date'] || row['StartDate'] || new Date().toISOString().split('T')[0];
  const endDate = row['End Date'] || row['EndDate'] || '';
  
  // Handle images - provide defaults if not in CSV
  const bannerImage = row['Banner Image'] || row['Banner URL'] || 
    `https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&q=80`;
  const sellerLogo = row['Seller Logo'] || row['Logo URL'] || 
    `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80`;
  
  // Handle special offers
  const specialOffers: string[] = [];
  if (row['Special Offer 1']) specialOffers.push(row['Special Offer 1']);
  if (row['Special Offer 2']) specialOffers.push(row['Special Offer 2']);
  if (row['Special Offers']) {
    // If special offers are in one cell, split by semicolon or comma
    const offers = row['Special Offers'].split(/[;,]/).map(o => o.trim()).filter(o => o);
    specialOffers.push(...offers);
  }

  return {
    id: `csv-${index}`,
    title,
    description,
    sellerName,
    sellerLogo,
    bannerImage,
    productCount: parseInt(row['Product Count'] || '0') || Math.floor(Math.random() * 20) + 5,
    totalCommission: commission,
    averageRating: rating,
    category,
    isActive,
    startDate,
    endDate,
    products: [], // Will be populated based on category
    specialOffers: specialOffers.length > 0 ? specialOffers : undefined
  };
};

// Main function to fetch and parse campaigns
export const fetchCampaignsFromSpreadsheet = async (): Promise<Campaign[]> => {
  try {
    console.log('Fetching campaigns from spreadsheet...');
    
    const response = await fetch(SPREADSHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('CSV data received:', csvText.substring(0, 200) + '...');
    
    const csvRows = parseCSV(csvText);
    console.log('Parsed CSV rows:', csvRows.length);
    
    if (csvRows.length === 0) {
      console.warn('No data rows found in CSV');
      return [];
    }
    
    const campaigns = csvRows
      .filter(row => {
        // Filter out empty rows
        const hasData = Object.values(row).some(value => value && value.trim());
        return hasData;
      })
      .map((row, index) => mapCSVRowToCampaign(row, index));
    
    console.log('Successfully mapped campaigns:', campaigns.length);
    return campaigns;
    
  } catch (error) {
    console.error('Error fetching campaigns from spreadsheet:', error);
    throw new Error(`Failed to load campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Test function to help debug CSV structure
export const debugCSVStructure = async (): Promise<void> => {
  try {
    const response = await fetch(SPREADSHEET_CSV_URL);
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    
    if (lines.length > 0) {
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      console.log('CSV Headers found:', headers);
      
      if (lines.length > 1) {
        const firstRow = lines[1].split(',').map(v => v.trim().replace(/"/g, ''));
        console.log('First data row example:', 
          headers.reduce((obj, header, index) => {
            obj[header] = firstRow[index] || '';
            return obj;
          }, {} as Record<string, string>)
        );
      }
    }
  } catch (error) {
    console.error('Error debugging CSV structure:', error);
  }
};