import { Product, Creator, Campaign, FeaturedCreator, ExampleVideo } from '../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Glow Serum - Vitamin C + Hyaluronic Acid',
    images: [
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400'
    ],
    starRating: 4.8,
    positiveReviewPercentage: 94,
    shopRating: 4.9,
    baseCommission: 8,
    higherCommission: 15,
    commissionIncrease: '+7%',
    category: 'beauty',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/1',
    sampleRequestUrl: 'https://shop.tiktok.com/sample/1',
    tags: ['trending', 'top-product'],
    shopName: 'GlowSkin Official',
    price: 29.99,
    originalPrice: 49.99
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Earbuds Pro',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'
    ],
    starRating: 4.6,
    positiveReviewPercentage: 89,
    shopRating: 4.7,
    baseCommission: 12,
    higherCommission: 20,
    commissionIncrease: '+8%',
    category: 'tech',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/2',
    sampleRequestUrl: 'https://shop.tiktok.com/sample/2',
    tags: ['most-searched', 'hot-deal'],
    shopName: 'TechGear Store',
    price: 79.99,
    originalPrice: 129.99
  },
  {
    id: '3',
    name: 'Oversized Hoodie - Cotton Blend',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    ],
    starRating: 4.7,
    positiveReviewPercentage: 92,
    shopRating: 4.8,
    baseCommission: 10,
    higherCommission: 18,
    commissionIncrease: '+8%',
    category: 'fashion',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/3',
    tags: ['trending'],
    shopName: 'Urban Styles Co',
    price: 39.99,
    originalPrice: 69.99
  },
  {
    id: '4',
    name: 'Smart Fitness Tracker Watch',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400'
    ],
    starRating: 4.5,
    positiveReviewPercentage: 87,
    shopRating: 4.6,
    baseCommission: 15,
    higherCommission: 25,
    commissionIncrease: '+10%',
    category: 'tech',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/4',
    sampleRequestUrl: 'https://shop.tiktok.com/sample/4',
    tags: ['top-product', 'new-arrival'],
    shopName: 'FitTech Solutions',
    price: 149.99,
    originalPrice: 199.99
  },
  {
    id: '5',
    name: 'LED Strip Lights - RGB Gaming Setup',
    images: [
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400',
      'https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2d?w=400'
    ],
    starRating: 4.4,
    positiveReviewPercentage: 85,
    shopRating: 4.5,
    baseCommission: 8,
    higherCommission: 14,
    commissionIncrease: '+6%',
    category: 'home',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/5',
    tags: ['trending', 'most-searched'],
    shopName: 'HomeLight Pro',
    price: 24.99,
    originalPrice: 39.99
  },
  {
    id: '6',
    name: 'Collagen Protein Powder - Vanilla',
    images: [
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    starRating: 4.9,
    positiveReviewPercentage: 96,
    shopRating: 4.9,
    baseCommission: 12,
    higherCommission: 22,
    commissionIncrease: '+10%',
    category: 'health',
    tiktokShopUrl: 'https://shop.tiktok.com/view/product/6',
    sampleRequestUrl: 'https://shop.tiktok.com/sample/6',
    tags: ['top-product', 'trending'],
    shopName: 'Wellness Plus',
    price: 44.99,
    originalPrice: 59.99
  }
];

export const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
    followers: '850K',
    engagement: 4.2,
    gmv: 125000,
    niche: ['beauty', 'lifestyle'],
    tiktokHandle: '@sarahglows',
    isVerified: true,
    tier: 'S',
    category: 'Beauty',
    exampleVideos: [
      {
        id: '1',
        title: 'Morning Skincare Routine ✨',
        thumbnail: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300',
        views: 2400000,
        likes: 180000,
        url: 'https://tiktok.com/@sarahglows/video1'
      },
      {
        id: '2',
        title: 'Glow Up Transformation',
        thumbnail: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300',
        views: 1800000,
        likes: 145000,
        url: 'https://tiktok.com/@sarahglows/video2'
      },
      {
        id: '3',
        title: 'Must-Have Beauty Products',
        thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300',
        views: 3100000,
        likes: 220000,
        url: 'https://tiktok.com/@sarahglows/video3'
      }
    ]
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    followers: '1.2M',
    engagement: 3.8,
    gmv: 180000,
    niche: ['tech', 'gaming'],
    tiktokHandle: '@miketechtips',
    isVerified: true,
    tier: 'S',
    category: 'Tech',
    exampleVideos: [
      {
        id: '4',
        title: 'iPhone 15 First Look 📱',
        thumbnail: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300',
        views: 4200000,
        likes: 340000,
        url: 'https://tiktok.com/@miketechtips/video1'
      },
      {
        id: '5',
        title: 'Gaming Setup Tour 2024',
        thumbnail: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300',
        views: 1900000,
        likes: 160000,
        url: 'https://tiktok.com/@miketechtips/video2'
      },
      {
        id: '6',
        title: 'Best Budget Tech Finds',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
        views: 2700000,
        likes: 195000,
        url: 'https://tiktok.com/@miketechtips/video3'
      }
    ]
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    followers: '650K',
    engagement: 5.1,
    gmv: 95000,
    niche: ['fashion', 'beauty'],
    tiktokHandle: '@emmastyles',
    isVerified: false,
    tier: 'A',
    category: 'Fashion',
    exampleVideos: [
      {
        id: '7',
        title: 'Fall Outfit Ideas 🍂',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
        views: 1500000,
        likes: 120000,
        url: 'https://tiktok.com/@emmastyles/video1'
      },
      {
        id: '8',
        title: 'Thrift Flip Challenge',
        thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
        views: 890000,
        likes: 75000,
        url: 'https://tiktok.com/@emmastyles/video2'
      },
      {
        id: '9',
        title: 'Designer vs Dupe',
        thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
        views: 2100000,
        likes: 180000,
        url: 'https://tiktok.com/@emmastyles/video3'
      }
    ]
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    followers: '920K',
    engagement: 4.6,
    gmv: 110000,
    niche: ['fitness', 'health'],
    tiktokHandle: '@davidfitness',
    isVerified: true,
    tier: 'A',
    category: 'Fitness',
    exampleVideos: [
      {
        id: '10',
        title: '5 Minute Morning Workout',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
        views: 1800000,
        likes: 145000,
        url: 'https://tiktok.com/@davidfitness/video1'
      },
      {
        id: '11',
        title: 'Protein Shake Recipe',
        thumbnail: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300',
        views: 950000,
        likes: 82000,
        url: 'https://tiktok.com/@davidfitness/video2'
      },
      {
        id: '12',
        title: 'Home Gym Setup Guide',
        thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300',
        views: 1200000,
        likes: 98000,
        url: 'https://tiktok.com/@davidfitness/video3'
      }
    ]
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200',
    followers: '480K',
    engagement: 4.9,
    gmv: 65000,
    niche: ['home', 'lifestyle'],
    tiktokHandle: '@lisahomehacks',
    isVerified: false,
    tier: 'B',
    category: 'Lifestyle',
    exampleVideos: [
      {
        id: '13',
        title: 'Room Makeover Under $100',
        thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
        views: 780000,
        likes: 65000,
        url: 'https://tiktok.com/@lisahomehacks/video1'
      },
      {
        id: '14',
        title: 'Organization Hacks',
        thumbnail: 'https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2d?w=300',
        views: 1100000,
        likes: 89000,
        url: 'https://tiktok.com/@lisahomehacks/video2'
      },
      {
        id: '15',
        title: 'DIY Storage Solutions',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
        views: 650000,
        likes: 58000,
        url: 'https://tiktok.com/@lisahomehacks/video3'
      }
    ]
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Summer Beauty Essentials',
    description: 'Partner with GlowSkin Official for their summer collection featuring premium skincare products',
    sellerName: 'GlowSkin Official',
    sellerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
    bannerImage: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800',
    totalCommission: 15,
    averageRating: 4.8,
    category: 'beauty',
    isActive: true,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    specialOffers: ['Free samples for top performers', 'Exclusive 20% discount codes']
  },
  {
    id: '2',
    title: 'Tech Innovation Hub',
    description: 'Showcase the latest tech gadgets and smart devices from leading electronics brands',
    sellerName: 'TechGear Store',
    sellerLogo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
    totalCommission: 18,
    averageRating: 4.6,
    category: 'tech',
    isActive: true,
    startDate: '2024-07-01',
    specialOffers: ['Extended warranty offers', 'Bundle deals available']
  },
  {
    id: '3',
    title: 'Fashion Forward Collection',
    description: 'Urban Styles Co presents their trendy streetwear and casual fashion line',
    sellerName: 'Urban Styles Co',
    sellerLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    bannerImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    totalCommission: 12,
    averageRating: 4.7,
    category: 'fashion',
    isActive: true,
    startDate: '2024-07-15',
    endDate: '2024-09-15',
    specialOffers: ['Size exchanges available', 'Styling guide included']
  },
  {
    id: '4',
    title: 'Wellness & Fitness Partnership',
    description: 'Promote health and wellness products including supplements and fitness gear',
    sellerName: 'Wellness Plus',
    sellerLogo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
    bannerImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    totalCommission: 20,
    averageRating: 4.9,
    category: 'health',
    isActive: true,
    startDate: '2024-06-15',
    specialOffers: ['Nutrition consultation included', 'Bulk order discounts']
  },
  {
    id: '5',
    title: 'Smart Home Revolution',
    description: 'Transform homes with cutting-edge smart lighting and automation products',
    sellerName: 'HomeLight Pro',
    sellerLogo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200',
    bannerImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
    totalCommission: 14,
    averageRating: 4.4,
    category: 'home',
    isActive: false,
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    specialOffers: ['Installation guide videos', 'Technical support included']
  }
];

export const mockFeaturedCreators: FeaturedCreator[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
    followers: '850K',
    tiktokHandle: '@sarahglows',
    isVerified: true,
    specialty: 'Beauty & Lifestyle'
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    followers: '1.2M',
    tiktokHandle: '@miketechtips',
    isVerified: true,
    specialty: 'Tech Reviews'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    followers: '650K',
    tiktokHandle: '@emmastyles',
    isVerified: false,
    specialty: 'Fashion'
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    followers: '920K',
    tiktokHandle: '@davidfitness',
    isVerified: true,
    specialty: 'Fitness & Health'
  },
  {
    id: '5',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    followers: '780K',
    tiktokHandle: '@alexcreates',
    isVerified: true,
    specialty: 'DIY & Crafts'
  },
  {
    id: '6',
    name: 'Jessica Wong',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    followers: '590K',
    tiktokHandle: '@jessicacooks',
    isVerified: false,
    specialty: 'Food & Cooking'
  }
];