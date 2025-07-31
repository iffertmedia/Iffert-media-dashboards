import { ExclusiveCampaign } from '../types/product';

const EXCLUSIVE_CAMPAIGNS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlBvjzryWd0VP0wcANqoakdAhrnOMnJwNCx_2PTbMNzQsQyeErIMtA-uJTlIz0b1NV0dz0uVk0-SKW/pub?output=csv';

// Enhanced CSV parsing function to handle quotes and commas properly
const parseCSV = (csvText: string): string[][] => {
  const rows: string[][] = [];
  const lines = csvText.split('\n');
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const row: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    row.push(current.trim());
    rows.push(row);
  }
  
  return rows;
};

const findFieldIndex = (headers: string[], possibleNames: string[]): number => {
  for (const name of possibleNames) {
    const index = headers.findIndex(header => 
      header.toLowerCase().includes(name.toLowerCase())
    );
    if (index !== -1) return index;
  }
  return -1;
};

export const fetchExclusiveCampaigns = async (): Promise<ExclusiveCampaign[]> => {
  try {
    console.log('🔄 Fetching exclusive campaigns from Google Sheets...');
    const response = await fetch(EXCLUSIVE_CAMPAIGNS_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    console.log('📄 Raw CSV length:', csvText.length);
    
    const rows = parseCSV(csvText);
    
    if (rows.length === 0) {
      console.warn('⚠️ No rows found in CSV');
      return [];
    }
    
    const headers = rows[0].map(h => h.trim());
    console.log('📋 Headers found:', headers);
    
    // Find column indices
    const categoryIndex = findFieldIndex(headers, ['category', 'type', 'genre']);
    const descriptionIndex = findFieldIndex(headers, ['description', 'desc', 'details']);
    const endDateIndex = findFieldIndex(headers, ['end date', 'campaign end', 'expires', 'deadline']);
    const linkIndex = findFieldIndex(headers, ['link', 'url', 'campaign link', 'landing page']);
    const titleIndex = findFieldIndex(headers, ['title', 'name', 'campaign name']);
    
    console.log('🗂️ Field mapping:', {
      category: categoryIndex,
      description: descriptionIndex,
      endDate: endDateIndex,
      link: linkIndex,
      title: titleIndex
    });
    
    const campaigns: ExclusiveCampaign[] = [];
    
    // Process data rows (skip header)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      if (row.length === 0 || row.every(cell => !cell.trim())) {
        continue; // Skip empty rows
      }
      
      const category = categoryIndex >= 0 ? row[categoryIndex]?.trim() || 'General' : 'General';
      const description = descriptionIndex >= 0 ? row[descriptionIndex]?.trim() || '' : '';
      const endDate = endDateIndex >= 0 ? row[endDateIndex]?.trim() || '' : '';
      const link = linkIndex >= 0 ? row[linkIndex]?.trim() || '' : '';
      const title = titleIndex >= 0 ? row[titleIndex]?.trim() || `Campaign ${i}` : `Campaign ${i}`;
      
      // Skip campaigns without essential data
      if (!description && !category && !endDate) {
        console.log(`⏭️ Skipping row ${i}: insufficient data`);
        continue;
      }
      
      const campaign: ExclusiveCampaign = {
        id: `exclusive_${Date.now()}_${i}`,
        title,
        category,
        description,
        endDate,
        link,
      };
      
      campaigns.push(campaign);
      console.log(`✅ Added exclusive campaign: ${title}`);
    }
    
    console.log(`🎯 Successfully parsed ${campaigns.length} exclusive campaigns`);
    return campaigns;
    
  } catch (error) {
    console.error('❌ Error fetching exclusive campaigns:', error);
    return [];
  }
};

export const fetchExclusiveCampaignsWithFallback = async (): Promise<ExclusiveCampaign[]> => {
  try {
    const campaigns = await fetchExclusiveCampaigns();
    return campaigns;
  } catch (error) {
    console.error('Failed to fetch exclusive campaigns, using empty array:', error);
    return [];
  }
};