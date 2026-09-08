import React from 'react';
import { Crown, Sparkles, Zap, Gift, Award, CheckCircle2 } from 'lucide-react';

export interface PromoItem {
  id?: string | number;
  title?: string;
  price?: number | string;
  isFree?: boolean;
  offerBadge?: string;
  [key: string]: any;
}

export interface SinglePromoBadgeViewProps {
  item: PromoItem;
  itemType?: 'course' | 'digital_product' | 'service' | 'gig' | string;
  textColor?: string;
  className?: string;
}

export const SinglePromoBadgeView: React.FC<SinglePromoBadgeViewProps> = ({
  item,
  itemType = 'service',
  textColor = 'text-slate-900 dark:text-white',
  className = ''
}) => {
  const isFree = Boolean(
    item.isFree ||
    item.price === 0 ||
    item.price === '0' ||
    item.offerBadge === 'free' ||
    item.offerBadge === 'সম্পূর্ণ ফ্রি' ||
    item.offerBadge === 'সম্পূর্ণ ফ্রি কোর্স'
  );

  const isWorkFirst = Boolean(
    item.offerBadge === 'work_first' ||
    item.offerBadge === 'আগে কাজ শুরু'
  );

  let label = '';
  let IconComponent: React.ComponentType<{ className?: string }> = Crown;

  if (itemType === 'course') {
    if (isFree) {
      label = 'সম্পূর্ণ ফ্রি কোর্স';
      IconComponent = Sparkles;
    } else {
      label = 'প্রিমিয়াম কোর্স';
      IconComponent = Crown;
    }
  } else if (itemType === 'digital_product') {
    if (isFree) {
      label = 'সম্পূর্ণ ফ্রি';
      IconComponent = Sparkles;
    } else {
      label = 'প্রিমিয়াম প্রোডাক্ট';
      IconComponent = Crown;
    }
  } else {
    // service or gig
    if (isWorkFirst) {
      label = 'আগে কাজ শুরু';
      IconComponent = Zap;
    } else if (isFree) {
      label = 'ফ্রি সার্ভিস';
      IconComponent = Sparkles;
    } else {
      label = 'প্রিমিয়াম সার্ভিস';
      IconComponent = Crown;
    }
  }

  // If item has a custom offerBadge string that isn't one of the slug values
  if (item.offerBadge && !['work_first', 'free'].includes(item.offerBadge)) {
    label = item.offerBadge;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold ${textColor} ${className}`}>
      <IconComponent className="w-4 h-4 shrink-0 stroke-[2.2]" />
      <span className="truncate">{label}</span>
    </div>
  );
};

export const getOfferBadgeLabel = (badge?: string): string => {
  if (!badge) return '';
  if (badge === 'work_first' || badge === 'আগে কাজ শুরু') return 'আগে কাজ শুরু';
  if (badge === 'free' || badge === 'সম্পূর্ণ ফ্রি') return 'সম্পূর্ণ ফ্রি';
  return badge;
};

export default SinglePromoBadgeView;
