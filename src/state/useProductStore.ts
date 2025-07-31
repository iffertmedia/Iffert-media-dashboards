import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductCategory, Creator, AdminText, Campaign, FeaturedCreator, Notification, ExclusiveCampaign } from '../types/product';
import { fetchCampaignsFromSpreadsheet } from '../services/campaignDataService';

interface ProductStore {
  products: Product[];
  creators: Creator[];
  campaigns: Campaign[];
  exclusiveCampaigns: ExclusiveCampaign[];
  featuredCreators: FeaturedCreator[];
  adminTexts: AdminText[];
  notifications: Notification[];
  selectedCategory: ProductCategory | 'all';
  searchQuery: string;
  isLoadingCampaigns: boolean;
  campaignError: string | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCreators: (creators: Creator[]) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setExclusiveCampaigns: (campaigns: ExclusiveCampaign[]) => void;
  setFeaturedCreators: (creators: FeaturedCreator[]) => void;
  setSelectedCategory: (category: ProductCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  updateAdminText: (id: string, content: string) => void;
  addAdminText: (text: Omit<AdminText, 'id'>) => void;
  initializeDefaultTexts: () => void;
  updateCreatorCollabOptions: (creatorId: string, options: { freeSample: boolean; paidCollab: boolean; retainer: boolean; }) => void;
  updateCampaignMoreNotes: (campaignId: string, notes: string) => void;
  updateCampaignMoreInfoOptions: (campaignId: string, options: { freeSample: boolean; trending: boolean; topSelling: boolean; highOpportunity: boolean; videoOnly: boolean; liveOnly: boolean; videoOrLive: boolean; }) => void;
  updateCampaignStatus: (campaignId: string, isActive: boolean) => void;
  loadCampaignsFromSpreadsheet: () => Promise<void>;
  clearCampaignError: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  getActiveNotifications: () => Notification[];
  clearOldNotifications: () => void;
  
  // Computed
  filteredProducts: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      creators: [],
      campaigns: [],
      exclusiveCampaigns: [],
      featuredCreators: [],
      notifications: [],
      adminTexts: [
        {
          id: '1',
          key: 'dashboard-header',
          content: 'Iffert Media - Exclusive TikTok Shop Deals',
          location: 'dashboard'
        },
        {
          id: '2', 
          key: 'dashboard-subtitle',
          content: 'Tap any product to get higher commission rates or request samples',
          location: 'dashboard'
        },
        {
          id: '3',
          key: 'creator-header',
          content: 'Creator Showcase',
          location: 'creator-showcase'
        },
        {
          id: '4',
          key: 'creator-subtitle',
          content: 'Top-performing TikTok creators we manage as a Creator Agency Partner',
          location: 'creator-showcase'
        },
        {
          id: '5',
          key: 'homepage-header',
          content: 'Welcome Back',
          location: 'homepage'
        },
        {
          id: '6',
          key: 'homepage-subtitle',
          content: 'Discover the latest products and campaigns',
          location: 'homepage'
        },
        {
          id: '7',
          key: 'homepage-products-title',
          content: 'Amazing Products',
          location: 'homepage'
        },
        {
          id: '8',
          key: 'creators-page-header',
          content: 'Featured Creators',
          location: 'creators-page'
        },
        {
          id: '9',
          key: 'creators-page-subtitle',
          content: 'Connect with top-performing TikTok creators',
          location: 'creators-page'
        }
      ],
      selectedCategory: 'all',
      searchQuery: '',
      isLoadingCampaigns: false,
      campaignError: null,
      
      setProducts: (products) => set({ products }),
      setCreators: (creators) => set({ creators }),
      setCampaigns: (campaigns) => set({ campaigns }),
      setExclusiveCampaigns: (campaigns) => set({ exclusiveCampaigns: campaigns }),
      setFeaturedCreators: (creators) => set({ featuredCreators: creators }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      loadCampaignsFromSpreadsheet: async () => {
        set({ isLoadingCampaigns: true, campaignError: null });
        try {
          const campaigns = await fetchCampaignsFromSpreadsheet();
          
          // Link products to campaigns based on category
          const { products } = get();
          const campaignsWithProducts = campaigns.map(campaign => ({
            ...campaign,
            products: products.filter(p => p.category === campaign.category),
            productCount: products.filter(p => p.category === campaign.category).length || campaign.productCount
          }));
          
          set({ 
            campaigns: campaignsWithProducts, 
            isLoadingCampaigns: false,
            campaignError: null 
          });
        } catch (error) {
          set({ 
            isLoadingCampaigns: false, 
            campaignError: error instanceof Error ? error.message : 'Failed to load campaigns'
          });
        }
      },

      clearCampaignError: () => set({ campaignError: null }),
      
      updateAdminText: (id, content) => set((state) => ({
        adminTexts: state.adminTexts.map(text => 
          text.id === id ? { ...text, content } : text
        )
      })),
      
      addAdminText: (text) => set((state) => ({
        adminTexts: [...state.adminTexts, { ...text, id: Date.now().toString() }]
      })),

      updateCreatorCollabOptions: (creatorId, options) => set((state) => ({
        creators: state.creators.map(creator => 
          creator.id === creatorId 
            ? { ...creator, collabOptions: options }
            : creator
        )
      })),

      updateCampaignMoreNotes: (campaignId, notes) => set((state) => {
        console.log('📝 Updating campaign notes for ID:', campaignId, 'Notes:', notes);
        const updatedCampaigns = state.campaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, moreNotes: notes }
            : campaign
        );
        console.log('📝 Updated campaigns:', updatedCampaigns.find(c => c.id === campaignId)?.moreNotes);
        return { campaigns: updatedCampaigns };
      }),

      updateCampaignMoreInfoOptions: (campaignId, options) => set((state) => {
        console.log('⚙️ Updating campaign more info options for ID:', campaignId, 'Options:', options);
        const updatedCampaigns = state.campaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, moreInfoOptions: options }
            : campaign
        );
        const updatedCampaign = updatedCampaigns.find(c => c.id === campaignId);
        console.log('⚙️ Updated campaign options:', updatedCampaign?.moreInfoOptions);
        console.log('⚙️ Full updated campaign:', updatedCampaign);
        return { campaigns: updatedCampaigns };
      }),

      updateCampaignStatus: (campaignId, isActive) => set((state) => {
        console.log('🔄 Updating campaign status for ID:', campaignId, 'Active:', isActive);
        const updatedCampaigns = state.campaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, isActive: isActive }
            : campaign
        );
        return { campaigns: updatedCampaigns };
      }),
      
      filteredProducts: () => {
        const { products, selectedCategory, searchQuery } = get();
        let filtered = products;
        
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.shopName.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      },
      
      // Notification actions
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          isRead: false
        };
        set(state => ({
          notifications: [notification, ...state.notifications]
        }));
      },
      
      markNotificationAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        }));
      },
      
      deleteNotification: (notificationId) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== notificationId)
        }));
      },
      
      getActiveNotifications: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        return get().notifications.filter(notification => 
          new Date(notification.createdAt) > thirtyDaysAgo
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      
      clearOldNotifications: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        set(state => ({
          notifications: state.notifications.filter(notification => 
            new Date(notification.createdAt) > thirtyDaysAgo
          )
        }));
      },

      initializeDefaultTexts: () => {
        const defaultTexts = [
          {
            id: '1',
            key: 'dashboard-header',
            content: 'Exclusive TikTok Shop Deals & Higher Commissions',
            location: 'dashboard'
          },
          {
            id: '2', 
            key: 'dashboard-subtitle',
            content: 'Tap any product to get higher commission rates or request samples',
            location: 'dashboard'
          },
          {
            id: '3',
            key: 'creator-header',
            content: 'Creator Showcase',
            location: 'creator-showcase'
          },
          {
            id: '4',
            key: 'creator-subtitle',
            content: 'Top-performing TikTok creators we manage as a Creator Agency Partner',
            location: 'creator-showcase'
          },
          {
            id: '5',
            key: 'homepage-header',
            content: 'Welcome Back',
            location: 'homepage'
          },
          {
            id: '6',
            key: 'homepage-subtitle',
            content: 'Discover the latest products and campaigns',
            location: 'homepage'
          },
          {
            id: '7',
            key: 'homepage-products-title',
            content: 'Amazing Products',
            location: 'homepage'
          },
          {
            id: '8',
            key: 'creators-page-header',
            content: 'Featured Creators',
            location: 'creators-page'
          },
          {
            id: '9',
            key: 'creators-page-subtitle',
            content: 'Connect with top-performing TikTok creators',
            location: 'creators-page'
          }
        ];

        set(state => {
          const existingKeys = state.adminTexts.map(t => t.key);
          const newTexts = defaultTexts.filter(defaultText => 
            !existingKeys.includes(defaultText.key)
          );
          
          return {
            adminTexts: [...state.adminTexts, ...newTexts]
          };
        });
      }
    }),
    {
      name: 'product-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        adminTexts: state.adminTexts,
        notifications: state.notifications,
        selectedCategory: state.selectedCategory,
        // Don't persist campaigns to always fetch fresh from spreadsheet
        creators: state.creators
      })
    }
  )
);