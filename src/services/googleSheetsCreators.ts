import { Creator, ExampleVideo } from '../types/product';

// Google Sheets CSV URL for Creators
const CREATORS_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMPBKqeX6IjK7O4u6vIsJTAr9KGg_2iPIptbTelthvWheYB6tlOV3NRnpY7R7ZX93aO6WFVP-V4b4B/pub?output=csv';

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

// Convert spreadsheet row to Creator object
function rowToCreator(row: string[], headers: string[]): Creator | null {
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
          'name': ['creator', 'full_name', 'username'],
          'avatar': ['image', 'photo', 'picture', 'profile_pic'],
          'followers': ['follower_count', 'subs', 'audience'],
          'engagement': ['eng', 'engagement_rate', 'er'],
          'gmv': ['revenue', 'sales', 'earnings', 'gross_merchandise_value'],
          'niche': ['niches', 'category', 'categories', 'topics'],
          'tiktokhandle': ['handle', 'username', 'tiktok', '@'],
          'verified': ['is_verified', 'checkmark', 'blue_check'],
          'tier': ['level', 'rank', 'grade'],
          'category': ['main_category', 'primary_category', 'cat']
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

    // Special function for followers to preserve original formatting
    const getFollowersField = (fieldName: string): string => {
      const value = getField(fieldName);
      return value || '0';
    };

    // Special function for GMV to preserve original formatting
    const getGMVField = (fieldName: string): string => {
      const value = getField(fieldName);
      return value || '0';
    };

    const getBooleanField = (fieldName: string): boolean => {
      const value = getField(fieldName).toLowerCase();
      return value === 'true' || value === '1' || value === 'yes' || value === 'verified';
    };

    // Parse niche tags from comma-separated string
    const parseNiches = (nichesString: string): string[] => {
      if (!nichesString) return [];
      return nichesString.split(',').map(n => n.trim()).filter(n => n);
    };

    // Parse tier from string
    const parseTier = (tierString: string): 'S' | 'A' | 'B' | 'C' => {
      const tier = tierString.toUpperCase();
      if (['S', 'A', 'B', 'C'].includes(tier)) {
        return tier as 'S' | 'A' | 'B' | 'C';
      }
      return 'B'; // default
    };

    // Parse example videos - supports both embed codes and URLs
    const parseExampleVideos = (): ExampleVideo[] => {
      const videos: ExampleVideo[] = [];
      
      // First try individual video embed/URL fields (video1, video2, video3, embed1, embed2, etc.)
      for (let i = 1; i <= 5; i++) {
        const embedField = getField(`embed${i}`) || getField(`embed_${i}`) || getField(`video${i}_embed`) || getField(`video${i}embed`);
        const urlField = getField(`video${i}`) || getField(`video_${i}`) || getField(`video${i}_url`) || getField(`link${i}`) || getField(`url${i}`);
        
        // Prefer embed code over URL if both exist
        const videoContent = embedField || urlField;
        
        if (videoContent && videoContent.trim()) {
          // Check if it's an embed code (contains HTML tags) or just a URL
          const isEmbedCode = videoContent.includes('<') && (videoContent.includes('blockquote') || videoContent.includes('iframe'));
          
          videos.push({
            id: `${Date.now()}_${i}`,
            title: `Video ${i}`,
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
            url: videoContent.trim(),
            views: 0, // Not needed for display
            likes: 0  // Not needed for display
          });
        }
      }
      
      // If no individual videos found, try single field with comma/newline-separated content
      if (videos.length === 0) {
        const videoFieldVariations = [
          'embeds', 'embed_codes', 'video_embeds',
          'videos', 'video_links', 'example_videos', 'links', 'video_urls', 'tiktok_links'
        ];
        
        for (const fieldVar of videoFieldVariations) {
          const fieldValue = getField(fieldVar);
          if (fieldValue && fieldValue.trim()) {
            // Split by common separators, handling both embed codes and URLs
            const separator = fieldValue.includes('<blockquote') ? '</blockquote>' : /[,;|\n]/;
            let videoContents = [];
            
            if (fieldValue.includes('<blockquote')) {
              // Split embed codes by closing blockquote tag
              videoContents = fieldValue.split('</blockquote>')
                .map(content => content.includes('<blockquote') ? content + '</blockquote>' : content)
                .filter(content => content.trim() && content.includes('<blockquote'));
            } else {
              // Split URLs normally
              videoContents = fieldValue.split(separator)
                .map(content => content.trim())
                .filter(content => content && (content.includes('http') || content.includes('<')));
            }
            
            videoContents.forEach((content, index) => {
              if (index < 5) { // Allow up to 5 videos
                videos.push({
                  id: `${Date.now()}_${index + 1}`,
                  title: `Video ${index + 1}`,
                  thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300',
                  url: content.trim(),
                  views: 0,
                  likes: 0
                });
              }
            });
            
            if (videos.length > 0) {
              break; // Found videos, stop looking
            }
          }
        }
      }
      
      return videos;
    };

    const name = getField('name');
    const tiktokHandle = getField('tiktokhandle') || getField('handle');
    
    if (!name || !tiktokHandle) {
      return null; // Skip invalid rows
    }

    // Ensure TikTok handle starts with @
    const formattedHandle = tiktokHandle.startsWith('@') ? tiktokHandle : `@${tiktokHandle}`;

    const exampleVideos = parseExampleVideos();
    
    // Debug log for video parsing
    console.log(`🎥 Creator ${name} - Found ${exampleVideos.length} videos`);
    if (exampleVideos.length > 0) {
      console.log('Video content found:', exampleVideos.map(v => ({
        title: v.title,
        contentType: v.url.includes('<') ? 'embed_code' : 'url',
        preview: v.url.substring(0, 100) + (v.url.length > 100 ? '...' : '')
      })));
    } else {
      // Log field names that might contain video content
      console.log('Looking for video fields in:', headers.filter(h => 
        h.toLowerCase().includes('video') || 
        h.toLowerCase().includes('embed') ||
        h.toLowerCase().includes('link') ||
        h.toLowerCase().includes('url')
      ));
    }

    const creator: Creator = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: name,
      avatar: getField('avatar') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      followers: getFollowersField('followers') || '10K',
      engagement: getNumberField('engagement', 4.0),
      gmv: getGMVField('gmv') || '50K',
      niche: parseNiches(getField('niche')),
      tiktokHandle: formattedHandle,
      isVerified: getBooleanField('verified'),
      tier: parseTier(getField('tier')),
      category: getField('category') || 'Lifestyle',
      exampleVideos: exampleVideos
    };

    return creator;
  } catch (error) {
    console.error('Error parsing creator row:', error);
    return null;
  }
}

// Main function to fetch creators from Google Sheets
export async function fetchCreatorsFromSheets(): Promise<Creator[]> {
  const debugInfo = {
    url: CREATORS_SHEETS_URL,
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    console.log('🔄 Fetching creators from Google Sheets...');
    debugInfo.steps.push('Started fetch request');
    
    const response = await fetch(CREATORS_SHEETS_URL, {
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
      console.warn('⚠️ Not enough data in creators spreadsheet');
      debugInfo.steps.push('Warning: Insufficient data rows');
      return [];
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    console.log('📊 Creators spreadsheet headers:', headers);
    console.log('📝 Processing', dataRows.length, 'creator rows');
    
    debugInfo.steps.push(`Headers: ${headers.join(', ')}`);
    debugInfo.steps.push(`Data rows to process: ${dataRows.length}`);
    
    const creators: Creator[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      try {
        const creator = rowToCreator(dataRows[i], headers);
        if (creator) {
          creators.push(creator);
        } else {
          errors.push(`Row ${i + 2}: Failed to parse (missing name or handle)`);
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }
    
    debugInfo.steps.push(`Successfully parsed: ${creators.length} creators`);
    if (errors.length > 0) {
      debugInfo.steps.push(`Parsing errors: ${errors.length}`);
      console.warn('⚠️ Creator parsing errors:', errors);
    }
    
    console.log('✅ Successfully processed Creators Google Sheets data:', {
      totalRows: dataRows.length,
      successfulCreators: creators.length,
      errors: errors.length
    });
    
    return creators;
    
  } catch (error) {
    debugInfo.steps.push(`ERROR: ${error.message}`);
    console.error('❌ Error fetching creators from sheets:', {
      error: error.message,
      debugInfo
    });
    throw error;
  }
}

// Fallback function
export async function fetchCreatorsWithFallback(): Promise<Creator[]> {
  try {
    const creators = await fetchCreatorsFromSheets();
    return creators.length > 0 ? creators : [];
  } catch (error) {
    console.error('Failed to fetch creators from sheets, using empty array:', error);
    return [];
  }
}

// Debug utility functions
export async function getCreatorsSheetDebugInfo() {
  try {
    const response = await fetch(CREATORS_SHEETS_URL);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    return {
      success: true,
      url: CREATORS_SHEETS_URL,
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
      url: CREATORS_SHEETS_URL,
      timestamp: new Date().toISOString()
    };
  }
}

export async function validateCreatorsSheetStructure() {
  try {
    const response = await fetch(CREATORS_SHEETS_URL);
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
    const essentialFields = ['name', 'tiktokhandle'];
    const recommendedFields = ['avatar', 'followers', 'tier', 'category', 'gmv'];
    
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