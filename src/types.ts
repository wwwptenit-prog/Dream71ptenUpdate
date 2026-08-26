export type UserRole = 'student' | 'instructor' | 'specialist' | 'customer' | 'admin' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  roles?: ('customer' | 'specialist' | 'instructor' | 'admin' | 'student')[];
  activeRole?: 'customer' | 'specialist' | 'instructor' | 'admin' | 'student';
  avatar?: string;
  bio?: string;
  title?: string;
  address?: string;
  institution?: string;
  createdAt: string;
  blocked?: boolean;
  isSpecialist?: boolean;
  specialistStatus?: 'not_applied' | 'pending' | 'approved' | 'rejected';
  specialistApplication?: {
    expertise: string[];
    experienceYears: string;
    bio: string;
    portfolioUrl?: string;
    phone?: string;
    nidOrIdNumber?: string;
    appliedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  };
  isMentor?: boolean;
  mentorStatus?: 'not_applied' | 'pending' | 'approved' | 'rejected';
  mentorApplication?: {
    expertise: string[];
    experienceYears: string;
    bio: string;
    portfolioUrl?: string;
    proposedCourseTopic?: string;
    phone?: string;
    appliedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  duration: string;
  videoUrl: string;
  pdfResourceUrl?: string;
  content?: string;
  isFreePreview?: boolean;
  order: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  instructorId?: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  submissionText: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  points?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface CustomerProject {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  category: string;
  description: string;
  budgetRange?: string;
  deadline?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: 'Pending Review' | 'In Progress' | 'Under Testing' | 'Completed' | 'Cancelled';
  priceEstimate?: number;
  assignedStaff?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole?: string;
  category: string;
  duration: string;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  reviewsCount?: number;
  isFree: boolean;
  price: number;
  discountPrice?: number;
  thumbnail: string;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  tags: string[];
  modules: CourseModule[];
  assignments?: Assignment[];
  quiz?: QuizQuestion[];
  published: boolean;
  createdAt: string;
  targetModules?: number;
  targetLessons?: number;
  teacherCommissionRate?: number;
  assignedInstructorId?: string;
  offerStatus?: 'offered' | 'accepted' | 'declined' | 'unassigned';
  acceptedAt?: string;
  level?: 'basic' | 'advanced' | 'professional' | 'live_batch';
  isPublicOffer?: boolean;
  liveSchedule?: string;
  batch?: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  priceText?: string;
  features: string[];
  published: boolean;
  order?: number;
  thumbnail?: string;
  rating?: number;
  reviewsCount?: number;
  packages?: {
    basic: MarketplaceGigPackage;
    standard: MarketplaceGigPackage;
    premium: MarketplaceGigPackage;
  };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number; // 0 to 100
  completedLessons: string[]; // lessonIds
  enrolledAt: string;
  status: 'active' | 'completed';
  certificateIssued: boolean;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  instructorName: string;
  qrCodeUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Office' | 'Students' | 'Training' | 'Events' | 'Certificates' | 'Projects' | 'Activities';
  imageUrl: string;
  caption: string;
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  courseOrService: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceOrCourse: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  endDate: string; // ISO string
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz';
  transactionId: string;
  senderPhone: string;
  status: 'Pending' | 'Paid' | 'Failed' | 'Cancelled';
  createdAt: string;
}

export interface SubAdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Sub-Admin' | 'Support Specialist' | 'Order Manager' | 'Course Admin';
  permissions: string[]; // e.g., ['orders', 'support', 'courses', 'students']
  status: 'active' | 'suspended';
  assignedAt: string;
}

export interface PaymentMethodItem {
  id: string;
  name: string;
  logoUrl: string;
  type?: 'mobile' | 'bank' | 'card' | 'other';
  isActive?: boolean;
}

export interface SiteSettings {
  heroHeading: string;
  heroSubtext: string;
  statsStudents: string;
  statsProjects: string;
  statsCourses: string;
  statsSatisfaction: string;
  phone: string;
  email: string;
  whatsapp: string;
  officeAddress: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  logoUrl?: string;
  heroBannerUrl?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  paymentLogos?: PaymentMethodItem[];
  enableMoneyBackGuarantee?: boolean;
  moneyBackGuaranteeDays?: number;
  moneyBackGuaranteeText?: string;
  // Meta Pixel & Analytics Setup
  metaPixelId?: string;
  googleAnalyticsId?: string;
  tiktokPixelId?: string;
  googleTagManagerId?: string;
  conversionApiToken?: string;
  // Taxes & VAT Setup
  platformTaxPercent?: number;
  courseVatPercent?: number;
  serviceTaxPercent?: number;
  freelancerTaxDeductionPercent?: number;
  taxRegistrationNumber?: string;
  invoiceTaxNote?: string;
  // Platform Commission & Fee Defaults
  defaultCommissionRate?: number;
  defaultTrainerRevShare?: number;
  defaultClientFee?: number;
  defaultWithdrawalFee?: number;
  // Sub-Admins & Support Team Access
  subAdminMembers?: SubAdminMember[];
  // Written Content Configuration
  announcementNoticeText?: string;
  aboutUsText?: string;
  termsAndConditionsText?: string;
  privacyPolicyText?: string;
  refundPolicyText?: string;
  footerCopyrightText?: string;
  // Responsive 100% Layout & Scaling Setup
  enableFullWidth100Percent?: boolean;
  containerMaxWidth?: string; // '100%', '1536px', '1280px'
  customScalePercent?: number; // 100, 95, 90, 105
  mobileResponsiveMode?: 'fluid_100' | 'adaptive' | 'compact';
  // SEO & Search Engine Optimization Setup
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  robotsTxt?: string;
  structuredDataJson?: string;
  googleSiteVerification?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: 'seller' | 'mentor' | 'message' | 'payout' | 'system';
  targetTab?: string;
  targetId?: string;
  senderName?: string;
  senderAvatar?: string;
  actionLabel?: string;
  details?: {
    orderId?: string;
    courseId?: string;
    assignmentId?: string;
    clientName?: string;
    amount?: number;
    badgeText?: string;
    note?: string;
  };
}

export interface DirectMessageItem {
  id: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  recipientRole?: 'customer' | 'instructor' | 'admin' | 'all';
  text: string;
  time: string;
  read: boolean;
  unreadCount?: number;
  orderId?: string;
  orderTitle?: string;
  targetTab?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  isSelf: boolean;
  text: string;
  time: string;
  meetLink?: string;
}

export interface ActiveChatWindow {
  id: string;
  orderId?: string;
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  messages: ChatMessage[];
  minimized?: boolean;
}

export interface TeacherPayout {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  accountNumber: string;
  note?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  transactionId?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface TeacherNotice {
  id: string;
  senderName: string;
  recipientTeacherId: string; // 'all' or specific teacher id
  recipientTeacherName?: string;
  subject: string;
  message: string;
  sentAt: string;
  read?: boolean;
}

// Marketplace & Agency Project Dispatch Types
export interface MarketplaceGigPackage {
  name: string;
  price: number;
  deliveryDays: number;
  revisions: number | string;
  features: string[];
}

export interface MarketplaceGig {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerTitle?: string;
  sellerLevel?: string;
  sellerRating?: number;
  isAgencyStaff?: boolean; // internal PTENit office staff/instructor
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  galleryImages?: string[];
  videoUrl?: string;
  portfolioWork?: {
    id: string;
    title: string;
    images: string[];
    videoUrl?: string;
    clientReview?: string;
    rating?: number;
    completedDate?: string;
  }[];
  packages: {
    basic: MarketplaceGigPackage;
    standard: MarketplaceGigPackage;
    premium: MarketplaceGigPackage;
  };
  rating: number;
  reviewsCount: number;
  salesCount: number;
  status: 'active' | 'paused';
  offerBadge?: 'cashback' | 'work_first' | string;
  tags?: string[];
  createdAt?: string;
}

export interface MarketplaceJob {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAvatar?: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  deadlineDays: number;
  attachmentName?: string;
  attachmentUrl?: string;
  visibility: 'public' | 'internal_staff_only' | 'custom_assigned';
  assignedStaffId?: string;
  assignedStaffName?: string;
  proposalsCount: number;
  status: 'open' | 'assigned' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface MarketplaceProposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
  freelancerTitle?: string;
  isAgencyStaff?: boolean;
  coverLetter: string;
  bidAmount: number;
  deliveryDays: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MarketplaceOrder {
  id: string;
  type: 'gig_order' | 'job_order' | 'custom_agency_order' | 'digital_product_order';
  digitalProductId?: string;
  downloadUrl?: string;
  licenseKey?: string;
  gigId?: string;
  jobId?: string;
  title: string;
  category: string;
  buyerId: string;
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  isInternalStaff?: boolean;
  packageType?: 'Basic' | 'Standard' | 'Premium' | 'Custom';
  amount: number;
  adminCommission: number;
  sellerPayout: number;
  paymentMethod?: string;
  transactionId?: string;
  status: 'pending' | 'pending_approval' | 'in_progress' | 'in_review' | 'revision_requested' | 'completed' | 'disputed' | 'cancelled';
  deliveryNote?: string;
  deliveryFileUrl?: string;
  deliveryFileName?: string;
  deliveredAt?: string;
  revisionNote?: string;
  updates?: { id?: string; date: string; note: string; sender: string }[];
  rating?: number;
  reviewComment?: string;
  createdAt: string;
  deadlineDate: string;
  unreadMessageCount?: number;
  isPublicOffer?: boolean;
  assignedExpert?: string;
  reachCount?: number;
  likesCount?: number;
  isLikedByBuyer?: boolean;
  budgetRange?: string;
  isOutsourcedToPublic?: boolean;
  outsourcedFreelancerId?: string;
  outsourcedFreelancerName?: string;
  referralCommissionPercent?: number;
  officeReferralCommission?: number;
  freelancerNetPayout?: number;
  outsourceOfferNote?: string;
  outsourceStatus?: 'offered' | 'accepted' | 'in_progress' | 'delivered' | 'completed';
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  shortDescription: string;
  fullDescription?: string;
  deliveryType: 'auto' | 'manual';
  fileFormat: string;
  fileSize: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  features: string[];
  downloadUrl: string;
  licenseKey?: string;
  demoUrl?: string;
  createdAt?: string;
}

