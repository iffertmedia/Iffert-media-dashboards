import React, { useState } from 'react';
// [converted from react-native] import { div, span, Scrolldiv, Pressable, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';
import { Product, ProductCategory, ProductTag } from '../../types/product';
import { FormField, SelectField, TagInput, ImageInput } from '../../components/admin/FormComponents';
import { cn } from '../../utils/cn';

export const ProductManagerScreen: React.FC = () => {
  const { products, setProducts } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    images: [],
    starRating: 4.5,
    positiveReviewPercentage: 90,
    shopRating: 4.5,
    baseCommission: 10,
    higherCommission: 15,
    commissionIncrease: '+5%',
    category: 'beauty',
    tiktokShopUrl: '',
    sampleRequestUrl: '',
    tags: [],
    shopName: '',
    price: 0,
    originalPrice: 0
  });

  const categoryOptions = [
    { label: 'Beauty', value: 'beauty' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Tech', value: 'tech' },
    { label: 'Health', value: 'health' },
    { label: 'Home', value: 'home' },
    { label: 'Sports', value: 'sports' },
    { label: 'Pets', value: 'pets' },
    { label: 'Food', value: 'food' },
    { label: 'Toys', value: 'toys' },
    { label: 'Automotive', value: 'automotive' }
  ];

  const availableTags = ['trending', 'most-searched', 'top-product', 'hot-deal', 'new-arrival'];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      images: [],
      starRating: 4.5,
      positiveReviewPercentage: 90,
      shopRating: 4.5,
      baseCommission: 10,
      higherCommission: 15,
      commissionIncrease: '+5%',
      category: 'beauty',
      tiktokShopUrl: '',
      sampleRequestUrl: '',
      tags: [],
      shopName: '',
      price: 0,
      originalPrice: 0
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.shopName || !formData.tiktokShopUrl || formData.price === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name!,
      images: formData.images!,
      starRating: formData.starRating!,
      positiveReviewPercentage: formData.positiveReviewPercentage!,
      shopRating: formData.shopRating!,
      baseCommission: formData.baseCommission!,
      higherCommission: formData.higherCommission,
      commissionIncrease: formData.commissionIncrease,
      category: formData.category as ProductCategory,
      tiktokShopUrl: formData.tiktokShopUrl!,
      sampleRequestUrl: formData.sampleRequestUrl,
      tags: formData.tags as ProductTag[],
      shopName: formData.shopName!,
      price: formData.price!,
      originalPrice: formData.originalPrice
    };

    if (isEditing) {
      const updatedProducts = products.map(p => p.id === editingProduct?.id ? productData : p);
      setProducts(updatedProducts);
    } else {
      setProducts([...products, productData]);
    }

    setShowForm(false);
    Alert.alert('Success', `Product ${isEditing ? 'updated' : 'added'} successfully`);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedProducts = products.filter(p => p.id !== product.id);
            setProducts(updatedProducts);
          }
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex-row items-center justify-between mb-2">
        <span className="font-semibold text-gray-900 flex-1" numberOfLines={1}>
          {item.name}
        </span>
        <div className="flex-row ml-2">
          <Pressable onPress={() => handleEdit(item)} className="p-2">
            <Ionicons name="pencil" size={16} color="#6b7280" />
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} className="p-2">
            <Ionicons name="trash" size={16} color="#ef4444" />
          </Pressable>
        </div>
      </div>
      
      <span className="text-sm text-gray-600 mb-1">by {item.shopName}</span>
      <span className="text-sm text-gray-600 mb-2">Category: {item.category}</span>
      
      <div className="flex-row items-center justify-between">
        <span className="font-bold text-lg text-gray-900">${item.price}</span>
        <div className="flex-row items-center">
          <Ionicons name="star" size={14} color="#fbbf24" />
          <span className="text-sm text-gray-600 ml-1">{item.starRating}</span>
        </div>
      </div>
    </div>
  );

  if (showForm) {
    return (
      <Scrolldiv className="flex-1 bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex-row items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </span>
            <Pressable onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </div>

          <FormField
            label="Product Name"
            value={formData.name || ''}
            onChangespan={(text) => setFormData({...formData, name: text})}
            placeholder="Enter product name"
            required
          />

          <FormField
            label="Shop Name"
            value={formData.shopName || ''}
            onChangespan={(text) => setFormData({...formData, shopName: text})}
            placeholder="Enter shop name"
            required
          />

          <SelectField
            label="Category"
            value={formData.category || 'beauty'}
            options={categoryOptions}
            onSelect={(value) => setFormData({...formData, category: value as ProductCategory})}
            required
          />

          <ImageInput
            label="Product Images"
            urls={formData.images || []}
            onUrlsChange={(urls) => setFormData({...formData, images: urls})}
            maxImages={5}
          />

          <div className="flex-row space-x-4 mb-4">
            <div className="flex-1">
              <FormField
                label="Price"
                value={formData.price?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, price: parseFloat(text) || 0})}
                placeholder="0.00"
                keyboardType="numeric"
                required
              />
            </div>
            <div className="flex-1">
              <FormField
                label="Original Price"
                value={formData.originalPrice?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, originalPrice: parseFloat(text) || 0})}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </div>
          </div>

          <div className="flex-row space-x-4 mb-4">
            <div className="flex-1">
              <FormField
                label="Star Rating"
                value={formData.starRating?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, starRating: parseFloat(text) || 0})}
                placeholder="4.5"
                keyboardType="numeric"
              />
            </div>
            <div className="flex-1">
              <FormField
                label="Positive Reviews %"
                value={formData.positiveReviewPercentage?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, positiveReviewPercentage: parseInt(text) || 0})}
                placeholder="90"
                keyboardType="numeric"
              />
            </div>
          </div>

          <div className="flex-row space-x-4 mb-4">
            <div className="flex-1">
              <FormField
                label="Base Commission %"
                value={formData.baseCommission?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, baseCommission: parseInt(text) || 0})}
                placeholder="10"
                keyboardType="numeric"
              />
            </div>
            <div className="flex-1">
              <FormField
                label="Higher Commission %"
                value={formData.higherCommission?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, higherCommission: parseInt(text) || 0})}
                placeholder="15"
                keyboardType="numeric"
              />
            </div>
          </div>

          <FormField
            label="TikTok Shop URL"
            value={formData.tiktokShopUrl || ''}
            onChangespan={(text) => setFormData({...formData, tiktokShopUrl: text})}
            placeholder="https://shop.tiktok.com/..."
            keyboardType="url"
            required
          />

          <FormField
            label="Sample Request URL"
            value={formData.sampleRequestUrl || ''}
            onChangespan={(text) => setFormData({...formData, sampleRequestUrl: text})}
            placeholder="https://shop.tiktok.com/sample/..."
            keyboardType="url"
          />

          <TagInput
            label="Product Tags"
            tags={formData.tags || []}
            onTagsChange={(tags) => setFormData({...formData, tags: tags as ProductTag[]})}
            availableTags={availableTags}
            placeholder="Add tag..."
          />

          <div className="flex-row gap-3 mt-6">
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-black rounded-lg py-4"
            >
              <span className="text-white text-center font-medium text-base">
                {isEditing ? 'Update Product' : 'Add Product'}
              </span>
            </Pressable>
            
            <Pressable
              onPress={() => setShowForm(false)}
              className="flex-1 bg-gray-200 rounded-lg py-4"
            >
              <span className="text-gray-700 text-center font-medium text-base">
                Cancel
              </span>
            </Pressable>
          </div>
        </div>
      </Scrolldiv>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="flex-row items-center justify-between p-4">
        <span className="text-lg font-bold text-gray-900">
          Products ({products.length})
        </span>
        <Pressable
          onPress={handleAdd}
          className="bg-black rounded-lg px-4 py-2 flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <span className="text-white font-medium ml-1">Add Product</span>
        </Pressable>
      </div>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <div className="items-center justify-center py-16">
            <Ionicons name="cube-outline" size={48} color="#d1d5db" />
            <span className="text-gray-500 text-lg font-medium mt-4">
              No products yet
            </span>
            <span className="text-gray-400 text-center mt-2">
              Tap "Add Product" to get started
            </span>
          </div>
        )}
      />
    </div>
  );
};