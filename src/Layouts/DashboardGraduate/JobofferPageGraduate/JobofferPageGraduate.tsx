import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب البيانات
  const fetchOffers = async () => {
    try {
      // تأكدي من ضبط الـ token في الـ header إذا كان لديك نظام توثيق
      const res = await axios.get('http://localhost:5000/api/v1/offers/my-offers', {
        withCredentials: true 
      });
      setOffers(res.data.data); // بناءً على هيكل الـ controller الخاص بك
      setLoading(false);
    } catch (err) {
      console.error("Error fetching offers", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // دالة قبول أو رفض العرض
  const handleAction = async (id, action) => {
    try {
      await axios.patch(`http://localhost:5000/api/v1/offers/${id}/${action}`, {}, {
        withCredentials: true
      });
      alert(`Offer ${action}ed successfully!`);
      fetchOffers(); // تحديث القائمة بعد العملية
    } catch (err) {
      console.error(`Error ${action}ing offer:`, err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Job Offers</h1>
      
      {/* عداد العروض */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex items-center">
        <span className="text-blue-700 font-bold mr-2">You have {offers.length} job offers!</span>
        <span className="text-gray-600">Review the offers and respond to companies</span>
      </div>

      {/* قائمة العروض */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">
                {offer.company?.companyName?.[0] || 'C'}
              </div>
              <div>
                <h2 className="font-bold text-lg">{offer.company?.companyName || 'Unknown Company'}</h2>
                <p className="text-blue-600 font-medium">{offer.position}</p>
                <p className="text-gray-500 text-sm mt-1">{offer.message}</p>
                <p className="text-gray-400 text-xs mt-2">Status: {offer.status}</p>
              </div>
            </div>
            
            {/* الأزرار تظهر فقط إذا كان العرض معلقاً */}
            {offer.status === 'pending' && (
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => handleAction(offer._id, 'accept')}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-800 transition"
                >
                  Accept & Schedule Interview
                </button>
                <button className="border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  View Details
                </button>
                <button 
                  onClick={() => handleAction(offer._id, 'decline')}
                  className="text-gray-600 font-medium hover:text-red-600 transition"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobOffersPage;