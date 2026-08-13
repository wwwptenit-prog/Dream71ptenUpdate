import {
  Course,
  Service,
  GalleryItem,
  Testimonial,
  Offer,
  SiteSettings,
  User,
  Enrollment,
  Certificate,
  MarketplaceGig,
  MarketplaceJob,
  MarketplaceProposal,
  MarketplaceOrder
} from '../types';

export const initialSiteSettings: SiteSettings = {
  heroHeading: "আপনার ডিজিটাল প্ল্যাটফর্ম এখানে তৈরি করুন",
  heroSubtext: "PTENit আপনার ব্যবসা ও ক্যারিয়ারের জন্য আধুনিক IT Services, Digital Marketing, Web Development এবং Professional Training Solutions প্রদান করে।",
  statsStudents: "500+",
  statsProjects: "100+",
  statsCourses: "50+",
  statsSatisfaction: "95%",
  phone: "+880 1700-000000",
  email: "info@ptenit.com",
  whatsapp: "+8801700000000",
  officeAddress: "House #12, Road #04, Sector #07, Uttara, Dhaka, Bangladesh",
  facebookUrl: "https://facebook.com/ptenit",
  youtubeUrl: "https://youtube.com/ptenit",
  instagramUrl: "https://instagram.com/ptenit",
  linkedinUrl: "https://linkedin.com/company/ptenit",
  bkashNumber: "01712345678",
  nagadNumber: "01700000000",
  rocketNumber: "01900000000",
  bankName: "Dutch-Bangla Bank PLC",
  bankAccountName: "PTENIT IT SOLUTIONS",
  bankAccountNumber: "2181100098765",
  bankBranch: "Uttara Branch, Dhaka",
  enableMoneyBackGuarantee: true,
  moneyBackGuaranteeDays: 10,
  moneyBackGuaranteeText: "১০-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি"
};

export const initialOffers: Offer[] = [
  {
    id: "offer-1",
    title: "ঈদ উল ফিতর মেগা ডিসকাউন্ট অফার!",
    subtitle: "সকল প্রিমিয়াম কোর্সে পাচ্ছেন ৫০% পর্যন্ত বিশেষ ক্যাশব্যাক ছাড়",
    discountBadge: "৫০% ছাড়",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ctaText: "অফারটি উপভোগ করুন",
    ctaLink: "/courses",
    active: true,
  }
];

export const initialServices: Service[] = [
  {
    id: "web-dev",
    title: "Web Design & Development",
    category: "Development",
    shortDescription: "Professional responsive websites, landing pages, business websites, e-commerce websites and CMS solutions.",
    fullDescription: "আমরা আধুনিক React, Next.js, WordPress এবং E-Commerce ফ্রেমওয়ার্ক ব্যবহার করে হাই-স্পিড ও রেসপন্সিভ ওয়েবসাইট তৈরি করি। আপনার ব্র্যান্ডের জন্য উপযোগী কাস্টম UI/UX ডিজাইন এবং সিকিউর ব্যাকএন্ড সাপোর্ট অন্তর্ভুক্ত।",
    iconName: "Code",
    priceText: "৳15,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 48,
    packages: {
      basic: { name: "Landing Page / Single Page", price: 15000, deliveryDays: 4, revisions: 3, features: ["Mobile Responsive Layout", "Speed Optimization", "Free Hosting Setup"] },
      standard: { name: "Dynamic Business Website", price: 35000, deliveryDays: 7, revisions: 5, features: ["Up to 10 Pages", "Admin CMS Panel", "SEO Structure", "bKash/SSL Integration"] },
      premium: { name: "Custom E-Commerce & Web App", price: 75000, deliveryDays: 15, revisions: "Unlimited", features: ["Full Custom Tech Stack", "Payment Gateways", "1 Year Support", "Source Code Included"] }
    },
    features: [
      "100% Mobile Responsive Layout",
      "SEO Friendly Code Structure",
      "Free Domain & Hosting Setup",
      "Admin Panel & Content Management",
      "1 Year Technical Support"
    ],
    published: true,
    order: 1
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    category: "Marketing",
    shortDescription: "Facebook, Google, YouTube and other social media marketing solutions.",
    fullDescription: "আপনার ব্যবসার সেলস ও ব্র্যান্ড ভ্যালু বহুগুণ বাড়াতে টার্গেটেড ডিজিটাল মার্কেটিং সেবা। ফেসবুক এডস ক্যাম্পেইন, গুগল পিসি এডস, ডিসপ্লে এডস এবং লিড জেনারেশনের মাধ্যমে সর্বোচ্চ ROI নিশ্চিত করা হয়।",
    iconName: "TrendingUp",
    priceText: "৳8,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 37,
    packages: {
      basic: { name: "Starter Ad Campaign", price: 8000, deliveryDays: 7, revisions: 2, features: ["Audience Targeting", "Pixel & Event Setup", "Ad Copywriting"] },
      standard: { name: "Growth Sales Funnel", price: 18000, deliveryDays: 15, revisions: 4, features: ["Facebook + Google Ads", "Custom Visual Creatives", "Weekly Performance Report"] },
      premium: { name: "Enterprise Brand Growth", price: 40000, deliveryDays: 30, revisions: "Unlimited", features: ["Full Funnel Strategy", "Lead Gen & Remarketing", "Dedicated Account Manager"] }
    },
    features: [
      "Targeted Audience Research",
      "Custom Ad Creatives & Copywriting",
      "Conversion Tracking & Pixel Setup",
      "Weekly Performance Reporting",
      "Sales Funnel Optimization"
    ],
    published: true,
    order: 2
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    category: "Design",
    shortDescription: "Professional branding, social media design, banner, poster, brochure, business card and marketing creatives.",
    fullDescription: "ব্র্যান্ডের ভিজ্যুয়াল আইডেন্টিটি প্রতিষ্ঠা করতে চোখ ধাঁধানো গ্রাফিক ডিজাইন সেবা। লোগো ডিজাইন, সোশ্যাল মিডিয়া ব্যানার, ফ্লাইয়ার, ব্রোশিয়ার এবং ব্র্যান্ড বুক প্রিপারেশন।",
    iconName: "Palette",
    priceText: "৳5,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 52,
    packages: {
      basic: { name: "Vector Logo & Branding Card", price: 5000, deliveryDays: 2, revisions: 3, features: ["2 Logo Concepts", "Vector High Res Files", "3D Mockup"] },
      standard: { name: "Social Media Kit (15 Posts)", price: 12000, deliveryDays: 4, revisions: 5, features: ["15 Custom Posts", "Cover Photo", "Canva Editable Links"] },
      premium: { name: "Complete Brand Identity Manual", price: 28000, deliveryDays: 8, revisions: "Unlimited", features: ["Logo + Brand Guide", "Packaging & Stationery", "Marketing Creatives"] }
    },
    features: [
      "Unique Vector Logo Design",
      "Brand Color Palette & Typography",
      "Social Media Kit (20+ Templates)",
      "Print-Ready High Res Files",
      "Unlimited Revisions"
    ],
    published: true,
    order: 3
  },
  {
    id: "video-editing",
    title: "Video Editing",
    category: "Multimedia",
    shortDescription: "Professional social media videos, promotional videos, reels, YouTube videos and motion graphics.",
    fullDescription: "আপনার প্রোডাক্ট বা ইউটিউব চ্যানেলের জন্য হাই-কোয়ালিটি ভিডিও এডিটিং। সাউন্ড ডিজাইন, মোশন গ্রাফিক্স, কালার গ্রেডিং এবং ক্যাচি সাবটাইটেল যোগ করে দর্শকনন্দিত ভিডিও তৈরি।",
    iconName: "Video",
    priceText: "৳1,500 / ভিডিও",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 29,
    packages: {
      basic: { name: "Reels / Shorts Video (60s)", price: 1500, deliveryDays: 1, revisions: 2, features: ["Catchy Subtitles", "Sound Effects", "Trend Editing"] },
      standard: { name: "YouTube Long Video (10m)", price: 4500, deliveryDays: 3, revisions: 4, features: ["4K Output", "Color Grading", "Custom Lower Thirds"] },
      premium: { name: "Commercial Promo & Motion Video", price: 15000, deliveryDays: 5, revisions: "Unlimited", features: ["Voiceover Sync", "Motion Graphics", "3D Title Animations"] }
    },
    features: [
      "4K & Full HD Video Output",
      "Professional Sound Mixing & SFX",
      "Custom Motion Graphics & Lower Thirds",
      "Engaging Subtitles & Transitions",
      "Fast Turnaround Time"
    ],
    published: true,
    order: 4
  },
  {
    id: "seo",
    title: "SEO (Search Engine Optimization)",
    category: "Marketing",
    shortDescription: "Google SEO, Local SEO, YouTube SEO and website optimization.",
    fullDescription: "গুগলের প্রথম পেজে আপনার ওয়েবসাইট বা সার্ভিস নিয়ে আসতে রেজাল্ট-ওরিয়েন্টেড SEO সার্ভিস। অন-পেজ, অফ-পেজ, টেকনিক্যাল SEO এবং গুগল ম্যাপস লোকাল SEO গ্যারান্টি।",
    iconName: "Search",
    priceText: "৳10,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 41,
    packages: {
      basic: { name: "Technical & On-Page Audit", price: 10000, deliveryDays: 5, revisions: 3, features: ["Keyword Research", "Meta Optimization", "Speed Fix"] },
      standard: { name: "Google Rank Growth (Monthly)", price: 22000, deliveryDays: 30, revisions: 5, features: ["Full On-Page & Off-Page", "High DA Backlinks", "Rank Tracking"] },
      premium: { name: "Top 3 Guaranteed Organic SEO", price: 50000, deliveryDays: 60, revisions: "Unlimited", features: ["National/Global Target", "Competitor Hijack", "Monthly Guarantee"] }
    },
    features: [
      "Comprehensive Keyword Research",
      "On-Page Title & Meta Tag Optimization",
      "Technical SEO & Speed Boost",
      "High Authority Backlink Building",
      "Google My Business Rank Boost"
    ],
    published: true,
    order: 5
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    category: "Marketing",
    shortDescription: "Facebook, Instagram, LinkedIn and other platform marketing.",
    fullDescription: "সোশ্যাল মিডিয়ায় অর্গানিক কন্টেন্ট পোস্টিং, অডিয়েন্স এনগেজমেন্ট এবং পেইড প্রমোশন পরিচালনা। নিয়মিত শিডিউলড পোস্ট ও গ্রাফিক্স কভার সার্ভিস।",
    iconName: "Share2",
    priceText: "৳7,000 / মাস",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 31,
    packages: {
      basic: { name: "Weekly Content Mgmt", price: 7000, deliveryDays: 7, revisions: 2, features: ["8 Custom Posts", "Captions", "Hashtag Plan"] },
      standard: { name: "Full Monthly Page Mgmt", price: 16000, deliveryDays: 30, revisions: 4, features: ["20 Posts + 4 Reels", "Comment Inbox Mgmt", "Ad Campaign Setup"] },
      premium: { name: "Cross-Platform Growth Pack", price: 35000, deliveryDays: 30, revisions: "Unlimited", features: ["FB, IG, LinkedIn & TikTok", "Video Reels Production", "Growth Analytics"] }
    },
    features: [
      "Content Calendar Creation",
      "Custom Post Designs & Captions",
      "Community Engagement & Reply Mgmt",
      "Competitor Analysis",
      "Growth Analytics"
    ],
    published: true,
    order: 6
  },
  {
    id: "wordpress",
    title: "WordPress Development",
    category: "Development",
    shortDescription: "Business website, landing page, WooCommerce and Elementor solutions.",
    fullDescription: "সহজে পরিচালনাযোগ্য ওয়ার্ডপ্রেস ওয়েবসাইট। এলিমেন্টর প্রক্সি এবং প্রিমিয়াম থিম ব্যবহার করে দ্রুত ডেলিভারি ও কাস্টমাইজেশন।",
    iconName: "Globe",
    priceText: "৳12,000 থেকে শুরু",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 63,
    packages: {
      basic: { name: "WordPress Landing Page", price: 12000, deliveryDays: 2, revisions: 3, features: ["Elementor Pro Design", "Contact Form", "Mobile Friendly"] },
      standard: { name: "Complete Business Site", price: 25000, deliveryDays: 5, revisions: 5, features: ["Up to 8 Pages", "Blog & Gallery", "Security Hardening"] },
      premium: { name: "WooCommerce E-Commerce Store", price: 45000, deliveryDays: 8, revisions: "Unlimited", features: ["bKash/Nagad Integration", "Inventory Mgmt", "Automated Invoice"] }
    },
    features: [
      "Elementor Pro Setup",
      "WooCommerce Payment Gateway Setup",
      "Fast Loading Speed Optimization",
      "Security & Malware Protection",
      "Video Tutorial for Admin"
    ],
    published: true,
    order: 7
  },
  {
    id: "branding",
    title: "Branding",
    category: "Design",
    shortDescription: "Complete digital branding and visual identity solutions.",
    fullDescription: "আপনার স্টার্টআপ বা রিননড ব্যবসার জন্য থ্রি-সিক্সটি ডিগ্রি ব্র্যান্ডিং সলিউশন। কনসেপ্ট আর্ট থেকে শুরু করে মার্কেটিং ম্যাটেরিয়াল তৈরি।",
    iconName: "Award",
    priceText: "৳20,000 প্যাকেজ",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 22,
    packages: {
      basic: { name: "Corporate Identity Pack", price: 20000, deliveryDays: 5, revisions: 3, features: ["Brand Style Guide", "Stationery Kit", "Social Media Cover"] },
      standard: { name: "Complete Brand Ecosystem", price: 45000, deliveryDays: 10, revisions: 5, features: ["Full Visual Identity", "Packaging Design", "Company Profile PDF"] },
      premium: { name: "360 Growth & Brand Takeover", price: 90000, deliveryDays: 20, revisions: "Unlimited", features: ["Design + Video + Web", "Trademark Prep", "National PR Kit"] }
    },
    features: [
      "Full Brand Guidelines Manual",
      "Stationery & Uniform Mockups",
      "Packaging Design",
      "Digital Presence Strategy",
      "Brand Storytelling"
    ],
    published: true,
    order: 8
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "PTENit HQ Office & Lab",
    category: "Office",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    caption: "উত্তরায় আমাদের আধুনিক অফিস ও প্র্যাকটিক্যাল কম্পিউটার ল্যাব"
  },
  {
    id: "gal-2",
    title: "Live Student Workshop",
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    caption: "লাইভ ব্যাচ শিক্ষার্থীদের সাথে হ্যাকথন ও প্র্যাকটিক্যাল সেশন"
  },
  {
    id: "gal-3",
    title: "Certificate Distribution Ceremony",
    category: "Events",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
    caption: "সফলভাবে কোর্স সম্পন্নকারীদের সার্টিফিকেট প্রদান অনুষ্ঠান"
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "মেহেদী হাসান",
    role: "ই-কমার্স উদ্যোক্তা",
    courseOrService: "Web Design & Development",
    rating: 5,
    text: "PTENit টিমের সার্ভিস সত্যিই প্রশংসনীয়। ৫ দিনে আমাদের অনলাইন কাপড়ের সাইট বানিয়ে দিয়েছেন এবং পেমেন্ট গেটওয়ে খুব সহজে কাজ করছে।",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-2",
    name: "সাবরিনা সুলতানা",
    role: "ফ্রিল্যান্সার & ডিজিটাল মার্কেটার",
    courseOrService: "PTE Academic - Basic Level",
    rating: 5,
    text: "তানভীর স্যারের PTE ক্লাসের টেকনিকগুলো অসাধারন। প্র্যাকটিস করে আমি একবারে পয়েন্ট ৭৯ পেয়েছি!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  }
];

export const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "PTENit Admin",
    email: "admin@ptenit.com",
    mobile: "01700000000",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    title: "Chief Executive Officer & Admin",
    createdAt: "2026-01-01"
  },
  {
    id: "teacher-1",
    name: "প্রকৌশলী আল-আমিন",
    email: "alamin@ptenit.com",
    mobile: "01711112233",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    title: "Senior Full Stack Architect & Lead Instructor",
    bio: "১০ বছরের অভিজ্ঞতা সম্পন্ন ফুল-স্ট্যাক ও ক্লাউড ইঞ্জিনিয়ার।",
    createdAt: "2026-01-05"
  },
  {
    id: "student-1",
    name: "সাব্বির রহমান",
    email: "student@ptenit.com",
    mobile: "01822334455",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    title: "Web Developer & Student",
    createdAt: "2026-01-10"
  },
  {
    id: "customer-1",
    name: "মেহেদী হাসান (PTENit ক্লায়েন্ট)",
    email: "customer@ptenit.com",
    mobile: "01988776655",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    title: "Business Owner & IT Client",
    createdAt: "2026-01-15"
  },
  {
    id: "mkt-seller-1",
    name: "সোহাগ কাজী (ফ্রিলা্যান্সার সেলার)",
    email: "seller@marketplace.com",
    mobile: "01799887766",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    title: "Top Rated Freelancer & Full-Stack Pro",
    bio: "মার্কেটপ্লেসের সার্টিফাইড টপ-রেটেড ফ্রিল্যান্সার ও গিগ ক্রিয়েটর।",
    createdAt: "2026-01-20"
  },
  {
    id: "mkt-buyer-1",
    name: "তানজিল তানভীর (মার্কেটপ্লেস বায়ার)",
    email: "buyer@marketplace.com",
    mobile: "01811223344",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    title: "Marketplace Business Buyer & Client",
    createdAt: "2026-01-22"
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: "enr-1",
    userId: "student-1",
    courseId: "course-canva",
    progress: 100,
    completedLessons: ["l-canva-1"],
    enrolledAt: "2026-01-12",
    status: "completed",
    certificateIssued: true,
    certificateId: "cert-1"
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: "cert-1",
    certificateCode: "CERT-PTEN-2026-0891",
    studentId: "student-1",
    studentName: "সাব্বির রহমান",
    courseId: "course-canva",
    courseName: "Canva Design & Freelancing Masterclass",
    issueDate: "2026-02-01",
    instructorName: "তানভীর আহমেদ",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CERT-PTEN-2026-0891"
  }
];

export const initialCourses: Course[] = [
  {
    id: "course-canva",
    title: "Canva Design & Freelancing Masterclass",
    instructor: "তানভীর আহমেদ",
    instructorRole: "Senior Graphic Designer & Freelancer",
    category: "Graphic Design",
    duration: "4 Weeks (12 Hours)",
    lessonsCount: 16,
    enrolledCount: 342,
    rating: 4.9,
    reviewsCount: 88,
    isFree: false,
    price: 1200,
    discountPrice: 850,
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    description: "ক্যানভা (Canva Pro) দিয়ে কোনো কোডিং বা কঠিন সফটওয়্যার ছাড়া প্রফেশনাল সোশ্যাল মিডিয়া গ্রাফিক্স, ইউটিউব থাম্বনেইল, ব্যানার, লোগো এবং প্রেসেন্টেশন তৈরি শিখুন। মার্কেটপ্লেসে ইনকাম শুরু করার সম্পূর্ণ ফ্রিল্যান্সিং গাইডলাইন।",
    whatYouWillLearn: [
      "Canva Pro-এর সকল প্রিমিয়াম ফিচারের ব্যবহার",
      "সোশ্যাল মিডিয়া পোস্ট ও কাভার ব্যানার ডিজাইন",
      "হাই-কনভার্টিং ইউটিউব থাম্বনেইল তৈরি",
      "ব্র্যান্ড লোগো, ভিজিটিং কার্ড ও লেটারহেড ডিজাইন",
      "Fiverr ও Upwork-এ ক্যানভা সার্ভিস বিক্রি করার ট্রিকস"
    ],
    requirements: [
      "একটি স্মার্টফোন বা ল্যাপটপ/কম্পিউটার",
      "ইন্টারনেট কানেকশন",
      "ডিজাইনের প্রতি আগ্রহ"
    ],
    tags: ["#CanvaDesign", "#GraphicDesign", "#Freelancing", "#Fiverr"],
    published: true,
    createdAt: "2026-01-10",
    assignedInstructorId: "teacher-1",
    offerStatus: "accepted",
    acceptedAt: "2026-01-20",
    targetModules: 4,
    targetLessons: 16,
    teacherCommissionRate: 35,
    modules: [
      {
        id: "m1",
        courseId: "course-canva",
        title: "Module 1: Canva Fundamentals & Pro Features",
        order: 1,
        lessons: [
          {
            id: "l1",
            courseId: "course-canva",
            moduleId: "m1",
            title: "Lesson 1: Introduction to Canva & Workspace",
            duration: "25 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdfResourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            content: "ক্যানভা ইন্টারফেস পরিচিতি এবং প্রফেশনাল ক্যানভা একাউন্ট কনফিগারেশন।",
            isFreePreview: true,
            order: 1
          },
          {
            id: "l2",
            courseId: "course-canva",
            moduleId: "m1",
            title: "Lesson 2: Typography & Color Science in Canva",
            duration: "30 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "ডিজাইনে সঠিক ফন্ট ও কালার নির্বাচন করার নিয়মাবলী।",
            isFreePreview: false,
            order: 2
          }
        ]
      },
      {
        id: "m2",
        courseId: "course-canva",
        title: "Module 2: Practical Projects & Freelancing",
        order: 2,
        lessons: [
          {
            id: "l3",
            courseId: "course-canva",
            moduleId: "m2",
            title: "Lesson 3: Designing Viral YouTube Thumbnails",
            duration: "40 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "উচ্চ সিটিআর (CTR) ইউটিউব থাম্বনেইল তৈরির গোপন টেকনিক।",
            isFreePreview: false,
            order: 3
          }
        ]
      }
    ]
  },
  {
    id: "course-yt-seo",
    title: "YouTube SEO & Channel Growth Blueprint",
    instructor: "কাজী সোহাগ",
    instructorRole: "Digital Marketing Specialist",
    category: "SEO",
    duration: "6 Weeks (20 Hours)",
    lessonsCount: 22,
    enrolledCount: 215,
    rating: 4.8,
    reviewsCount: 54,
    isFree: false,
    price: 5999,
    discountPrice: 3499,
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    description: "আপনার ইউটিউব চ্যানেলের ভিডিও গুগলে ও ইউটিউব সার্চের ১ম স্থানে র‍্যাংক করানোর কমপ্লিট এসইও মাস্টারক্লাস। টাইটেল, ট্যাগ, ডেসক্রিপশন, হ্যাশট্যাগ ও TubeBuddy/vidiQ টুলস ব্যবহার শিখুন।",
    whatYouWillLearn: [
      "YouTube Algorithm & Ranking Factors",
      "High Search Volume Keyword Research",
      "TubeBuddy & VidIQ Keyword Masterclass",
      "Click-Through-Rate (CTR) & Audience Retention Optimization",
      "Channel Monetization & Sponsor Management"
    ],
    requirements: [
      "কম্পিউটার/ল্যাপটপ বা অ্যান্ড্রয়েড ফোন",
      "বেসিক কম্পিউটার জানা থাকা ভালো"
    ],
    tags: ["#SEOExpert", "#YouTubeSEO", "#SearchEngineOptimization", "#Monetization"],
    published: true,
    createdAt: "2026-01-15",
    targetModules: 5,
    targetLessons: 22,
    teacherCommissionRate: 30,
    modules: [
      {
        id: "m-yt-1",
        courseId: "course-yt-seo",
        title: "Module 1: YouTube Algorithm & Basics",
        order: 1,
        lessons: [
          {
            id: "l-yt-1",
            courseId: "course-yt-seo",
            moduleId: "m-yt-1",
            title: "Lesson 1: How YouTube Algorithm Works in 2026",
            duration: "35 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            pdfResourceUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            content: "ইউটিউব এলগরিদম কিভাবে ভিডিও প্রমোট করে তা বিস্তারিত আলোচনা।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-fb-marketing",
    title: "Facebook Marketing & Paid Ads Mastery",
    instructor: "রেজওয়ান করিম",
    instructorRole: "FB Ads Strategist",
    category: "Digital Marketing",
    duration: "3 Weeks (10 Hours)",
    lessonsCount: 14,
    enrolledCount: 1250,
    rating: 4.9,
    reviewsCount: 310,
    isFree: true,
    price: 0,
    discountPrice: 0,
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "সম্পূর্ণ বিনামূল্যে ফেসবুক পেজ সেটআপ, অর্গানিক গ্রোথ, বিজনেস ম্যানেজার, মেটা পিক্সেল এবং প্রফেশনাল এডস রান করা শিখুন। সকল ছোট-বড় ব্যবসায়ীদের জন্য অত্যন্ত দরকারি কোর্স।",
    whatYouWillLearn: [
      "Facebook Business Page Professional Setup",
      "Meta Business Suite & Ads Manager Setup",
      "Targeted Audience Custom & Lookalike Audiences",
      "Budgeting & Campaign Bidding Strategies",
      "Ad Creative Writing & High Conversion Tips"
    ],
    requirements: [
      "ইন্টারনেট কানেকশন সহ মোবাইল বা কম্পিউটার",
      "একটি ফেসবুক অ্যাকাউন্ট"
    ],
    tags: ["#Facebook", "#DigitalMarketing", "#Ads", "#Freelancing", "#FreeCourse"],
    published: true,
    createdAt: "2026-02-01",
    modules: [
      {
        id: "m-fb-1",
        courseId: "course-fb-marketing",
        title: "Module 1: Page Setup & Business Suite",
        order: 1,
        lessons: [
          {
            id: "l-fb-1",
            courseId: "course-fb-marketing",
            moduleId: "m-fb-1",
            title: "Lesson 1: FB Page Optimization & Branding",
            duration: "20 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "পেজের ইউজারনেম, কভার আর্ট ও সিটিএ বাটন সেটআপ।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-wp-dev",
    title: "Complete WordPress & E-Commerce Development",
    instructor: "শাহরিয়ার হাসান",
    instructorRole: "Full Stack Developer",
    category: "Web Development",
    duration: "8 Weeks (28 Hours)",
    lessonsCount: 32,
    enrolledCount: 180,
    rating: 4.9,
    reviewsCount: 42,
    isFree: false,
    price: 4500,
    discountPrice: 2999,
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    description: "কোডিং ছাড়া প্রফেশনাল ই-কমার্স ওয়েবসাইট, ল্যান্ডিং পেজ, ব্লগ ও কর্পোরেট ওয়েবসাইট তৈরি শিখুন। bKash/Nagad পেমেন্ট গেটওয়ে সেটআপ সহ ক্লায়েন্ট হ্যান্ডলিং।",
    whatYouWillLearn: [
      "Domain & Hosting Setup Masterclass",
      "Elementor Pro Page Builder Mastery",
      "WooCommerce Online Shop Development",
      "bKash & Nagad Payment Gateway Setup",
      "Website Security & Backup Systems"
    ],
    requirements: [
      "ল্যাপটপ বা কম্পিউটার (কমপক্ষে ৪জিবি র‍্যাম)",
      "কম্পিউটার চালানোর প্রাথমিক ধারণা"
    ],
    tags: ["#WordPress", "#WooCommerce", "#WebDevelopment", "#Elementor"],
    published: true,
    createdAt: "2026-02-10",
    modules: [
      {
        id: "m-wp-1",
        courseId: "course-wp-dev",
        title: "Module 1: WordPress Installation & Theme Setup",
        order: 1,
        lessons: [
          {
            id: "l-wp-1",
            courseId: "course-wp-dev",
            moduleId: "m-wp-1",
            title: "Lesson 1: Localhost & Live Server Installation",
            duration: "30 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "XAMPP এবং লাইভ সিপ্যানেলে ওয়ার্ডপ্রেস ইনস্টলেশন।",
            isFreePreview: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "course-pte-basic-2026",
    title: "PTE Academic - Basic Level (Foundation & Fundamentals 2026)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "basic",
    instructorRole: "PTE Certified Trainer",
    category: "PTE Academic",
    duration: "4 Weeks (15 Hours)",
    lessonsCount: 12,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 3500,
    discountPrice: 2200,
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত বেসিক কোর্স। PTE Speaking, Writing, Reading & Listening সেকশনের বেসিক ফরম্যাট, টেমপ্লেট ও ফাউন্ডেশন প্র্যাকটিস।",
    whatYouWillLearn: [
      "PTE 4 Sections Basic Structure & Scoring Rules",
      "Pronunciation & Fluency Foundation",
      "Basic Essay Template & Summarize Text Rules"
    ],
    requirements: ["বেসিক ইংরেজি জানা আবশ্যক"],
    tags: ["#PTEBasic", "#StudyAbroad"],
    published: true,
    createdAt: "2026-02-10",
    targetModules: 4,
    targetLessons: 12,
    teacherCommissionRate: 35,
    modules: []
  },
  {
    id: "course-pte-masterclass-2026",
    title: "PTE Academic - Advanced Level (79+ Target Masterclass 2026)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "advanced",
    instructorRole: "PTE Certified Trainer",
    category: "PTE Academic",
    duration: "5 Weeks (20 Hours)",
    lessonsCount: 16,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 6500,
    discountPrice: 4200,
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত এডভান্সড কোর্স। PTE Speaking, Writing, Reading & Listening সেকশনে 79+ স্কোর তোলার কৌশল ও AI মডেল মক টেস্ট প্র্যাকটিস।",
    whatYouWillLearn: [
      "PTE Speaking Describe Image & Read Aloud Standard",
      "PTE Writing Essay Template & Grammar Rules",
      "PTE Listening Summarize Spoken Text Mastery",
      "Real AI Evaluation & Live Mock Test Practice"
    ],
    requirements: [
      "হেডফোন সহ ল্যাপটপ বা কম্পিউটার",
      "ইংরেজি ইন্টারমিডিয়েট লেভেল"
    ],
    tags: ["#PTEAcademic", "#PTEPreparation", "#StudyAbroad"],
    published: true,
    createdAt: "2026-02-15",
    targetModules: 5,
    targetLessons: 16,
    teacherCommissionRate: 40,
    modules: []
  },
  {
    id: "course-pte-pro-2026",
    title: "PTE Academic - Professional Level (Trainer Certification & AI Scoring)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "PTE Master Trainer",
    category: "PTE Academic",
    duration: "8 Weeks (32 Hours)",
    lessonsCount: 24,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 9500,
    discountPrice: 6800,
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    description: "মেইন এডমিন কর্তৃক অফারকৃত প্রফেশনাল কোর্স। PTE ফুল মক টেস্ট, স্পেশাল এআই স্কোরিং এনালাইসিস এবং ট্রেইনার লেভেল মাস্টারি।",
    whatYouWillLearn: [
      "Full Mock Test with AI Band Breakdown",
      "1-on-1 Trainer Evaluation & Accent Training",
      "Advanced Fast Scoring Hacks"
    ],
    requirements: ["PTE Advanced level experience"],
    tags: ["#PTEPro", "#PTEMastery"],
    published: true,
    createdAt: "2026-02-18",
    targetModules: 8,
    targetLessons: 24,
    teacherCommissionRate: 50,
    modules: []
  },
  {
    id: "course-web-basic-2026",
    title: "Full Stack Web Development - Basic (HTML, CSS & JS Fundamentals)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "basic",
    instructorRole: "Senior Software Engineer",
    category: "Web Development",
    duration: "6 Weeks (24 Hours)",
    lessonsCount: 18,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 4500,
    discountPrice: 2800,
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    description: "ওয়েব ডেভেলপমেন্টের বেসিক ফাউন্ডেশন কোর্স। শূন্য থেকে HTML5, CSS3, Tailwind এবং JavaScript শিখে ওয়েবসাইট তৈরি করুন।",
    whatYouWillLearn: ["HTML5 & Responsive CSS3", "Tailwind CSS Layouts", "JavaScript Essentials & DOM manipulation"],
    requirements: ["কম্পিউটার বা ল্যাপটপ"],
    tags: ["#WebDevBasic", "#HTML", "#CSS"],
    published: true,
    createdAt: "2026-02-12",
    targetModules: 4,
    targetLessons: 18,
    teacherCommissionRate: 35,
    modules: []
  },
  {
    id: "course-web-pro-2026",
    title: "Full Stack Web Development - Professional (Enterprise Microservices & Cloud)",
    instructor: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
    assignedInstructorId: "teacher-1",
    offerStatus: "offered",
    isPublicOffer: true,
    level: "professional",
    instructorRole: "Senior Software Engineer",
    category: "Web Development",
    duration: "10 Weeks (40 Hours)",
    lessonsCount: 30,
    enrolledCount: 0,
    rating: 5.0,
    reviewsCount: 0,
    isFree: false,
    price: 12000,
    discountPrice: 8500,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "প্রফেশনাল লেভেল ওয়েব ডেভেলপমেন্ট কোর্স। React, Node.js, Docker, Kubernetes এবং ক্লাউড মাইক্রোসার্ভিসেস আর্কিটেকচার।",
    whatYouWillLearn: ["Microservices Architecture", "Docker & Kubernetes Deployment", "Advanced Node.js & Cloud Scaling"],
    requirements: ["React & Node.js অভিজ্ঞতা"],
    tags: ["#WebDevPro", "#FullStack", "#Cloud"],
    published: true,
    createdAt: "2026-02-20",
    targetModules: 8,
    targetLessons: 30,
    teacherCommissionRate: 50,
    modules: []
  }
];

export const initialGigs: MarketplaceGig[] = [
  {
    id: "gig-1",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Senior Full Stack Architect & Tech Lead",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ফুল-স্ট্যাক রিয়েক্ট, নেক্সট-জেএস এবং নোড-জেএস কাস্টম ওয়েব অ্যাপ ডেভেলপ করবো",
    category: "Web Development",
    description: "আপনার স্টার্টআপ বা ব্যবসার জন্য হাই-পারফরম্যান্স স্পিডি ওয়েব অ্যাপ্লিকেশন। রেসপন্সিভ ইউআই, নিরাপদ ব্যাকএন্ড এবং রিয়েলটাইম ডাটাবেস ইন্টিগ্রেশন।",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Single Page App", price: 8500, deliveryDays: 3, revisions: 3, features: ["১টি ল্যান্ডিং পেজ", "Tailwind UI", "মোবাইল ফ্রেন্ডলি"] },
      standard: { name: "Full Dynamic Website", price: 22000, deliveryDays: 7, revisions: 5, features: ["৫টি ডায়নামিক পেজ", "Admin Panel", "API Setup", "Database"] },
      premium: { name: "Enterprise Custom SaaS", price: 45000, deliveryDays: 14, revisions: "Unlimited", features: ["Full SaaS Engine", "Payment Gateway", "Deployment", "6 Months Support"] }
    },
    rating: 4.9,
    reviewsCount: 42,
    salesCount: 58,
    status: "active",
    offerBadge: "আগে কাজ শুরু",
    createdAt: "2026-01-10"
  },
  {
    id: "gig-2",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Digital Marketing Specialist & Media Buyer",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি সেলস বাড়াতে টার্গেটেড ফেসবুক, ইন্সটাগ্রাম ও গুগল অ্যাডস ক্যাম্পেইন সেটআপ করবো",
    category: "Digital Marketing",
    description: "পিক্সেল সেটআপ, কনভার্সন ট্র্যাকিং, কাস্টম অডিয়েন্স এবং রিটার্গেটিং অ্যাডসের মাধ্যমে সেলস ৫ গুণ বৃদ্ধি করুন।",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Ad Setup Starter", price: 3500, deliveryDays: 2, revisions: 2, features: ["১টি ক্যাম্পেইন", "অডিয়েন্স রিসার্চ"] },
      standard: { name: "Growth Funnel", price: 8000, deliveryDays: 5, revisions: 3, features: ["৩টি ক্যাম্পেইন", "Pixel Setup", "A/B Test"] },
      premium: { name: "Monthly Growth Partner", price: 18000, deliveryDays: 30, revisions: "Unlimited", features: ["৩০ দিন ফুল এড ম্যানেজমেন্ট", "আনলিমিটেড ক্যাম্পেইন"] }
    },
    rating: 4.8,
    reviewsCount: 35,
    salesCount: 48,
    status: "active",
    offerBadge: "৩০% ছাড়",
    createdAt: "2026-01-12"
  },
  {
    id: "gig-3",
    sellerId: "student-1",
    sellerName: "সাব্বির রহমান",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Professional Canva & Graphic Designer",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি আকর্ষণীয় সোশ্যাল মিডিয়া ব্যানার, লোগো এবং থাম্বনেইল ডিজাইন করবো",
    category: "Graphic Design",
    description: "আপনার ব্র্যান্ডিং বাড়াতে প্রফেশনাল লোগো, ফেসবুক কভার, ইউটিউব থাম্বনেইল ও এড কভার ডিজাইন।",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Single Creative", price: 1200, deliveryDays: 1, revisions: 3, features: ["২টি সোশ্যাল ব্যানার", "HD PNG/JPG"] },
      standard: { name: "Brand Starter Pack", price: 3500, deliveryDays: 2, revisions: 5, features: ["১টি লোগো", "৫টি ব্যানার", "Print Ready File"] },
      premium: { name: "Full Social Branding", price: 7500, deliveryDays: 4, revisions: "Unlimited", features: ["১৫টি কভার/পোস্ট", "সোর্স ফাইল (PSD/Canva)"] }
    },
    rating: 4.9,
    reviewsCount: 22,
    salesCount: 29,
    status: "active",
    createdAt: "2026-01-20"
  },
  {
    id: "gig-4",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Mobile App Architect (PTENit Core Team)",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি এন্ড্রয়েড ও আইওএস এর জন্য ক্রস-প্ল্যাটফর্ম ফ্ল্যাটার মোবাইল অ্যাপ তৈরি করবো",
    category: "Mobile App Development",
    description: "সিঙ্গেল কোডবেসে অ্যান্ড্রয়েড ও আইওএস অ্যাপ। রেসপন্সিভ ইউআই, ফায়ারবেস পুশ নোটিফিকেশন ও দ্রুত পারফরম্যান্স।",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Flutter UI", price: 15000, deliveryDays: 5, revisions: 3, features: ["৩টি রেসপন্সিভ স্ক্রিন", "Firebase Setup"] },
      standard: { name: "Standard App with Backend", price: 35000, deliveryDays: 12, revisions: 5, features: ["৮টি স্ক্রিন", "REST API", "Auth & DB"] },
      premium: { name: "Complete Enterprise App", price: 75000, deliveryDays: 25, revisions: "Unlimited", features: ["Full App", "Play Store & App Store Publish", "1 Year Maintenance"] }
    },
    rating: 5.0,
    reviewsCount: 19,
    salesCount: 24,
    status: "active",
    createdAt: "2026-01-18"
  },
  {
    id: "gig-5",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "SEO & Growth Marketing Lead",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি ইউটিউব চ্যানেল এসইও, ট্যাগ রিচার্জ এবং ভিডিও র্যাঙ্কিং অপটিমাইজেশন করবো",
    category: "Digital Marketing",
    description: "অর্গানিক ভিউ এবং সাবস্ক্রাইবার বাড়াতে সঠিক কিওয়ার্ড রিসার্চ, কাস্টম ট্যাগস ও এসইও ফ্রেন্ডলি টাইটেল প্রোভাইড করবো।",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "3 Videos SEO", price: 2500, deliveryDays: 2, revisions: 2, features: ["৩টি ভিডিও SEO", "Keyword Research"] },
      standard: { name: "10 Videos Channel SEO", price: 6500, deliveryDays: 4, revisions: 4, features: ["১০টি ভিডিও SEO", "Channel Audit", "Competitor Analysis"] },
      premium: { name: "Full Channel Growth Pack", price: 15000, deliveryDays: 15, revisions: "Unlimited", features: ["৩০টি ভিডিও SEO", "Thumbnail Strategy", "Monthly Strategy Call"] }
    },
    rating: 4.8,
    reviewsCount: 31,
    salesCount: 39,
    status: "active",
    offerBadge: "আগে কাজ শুরু",
    createdAt: "2026-01-22"
  },
  {
    id: "gig-6",
    sellerId: "student-2",
    sellerName: "রাফসান সানি",
    sellerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "UI/UX & Product Designer",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি ফিগমাতে ওয়েবসাইট ও মোবাইল অ্যাপের জন্য মডার্ন ইউআই/ইউএক্স ডিজাইন করবো",
    category: "Graphic Design",
    description: "ইউজার ফ্রেন্ডলি এবং নান্দনিক মোবাইল বা ওয়েব ইন্টারফেস ডিজাইন। ফিগমা প্রোটোটাইপ এবং ইউআই কিট হ্যান্ডঅফ।",
    thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Landing Page Figma", price: 4000, deliveryDays: 2, revisions: 3, features: ["১টি ল্যান্ডিং পেজ", "Figma File", "Mobile Version"] },
      standard: { name: "Full Website UI (5 Pages)", price: 12000, deliveryDays: 5, revisions: 5, features: ["৫টি পেজ ইউআই", "Design System", "Interactive Prototype"] },
      premium: { name: "Full Mobile App UX (15 Screens)", price: 25000, deliveryDays: 10, revisions: "Unlimited", features: ["১৫টি স্ক্রিন UX", "User Flow Chart", "Developer Handoff"] }
    },
    rating: 4.9,
    reviewsCount: 16,
    salesCount: 20,
    status: "active",
    createdAt: "2026-01-25"
  },
  {
    id: "gig-7",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "WordPress & Performance Specialist",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ওয়ার্ডপ্রেস ওয়েবসাইটের স্পিড এবং সিকিউরিটি অপটিমাইজেশন ৯০+ স্কোরে নিয়ে যাবো",
    category: "Web Development",
    description: "গুগল পেজস্পিড ইনসাইটসে 90+ স্কোর এচিভ করতে ডাটাবেস ক্লিনআপ, ইমেজ কম্প্রেশন এবং সিকিউরিটি ওয়াল সেটআপ।",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Speed Boost", price: 3000, deliveryDays: 1, revisions: 2, features: ["Mobile 80+ Speed", "Cache Setup"] },
      standard: { name: "Pro Speed & Malware Clean", price: 7000, deliveryDays: 2, revisions: 4, features: ["90+ PageSpeed", "Malware Removal", "SSL & Firewall"] },
      premium: { name: "Full Security & Cloudflare Pro", price: 14000, deliveryDays: 4, revisions: "Unlimited", features: ["Full Hardening", "Cloudflare CDN Pro", "1 Month Monitoring"] }
    },
    rating: 5.0,
    reviewsCount: 28,
    salesCount: 35,
    status: "active",
    createdAt: "2026-01-28"
  },
  {
    id: "gig-8",
    sellerId: "student-3",
    sellerName: "তামিম ইকবাল",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Video Editor & Motion Artist",
    sellerRating: 4.7,
    isAgencyStaff: false,
    title: "আমি ফেসবুক রিলস, টিকটক এবং ইউটিউব শর্টসের জন্য হাই-এনগেজিং ভিডিও এডিটিং করবো",
    category: "Video Editing",
    description: "এলেক্স হরমোজি স্টাইলের ট্রেন্ডি ক্যাপশন, কালার গ্রেডিং, সাউন্ড ইফেক্ট এবং বি-রোল ফুটেজ এড করে ভিডিও এডিট।",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "1 Short Video (60s)", price: 1500, deliveryDays: 1, revisions: 2, features: ["১টি রিল/শর্টস", "Captions & SFX"] },
      standard: { name: "5 Shorts Pack", price: 6000, deliveryDays: 3, revisions: 4, features: ["৫টি রিল/শর্টস", "Color Grading", "Motion Graphics"] },
      premium: { name: "15 Shorts Monthly Pack", price: 16000, deliveryDays: 10, revisions: "Unlimited", features: ["১৫টি ভিডিও", "Hook Generation", "Background Music"] }
    },
    rating: 4.7,
    reviewsCount: 14,
    salesCount: 18,
    status: "active",
    createdAt: "2026-02-01"
  },
  {
    id: "gig-9",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Laravel Backend Engineer (PTENit Core Team)",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি লারাভেল (Laravel) পিএইচপি দিয়ে এন্টারপ্রাইজ ওয়েব পোর্টাল ও রেস্ট এপিআই তৈরি করবো",
    category: "Web Development",
    description: "নিরাপদ পিএইচপি লারাভেল আর্কিটেকচার, কাস্টম সিআরএম, ই-কমার্স বা স্কুলের ম্যানেজমেন্ট পোর্টাল ডেভেলপমেন্ট।",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "API Module", price: 6000, deliveryDays: 3, revisions: 2, features: ["REST API Endpoints", "JWT Auth"] },
      standard: { name: "Custom Laravel Web App", price: 25000, deliveryDays: 8, revisions: 5, features: ["Full CRUD System", "Admin Dashboard", "bKash Integration"] },
      premium: { name: "Enterprise Portal & API", price: 55000, deliveryDays: 18, revisions: "Unlimited", features: ["Complex CRM/ERP", "Payment Gateway", "Deployment & Support"] }
    },
    rating: 5.0,
    reviewsCount: 12,
    salesCount: 15,
    status: "active",
    createdAt: "2026-02-02"
  },
  {
    id: "gig-10",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "SEO & Growth Marketing Lead",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি আপনার ওয়েবসাইটের সম্পূর্ণ অন-পেজ এবং টেকনিক্যাল এসইও র্যাঙ্কিং অডিট করবো",
    category: "Digital Marketing",
    description: "গুগলে ফার্স্ট পেজে র‍্যাংক করার জন্য টেকনিক্যাল ফিক্স, ক্যানোনিকাল ট্যাগ, মেটা টাইটেল, এইচ১ রি-রাইট এবং অন-পেজ SEO।",
    thumbnail: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Technical Audit Report", price: 2000, deliveryDays: 1, revisions: 2, features: ["Full Audit PDF", "Actionable Plan"] },
      standard: { name: "On-Page SEO (10 Pages)", price: 7500, deliveryDays: 4, revisions: 4, features: ["১০ পেজ SEO", "Sitemap & Indexing", "Meta Tags Fix"] },
      premium: { name: "Full Monthly SEO Service", price: 20000, deliveryDays: 30, revisions: "Unlimited", features: ["On-page + Technical", "High DA Backlinks", "Monthly Rank Report"] }
    },
    rating: 4.8,
    reviewsCount: 26,
    salesCount: 31,
    status: "active",
    createdAt: "2026-02-03"
  },
  {
    id: "gig-11",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "AI & ML Solutions Lead",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি আপনার ব্যবসার কাস্টমার সাপোর্টের জন্য এআই চ্যাটবট (OpenAI/Gemini) ইন্টিগ্রেট করবো",
    category: "AI & Automation",
    description: "আপনার ওয়েবসাইট বা হোয়াটসঅ্যাপে ২৪/৭ কাস্টমার অটো-রিপ্লাইয়ের জন্য কাস্টম ট্রেইনড এআই চ্যাটবট ডেভেলপমেন্ট।",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Web Chatbot", price: 10000, deliveryDays: 3, revisions: 3, features: ["OpenAI API Setup", "Custom FAQ Training"] },
      standard: { name: "Smart Support Bot", price: 25000, deliveryDays: 7, revisions: 5, features: ["Database Lookup", "Multi-Language (Bangla/Eng)", "Lead Capture"] },
      premium: { name: "Enterprise Omni-channel Bot", price: 60000, deliveryDays: 15, revisions: "Unlimited", features: ["Website + FB + WhatsApp", "Fine-tuned Model", "Analytics Admin"] }
    },
    rating: 5.0,
    reviewsCount: 9,
    salesCount: 11,
    status: "active",
    createdAt: "2026-02-04"
  },
  {
    id: "gig-12",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "DevOps & Cloud Specialist",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি লিনাক্স ভিপিএস, সিপ্যানেল, এসএসএল এবং ক্লাউড সার্ভার মাইগ্রেশন সাপোর্ট দেবো",
    category: "Cyber Security & Server",
    description: "AWS, DigitalOcean, Hetzner সার্ভারে Ubuntu, Nginx, Docker সেটআপ, জিরো ডাউনটাইম মাইগ্রেশন ও ফ্রি SSL সার্টিফিকেট।",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "SSL & Server Fix", price: 2000, deliveryDays: 1, revisions: 2, features: ["Free SSL Setup", "Nginx Configuration"] },
      standard: { name: "Zero Downtime Migration", price: 6000, deliveryDays: 2, revisions: 3, features: ["Database & File Migration", "DNS Setup", "Performance Check"] },
      premium: { name: "Full VPS / Docker Infra", price: 15000, deliveryDays: 4, revisions: "Unlimited", features: ["Dockerization", "CI/CD Pipeline", "Security Hardening"] }
    },
    rating: 5.0,
    reviewsCount: 21,
    salesCount: 26,
    status: "active",
    createdAt: "2026-02-05"
  },
  {
    id: "gig-13",
    sellerId: "student-4",
    sellerName: "ফারহানা ইয়াসমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Content Writer & Translator",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি এসইও ফ্রেন্ডলি বাংলা ও ইংরেজি ব্লগ পোস্ট, আর্টিকেল এবং ওয়েবসাইট কন্টেন্ট লিখবো",
    category: "Content Writing",
    description: "প্ল্যাজিয়ারিজম-ফ্রি, গ্রামারটিক্যালি নির্ভুল ও সুন্দর উপস্থাপনায় টেক, বিজনেস, লাইফস্টাইল আর্টিকেল রাইটিং।",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "1000 Words Article", price: 1000, deliveryDays: 1, revisions: 3, features: ["১০০০ শব্দ কন্টেন্ট", "SEO Keyword Placement"] },
      standard: { name: "3000 Words Package", price: 2800, deliveryDays: 3, revisions: 5, features: ["৩০০০ শব্দ", "Meta Description", "Royalty Free Images"] },
      premium: { name: "Full Website Copywriting", price: 7500, deliveryDays: 6, revisions: "Unlimited", features: ["৫টি পেজের ফুল কন্টেন্ট", "High Converting Headlines"] }
    },
    rating: 4.9,
    reviewsCount: 18,
    salesCount: 23,
    status: "active",
    createdAt: "2026-02-06"
  },
  {
    id: "gig-14",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "E-Commerce & Shopify Architect",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি শপিফাই (Shopify) স্টোর সেটআপ, কাস্টম থিম এবং ড্রপশিপিং কনফিগারেশন করবো",
    category: "Web Development",
    description: "প্রফেশনাল শপিফাই ই-কমার্স স্টোর। উইনিং প্রোডাক্ট ইমপোর্ট, পেমেন্ট গেটওয়ে সেটআপ এবং হাই-কনভার্টিং লেআউট।",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Shopify Starter", price: 6000, deliveryDays: 2, revisions: 3, features: ["Basic Theme Setup", "৫টি প্রোডাক্ট"] },
      standard: { name: "Pro E-Commerce Store", price: 18000, deliveryDays: 5, revisions: 5, features: ["Premium Theme", "২০টি প্রোডাক্ট", "Payment & Courier Integration"] },
      premium: { name: "Turnkey Automated Store", price: 38000, deliveryDays: 10, revisions: "Unlimited", features: ["Winning Products Research", "Automated Order System", "Marketing Apps"] }
    },
    rating: 5.0,
    reviewsCount: 15,
    salesCount: 20,
    status: "active",
    createdAt: "2026-02-07"
  },
  {
    id: "gig-15",
    sellerId: "student-3",
    sellerName: "তামিম ইকবাল",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "2D Animator & Motion Designer",
    sellerRating: 4.8,
    isAgencyStaff: false,
    title: "আমি ব্যবসার প্রচারের জন্য ২ডি এনিমেটেড এক্সপ্লেইনার ভিডিও ও প্রমো তৈরি করবো",
    category: "Video Editing",
    description: "আকর্ষণীয় ক্যারেক্টার এনিমেশন, ভয়েসওভার ও বিজিএম সহ ২ডি এনিমেটেড প্রোমোশনাল ভিডিও এডিটিং।",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "30 Second Explainer", price: 5000, deliveryDays: 3, revisions: 3, features: ["৩০ সেকেন্ড ভিডিও", "Full HD 1080p", "Sound Effects"] },
      standard: { name: "60 Second Explainer", price: 11000, deliveryDays: 5, revisions: 5, features: ["৬০ সেকেন্ড ভিডিও", "Voiceover Sync", "Script Assistance"] },
      premium: { name: "2 Min Pro Brand Video", price: 22000, deliveryDays: 10, revisions: "Unlimited", features: ["১২০ সেকেন্ড ভিডিও", "Custom Characters", "Commercial Rights"] }
    },
    rating: 4.8,
    reviewsCount: 11,
    salesCount: 14,
    status: "active",
    createdAt: "2026-02-08"
  },
  {
    id: "gig-16",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Certified Ethical Hacker & Security Engineer",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি আপনার ওয়েবসাইটের সাইবার সিকিউরিটি অডিট ও পেনিট্রেশন টেস্টিং করবো",
    category: "Cyber Security & Server",
    description: "SQL Injection, XSS, CSRF এবং ব্যাকডোর দুর্বলতা খুঁজে প্যাচ করার জন্য প্রফেশনাল সিকিউরিটি অডিট।",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Vulnerability Scan", price: 5000, deliveryDays: 2, revisions: 2, features: ["Automated Pentest", "Vulnerability Report"] },
      standard: { name: "Manual PenTest & Patching", price: 18000, deliveryDays: 5, revisions: 4, features: ["Manual Penetration Test", "Patch Assistance", "WAF Configuration"] },
      premium: { name: "Enterprise Security Certification", price: 45000, deliveryDays: 12, revisions: "Unlimited", features: ["Deep Source Code Audit", "Full Patching", "Certificate of Audit"] }
    },
    rating: 5.0,
    reviewsCount: 8,
    salesCount: 10,
    status: "active",
    createdAt: "2026-02-09"
  },
  {
    id: "gig-17",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Python Developer & Automation Expert",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি পাইথন দিয়ে অটোমেশন স্ক্রিপ্ট, ওয়েব স্ক্র্যাপিং ও ডাটা এক্সট্র্যাকশন করবো",
    category: "AI & Automation",
    description: "যেকোনো ওয়েবসাইট থেকে ডাটা স্ক্র্যাপ করে Excel/CSV বা ডাটাবেসে সেভ করার কাস্টম পাইথন অটোমেশন বোট।",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Simple Scraper Script", price: 3000, deliveryDays: 1, revisions: 2, features: ["1 Site Scraper", "Excel Output"] },
      standard: { name: "Automated Bot with GUI", price: 9000, deliveryDays: 3, revisions: 4, features: ["Complex Scraping", "Desktop Interface", "Anti-Bot Bypass"] },
      premium: { name: "Enterprise Scraping Pipeline", price: 22000, deliveryDays: 7, revisions: "Unlimited", features: ["Scheduled Scraping", "Database Integration", "Proxy Rotation"] }
    },
    rating: 5.0,
    reviewsCount: 17,
    salesCount: 22,
    status: "active",
    createdAt: "2026-02-10"
  },
  {
    id: "gig-18",
    sellerId: "student-2",
    sellerName: "রাফসান সানি",
    sellerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Brand Identity Specialist",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি আপনার কোম্পানির ব্র্যান্ড আইডেন্টিটি, ভিজিটিং কার্ড ও ব্র্যান্ড গাইডলাইন বানাবো",
    category: "Graphic Design",
    description: "একটি প্রফেশনাল ব্র্যান্ডের জন্য ভেক্টর লোগো, ভিজিটিং কার্ড, প্যাড, ইনভয়েস ও কালার প্যালেট তৈরি।",
    thumbnail: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Visiting Card & Letterhead", price: 1500, deliveryDays: 1, revisions: 3, features: ["Double Sided Card", "Print Ready PDF"] },
      standard: { name: "Logo + Stationery Kit", price: 5000, deliveryDays: 3, revisions: 5, features: ["Vector Logo", "Business Card", "Envelop & Pad"] },
      premium: { name: "Complete Brand Style Guide", price: 14000, deliveryDays: 7, revisions: "Unlimited", features: ["Full Brand Book", "Typography", "Usage Rules & Mockups"] }
    },
    rating: 4.9,
    reviewsCount: 13,
    salesCount: 16,
    status: "active",
    createdAt: "2026-02-11"
  },
  {
    id: "gig-19",
    sellerId: "teacher-1",
    sellerName: "তানভীর আহমেদ",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "PTE Master Trainer & Lead Assessor",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি আপনার PTE/IELTS রাইটিং ও স্পিকিং টেস্ট অ্যাসেস করে ব্যান্ড স্কোর ফিডব্যাক দেবো",
    category: "Education & Training",
    description: "PTE Academic রাইটিং এসে, রাইট ফ্রম ডিকটেশন এবং স্পিকিং রেকর্ডিং ইভালুয়েশন করে স্পেশাল স্কোর ইমপ্রুভমেন্ট টিপস।",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "1 Essay Feedback", price: 1000, deliveryDays: 1, revisions: 2, features: ["Detailed Scoring", "Grammar & Vocab Edits"] },
      standard: { name: "Full Speaking & Writing Mock", price: 3500, deliveryDays: 2, revisions: 3, features: ["1 Mock Evaluation", "1-on-1 20m Zoom Session"] },
      premium: { name: "5 Mocks + Live Mentorship", price: 9500, deliveryDays: 7, revisions: "Unlimited", features: ["5 Full Mocks", "Custom Hacks", "Direct WhatsApp Support"] }
    },
    rating: 5.0,
    reviewsCount: 25,
    salesCount: 30,
    status: "active",
    createdAt: "2026-02-12"
  },
  {
    id: "gig-20",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Senior Cross Platform Engineer",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি রিয়েক্ট নেটিভ (React Native) মোবাইল অ্যাপের বাগ ফিক্সিং ও নতুন ফিচার যোগ করবো",
    category: "Mobile App Development",
    description: "বিদ্যমান React Native অ্যাপের পারফরম্যান্স ইস্যু, ক্যাশ ক্র্যাশ, থার্ড পার্টি এসডিকে বা ব্যাকএন্ড এপিআই ইস্যু সলভ।",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Single Bug Fix", price: 2500, deliveryDays: 1, revisions: 2, features: ["১টি বাগ ফিক্স", "Performance Check"] },
      standard: { name: "Feature Integration", price: 8000, deliveryDays: 3, revisions: 4, features: ["নতুন ফিচার/স্ক্রিন", "API Connection"] },
      premium: { name: "App Refactoring & Upgrade", price: 20000, deliveryDays: 7, revisions: "Unlimited", features: ["Full Refactoring", "SDK Updates", "Play/App Store Update"] }
    },
    rating: 5.0,
    reviewsCount: 10,
    salesCount: 13,
    status: "active",
    createdAt: "2026-02-13"
  },
  {
    id: "gig-21",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Automation & Growth Lead",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি ফেসবুক মেসেঞ্জার ও হোয়াটসঅ্যাপের জন্য মেনিচ্যাট (ManyChat) অটোমেশন বোট বানাবো",
    category: "AI & Automation",
    description: "আপনার পেইজের কমেন্টে অটো রিপ্লাই, ইনবক্সে মেসেজ ফ্লো এবং হোয়াটসঅ্যাপে ক্যাটাগরি দেখিয়ে প্রোডাক্ট অর্ডার কনফার্মেশন।",
    thumbnail: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Auto Reply Setup", price: 2000, deliveryDays: 1, revisions: 2, features: ["Comment to Inbox Bot", "Welcome Message"] },
      standard: { name: "Full E-Commerce Bot Flow", price: 6500, deliveryDays: 3, revisions: 4, features: ["Product Catalog Flow", "Lead Form Capture", "Broadcast Flow"] },
      premium: { name: "WhatsApp & Messenger Automation", price: 15000, deliveryDays: 6, revisions: "Unlimited", features: ["WhatsApp Business API Integration", "CRM Connection"] }
    },
    rating: 4.8,
    reviewsCount: 19,
    salesCount: 25,
    status: "active",
    createdAt: "2026-02-14"
  },
  {
    id: "gig-22",
    sellerId: "student-1",
    sellerName: "সাব্বির রহমান",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Canva Design Specialist",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি এডিটেবল ক্যানভা প্রফেশনাল টেমপ্লেট ও বিজনেস প্রেজেন্টেশন স্লাইড ডিজাইন করবো",
    category: "Graphic Design",
    description: "পরবর্তীতে টেক্সট ও ছবি পরিবর্তন করা যায় এমন ইজি-টু-ইউজ Canva প্রফেশনাল স্লাইড, ফ্লায়ার ও সোশ্যাল মিডিয়া কিট।",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a3172720177?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "10 Canva Templates", price: 1500, deliveryDays: 1, revisions: 3, features: ["১০টি এডিটেবল টেমপ্লেট", "Canva Share Link"] },
      standard: { name: "Investor Pitch Deck (15 Slides)", price: 4500, deliveryDays: 3, revisions: 5, features: ["১৫ স্লাইড প্রেজেন্টেশন", "Custom Graphics & Charts"] },
      premium: { name: "30 Days Social Content Pack", price: 9000, deliveryDays: 5, revisions: "Unlimited", features: ["৩০টি আলাদা পোস্ট ডিজাইন", "Reels Cover + Story Templates"] }
    },
    rating: 4.9,
    reviewsCount: 15,
    salesCount: 20,
    status: "active",
    createdAt: "2026-02-15"
  },
  {
    id: "gig-23",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Senior Full-Stack & AI Engineer",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি রিয়েলটাইম চ্যাটজিপিটি / জেমিনি এআই চ্যাটবট ও এআই সফটওয়্যার তৈরি করবো",
    category: "AI Services",
    description: "আপনার ব্যবসার ওয়েবসাইট বা অ্যাপের জন্য কাস্টম ডাটা ও ডকুমেন্ট ট্রেইন্ড চ্যাট জিপিটি ও জেমিনি এআই বোট সিস্টেম।",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Web Chatbot", price: 4000, deliveryDays: 2, revisions: 3, features: ["OpenAI/Gemini Setup", "Custom Prompt", "Embed Script"] },
      standard: { name: "RAG Smart AI Bot (Custom Data)", price: 12000, deliveryDays: 4, revisions: 5, features: ["PDF/Doc Knowledge Base", "Lead Capture", "WhatsApp/Web Widget"] },
      premium: { name: "Enterprise AI SaaS Portal", price: 35000, deliveryDays: 10, revisions: "Unlimited", features: ["Full AI App", "Stripe/bKash Payment", "Admin Dashboard"] }
    },
    rating: 5.0,
    reviewsCount: 32,
    salesCount: 45,
    status: "active",
    createdAt: "2026-02-16"
  },
  {
    id: "gig-24",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "YouTube & Video Editing Specialist",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি প্রফেশনাল ইউটিউব ভিডিও, রিলস ও শর্টস ভিডিও এডিটিং করবো",
    category: "Video & Animation",
    description: "৪কে ক্লিয়ার অডিও, কালার গ্রেডিং, এটেনশন গ্রেবিং ক্যাপশন, সাউন্ড ইফেক্টস এবং মোশন গ্রাফিক্স ওভারলে সহ ভিডিও এডিটিং।",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "3 Short Videos / Reels (60s)", price: 2000, deliveryDays: 1, revisions: 2, features: ["৩০-৬০ সে. এডিটিং", "Trendy Captions", "Sound FX"] },
      standard: { name: "1 YouTube Long Video (10 Min)", price: 5000, deliveryDays: 3, revisions: 4, features: ["১০ মিনিট ভিডিও এডিটিং", "Color Grading", "Thumbnail Free"] },
      premium: { name: "4 Long + 10 Short Videos Package", price: 18000, deliveryDays: 7, revisions: "Unlimited", features: ["Monthly Content Pack", "Custom Motion Graphics", "SEO Titles"] }
    },
    rating: 4.9,
    reviewsCount: 28,
    salesCount: 36,
    status: "active",
    createdAt: "2026-02-17"
  },
  {
    id: "gig-25",
    sellerId: "student-2",
    sellerName: "রাফসান সানি",
    sellerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "SEO & Content Marketing Lead",
    sellerRating: 5.0,
    isAgencyStaff: false,
    title: "আমি সম্পূর্ণ অন-পেজ ও টেকনিক্যাল এসইও (SEO) দিয়ে গুগল ১ নম্বর র‍্যাঙ্কিং এ আনবো",
    category: "SEO & Growth",
    description: "কীওয়ার্ড রিসার্চ, টেকনিক্যাল অডিট, গুগল সার্চ কনসোল সেটআপ, পেজ স্পিড অপটিমাইজেশন এবং হাই অথোরিটি ব্যাকলিংক তৈরি।",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Technical SEO Audit & Fix", price: 2500, deliveryDays: 2, revisions: 3, features: ["15 Pages Audit", "Meta Tags Fix", "Sitemap & Robots.txt"] },
      standard: { name: "Full On-Page + Keyword Plan", price: 7500, deliveryDays: 5, revisions: 5, features: ["Full On-Page Optimization", "Competitor Research", "Rank Tracking"] },
      premium: { name: "Monthly Organic Ranking Growth", price: 22000, deliveryDays: 30, revisions: "Unlimited", features: ["Complete SEO Strategy", "High DA Backlinks", "Monthly Report"] }
    },
    rating: 5.0,
    reviewsCount: 21,
    salesCount: 29,
    status: "active",
    createdAt: "2026-02-18"
  }
];

/*
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Senior Full Stack Architect & Tech Lead",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ফুল-স্ট্যাক রিয়েক্ট, নেক্সট-জেএস এবং নোড-জেএস কাস্টম ওয়েব অ্যাপ ডেভেলপ করবো",
    category: "Web Development",
    description: "আপনার স্টার্টআপ বা ব্যবসার জন্য হাই-পারফরম্যান্স স্পিডি ওয়েব অ্যাপ্লিকেশন। রেসপন্সিভ ইউআই, নিরাপদ ব্যাকএন্ড এবং রিয়েলটাইম ডাটাবেস ইন্টিগ্রেশন।",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Single Page App", price: 8500, deliveryDays: 3, revisions: 3, features: ["১টি ল্যান্ডিং পেজ", "Tailwind UI", "মোবাইল ফ্রেন্ডলি"] },
      standard: { name: "Full Dynamic Website", price: 22000, deliveryDays: 7, revisions: 5, features: ["৫টি ডায়নামিক পেজ", "Admin Panel", "API Setup", "Database"] },
      premium: { name: "Enterprise Custom SaaS", price: 45000, deliveryDays: 14, revisions: "Unlimited", features: ["Full SaaS Engine", "Payment Gateway", "Deployment", "6 Months Support"] }
    },
    rating: 4.9,
    reviewsCount: 42,
    salesCount: 58,
    status: "active",
    createdAt: "2026-01-10"
  },
  {
    id: "gig-2",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Digital Marketing Specialist & Media Buyer",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি সেলস বাড়াতে টার্গেটেড ফেসবুক, ইন্সটাগ্রাম ও গুগল অ্যাডস ক্যাম্পেইন সেটআপ করবো",
    category: "Digital Marketing",
    description: "পিক্সেল সেটআপ, কনভার্সন ট্র্যাকিং, কাস্টম অডিয়েন্স এবং রিটার্গেটিং অ্যাডসের মাধ্যমে সেলস ৫ গুণ বৃদ্ধি করুন।",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Ad Setup Starter", price: 3500, deliveryDays: 2, revisions: 2, features: ["১টি ক্যাম্পেইন", "অডিয়েন্স রিসার্চ"] },
      standard: { name: "Growth Funnel", price: 8000, deliveryDays: 5, revisions: 3, features: ["৩টি ক্যাম্পেইন", "Pixel Setup", "A/B Test"] },
      premium: { name: "Monthly Growth Partner", price: 18000, deliveryDays: 30, revisions: "Unlimited", features: ["৩০ দিন ফুল এড ম্যানেজমেন্ট", "আনলিমিটেড ক্যাম্পেইন"] }
    },
    rating: 4.8,
    reviewsCount: 35,
    salesCount: 48,
    status: "active",
    createdAt: "2026-01-12"
  },
  {
    id: "gig-3",
    sellerId: "student-1",
    sellerName: "সাব্বির রহমান",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Canva & Brand Identity Specialist",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি ব্যবসার জন্য আইকনিক লোগো, সোশ্যাল মিডিয়া কিট ও ব্যানার ডিজাইন করবো",
    category: "Graphic Design",
    description: "আপনার ব্যবসার ভিজ্যুয়াল আইডেন্টিটি ও প্রফেশনাল সোশ্যাল মিডিয়া পোস্ট, কভার এবং লোগো ডিজাইন।",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Logo & Card", price: 1500, deliveryDays: 1, revisions: 3, features: ["১টি লোগো কনসেপ্ট", "ভিজিটিং কার্ড"] },
      standard: { name: "Brand Starter Kit", price: 4000, deliveryDays: 3, revisions: 5, features: ["৩টি লোগো অপশন", "৫টি সোশ্যাল পোস্ট"] },
      premium: { name: "Full Corporate Branding", price: 9500, deliveryDays: 6, revisions: "Unlimited", features: ["Full Brand Book", "১৫টি সোশ্যাল ডিজাইন", "সোর্স ফাইল"] }
    },
    rating: 4.9,
    reviewsCount: 28,
    salesCount: 36,
    status: "active",
    createdAt: "2026-01-15"
  },
  {
    id: "gig-4",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "WordPress & E-Commerce Expert",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ওয়ার্ডপ্রেস ও উকমার্স দিয়ে হাই-স্পিড অনলাইন শপ এবং ই-কমার্স ওয়েবসাইট বানাবো",
    category: "WordPress",
    description: "বিকাশ/নগদ পেমেন্ট গেটওয়ে, এসএমএস নোটিফিকেশন, ইনভেন্টরি ম্যানেজমেন্টসহ রেডি ই-কমার্স ওয়েবসাইট।",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Business Landing", price: 6000, deliveryDays: 2, revisions: 2, features: ["Elementor Pro Setup", "Fast Speed"] },
      standard: { name: "WooCommerce Store", price: 15000, deliveryDays: 5, revisions: 4, features: ["৫০টি প্রোডাক্ট আপলোড", "bKash Gateway", "Order SMS"] },
      premium: { name: "Multivendor Marketplace", price: 32000, deliveryDays: 10, revisions: "Unlimited", features: ["Dokan Multivendor", "Mobile App Ready", "1 Year Support"] }
    },
    rating: 5.0,
    reviewsCount: 50,
    salesCount: 65,
    status: "active",
    createdAt: "2026-01-18"
  },
  {
    id: "gig-5",
    sellerId: "teacher-3",
    sellerName: "মাহমুদা সুলতানা",
    sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Flutter & React Native Developer",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি অ্যান্ড্রয়েড এবং আইওএস (iOS) এর জন্য হাই-কোয়ালিটি কাস্টম মোবাইল অ্যাপ তৈরি করবো",
    category: "Mobile App",
    description: "সিঙ্গেল কোডবেসে ফ্লটার দিয়ে প্রফেশনাল মোবাইল অ্যাপ। প্লেস্টোর ও অ্যাপস্টোর পাবলিশিং সাপোর্ট সহ।",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "App Prototype", price: 12000, deliveryDays: 4, revisions: 2, features: ["৩টি স্ক্রিন ইউআই", "Clean Architecture"] },
      standard: { name: "Full Android/iOS App", price: 35000, deliveryDays: 12, revisions: 5, features: ["Firebase/API Backend", "Push Notification", "Play Store"] },
      premium: { name: "Complex Enterprise App", price: 70000, deliveryDays: 25, revisions: "Unlimited", features: ["Custom Backend", "Payment Integration", "Source Code"] }
    },
    rating: 4.9,
    reviewsCount: 19,
    salesCount: 24,
    status: "active",
    createdAt: "2026-01-20"
  },
  {
    id: "gig-6",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "SEO & Content Ranker",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি ওয়েবসাইটের অন-পেজ, অফ-পেজ ও টেকনিক্যাল এসইও (SEO) দিয়ে ১ম পেজে র‍্যাংক করাবো",
    category: "SEO",
    description: "গুগল সার্চ ইঞ্জিনে আপনার সাইটের ট্রাফিক বাড়াতে সম্পূর্ণ অন-পেজ, কিওয়ার্ড রিসার্চ এবং হাই কিউএ ব্যাকলিংক তৈরি।",
    thumbnail: "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "SEO Audit & Keyword", price: 4000, deliveryDays: 2, revisions: 2, features: ["Audit Report", "১০টি গোল্ডেন কিওয়ার্ড"] },
      standard: { name: "Complete On-Page SEO", price: 10000, deliveryDays: 5, revisions: 3, features: ["১০টি পেজ অন-পেজ", "Speed Boost", "Schema Setup"] },
      premium: { name: "Monthly Technical & Link Building", price: 25000, deliveryDays: 30, revisions: "Unlimited", features: ["Full Monthly SEO", "50+ High DA Backlinks", "Weekly Ranking Report"] }
    },
    rating: 4.8,
    reviewsCount: 31,
    salesCount: 40,
    status: "active",
    createdAt: "2026-01-22"
  },
  {
    id: "gig-7",
    sellerId: "student-2",
    sellerName: "রাশেদুল ইসলাম",
    sellerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Lead UI/UX & Figma Designer",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি ফিগমা (Figma) দিয়ে মডার্ন, ক্লিন এবং কনভার্টিং মোবাইল অ্যাপ ও ওয়েবসাইটের UI/UX ডিজাইন করবো",
    category: "UI/UX Design",
    description: "ইউজার ফ্রেন্ডলি ড্যাশবোর্ড, ওয়েয়্যারফ্রেম, ইউজার জার্নি ম্যাপ এবং ইন্টারঅ্যাক্টিভ ফিগমা প্রোটোটাইপ।",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Landing Page UI", price: 5000, deliveryDays: 2, revisions: 3, features: ["১টি ফিগমা স্ক্রিন", "Design System", "Icons Included"] },
      standard: { name: "Full Web UI Kit", price: 14000, deliveryDays: 5, revisions: 5, features: ["৫টি রেসপন্সিভ স্ক্রিন", "Prototyping", "Developer Handoff"] },
      premium: { name: "Complete Mobile App UX", price: 28000, deliveryDays: 10, revisions: "Unlimited", features: ["১৫টি স্ক্রিন", "Interactive Prototype", "User Testing"] }
    },
    rating: 4.9,
    reviewsCount: 22,
    salesCount: 29,
    status: "active",
    createdAt: "2026-01-25"
  },
  {
    id: "gig-8",
    sellerId: "teacher-4",
    sellerName: "তানজিল আহমেদ",
    sellerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Video Editor & Motion Designer",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি ইউটিউব, রিলস, এবং অ্যাডসের জন্য আই-ক্যাচিং ভিডিও এডিটিং ও মোশন গ্রাফিক্স করবো",
    category: "Video Editing",
    description: "প্রিমিয়ার প্রো এবং আফটার ইফেক্টস দিয়ে ৪কে কালার গ্রেডিং, সাউন্ড ডিজাইন, সাবটাইটেল এবং এনিমেশন।",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Short Reel / Shorts", price: 2000, deliveryDays: 1, revisions: 2, features: ["১ মিনিট ভিডিও", "আকর্ষণীয় সাবটাইটেল", "Sound Effects"] },
      standard: { name: "YouTube Video Edit", price: 6500, deliveryDays: 3, revisions: 4, features: ["১০ মিনিট ইউটিউব এডিট", "Motion Graphics", "B-Roll Footage"] },
      premium: { name: "Commercial Ad Video", price: 16000, deliveryDays: 6, revisions: "Unlimited", features: ["3D Title Motion", "Pro Sound Mix", "Color Grade", "Voiceover"] }
    },
    rating: 4.9,
    reviewsCount: 27,
    salesCount: 38,
    status: "active",
    createdAt: "2026-01-28"
  },
  {
    id: "gig-9",
    sellerId: "student-3",
    sellerName: "ফারজানা আক্তার",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Content Writer & Copywriter",
    sellerRating: 4.8,
    isAgencyStaff: false,
    title: "আমি এসইও ফ্রেন্ডলি বাংলা ও ইংরেজি ওয়েবসাইট কন্টেন্ট, আর্টিকেল এবং কপিরাইটিং করবো",
    category: "Content Writing",
    description: "প্ল্যাজিয়ারিজম ফ্রী, গ্রামাটিক্যালি কারেক্ট এবং সার্চ ইঞ্জিনে র‍্যাংক করার মতো আকর্ষনীয় ব্লগ ও সেলস কপি।",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "1000 Words Article", price: 1000, deliveryDays: 1, revisions: 2, features: ["1000 Words SEO Article", "Copyscape Passed"] },
      standard: { name: "Website Copy Pack", price: 3500, deliveryDays: 3, revisions: 4, features: ["৪টি পেজ ওয়েবসাইট কপি", "SEO Optimization", "Meta Tags"] },
      premium: { name: "Monthly Content Strategy", price: 12000, deliveryDays: 15, revisions: "Unlimited", features: ["১০টি ১০০০ শব্দের আর্টিকেল", "Keyword Mapping", "Publishing"] }
    },
    rating: 4.8,
    reviewsCount: 16,
    salesCount: 21,
    status: "active",
    createdAt: "2026-02-01"
  },
  {
    id: "gig-10",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Certified Cyber Security Ethical Hacker",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি আপনার ওয়েবসাইট সিকিউরিটি অডিট, হ্যাক রিকভারি এবং মেলওয়্যার রিমুভ করবো",
    category: "Cyber Security",
    description: "পেনিট্রেশন টেস্টিং, বাগ ফাইন্ডিং, ওয়ার্ডপ্রেস ভাইরাস ক্লিন এবং সার্ভার সিকিউরিটি ফায়ারওয়াল সেটআপ।",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Malware Removal", price: 3000, deliveryDays: 1, revisions: 2, features: ["১টি ওয়েবসাইট ভাইরাস রিমুভ", "Blacklist Fix"] },
      standard: { name: "Vulnerability Audit", price: 8500, deliveryDays: 3, revisions: 3, features: ["Full Pentest Report", "Fixing SQLi/XSS", "SSL Harden"] },
      premium: { name: "Enterprise Security Shield", price: 20000, deliveryDays: 7, revisions: "Unlimited", features: ["24/7 Monitoring", "WAF Firewall", "Backup System", "Guarantee"] }
    },
    rating: 5.0,
    reviewsCount: 38,
    salesCount: 52,
    status: "active",
    createdAt: "2026-02-02"
  },
  {
    id: "gig-11",
    sellerId: "teacher-5",
    sellerName: "ড. সাজ্জাদ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Python Data Scientist & AI Specialist",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি পাইথন (Python) দিয়ে ডাটা এনালাইসিস, স্ক্র্যাপিং এবং অটোমেশন স্ক্রিপ্ট তৈরি করবো",
    category: "Data Science",
    description: "ওয়েব স্ক্র্যাপিং, ডাটা ক্লিনিং, পান্ডাস/মাইসকিউএল এনালাইসিস এবং এক্সেল/সিএসভি প্রসেসিং অটোমেশন।",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Data Scraper Bot", price: 2500, deliveryDays: 1, revisions: 2, features: ["১টি সাইট স্ক্র্যাপিং", "CSV Output"] },
      standard: { name: "Automation Script", price: 7500, deliveryDays: 3, revisions: 3, features: ["Custom Python Script", "Database Link", "GUI Window"] },
      premium: { name: "Complete ML & Data Pipeline", price: 22000, deliveryDays: 8, revisions: "Unlimited", features: ["Pandas Analytics", "Predictive Model", "Interactive Dashboard"] }
    },
    rating: 5.0,
    reviewsCount: 14,
    salesCount: 19,
    status: "active",
    createdAt: "2026-02-03"
  },
  {
    id: "gig-12",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "DevOps & Cloud Engineer",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ভিপিএস (VPS), ক্লাউড সার্ভার, ডকার (Docker) এবং Nginx রিভার্স প্রক্সি কনফিগার করবো",
    category: "Cloud & DevOps",
    description: "AWS, DigitalOcean, Hetzner সার্ভারে সাইট মাইগ্রেশন, SSL সার্টিফিকেট এবং CI/CD পাইপলাইন সেটআপ।",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "VPS Server Setup", price: 2500, deliveryDays: 1, revisions: 2, features: ["Linux VPS Setup", "Nginx", "SSL Certificate"] },
      standard: { name: "Docker & Migration", price: 7000, deliveryDays: 2, revisions: 3, features: ["Docker Compose", "Zero Downtime Migration", "Redis Caching"] },
      premium: { name: "AWS Cloud Infrastructure", price: 18000, deliveryDays: 5, revisions: "Unlimited", features: ["Kubernetes Cluster", "Load Balancer", "Auto Scaling"] }
    },
    rating: 5.0,
    reviewsCount: 44,
    salesCount: 59,
    status: "active",
    createdAt: "2026-02-04"
  },
  {
    id: "gig-13",
    sellerId: "teacher-5",
    sellerName: "ড. সাজ্জাদ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "AI Integration & Generative AI Dev",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি ওয়েবসাইটে গুগল জেমিনাই (Gemini) এবং ChatGPT এআই চ্যাটবট ইন্টিগ্রেট করবো",
    category: "AI & Machine Learning",
    description: "আপনার ব্যবসার ডাটা ট্রেইন করে এআই কাস্টমার সাপোর্ট চ্যাটবট, অটোমেটেড কন্টেন্ট জেনারেটর এবং ভয়েস এআই।",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "AI Chatbot Widget", price: 4500, deliveryDays: 2, revisions: 2, features: ["Gemini API Link", "Widget UI"] },
      standard: { name: "Custom Trained AI Bot", price: 12000, deliveryDays: 4, revisions: 4, features: ["Business Knowledgebase", "RAG Vector DB", "WhatsApp/Web Link"] },
      premium: { name: "Full AI Powered SaaS Engine", price: 35000, deliveryDays: 10, revisions: "Unlimited", features: ["Image/Text Generation", "User Token Billing", "Admin Panel"] }
    },
    rating: 4.9,
    reviewsCount: 18,
    salesCount: 25,
    status: "active",
    createdAt: "2026-02-05"
  },
  {
    id: "gig-14",
    sellerId: "student-4",
    sellerName: "নাসরীন জাহান",
    sellerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Software QA & Test Automation Eng.",
    sellerRating: 4.8,
    isAgencyStaff: false,
    title: "আমি আপনার ওয়েবসাইট ও অ্যাপের ম্যানুয়াল ও অটোমেটেড টেস্টিং এবং বাগ রিপোর্ট প্রদান করবো",
    category: "Software Testing",
    description: "UI/UX বাগ, রেসপন্সিভনেস, পারফরম্যান্স টেস্টিং এবং পোস্টম্যান (Postman) দিয়ে API এন্ডপয়েন্ট টেস্টিং।",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Web Bug Audit", price: 2000, deliveryDays: 1, revisions: 2, features: ["20+ Device Testing", "Detailed Bug PDF"] },
      standard: { name: "API & Load Testing", price: 6000, deliveryDays: 3, revisions: 3, features: ["Postman Collection", "JMeter Load Test"] },
      premium: { name: "Full Automation Suite", price: 15000, deliveryDays: 7, revisions: "Unlimited", features: ["Cypress/Selenium Test", "CI/CD Integration"] }
    },
    rating: 4.8,
    reviewsCount: 12,
    salesCount: 15,
    status: "active",
    createdAt: "2026-02-06"
  },
  {
    id: "gig-15",
    sellerId: "student-5",
    sellerName: "ইনজামামুল হক",
    sellerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Unity 2D/3D Game Developer",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি ইউনিটি (Unity) দিয়ে মোবাইল ও পিসির জন্য ২ডি এবং ৩ডি গেম ডেভেলপমেন্ট করবো",
    category: "Game Development",
    description: "অ্যাকশন, পাজল বা ক্যাজুয়াল ২ডি/৩ডি গেম ইউআই, সাউন্ড, এডমোব অ্যাডস এবং অ্যাড সার্ভিসেস ইন্টিগ্রেশন।",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Simple 2D Prototype", price: 7000, deliveryDays: 3, revisions: 2, features: ["১টি লেভেল গেম", "Android APK"] },
      standard: { name: "Complete 2D Game", price: 20000, deliveryDays: 8, revisions: 4, features: ["১০টি লেভেল", "AdMob Ads", "Leaderboard"] },
      premium: { name: "3D Multiplayer Game", price: 55000, deliveryDays: 20, revisions: "Unlimited", features: ["Photon Multiplayer", "In-App Purchase", "Source Code"] }
    },
    rating: 4.9,
    reviewsCount: 11,
    salesCount: 14,
    status: "active",
    createdAt: "2026-02-07"
  },
  {
    id: "gig-16",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "SaaS Systems & Microservices Architect",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি স্কেলেবল SaaS সাবস্ক্রিপশন সফটওয়্যার ও মাইক্রোসার্ভিসেস আর্কিটেকচার তৈরি করবো",
    category: "SaaS Development",
    description: "মাল্টি-টেন্যান্ট ডাটাবেস, সাবস্ক্রিপশন স্ট্রাইপ/বিকাশ পিলিং, ইউজার রোলস এবং এপিআই গেটওয়ে।",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "SaaS Boilerplate", price: 15000, deliveryDays: 4, revisions: 3, features: ["Multi Tenant Setup", "Auth System"] },
      standard: { name: "Complete SaaS System", price: 40000, deliveryDays: 10, revisions: 5, features: ["Billing Portal", "Custom Domain", "Admin Dashboard"] },
      premium: { name: "Enterprise Microservices", price: 90000, deliveryDays: 25, revisions: "Unlimited", features: ["Kubernetes", "Kafka Queue", "Full Source Code"] }
    },
    rating: 5.0,
    reviewsCount: 23,
    salesCount: 30,
    status: "active",
    createdAt: "2026-02-08"
  },
  {
    id: "gig-17",
    sellerId: "teacher-5",
    sellerName: "ড. সাজ্জাদ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Database Administrator & Optimization Eng.",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি PostgreSQL, MySQL ও MongoDB ডাটাবেস টিউনিং, ব্যাকআপ ও অপটিমাইজেশন করবো",
    category: "Database Administration",
    description: "স্লো কোয়েরি ফিক্স, ইনডেক্সিং, মাস্টার-স্লেভ রেপ্লিকেশন এবং ডাটাবেস সিকিউরিটি হার্ডেনিং।",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Query Optimization", price: 2500, deliveryDays: 1, revisions: 2, features: ["Fix Slow Queries", "Index Tuning"] },
      standard: { name: "Replication & Backup", price: 8000, deliveryDays: 3, revisions: 3, features: ["Auto Cloud Backup", "Master Slave Setup"] },
      premium: { name: "Enterprise DB Cluster", price: 20000, deliveryDays: 6, revisions: "Unlimited", features: ["HA Failover Cluster", "Security Audit"] }
    },
    rating: 4.9,
    reviewsCount: 15,
    salesCount: 20,
    status: "active",
    createdAt: "2026-02-09"
  },
  {
    id: "gig-18",
    sellerId: "student-6",
    sellerName: "কামরুল হাসান",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "MikroTik Certified Network Administrator",
    sellerRating: 4.8,
    isAgencyStaff: false,
    title: "আমি মাইক্রোটিক (MikroTik) রাউটার কনফিগারেশন, ব্যান্ডউইথ কন্ট্রোল ও ভিপিএন সেটআপ করবো",
    category: "Networking",
    description: "আইএসপি বা অফিস নেটওয়ার্কের জন্য লোড ব্যালেন্সিং, হটসপট বিলিং সিস্টেম, সিকিউরিটি এবং ওয়্যারগার্ড ভিপিএন।",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Basic Router Config", price: 2000, deliveryDays: 1, revisions: 2, features: ["NAT / Firewall", "Bandwidth Queue"] },
      standard: { name: "Hotspot & VPN Server", price: 5500, deliveryDays: 2, revisions: 3, features: ["User Manager Hotspot", "WireGuard VPN"] },
      premium: { name: "Dual WAN Load Balance", price: 12000, deliveryDays: 4, revisions: "Unlimited", features: ["BGP / OSPF Setup", "Failover Routing"] }
    },
    rating: 4.8,
    reviewsCount: 20,
    salesCount: 26,
    status: "active",
    createdAt: "2026-02-10"
  },
  {
    id: "gig-19",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Shopify Partner & Theme Customizer",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি শপিফাই (Shopify) স্টোর ডিজাইন, অ্যাপস ড্রাইভিং ও পেজফ্লাই কাস্টমাইজেশন করবো",
    category: "E-Commerce",
    description: "ড্রপশিপিং বা ব্র্যান্ডেড ই-কমার্স স্টোর ডিজাইন। থিম কাস্টমাইজেশন, কার্ট অপটিমাইজেশন এবং বাংলা পেমেন্ট।",
    thumbnail: "https://images.unsplash.com/photo-1556742049-0a67e0e7a173?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "One Product Store", price: 5000, deliveryDays: 2, revisions: 2, features: ["Product Landing", "High Converting UI"] },
      standard: { name: "Full Shopify Store", price: 14000, deliveryDays: 4, revisions: 4, features: ["Full Theme Custom", "App Integrations", "Domain Link"] },
      premium: { name: "Brand E-Com Suite", price: 26000, deliveryDays: 8, revisions: "Unlimited", features: ["PageFly Custom Layout", "SEO & Speed Boost", "1 Year Support"] }
    },
    rating: 5.0,
    reviewsCount: 33,
    salesCount: 46,
    status: "active",
    createdAt: "2026-02-11"
  },
  {
    id: "gig-20",
    sellerId: "teacher-4",
    sellerName: "তানজিল আহমেদ",
    sellerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "2D/3D Animator & Storyboard Artist",
    sellerRating: 4.9,
    isAgencyStaff: true,
    title: "আমি প্রফেশনাল ২ডি এনিমেশন ও এক্সপ্লেইনার ভিডিও (Explainer Video) তৈরি করবো",
    category: "Animation",
    description: "আপনার সার্ভিস বা অ্যাপের জন্য স্ক্রিপ্টরাইটিং, ভয়েসওভারসহ আকর্ষণীয় কাস্টম ২ডি ক্যারেক্টার এনিমেশন।",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "30 Sec Animation", price: 4000, deliveryDays: 2, revisions: 2, features: ["৩০ সেকেন্ড এনিমেশন", "Background Music"] },
      standard: { name: "60 Sec Explainer", price: 9500, deliveryDays: 4, revisions: 4, features: ["১ মিনিট ২ডি এনিমেশন", "Bengali/English Voiceover", "Script"] },
      premium: { name: "Full Commercial Video", price: 22000, deliveryDays: 8, revisions: "Unlimited", features: ["Custom Characters", "Full HD 1080p", "Commercial Rights"] }
    },
    rating: 4.9,
    reviewsCount: 17,
    salesCount: 22,
    status: "active",
    createdAt: "2026-02-12"
  },
  {
    id: "gig-21",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Social Media Manager & Brand Strategist",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি আপনার ফেসবুক পেজ, ইনস্টাগ্রাম ও ইউটিউব চ্যানেলের অর্গানিক গ্রোথ ও ম্যানেজমেন্ট করবো",
    category: "Social Media",
    description: "প্রতিদিন ট্রেন্ডিং পোস্ট ডিজাইন, কন্টেন্ট পোল, কাস্টমার কমেন্ট রিপ্লাই এবং পেজের অর্গানিক রিচ বৃদ্ধি।",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "1 Week Test Drive", price: 3000, deliveryDays: 7, revisions: 2, features: ["৭টি ব্যানার পোস্ট", "পেজ অপটিমাইজেশন"] },
      standard: { name: "Monthly Page Manager", price: 10000, deliveryDays: 30, revisions: 5, features: ["২০টি কাস্টম পোস্ট", "কমেন্ট রিপ্লাই", "অডিয়েন্স গ্রোথ"] },
      premium: { name: "360 Brand Management", price: 24000, deliveryDays: 30, revisions: "Unlimited", features: ["৩০টি পোস্ট + ৪টি রিলস", "অ্যাড ক্যাম্পেইন রান", "মান্থলি রিপোর্ট"] }
    },
    rating: 4.8,
    reviewsCount: 25,
    salesCount: 31,
    status: "active",
    createdAt: "2026-02-13"
  },
  {
    id: "gig-22",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Payment Gateway & API Specialist",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি ওয়েবসাইটে বিকাশ (bKash), নগদ, রকেট, SSLCommerz এবং Stripe পেমেন্ট গেটওয়ে যুক্ত করবো",
    category: "API Integration",
    description: "যেকোনো পিএইচপি, ওয়ার্ডপ্রেস, রিয়েক্ট বা নোড সাইটে ইনস্ট্যান্ট ব্যাকএন্ড এপিআই পেমেন্ট কনফিগারেশন।",
    thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: { name: "Single Payment Gateway", price: 2500, deliveryDays: 1, revisions: 2, features: ["bKash Tokenized Checkout", "Instant Callback"] },
      standard: { name: "All BD Payment Methods", price: 6000, deliveryDays: 2, revisions: 3, features: ["bKash, Nagad, Rocket, Cards", "SMS Confirmation"] },
      premium: { name: "Global & Local Multi Currency", price: 14000, deliveryDays: 4, revisions: "Unlimited", features: ["Stripe + Local Gateways", "Automated Refund System", "6 Months Support"] }
    },
    rating: 5.0,
    reviewsCount: 48,
    salesCount: 62,
    status: "active",
    createdAt: "2026-02-14"
  }
];  },
  {
    id: "test-2",
    name: "নাসরিন আক্তার",
    role: "Owner, Royal Handicrafts",
    courseOrService: "Web Development Service",
    rating: 5,
    text: "আমাদের ই-কমার্স পেজের জন্য PTENit থেকে ওয়েবসাইট বানিয়েছি। সাইট স্পিড ও ডিজাইন অসাধারণ, এখন বিকাশ ও নগদ দিয়ে কাস্টমাররা সহজেই অর্ডার করছে।",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-3",
    name: "সাকিব চৌধুরী",
    role: "Content Creator",
    courseOrService: "Canva Design Course",
    rating: 5,
    text: "ক্যানভা কোর্সটি পানির মতো সহজ ছিল! আগে গ্রাফিক্স ডিজাইনারদের পেছনে অনেক টাকা খরচ হতো, এখন নিজেই নিজের ফেসবুক পেজের সব পোস্ট বানাই।",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const initialUsers: User[] = [
  {
    id: "admin-1",
    name: "PTENit Admin",
    email: "admin@ptenit.com",
    mobile: "01700000000",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-01"
  },
  {
    id: "teacher-1",
    name: "প্রকৌশলী আল-আমিন",
    email: "alamin@ptenit.com",
    mobile: "01711122233",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-15"
  },
  {
    id: "customer-1",
    name: "মেহেদী হাসান (কাস্টমার)",
    email: "customer@ptenit.com",
    mobile: "01988776655",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-01-20"
  },
  {
    id: "student-1",
    name: "সাব্বির রহমান (শিক্ষার্থী)",
    email: "student@ptenit.com",
    mobile: "01812345678",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    createdAt: "2026-02-01"
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: "enr-1",
    userId: "student-1",
    courseId: "course-canva",
    progress: 100,
    completedLessons: ["l1", "l2", "l3"],
    enrolledAt: "2026-02-05",
    status: "completed",
    certificateIssued: true,
    certificateId: "CERT-PTEN-2026-0891"
  },
  {
    id: "enr-2",
    userId: "student-1",
    courseId: "course-yt-seo",
    progress: 72,
    completedLessons: ["l-yt-1"],
    enrolledAt: "2026-02-12",
    status: "active",
    certificateIssued: false
  }
];

export const initialCertificates: Certificate[] = [
  {
    id: "cert-1",
    certificateCode: "CERT-PTEN-2026-0891",
    studentId: "student-1",
    studentName: "সাব্বির রহমান",
    courseId: "course-canva",
    courseName: "Canva Design & Freelancing Masterclass",
    issueDate: "2026-02-28",
    instructorName: "তানভীর আহমেদ",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CERT-PTEN-2026-0891"
  }
];

export const initialGigs: MarketplaceGig[] = [
  {
    id: "gig-1",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Senior Full Stack & React Developer (PTENit Core Team)",
    sellerRating: 5.0,
    isAgencyStaff: true,
    title: "আমি আপনার ব্যবসার জন্য রেসপন্সিভ ই-কমার্স বা কাস্টম ওয়েবসাইট বানিয়ে দেব",
    category: "Web Development",
    description: "আপনার অনলাইন বিজনেসের জন্য সম্পূর্ণ কাস্টম, দ্রুতগতির ও সিকিউর ওয়েবসাইট ডেভেলপমেন্ট। পেমেন্ট গেটওয়ে (bKash/Nagad), অ্যাডমিন প্যানেল এবং মোবাইল ফ্রেন্ডলি ডিজাইন সহ।",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: {
        name: "Basic Website",
        price: 8000,
        deliveryDays: 3,
        revisions: 2,
        features: ["৩টি পেজ", "মোবাইল রেসপন্সিভ", "কন্টাক্ট ফরম", "১ মাস ফ্রি সাপোর্ট"]
      },
      standard: {
        name: "Professional Business Website",
        price: 15000,
        deliveryDays: 5,
        revisions: 5,
        features: ["১০টি পেজ", "ই-কমার্স ক্যাটালগ", "bKash/Nagad Payment Setup", "SEO Optimization", "এডমিন প্যানেল"]
      },
      premium: {
        name: "Enterprise Full Stack Application",
        price: 35000,
        deliveryDays: 10,
        revisions: "Unlimited",
        features: ["আনলিমিটেড পেজ", "কাস্টম পোর্টাল / LMS", "লাইভ চ্যাট & API Integrations", "১ বছর সিকিউরিটি সাপোর্ট"]
      }
    },
    rating: 4.9,
    reviewsCount: 38,
    salesCount: 45,
    status: "active",
    createdAt: "2026-01-10"
  },
  {
    id: "gig-2",
    sellerId: "teacher-2",
    sellerName: "আরিফ হোসেন",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Digital Marketing Specialist & Media Buyer",
    sellerRating: 4.8,
    isAgencyStaff: true,
    title: "আমি সেলস বাড়ানোর জন্য টার্গেটেড ফেসবুক & গুগল অ্যাডস ক্যাম্পেইন রান করবো",
    category: "Digital Marketing",
    description: "ফেসবুক পিক্সেল সেটআপ, কনভার্সন ট্র্যাকিং এবং রিটার্গেটিং অ্যাডসের মাধ্যমে আপনার পেজের সেলস এবং লিড ৫ গুণ বৃদ্ধি করুন।",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: {
        name: "Starter Ad Setup",
        price: 3500,
        deliveryDays: 2,
        revisions: 2,
        features: ["১টি কাস্টম ক্যাম্পেইন", "অডিয়েন্স রিসার্চ", "১টি কাস্টম ব্যানার"]
      },
      standard: {
        name: "Growth Sales Funnel",
        price: 8000,
        deliveryDays: 5,
        revisions: 3,
        features: ["৩টি এডস ক্যাম্পেইন", "Pixel & Domain Verification", "A/B Testing", "রিপোর্টিং"]
      },
      premium: {
        name: "Monthly Ad Management",
        price: 18000,
        deliveryDays: 30,
        revisions: "Unlimited",
        features: ["পুরো মাস অ্যাড ম্যানেজমেন্ট", "আনলিমিটেড ক্যাম্পেইন", "কনভার্সন অপটিমাইজেশন"]
      }
    },
    rating: 4.8,
    reviewsCount: 29,
    salesCount: 32,
    status: "active",
    createdAt: "2026-01-15"
  },
  {
    id: "gig-3",
    sellerId: "student-1",
    sellerName: "সাব্বির রহমান",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    sellerTitle: "Professional Canva & Graphic Designer (Top Freelancer)",
    sellerRating: 4.9,
    isAgencyStaff: false,
    title: "আমি আকর্ষণীয় সোশ্যাল মিডিয়া ব্যানার, লোগো এবং থাম্বনেইল ডিজাইন করবো",
    category: "Graphic Design",
    description: "আপনার ব্যবসার ব্র্যান্ডিং বাড়াতে প্রফেশনাল লোগো, ফেসবুক পোস্ট কভার, ব্যানার ও ইউটিউব থাম্বনেইল ডিজাইন করা হয়।",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    packages: {
      basic: {
        name: "Single Creative",
        price: 1200,
        deliveryDays: 1,
        revisions: 3,
        features: ["২টি সোশ্যাল মিডিয়া ব্যানার", "High Res PNG/JPG", "কাস্টম কালার"]
      },
      standard: {
        name: "Brand Design Pack",
        price: 3500,
        deliveryDays: 2,
        revisions: 5,
        features: ["১টি ইউনিক লোগো", "৫টি ব্যানার ডিজাইন", "প্রিন্ট রেডি ফাইল"]
      },
      premium: {
        name: "Full Social Media Kit",
        price: 7500,
        deliveryDays: 4,
        revisions: "Unlimited",
        features: ["১৫টি সোশ্যাল কভার/পোস্ট", "লোগো সাইজ কাস্টমাইজেশন", "সোর্স ফাইল (Canva/PSD)"]
      }
    },
    rating: 4.9,
    reviewsCount: 18,
    salesCount: 22,
    status: "active",
    createdAt: "2026-02-01"
  }
];
*/

export const initialJobs: MarketplaceJob[] = [
  {
    id: "job-1",
    buyerId: "customer-1",
    buyerName: "মেহেদী হাসান (কাস্টমার)",
    buyerEmail: "customer@ptenit.com",
    buyerPhone: "01988776655",
    title: "ক্লথিং ব্র্যান্ডের জন্য ই-কমার্স ওয়েবসাইট ডেভেলপমেন্ট",
    category: "Web Development",
    description: "আমাদের অনলাইন কাপড়ের ব্র্যান্ডের জন্য একটি আধুনিক ক্যাটালগ ও কার্ড পেমেন্ট সাপোর্ট সহ ই-কমার্স সাইট দরকার। মোবাইল রেসপন্সিভ হতে হবে।",
    budget: 25000,
    deadlineDays: 7,
    visibility: "public",
    proposalsCount: 3,
    status: "open",
    createdAt: "2026-02-10"
  },
  {
    id: "job-2",
    buyerId: "customer-1",
    buyerName: "মেহেদী হাসান (কাস্টমার)",
    buyerEmail: "customer@ptenit.com",
    buyerPhone: "01988776655",
    title: "PTENit কাস্টম এজেন্সির মাধ্যমে অ্যান্ড্রয়েড অ্যাপ তৈরি",
    category: "Mobile App",
    description: "আমাদের প্রতিষ্ঠানের জন্য কাস্টম মোবাইল অ্যাপ তৈরি করা প্রয়োজন। এটি সরাসরি আমাদের অফিসিয়াল টিমে ডেসপ্যাচ করা হয়েছে।",
    budget: 45000,
    deadlineDays: 15,
    visibility: "custom_assigned",
    assignedStaffId: "teacher-1",
    assignedStaffName: "প্রকৌশলী আল-আমিন",
    proposalsCount: 1,
    status: "in_progress",
    createdAt: "2026-02-14"
  }
];

export const initialProposals: MarketplaceProposal[] = [
  {
    id: "prop-1",
    jobId: "job-1",
    freelancerId: "teacher-1",
    freelancerName: "প্রকৌশলী আল-আমিন",
    freelancerTitle: "Full Stack Engineer (PTENit Core Team)",
    isAgencyStaff: true,
    coverLetter: "আসসালামু আলাইকুম মেহেদী ভাই, আমি আপনার ই-কমার্স সাইটটি React & WooCommerce ব্যাকএন্ড দিয়ে ৫ দিনে কমপ্লিট করে দিতে পারবো। সাথে ১ বছর ফ্রি সাপোর্ট পাবেন।",
    bidAmount: 22000,
    deliveryDays: 5,
    createdAt: "2026-02-11",
    status: "pending"
  },
  {
    id: "prop-2",
    jobId: "job-1",
    freelancerId: "student-1",
    freelancerName: "সাব্বির রহমান",
    freelancerTitle: "Web & Graphics Designer",
    isAgencyStaff: false,
    coverLetter: "হ্যালো, আমি আপনার ক্লথিং ওয়েবসাইটের সম্পূর্ণ UI/UX ও ক্যাটালগ সেটআপ খুব সুন্দরভাবে করে দেব। সাথে ফ্রী ৫টি ব্যানার পাবেন।",
    bidAmount: 18000,
    deliveryDays: 6,
    createdAt: "2026-02-11",
    status: "pending"
  }
];

export const initialMarketplaceOrders: MarketplaceOrder[] = [
  {
    id: "ord-mkt-1",
    type: "custom_agency_order",
    jobId: "job-2",
    title: "PTENit কাস্টম এজেন্সির মাধ্যমে অ্যান্ড্রয়েড অ্যাপ তৈরি",
    category: "Mobile App",
    buyerId: "customer-1",
    buyerName: "মেহেদী হাসান (কাস্টমার)",
    buyerEmail: "customer@ptenit.com",
    buyerPhone: "01988776655",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    isInternalStaff: true,
    packageType: "Custom",
    amount: 45000,
    adminCommission: 4500,
    sellerPayout: 40500,
    paymentMethod: "bKash Escrow",
    transactionId: "TRX-MKT-998877",
    status: "in_progress",
    createdAt: "2026-02-14",
    deadlineDate: "2026-03-01"
  },
  {
    id: "ord-mkt-4",
    type: "gig_order",
    title: "রিয়্যাক্ট উইথ নোড জেএস ফুল স্ট্যাক ড্যাশবোর্ড ওয়েব সার্ভিস",
    category: "Web Development",
    buyerId: "customer-1",
    buyerName: "রাফসান আহমেদ (বায়ার)",
    buyerEmail: "rafsan@example.com",
    buyerPhone: "01812345678",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageType: "Standard",
    amount: 15000,
    adminCommission: 1500,
    sellerPayout: 13500,
    paymentMethod: "bKash Escrow",
    transactionId: "TRX-BK-774411",
    status: "pending",
    createdAt: "2026-02-16",
    deadlineDate: "2026-02-22"
  },
  {
    id: "ord-mkt-5",
    type: "gig_order",
    title: "এআই সিস্টেম সোশ্যাল মিডিয়া চ্যানেল লোগো ও ব্যানার সেটআপ",
    category: "Graphic Design",
    buyerId: "customer-1",
    buyerName: "তানিয়া সুলতানা (বায়ার)",
    buyerEmail: "tania@example.com",
    buyerPhone: "01799887766",
    sellerId: "teacher-1",
    sellerName: "প্রকৌশলী আল-আমিন",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageType: "Basic",
    amount: 5000,
    adminCommission: 500,
    sellerPayout: 4500,
    paymentMethod: "Nagad Escrow",
    transactionId: "TRX-NG-221100",
    status: "pending",
    createdAt: "2026-02-16",
    deadlineDate: "2026-02-20"
  },
  {
    id: "ord-mkt-2",
    type: "gig_order",
    title: "ফুল স্ট্যাক লারাভেল ও রিয়্যাক্ট ই-কমার্স পোর্টাল ডেভেলপমেন্ট",
    category: "Web Development",
    buyerId: "customer-1",
    buyerName: "মেহেদী হাসান (কাস্টমার)",
    buyerEmail: "customer@ptenit.com",
    buyerPhone: "01988776655",
    sellerId: "teacher-2",
    sellerName: "তানভীর আহমেদ",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    packageType: "Standard",
    amount: 18000,
    adminCommission: 1800,
    sellerPayout: 16200,
    paymentMethod: "bKash Escrow",
    transactionId: "TRX-BK-991201",
    status: "in_review",
    deliveryNote: "প্রিয় ভাইয়া, আপনার ওয়েবসাইটের সোর্স কোড ও সি প্যানেল সেটআপ সম্পূর্ণ করে ফাইল আপলোড করা হলো। ফাইলটি ডাউনলোড করে চেক করুন।",
    deliveryFileUrl: "https://github.com/example/ecommerce-release.zip",
    deliveryFileName: "ecommerce-laravel-react-v1.0.zip",
    deliveredAt: "2026-02-15 14:30",
    createdAt: "2026-02-10",
    deadlineDate: "2026-02-16"
  },
  {
    id: "ord-mkt-3",
    type: "gig_order",
    title: "হাই-কনভার্টিং ক্যানভা প্রফেশনাল লোগো ও ব্র্যান্ড কিট ডিজাইন",
    category: "Graphic Design",
    buyerId: "customer-1",
    buyerName: "মেহেদী হাসান (কাস্টমার)",
    buyerEmail: "customer@ptenit.com",
    buyerPhone: "01988776655",
    sellerId: "student-1",
    sellerName: "সাব্বির রহমান",
    sellerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    packageType: "Premium",
    amount: 6500,
    adminCommission: 650,
    sellerPayout: 5850,
    paymentMethod: "Nagad Escrow",
    transactionId: "TRX-NG-334412",
    status: "completed",
    rating: 5,
    reviewComment: "অসাধারণ লোগো ডিজাইন! খুব দ্রুত সময়ে কাজ কমপ্লিট করে দিয়েছে।",
    createdAt: "2026-02-01",
    deadlineDate: "2026-02-05"
  }
];

