import React, { useEffect, useState } from 'react';
import { fetchProductsFromSheets } from '../services/googleSheets';
import { fetchCampaignsFromSheets } from '../services/googleSheetsCampaigns';
import { fetchCreatorsFromSheets } from '../services/googleSheetsCreators';

import HomeProductCard from '../components/HomeProductCard';
import HomeCampaignCard from '../components/HomeCampaignCard';
import FeaturedCreatorsSlider from '../components/FeaturedCreatorsSlider';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    async function loadData() {
      const productsData = await fetchProductsFromSheets();
      const campaignsData = await fetchCampaignsFromSheets();
      const creatorsData = await fetchCreatorsFromSheets();

      setProducts(productsData.slice(0, 6));
      setCampaign(campaignsData?.[0] || null);
      setCreators(creatorsData);
    }

    loadData();
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <HomeProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Newest Campaign</h2>
        {campaign ? (
          <HomeCampaignCard campaign={campaign} />
        ) : (
          <p>No campaigns available.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Creators</h2>
        <FeaturedCreatorsSlider creators={creators} />
      </section>
    </div>
  );
}
