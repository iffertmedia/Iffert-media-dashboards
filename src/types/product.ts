export interface Product {
  id: string;
  name: string;
  images: string[];
  starRating: number | null;
  positiveReviewPercentage: number;
  shopRating: number | null;
  baseCommission: number;
  higherCommission?: number;
  commissionIncrease?: string; // e.g., "+5%" or "+$2.50"
  category: ProductCategory;
  tiktokShopUrl: string;
  sampleRequestUrl?: string;
  tags: ProductTag[];
  shopName: string;
  price: number;
  originalPrice?: number;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  followers: string; // Keep original formatting from spreadsheet (e.g., "850K", "1.2M")
  engagement: number;
  gmv: string; // Keep original formatting from spreadsheet (e.g., "1.3K", "2.5M")
  niche: string[];
  tiktokHandle: string;
  isVerified: boolean;
  tier: 'S' | 'A' | 'B' | 'C';
  category: string;
  exampleVideos?: ExampleVideo[];
  // Admin-editable collab options
  collabOptions?: {
    freeSample: boolean;
    paidCollab: boolean;
    retainer: boolean;
  };
}

export interface ExampleVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  url: string;
}

export type ProductCategory = 
  | 'fashion'
  | 'accessories'
  | 'beauty'
  | 'personal care'
  | 'health'
  | 'food'
  | 'home'
  | 'pet'
  | 'toys'
  | 'tech';

export type ProductTag = 
  | 'trending'
  | 'most-searched'
  | 'top-product'
  | 'hot-deal'
  | 'new-arrival';

export interface AdminText {
  id: string;
  key: string;
  content: string;
  location: 'dashboard' | 'product-detail' | 'creator-showcase';
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  sellerName: string;
  sellerLogo: string;
  bannerImage: string;
  totalCommission: number;
  averageRating: number;
  category: ProductCategory;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  specialOffers?: string[];
  campaignLink?: string;
  productImageUrl?: string;
  bannerUrl?: string;
  // Admin-editable fields
  moreNotes?: string;
  moreInfoOptions?: {
    freeSample: boolean;
    trending: boolean;
    topSelling: boolean;
    highOpportunity: boolean;
    videoOnly: boolean;
    liveOnly: boolean;
    videoOrLive: boolean;
  };
  // Additional fields that might be in spreadsheet
  requirements?: string;
  paymentTerms?: string;
  productTypes?: string;
  targetAudience?: string;
  contentGuidelines?: string;
  bonusCommission?: string;
  applicationDeadline?: string;
  expectedDeliverables?: string;
  campaignBudget?: string;
  exclusivityTerms?: string;
  performanceMetrics?: string;
  contactEmail?: string;
  additionalNotes?: string;
}

export interface FeaturedCreator {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  tiktokHandle: string;
  isVerified: boolean;
  specialty?: string;
}

export interface AdminText {
  id: string;
  key: string;
  content: string;
  location: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string; // ISO string timestamp
  isRead: boolean;
  type?: 'info' | 'warning' | 'success' | 'announcement';
}

export interface ExclusiveCampaign {
  id: string;
  title: string;
  category: string;
  description: string;
  endDate: string;
  link: string;
}