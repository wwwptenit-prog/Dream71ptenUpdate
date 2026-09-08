import React, { useState } from 'react';
import { X, Eye, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onBack?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onBack }) => {
  const { gallery, t } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Office', 'Students', 'Training', 'Events', 'Certificates', 'Projects', 'Activities'];

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'All': return t('সকল ছবি', 'All Photos');
      case 'Office': return t('অফিস', 'Office');
      case 'Students': return t('শিক্ষার্থী', 'Students');
      case 'Training': return t('ট্রেনিং', 'Training');
      case 'Events': return t('ইভেন্ট', 'Events');
      case 'Certificates': return t('সার্টিফিকেট', 'Certificates');
      case 'Projects': return t('প্রজেক্ট', 'Projects');
      case 'Activities': return t('কার্যক্রম', 'Activities');
      default: return cat;
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <section className="py-10 sm:py-16 bg-slate-100/90 text-slate-900 dark:bg-slate-950 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80 font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3 sm:gap-4 relative">
          {onBack && (
            <div className="w-full flex justify-start sm:absolute sm:left-0 sm:top-0">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer border-0 shadow-xs"
                title={t('পূর্ববর্তী স্থানে ফিরে যান', 'Go back to previous page')}
              >
                <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                <span>{t('ফিরে যান', 'Back')}</span>
              </button>
            </div>
          )}
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('ছবি গ্যালারি', 'Photo Gallery')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-bengali">
            {t('PTENit এর অফিসিয়াল ক্লাসরুম কার্যক্রম, ইভেন্ট, সার্টিফিকেট প্রদান ও সফল মুহূর্তসমূহ।', 'Official classroom activities, events, certificate presentations, and memorable moments.')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap font-bengali">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border-0 ${
                selectedCategory === cat
                  ? 'bg-[#1DB954] text-white shadow-lg shadow-[#1DB954]/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-4/3 border border-slate-200 dark:border-slate-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1DB954] text-white uppercase">
                  {item.category}
                </span>
                <h3 className="font-bold text-base font-bengali line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-300 font-bengali line-clamp-2">{item.caption}</p>
              </div>

              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage.imageUrl}
              alt={lightboxImage.title}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-700"
            />
            <div className="text-center pt-4 text-white space-y-1">
              <h3 className="text-xl font-bold font-bengali">{lightboxImage.title}</h3>
              <p className="text-sm text-slate-300 font-bengali">{lightboxImage.caption}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
