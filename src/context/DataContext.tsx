import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Course,
  Service,
  GalleryItem,
  Testimonial,
  Offer,
  SiteSettings,
  Enrollment,
  Certificate,
  PaymentOrder,
  ContactMessage,
  NotificationItem,
  DirectMessageItem,
  ActiveChatWindow,
  ChatMessage,
  Assignment,
  AssignmentSubmission,
  CustomerProject,
  TeacherPayout,
  TeacherNotice,
  MarketplaceGig,
  MarketplaceJob,
  MarketplaceProposal,
  MarketplaceOrder,
  DigitalProduct
} from '../types';
import {
  initialSiteSettings,
  initialOffers,
  initialServices,
  initialCourses,
  initialGallery,
  initialTestimonials,
  initialUsers,
  initialEnrollments,
  initialCertificates,
  initialGigs,
  initialJobs,
  initialProposals,
  initialMarketplaceOrders,
  initialDigitalProducts
} from '../data/initialData';

interface DataContextType {
  lang: 'bn' | 'en';
  setLang: (lang: 'bn' | 'en') => void;
  t: (bn: string, en: string) => string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  ptenitUser: User | null;
  marketplaceUser: User | null;
  setPtenitUser: (user: User | null) => void;
  setMarketplaceUser: (user: User | null) => void;
  loginMarketplace: (emailOrPhone: string, pass: string) => boolean;
  signupMarketplace: (userData: Omit<User, 'id' | 'createdAt'>, pass: string) => boolean;
  logoutMarketplace: () => void;
  demoLoginMarketplace: (role: 'customer' | 'instructor') => void;
  updateMarketplaceProfile: (data: Partial<User>) => void;
  users: User[];
  courses: Course[];
  services: Service[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  offers: Offer[];
  siteSettings: SiteSettings;
  orders: PaymentOrder[];
  contactMessages: ContactMessage[];
  notifications: NotificationItem[];
  directMessages: DirectMessageItem[];
  activeChatWindows: ActiveChatWindow[];
  activeMessengerConversationId: string | null;
  setActiveMessengerConversationId: (id: string | null) => void;
  activeMessengerOrderId: string | null;
  setActiveMessengerOrderId: (id: string | null) => void;
  isMessengerInboxOpen: boolean;
  setIsMessengerInboxOpen: (open: boolean) => void;
  initialMessengerTab: 'messages' | 'notifications' | 'courses';
  openMessengerInbox: (conversationId?: string, initialTab?: 'messages' | 'notifications' | 'courses', orderId?: string) => void;
  closeMessengerInbox: () => void;
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  customerProjects: CustomerProject[];
  payouts: TeacherPayout[];
  teacherNotices: TeacherNotice[];
  
  // Marketplace & Agency Dispatch State
  gigs: MarketplaceGig[];
  jobs: MarketplaceJob[];
  proposals: MarketplaceProposal[];
  marketplaceOrders: MarketplaceOrder[];
  digitalProducts: DigitalProduct[];
  
  // Digital Products Actions
  addDigitalProduct: (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount'>) => void;
  updateDigitalProduct: (id: string, product: Partial<DigitalProduct>) => void;
  deleteDigitalProduct: (id: string) => void;
  
  // Marketplace & Agency Dispatch Actions
  createGig: (gig: Omit<MarketplaceGig, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => void;
  updateGig: (id: string, gig: Partial<MarketplaceGig>) => void;
  deleteGig: (id: string) => void;
  
  createJob: (job: Omit<MarketplaceJob, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => void;
  updateJobStatus: (id: string, status: MarketplaceJob['status'], assignedStaffId?: string, assignedStaffName?: string) => void;
  
  submitProposal: (proposal: Omit<MarketplaceProposal, 'id' | 'createdAt' | 'status'>) => void;
  acceptProposalAndCreateOrder: (jobId: string, proposalId: string) => void;
  
  createDirectGigOrder: (
    gigId: string,
    packageType: 'basic' | 'standard' | 'premium',
    customNote?: string,
    buyerDetails?: { name?: string; email?: string; phone?: string; paymentMethod?: string; transactionId?: string }
  ) => MarketplaceOrder | null;
  deliverMarketplaceOrder: (orderId: string, note: string, fileUrl?: string, fileName?: string) => void;
  requestOrderRevision: (orderId: string, note: string) => void;
  approveOrderAndReleaseEscrow: (orderId: string, rating?: number, reviewComment?: string) => void;
  cancelMarketplaceOrder: (orderId: string, reason?: string) => void;
  updateMarketplaceOrderStatus: (orderId: string, status: MarketplaceOrder['status'], updateNote?: string) => void;
  addMarketplaceOrder: (order: MarketplaceOrder) => void;
  dispatchJobToStaff: (jobId: string, staffId: string, staffName: string) => void;
  
  // Auth & Profile
  login: (emailOrPhone: string, pass: string) => boolean;
  signup: (userData: Omit<User, 'id' | 'createdAt'>, pass: string) => boolean;
  logout: () => void;
  demoLogin: (role: 'student' | 'instructor' | 'customer' | 'admin') => void;
  switchRole: (newRole: 'customer' | 'specialist' | 'instructor' | 'admin' | 'student') => void;
  updateProfile: (data: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  
  // Teacher Payouts & Notices
  requestTeacherPayout: (payout: Omit<TeacherPayout, 'id' | 'requestedAt' | 'status'>) => void;
  updatePayoutStatus: (payoutId: string, status: TeacherPayout['status'], txId?: string) => void;
  sendTeacherNotice: (notice: Omit<TeacherNotice, 'id' | 'sentAt'>) => void;
  
  // Assignments (Teachers & Students)
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (submission: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeSubmission: (submissionId: string, points: number, feedback: string) => void;
  
  // Customer Projects & Service Requests
  createCustomerProject: (project: Omit<CustomerProject, 'id' | 'createdAt' | 'status'>) => void;
  updateCustomerProjectStatus: (id: string, status: CustomerProject['status'], priceEstimate?: number) => void;
  
  // Courses
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'enrolledCount' | 'rating'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  acceptCourseOffer: (courseId: string, teacherId?: string, teacherName?: string) => void;
  declineCourseOffer: (courseId: string) => void;
  
  // Enrollments & Learning
  enrollCourse: (courseId: string, paymentDetails?: { method: PaymentOrder['paymentMethod']; phone: string; txId: string; amount: number }) => Promise<boolean>;
  updateLessonProgress: (courseId: string, lessonId: string) => void;
  
  // Services
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  
  // Testimonials
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  
  // Offers & Settings
  updateOffers: (offers: Offer[]) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  
  // Certificates
  issueCertificate: (studentId: string, courseId: string) => Certificate;
  getCertificateByCode: (code: string) => Certificate | undefined;
  
  // Orders
  updateOrderStatus: (orderId: string, status: PaymentOrder['status']) => void;
  
  // Contact & Inquiries
  sendContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  
  // Notifications
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  openNotificationCenter: () => void;
  closeNotificationCenter: () => void;
  clearAllNotifications: () => void;
  deleteNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendCentralNotification: (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => void;
  
  // Shared Audio Synthesizer for Distinct Alerts
  playAppSound: (type?: 'notification' | 'message' | 'order' | 'success') => void;

  // Mentorship Application & Role Actions
  applyForMentorship: (data: { expertise: string[]; experienceYears: string; bio: string; portfolioUrl?: string; proposedCourseTopic?: string; phone?: string }) => void;
  approveMentorApplication: (userId?: string) => void;
  rejectMentorApplication: (userId?: string, reason?: string) => void;
  
  // Direct Messages & Popovers
  markDirectMessageRead: (id: string) => void;
  markAllDirectMessagesRead: () => void;
  sendDirectMessage: (msg: Omit<DirectMessageItem, 'id' | 'read'>) => void;
  openChatWindow: (contact: { id?: string; senderName: string; senderRole?: string; senderAvatar?: string; initialMessage?: string }) => void;
  closeChatWindow: (id: string) => void;
  toggleMinimizeChatWindow: (id: string) => void;
  sendChatMessage: (windowId: string, text: string, meetLink?: string) => void;
  createGoogleMeetCall: (windowId: string) => void;
  
  // Delete Operations
  deleteUser: (id: string) => void;
  deleteOrder: (id: string) => void;
  deleteJob: (id: string) => void;
  deleteMarketplaceOrder: (id: string) => void;
  updateMarketplaceOrder: (id: string, updates: Partial<MarketplaceOrder>) => void;
  deleteTeacherPayout: (id: string) => void;
  deleteTeacherNotice: (id: string) => void;

  // Students Management (Admin)
  toggleUserBlock: (userId: string) => void;
}

export const checkAndAutoCancelOverdueOrders = (orders: MarketplaceOrder[]): { updatedOrders: MarketplaceOrder[]; hasChanges: boolean } => {
  const now = Date.now();
  let hasChanges = false;
  const updatedOrders = (orders || []).map(ord => {
    // If order is completed or already cancelled
    if (ord.status === 'completed' || ord.status === 'cancelled') {
      if (ord.isAutoCancelledOverdue && !ord.overdueDelayText) {
        const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
        const deliveryDays = ord.deliveryDays || 3;
        const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime ? createdTime + deliveryDays * 24 * 3600 * 1000 : 0);
        const cancelledTime = ord.cancelledAt ? new Date(ord.cancelledAt).getTime() : now;
        const delayMs = Math.max(0, cancelledTime - deadline);
        const totalSecs = Math.floor(delayMs / 1000);
        const d = Math.floor(totalSecs / 86400);
        const h = Math.floor((totalSecs % 86400) / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const delayText = d > 0 ? `${d.toLocaleString('bn-BD')}দিন ${h.toLocaleString('bn-BD')}ঘণ্টা` : h > 0 ? `${h.toLocaleString('bn-BD')}ঘণ্টা ${m.toLocaleString('bn-BD')}মিনিট` : `${m.toLocaleString('bn-BD')} মিনিট`;
        return { ...ord, overdueDelayText: delayText };
      }
      return ord;
    }

    // If order is in_review or revision_requested (Buyer 24h review grace + 48h penalty cycle)
    if (ord.status === 'in_review' || ord.status === 'revision_requested') {
      const deliveredTime = ord.deliveredAt ? new Date(ord.deliveredAt).getTime() : (ord.createdAt ? new Date(ord.createdAt).getTime() : now);
      const gracePeriodMs = 24 * 3600 * 1000;
      const reviewDeadline = deliveredTime + gracePeriodMs;

      if (now > reviewDeadline) {
        const overdueReviewMs = now - reviewDeadline;
        const intervals = Math.floor(overdueReviewMs / (48 * 3600 * 1000)) + 1;
        const buyerReviewPenalty = Math.round((ord.amount || 0) * 0.05 * intervals);
        const sellerReviewBonus = Math.round((ord.amount || 0) * 0.02 * intervals);
        const revTotalSecs = Math.floor(overdueReviewMs / 1000);
        const revD = Math.floor(revTotalSecs / 86400);
        const revH = Math.floor((revTotalSecs % 86400) / 3600);
        const revM = Math.floor((revTotalSecs % 3600) / 60);
        const revDuration = revD > 0 ? `${revD.toLocaleString('bn-BD')}দিন ${revH.toLocaleString('bn-BD')}ঘ` : `${revH.toLocaleString('bn-BD')}ঘ ${revM.toLocaleString('bn-BD')}মি`;

        if (ord.buyerReviewPenalty !== buyerReviewPenalty || ord.sellerReviewBonus !== sellerReviewBonus || ord.reviewOverdueDuration !== revDuration) {
          hasChanges = true;
          return {
            ...ord,
            buyerReviewPenalty,
            sellerReviewBonus,
            reviewOverdueDuration: revDuration
          };
        }
      }
      return ord;
    }

    // Determine deadline for in_progress / pending / pending_approval
    const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
    const deliveryDays = ord.deliveryDays || 3;
    const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime ? createdTime + deliveryDays * 24 * 3600 * 1000 : 0);

    // If deadline has passed and order is in_progress, pending, or pending_approval
    if (deadline > 0 && now > deadline) {
      hasChanges = true;
      const penaltyAmount = ord.penaltyAmount || Math.round((ord.amount || 0) * 0.05);
      const buyerBonus = ord.buyerBonus || Math.round((ord.amount || 0) * 0.03);
      const delayMs = Math.max(0, now - deadline);
      const totalSecs = Math.floor(delayMs / 1000);
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const delayText = d > 0 ? `${d.toLocaleString('bn-BD')}দিন ${h.toLocaleString('bn-BD')}ঘণ্টা` : h > 0 ? `${h.toLocaleString('bn-BD')}ঘণ্টা ${m.toLocaleString('bn-BD')}মিনিট` : `${m.toLocaleString('bn-BD')} মিনিট`;

      return {
        ...ord,
        status: 'cancelled' as const,
        cancelledReason: 'সময়োত্তীর্ণ (অটো সিস্টেম ৫% জরিমানা কর্তন ও বায়ার ৩% ক্ষতিপূরণ বোনাস কার্যকর)',
        isAutoCancelledOverdue: true,
        penaltyAmount,
        buyerBonus,
        overdueDelayText: delayText,
        cancelledAt: new Date().toISOString()
      };
    }
    return ord;
  });

  return { updatedOrders, hasChanges };
};

const STORAGE_KEY = 'ptenit_database_v2';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const setLang = (newLang: 'bn' | 'en') => {
    setLangState(newLang);
    localStorage.setItem(`${STORAGE_KEY}_lang`, newLang);
  };

  const t = (bnText: string, enText: string) => {
    return lang === 'en' ? enText : bnText;
  };

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_dark_mode`) === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_KEY}_dark_mode`, String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkModeState(prev => !prev);
  };

  // Shared Global Web Audio API Synthesizer for Distinct Alerts & Chimes
  const playAppSound = (type: 'notification' | 'message' | 'order' | 'success' = 'notification') => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();

      const playNotes = () => {
        const now = ctx.currentTime;

        if (type === 'notification') {
          // Distinct crisp double bell chime (587.33 Hz [D5] -> 880 Hz [A5])
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          const gain2 = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, now);
          gain1.gain.setValueAtTime(0.25, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.22);

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(880, now + 0.09);
          gain2.gain.setValueAtTime(0.22, now + 0.09);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.09);
          osc2.stop(now + 0.38);

        } else if (type === 'message') {
          // Distinct warm bubble/pop chime (440Hz -> 659Hz -> 554Hz)
          const freqs = [440, 659.25, 554.37];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.07;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.18, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.18);
          });

        } else if (type === 'order') {
          // Joyful triumphant cash register & success chime (523Hz -> 659Hz -> 784Hz -> 1046.5Hz)
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const noteStart = now + idx * 0.06;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.24, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.25);
          });

        } else {
          // General smooth success ping
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playNotes()).catch(() => {});
      } else {
        playNotes();
      }
    } catch (e) {
      // Audio autoplay restriction fallback
    }
  };

  // Load state from localStorage or initialData
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_testimonials`);
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
    return saved ? JSON.parse(saved) : initialOffers;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // PTENit IT Academy / Services User Account
  const [ptenitUser, setPtenitUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ptenit_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return initialUsers.find(u => u.id === 'student-1') || initialUsers[2];
  });

  // Marketplace Freelancing Platform User Account (Buyer or Seller)
  const [marketplaceUser, setMarketplaceUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketplace_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return initialUsers.find(u => u.id === 'mkt-seller-1') || initialUsers[4];
  });

  // Legacy/Default currentUser synced with PTENit user
  const currentUser = ptenitUser;
  const setCurrentUser = (u: User | null) => setPtenitUser(u);

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_enrollments`);
    if (saved) {
      try {
        const parsed: Enrollment[] = JSON.parse(saved);
        const map = new Map<string, Enrollment>();
        initialEnrollments.forEach(e => map.set(e.courseId, e));
        parsed.forEach(e => map.set(e.courseId, e));
        return Array.from(map.values());
      } catch {}
    }
    return initialEnrollments;
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_certificates`);
    return saved ? JSON.parse(saved) : initialCertificates;
  });

  const [orders, setOrders] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : [
      {
        id: "ord-101",
        userId: "student-1",
        userName: "সাব্বির রহমান",
        userEmail: "student@ptenit.com",
        userMobile: "01812345678",
        courseId: "course-canva",
        courseTitle: "Canva Design & Freelancing Masterclass",
        amount: 850,
        paymentMethod: "bKash",
        transactionId: "BK9X82M1A7",
        senderPhone: "01812345678",
        status: "Paid",
        createdAt: "2026-02-05 14:30"
      }
    ];
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : [
      {
        id: "msg-1",
        name: "তানজিল আহমেদ",
        phone: "01711223344",
        email: "tanjil@gmail.com",
        serviceOrCourse: "Web Design & Development",
        message: "আমার একটি ই-কমার্স ফার্মের জন্য কাস্টম ওয়েবসাইট বানাতে চাই, কোটেশন প্রয়োজন।",
        createdAt: "2026-02-20 10:15",
        read: false
      }
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: "notif-1",
        title: "ক্লাইন্ট অর্ডার #ORD-8821 আপডেট",
        message: "আপনার ই-কমার্স প্রজেক্টের এস্ক্রো ওয়ালেটে ৳১২,০০০ জমা হয়েছে। প্রজেক্ট স্ট্যাটাস দেখতে ক্লিক করুন।",
        time: "১০ মিনিট আগে",
        read: false,
        type: "success",
        targetTab: "marketplace"
      },
      {
        id: "notif-2",
        title: "React Assignment রিভিউ সমাপ্ত",
        message: "আপনার জমা দেওয়া 'e-Commerce Frontend' অ্যাসাইনমেন্ট গ্রাডিং সম্পন্ন (95/100)।",
        time: "৪৫ মিনিট আগে",
        read: false,
        type: "info",
        targetTab: "student-dashboard"
      },
      {
        id: "notif-3",
        title: "কোর্স মডিউল ৫ লাইভ আনলক!",
        message: "Full Stack Masterclass - Module 5 Live API Streaming আপডেট প্রকাশিত হয়েছে।",
        time: "২ ঘন্টা আগে",
        read: false,
        type: "info",
        targetTab: "courses"
      },
      {
        id: "notif-4",
        title: "মার্কেটপ্লেস গিগ প্রস্তাবনা",
        message: "সোহাগ কাজী আপনার সার্ভিস অর্ডারে মেসেজ ও কাজ সংক্রান্ত আপডেট পাঠিয়েছেন।",
        time: "৩ ঘন্টা আগে",
        read: false,
        type: "success",
        targetTab: "marketplace"
      },
      {
        id: "notif-5",
        title: "ইনস্ট্যান্ট পেমেন্ট ওয়ালেট বোনাস",
        message: "আপনার PTENit ওয়ালেটে ৳৫,০০০ বোনাস ক্রেডিট জমা হয়েছে।",
        time: "৪ ঘন্টা আগে",
        read: false,
        type: "success",
        targetTab: "financials"
      }
    ];
  });

  const [directMessages, setDirectMessages] = useState<DirectMessageItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_direct_messages`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: "dmsg-1",
        senderName: "সোহাগ কাজী (বায়ার)",
        senderRole: "customer",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        recipientRole: "instructor",
        text: "ভাইয়া, আমার ই-কমার্স প্রজেক্টের ডিজাইন ডেমো কি তৈরি হয়েছে? একটু আপডেট দিবেন।",
        time: "১০ মিনিট আগে",
        read: false,
        targetTab: "marketplace"
      },
      {
        id: "dmsg-2",
        senderName: "তানজিম আহমেদ (সেবাগ্রহীতা)",
        senderRole: "customer",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        recipientRole: "instructor",
        text: "আপনার গিগ সার্ভিস অর্ডার করেছি, এস্ক্রো ওয়ালেটে টাকা জমা হয়েছে। কোড শুরু করুন।",
        time: "৪৫ মিনিট আগে",
        read: false,
        targetTab: "marketplace"
      },
      {
        id: "dmsg-3",
        senderName: "PTENit সাপোর্ট ও এজেন্সী",
        senderRole: "admin",
        senderAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80",
        recipientRole: "all",
        text: "অভিনন্দন! আপনার বায়ার/সেলার প্রোফাইল ৫ তারকা ভেরিফাইড হিসেবে লেভেল ২ ব্যাজ পেয়েছে।",
        time: "২ ঘন্টা আগে",
        read: false,
        targetTab: "admin"
      },
      {
        id: "dmsg-4",
        senderName: "রাশেদুল ইসলাম (এক্সপার্ট ডেভেলপার)",
        senderRole: "teacher",
        senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        recipientRole: "all",
        text: "আপনার প্রজেক্ট কোড রিভিউ সম্পন্ন। ইনবক্সে ফাইল চেক করে নিন।",
        time: "৩ ঘন্টা আগে",
        read: false,
        targetTab: "student-dashboard"
      },
      {
        id: "dmsg-5",
        senderName: "মার্কেটপ্লেস সাপোর্ট হেল্পডেস্ক",
        senderRole: "admin",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        recipientRole: "all",
        text: "আপনার কাস্টম সার্ভিস অর্ডার ভেরিফাইড হয়েছে এবং ডেলিভারি মেসেজ আপডেট প্রসেসিংয়ে।",
        time: "৫ ঘন্টা আগে",
        read: false,
        targetTab: "marketplace"
      }
    ];
  });

  const [activeChatWindows, setActiveChatWindows] = useState<ActiveChatWindow[]>([]);
  const [activeMessengerConversationId, setActiveMessengerConversationId] = useState<string | null>(null);
  const [activeMessengerOrderId, setActiveMessengerOrderId] = useState<string | null>(null);
  const [isMessengerInboxOpen, setIsMessengerInboxOpen] = useState(false);
  const [initialMessengerTab, setInitialMessengerTab] = useState<'messages' | 'notifications' | 'courses'>('messages');

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "asgn-1",
        courseId: "course-1",
        courseTitle: "PTE Academic Masterclass 2026",
        title: "PTE Speaking Describe Image Task Practice",
        description: "প্রদত্ত ছবি পর্যবেক্ষণ করে ৪০ সেকেন্ডের মৌখিক বিবরণ ও নোট ফাইল জমা দিন।",
        dueDate: "2026-08-15",
        totalPoints: 50,
        createdAt: "2026-08-01"
      },
      {
        id: "asgn-2",
        courseId: "course-2",
        courseTitle: "Full-Stack Web Development Bootcamp",
        title: "React Components & Tailwind Layout Project",
        description: "Tailwind CSS ব্যবহার করে একটি সুন্দর ই-কমার্স কার্ড ল্যান্ডিং পেজ ডিজাইন করে ফাইল আপলোড করুন।",
        dueDate: "2026-08-20",
        totalPoints: 100,
        createdAt: "2026-08-01"
      }
    ];
  });

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_submissions`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "sub-1",
        assignmentId: "asgn-1",
        studentId: "user-student-1",
        studentName: "আরিফ হোসেন",
        studentEmail: "student@ptenit.com",
        submissionText: "আমার ডেসক্রাইব ইমেজ টাস্কের ফাইল ও প্র্যাকটিস নোট সংযোজন করা হলো।",
        submittedAt: "2026-08-01 02:30 PM",
        points: 48,
        feedback: "খুব চমৎকার ফ্লুয়েন্সি ও এক্সেন্ট। গুড জব!",
        status: "graded"
      }
    ];
  });

  const [customerProjects, setCustomerProjects] = useState<CustomerProject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customer_projects`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "proj-1",
        customerId: "user-cust-1",
        customerName: "কামরুল হাসান (মেসার্স ট্রেডিং)",
        customerEmail: "client@ptenit.com",
        customerPhone: "01812345678",
        serviceTitle: "কাস্টম ই-কমার্স ওয়েবসাইট ডেভেলপমেন্ট",
        category: "Web Development",
        description: "আমাদের প্রতিষ্ঠানের জন্য পেমেন্ট গেটওয়েসহ পূর্ণাঙ্গ ই-কমার্স সাইট তৈরি দরকার।",
        budgetRange: "৳৪৫,০০০ - ৳৬০,০০০",
        status: "In Progress",
        priceEstimate: 50000,
        assignedStaff: "ইঞ্জি. সাব্বির আহমেদ",
        createdAt: "2026-07-28"
      }
    ];
  });

  const [payouts, setPayouts] = useState<TeacherPayout[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payouts`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "pay-101",
        teacherId: "teacher-1",
        teacherName: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
        teacherEmail: "teacher@ptenit.com",
        amount: 8500,
        paymentMethod: "bKash",
        accountNumber: "01711122233",
        note: "জুলাই মাসের কোর্স কমিশন ও মডিউল অ্যাসেসড বোনাস",
        status: "Pending",
        requestedAt: "2026-07-31 16:20"
      },
      {
        id: "pay-102",
        teacherId: "teacher-1",
        teacherName: "তানভীর আহমেদ (ইনস্ট্রাক্টর)",
        teacherEmail: "teacher@ptenit.com",
        amount: 5000,
        paymentMethod: "Nagad",
        accountNumber: "01711122233",
        note: "জুন মাসের ইনস্ট্রাকশন পেমেন্ট",
        status: "Paid",
        transactionId: "NG7721X90",
        requestedAt: "2026-06-30 11:00",
        processedAt: "2026-07-01 10:30"
      }
    ];
  });

  const [teacherNotices, setTeacherNotices] = useState<TeacherNotice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teacher_notices`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "tnotice-1",
        senderName: "PTENit Admin",
        recipientTeacherId: "all",
        subject: "নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা",
        message: "সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।",
        sentAt: "2026-08-01 09:00",
        read: false
      }
    ];
  });

  // Marketplace & Agency Dispatch States
  const [gigs, setGigs] = useState<MarketplaceGig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gigs`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const officialIds = ['web-dev', 'digital-marketing', 'graphics-design', 'app-development', 'seo-optimization', 'video-editing', 'cyber-security', 'software-dev'];
          const missingOfficial = initialGigs.filter(g => officialIds.includes(g.id) && !parsed.some(p => p.id === g.id));
          if (missingOfficial.length > 0) {
            return [...missingOfficial, ...parsed];
          }
          return parsed;
        }
      } catch {}
    }
    return initialGigs;
  });

  const [jobs, setJobs] = useState<MarketplaceJob[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialJobs;
  });

  const [proposals, setProposals] = useState<MarketplaceProposal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_proposals`);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialProposals;
  });

  const [digitalProducts, setDigitalProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_digital_products`);
    if (saved) {
      try {
        const parsed: DigitalProduct[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If dp-4 or dp-5 exist, ensure updated free price if not custom modified
          return parsed.map(p => {
            const initial = initialDigitalProducts.find(init => init.id === p.id);
            if (initial && (p.id === 'dp-4' || p.id === 'dp-5') && p.price > 0) {
              return { ...p, price: 0, originalPrice: initial.originalPrice };
            }
            return p;
          });
        }
      } catch {}
    }
    return initialDigitalProducts;
  });



  const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>(() => {
    let initialList = initialMarketplaceOrders;
    const saved = localStorage.getItem(`${STORAGE_KEY}_marketplace_orders`);
    if (saved) {
      try {
        const parsed: MarketplaceOrder[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPendingApproval = parsed.some(o => o.status === 'pending_approval');
          if (!hasPendingApproval) {
            const demoOrd = initialMarketplaceOrders.find(o => o.id === 'ord-mkt-4');
            if (demoOrd) {
              const without4 = parsed.filter(o => o.id !== 'ord-mkt-4');
              initialList = [demoOrd, ...without4];
            } else {
              initialList = parsed;
            }
          } else {
            initialList = parsed;
          }
        }
      } catch {}
    }
    const { updatedOrders } = checkAndAutoCancelOverdueOrders(initialList);
    return updatedOrders;
  });

  // Periodically check and auto-cancel any overdue orders in real-time
  useEffect(() => {
    const checkOverdueInterval = setInterval(() => {
      setMarketplaceOrders(prev => {
        const { updatedOrders, hasChanges } = checkAndAutoCancelOverdueOrders(prev);
        if (hasChanges) {
          return updatedOrders;
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(checkOverdueInterval);
  }, []);

  // Sync Marketplace to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gigs`, JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_proposals`, JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_digital_products`, JSON.stringify(digitalProducts));
  }, [digitalProducts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_marketplace_orders`, JSON.stringify(marketplaceOrders));
  }, [marketplaceOrders]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_teacher_notices`, JSON.stringify(teacherNotices));
  }, [teacherNotices]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (ptenitUser) {
      localStorage.setItem(`${STORAGE_KEY}_ptenit_user`, JSON.stringify(ptenitUser));
      localStorage.setItem(`${STORAGE_KEY}_current_user`, JSON.stringify(ptenitUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_ptenit_user`);
      localStorage.removeItem(`${STORAGE_KEY}_current_user`);
    }
  }, [ptenitUser]);

  useEffect(() => {
    if (marketplaceUser) {
      localStorage.setItem(`${STORAGE_KEY}_marketplace_user`, JSON.stringify(marketplaceUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_marketplace_user`);
    }
  }, [marketplaceUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_enrollments`, JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_certificates`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_direct_messages`, JSON.stringify(directMessages));
  }, [directMessages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_submissions`, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customer_projects`, JSON.stringify(customerProjects));
  }, [customerProjects]);

  // Auth Functions
  const login = (emailOrPhone: string, pass: string): boolean => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    let user = users.find(
      u => u.email.toLowerCase() === cleanInput || u.mobile === emailOrPhone
    );

    // If typing teacher or alamin credentials
    if (!user && (cleanInput === 'alamin@ptenit.com' || cleanInput === 'teacher@ptenit.com' || cleanInput.includes('alamin') || cleanInput.includes('teacher'))) {
      user = users.find(u => u.role === 'instructor') || initialUsers[1];
    }

    if (!user && cleanInput.includes("customer")) {
      user = users.find(u => u.role === 'customer') || initialUsers[2];
    }

    // If typing admin credentials
    if (!user && (cleanInput === 'mdskazisohag@gmail.com' || cleanInput === 'admin@ptenit.com' || cleanInput.includes("admin") || cleanInput.includes("sohag"))) {
      user = users.find(u => u.role === 'admin') || initialUsers[0];
    }

    if (user) {
      if (user.blocked) {
        alert("আপনার একাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। এডমিনের সাথে যোগাযোগ করুন।");
        return false;
      }
      setCurrentUser(user);
      return true;
    }

    // Auto-create student fallback if no match
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || "Student",
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@ptenit.com`,
      mobile: emailOrPhone,
      role: 'student',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const signup = (userData: Omit<User, 'id' | 'createdAt'>, _pass: string): boolean => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  // Marketplace Auth Functions
  const loginMarketplace = (emailOrPhone: string, _pass: string): boolean => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    let user = users.find(
      u => (u.email.toLowerCase() === cleanInput || u.mobile === emailOrPhone) && (u.id.startsWith('mkt-') || cleanInput.includes('seller') || cleanInput.includes('buyer'))
    );

    if (!user && (cleanInput.includes('seller') || cleanInput.includes('sohag') || cleanInput.includes('freelancer'))) {
      user = users.find(u => u.id === 'mkt-seller-1') || initialUsers[4];
    } else if (!user && (cleanInput.includes('buyer') || cleanInput.includes('tanjil') || cleanInput.includes('client'))) {
      user = users.find(u => u.id === 'mkt-buyer-1') || initialUsers[5];
    } else if (!user) {
      user = users.find(u => u.email.toLowerCase() === cleanInput || u.mobile === emailOrPhone);
    }

    if (user) {
      setMarketplaceUser(user);
      return true;
    }

    const newMktUser: User = {
      id: `mkt-usr-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || "Marketplace User",
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@marketplace.com`,
      mobile: emailOrPhone,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newMktUser]);
    setMarketplaceUser(newMktUser);
    return true;
  };

  const signupMarketplace = (userData: Omit<User, 'id' | 'createdAt'>, _pass: string): boolean => {
    const newMktUser: User = {
      ...userData,
      id: `mkt-usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newMktUser]);
    setMarketplaceUser(newMktUser);
    return true;
  };

  const logoutMarketplace = () => {
    setMarketplaceUser(null);
  };

  const logout = () => {
    setPtenitUser(null);
  };

  const demoLoginMarketplace = (role: 'customer' | 'instructor') => {
    if (role === 'instructor') {
      const seller = users.find(u => u.id === 'mkt-seller-1') || initialUsers.find(u => u.id === 'mkt-seller-1') || initialUsers[4];
      setMarketplaceUser(seller);
    } else {
      const buyer = users.find(u => u.id === 'mkt-buyer-1') || initialUsers.find(u => u.id === 'mkt-buyer-1') || initialUsers[5];
      setMarketplaceUser(buyer);
    }
  };

  const updateMarketplaceProfile = (data: Partial<User>) => {
    if (!marketplaceUser) return;
    const updated = { ...marketplaceUser, ...data };
    setMarketplaceUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const demoLogin = (role: 'student' | 'instructor' | 'customer' | 'admin') => {
    let target = users.find(u => u.role === role);
    if (!target) {
      target = initialUsers.find(u => u.role === role) || initialUsers[0];
    }
    setCurrentUser(target);
    
    // Synchronize marketplace user appropriately
    if (role === 'instructor') {
      const seller = users.find(u => u.id === 'mkt-seller-1') || initialUsers.find(u => u.id === 'mkt-seller-1') || initialUsers[4];
      setMarketplaceUser(seller);
    } else if (role === 'customer') {
      const buyer = users.find(u => u.id === 'mkt-buyer-1') || initialUsers.find(u => u.id === 'mkt-buyer-1') || initialUsers[5];
      setMarketplaceUser(buyer);
    } else if (role === 'admin') {
      const adminMkt = users.find(u => u.role === 'admin') || initialUsers[0];
      setMarketplaceUser(adminMkt);
    } else {
      const studentBuyer = users.find(u => u.id === 'mkt-buyer-1') || initialUsers.find(u => u.id === 'mkt-buyer-1') || initialUsers[5];
      setMarketplaceUser(studentBuyer);
    }
  };

  const switchRole = (newRole: 'customer' | 'specialist' | 'instructor' | 'admin' | 'student') => {
    const activeUser = currentUser || marketplaceUser;
    if (!activeUser) return;

    const targetRole = (newRole === 'specialist' ? 'instructor' : newRole) as any;
    const updatedUser: User = {
      ...activeUser,
      role: targetRole,
      activeRole: newRole as any
    };

    setPtenitUser(updatedUser);
    setMarketplaceUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Course Management
  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledCount' | 'rating'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const acceptCourseOffer = (courseId: string, teacherId?: string, teacherName?: string) => {
    let exists = false;
    setCourses(prev => {
      const isFound = prev.some(c => c.id === courseId);
      if (isFound) {
        exists = true;
        return prev.map(c => {
          if (c.id === courseId) {
            return {
              ...c,
              offerStatus: 'accepted',
              assignedInstructorId: teacherId || c.assignedInstructorId || currentUser?.id,
              instructor: teacherName || (currentUser ? currentUser.name : c.instructor),
              isPublicOffer: false,
              acceptedAt: new Date().toISOString().split('T')[0]
            };
          }
          return c;
        });
      } else {
        // Create new course if not found
        const newCourse: Course = {
          id: courseId.startsWith('course') ? courseId : `course-${Date.now()}`,
          title: 'প্রফেশনাল লাইভ কোর্স এনরোলমেন্ট (অফিশিয়াল অফার)',
          category: 'Full-Stack Development',
          instructor: teacherName || currentUser?.name || 'তানভীর আহমেদ',
          assignedInstructorId: teacherId || currentUser?.id || 'teacher-1',
          level: 'professional',
          duration: '4 Weeks',
          lessonsCount: 16,
          isFree: false,
          price: 8500,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
          description: 'PTENit একাডেমি কর্তৃক নির্ধারিত লাইভ প্রফেশনাল কোর্স ও মেন্টরিং ব্যাচ।',
          whatYouWillLearn: ['২৪টি প্রফেশনাল লাইভ ক্লাস লেকচার', '৪টি রিয়েল-টাইম অ্যাসাইনমেন্ট ও কোড রিভিউ', 'প্রজেক্ট ফিডব্যাক ও সার্টিফিকেট প্রদান'],
          requirements: ['কম্পিউটার বা ইন্টারনেট সংযোগ'],
          tags: ['#PTENit', '#LiveCourse'],
          modules: [],
          published: true,
          targetModules: 4,
          targetLessons: 16,
          teacherCommissionRate: 35,
          offerStatus: 'accepted',
          isPublicOffer: false,
          enrolledCount: 1,
          rating: 5.0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return [newCourse, ...prev];
      }
    });

    const targetCourse = courses.find(c => c.id === courseId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🎉 কোর্স রিসিভড & মেন্টর সার্ভিস অ্যাক্টিভ!',
      message: `আপনি সফলভাবে "${targetCourse?.title || 'লাইভ কোর্স'}" কোর্সটি রিসিভ করেছেন। মেন্টর সার্ভিস (Mentor Service) অটোমেটিক্যালি অ্যাক্টিভ করা হয়েছে।`,
      time: 'এইমাত্র',
      read: false,
      type: 'success'
    };
    setNotifications(prev => [notif, ...prev]);

    // Automatically enable & approve Mentor Status for currentUser when receiving a course offer
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: currentUser.mentorApplication ? {
          ...currentUser.mentorApplication,
          status: 'approved'
        } : {
          expertise: ['কোর্স ইন্সট্রাক্টর & মেন্টর'],
          experienceYears: '৩+ বছর',
          bio: 'পিটেন আইটি অনুমোদিত ভেরিফায়েড কোর্স মেন্টর',
          appliedAt: new Date().toISOString().split('T')[0],
          status: 'approved'
        }
      };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const declineCourseOffer = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          offerStatus: 'declined'
        };
      }
      return c;
    }));
  };

  // Enrollments & Learning
  const enrollCourse = async (
    courseId: string,
    paymentDetails?: { method: PaymentOrder['paymentMethod']; phone: string; txId: string; amount: number }
  ): Promise<boolean> => {
    if (!currentUser) return false;
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    // Check if already enrolled
    const existing = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (existing) return true;

    if (!course.isFree && paymentDetails) {
      // Create Order
      const newOrder: PaymentOrder = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userMobile: currentUser.mobile,
        courseId: course.id,
        courseTitle: course.title,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.method,
        transactionId: paymentDetails.txId,
        senderPhone: paymentDetails.phone,
        status: 'Paid', // Instantly activate for great user experience
        createdAt: new Date().toLocaleString('en-US', { hour12: true })
      };
      setOrders(prev => [newOrder, ...prev]);
    }

    // Add Enrollment
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId: currentUser.id,
      courseId: course.id,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date().toISOString().split('T')[0],
      status: 'active',
      certificateIssued: false
    };

    setEnrollments(prev => [...prev, newEnrollment]);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c));
    return true;
  };

  const updateLessonProgress = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    const enrollment = enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!enrollment) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Total lessons
    let totalLessonsCount = 0;
    course.modules?.forEach(m => {
      totalLessonsCount += m.lessons.length;
    });
    if (totalLessonsCount === 0) totalLessonsCount = course.lessonsCount || 1;

    const completed = enrollment.completedLessons.includes(lessonId)
      ? enrollment.completedLessons
      : [...enrollment.completedLessons, lessonId];

    const progress = Math.min(100, Math.round((completed.length / totalLessonsCount) * 100));
    const isCompleted = progress === 100;

    let certificateId = enrollment.certificateId;
    if (isCompleted && !enrollment.certificateIssued) {
      const cert = issueCertificate(currentUser.id, courseId);
      certificateId = cert.certificateCode;

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: '🎓 অফিসিয়াল সার্টিফিকেট তৈরি হয়েছে!',
        message: `অভিনন্দন! "${course.title}" কোর্সের ১০০% ক্লাস ও টাস্ক সম্পন্ন করায় আপনার সনদপত্র স্বয়ংক্রিয়ভাবে তৈরি হয়েছে।`,
        time: 'এইমাত্র',
        read: false,
        type: 'success'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    setEnrollments(prev => prev.map(e => e.id === enrollment.id ? {
      ...e,
      completedLessons: completed,
      progress: progress,
      status: isCompleted ? 'completed' : 'active',
      certificateIssued: isCompleted || e.certificateIssued,
      certificateId: certificateId || e.certificateId
    } : e));
  };

  // Certificate Issuance
  const issueCertificate = (studentId: string, courseId: string): Certificate => {
    const student = users.find(u => u.id === studentId) || currentUser;
    const course = courses.find(c => c.id === courseId);
    const code = `CERT-PTEN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateCode: code,
      studentId: studentId,
      studentName: student ? student.name : "Student",
      courseId: courseId,
      courseName: course ? course.title : "PTENit Course",
      issueDate: new Date().toISOString().split('T')[0],
      instructorName: course ? course.instructor : "PTENit Academic Team",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`
    };

    setCertificates(prev => [newCert, ...prev]);
    return newCert;
  };

  const getCertificateByCode = (code: string) => {
    return certificates.find(c => c.certificateCode.toLowerCase() === code.toLowerCase());
  };

  // Services
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = { ...serviceData, id: `srv-${Date.now()}` };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, fields: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  // Testimonials
  const addTestimonial = (item: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = { ...item, id: `test-${Date.now()}` };
    setTestimonials(prev => [newItem, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // Offers & Settings
  const updateOffers = (newOffers: Offer[]) => {
    setOffers(newOffers);
  };

  const updateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
  };

  // Orders
  const updateOrderStatus = (orderId: string, status: PaymentOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Contact
  const sendContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-US', { hour12: true }),
      read: false
    };
    setContactMessages(prev => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setDirectMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const sendCentralNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: 'এখনই',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    playAppSound('notification');
  };

  const applyForMentorship = (data: {
    expertise: string[];
    experienceYears: string;
    bio: string;
    portfolioUrl?: string;
    proposedCourseTopic?: string;
    phone?: string;
  }) => {
    const targetUser = currentUser || marketplaceUser;
    if (!targetUser) return;

    const updatedUser: User = {
      ...targetUser,
      mentorStatus: 'pending',
      mentorApplication: {
        ...data,
        appliedAt: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'pending'
      }
    };

    if (currentUser) setPtenitUser(updatedUser);
    if (marketplaceUser) setMarketplaceUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === targetUser.id ? updatedUser : u));

    sendCentralNotification({
      title: '📋 মেন্টরশিপ আবেদন সফলভাবে জমা হয়েছে',
      message: `আপনার মেন্টরশিপ আবেদন পর্যালোচনা করা হচ্ছে। এডমিন প্যানেল থেকে খুব শীঘ্রই অনুমোদন দেওয়া হবে।`,
      type: 'info',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'আবেদন স্ট্যাটাস দেখুন',
      details: {
        badgeText: 'অপেক্ষমান (Pending Review)',
        note: `এক্সপার্টিজ: ${data.expertise.join(', ')} • অভিজ্ঞতা: ${data.experienceYears}`
      }
    });
  };

  const approveMentorApplication = (userId?: string) => {
    const targetId = userId || currentUser?.id || marketplaceUser?.id;
    if (!targetId) return;

    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        return {
          ...u,
          role: 'instructor',
          isMentor: true,
          mentorStatus: 'approved',
          mentorApplication: u.mentorApplication ? { ...u.mentorApplication, status: 'approved' } : undefined
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === targetId) {
      setPtenitUser({
        ...currentUser,
        role: 'instructor',
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: currentUser.mentorApplication ? { ...currentUser.mentorApplication, status: 'approved' } : undefined
      });
    }

    if (marketplaceUser && marketplaceUser.id === targetId) {
      setMarketplaceUser({
        ...marketplaceUser,
        role: 'instructor',
        isMentor: true,
        mentorStatus: 'approved',
        mentorApplication: marketplaceUser.mentorApplication ? { ...marketplaceUser.mentorApplication, status: 'approved' } : undefined
      });
    }

    sendCentralNotification({
      title: '🎉 অভিনন্দন! আপনার মেন্টরশিপ আবেদন অনুমোদিত হয়েছে',
      message: 'আপনি এখন PTENit ভেরিফায়েড মেন্টর। আপনার কোর্স তৈরি, অ্যাসাইনমেন্ট প্রদান ও স্টুডেন্টদের মেন্টরিং করার সকল ফিচার আনলক করা হয়েছে!',
      type: 'success',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'মেন্টর প্যানেলে যান',
      details: {
        badgeText: 'ভেরিফায়েড মেন্টর (Approved)',
        note: 'কোর্স ও লাইভ ক্লাস ম্যানেজমেন্ট শুরু করুন।'
      }
    });
  };

  const rejectMentorApplication = (userId?: string, reason?: string) => {
    const targetId = userId || currentUser?.id || marketplaceUser?.id;
    if (!targetId) return;

    setUsers(prev => prev.map(u => {
      if (u.id === targetId) {
        return {
          ...u,
          mentorStatus: 'rejected',
          mentorApplication: u.mentorApplication ? { ...u.mentorApplication, status: 'rejected', rejectionReason: reason } : undefined
        };
      }
      return u;
    }));

    if (currentUser && currentUser.id === targetId) {
      setPtenitUser({
        ...currentUser,
        mentorStatus: 'rejected',
        mentorApplication: currentUser.mentorApplication ? { ...currentUser.mentorApplication, status: 'rejected', rejectionReason: reason } : undefined
      });
    }

    sendCentralNotification({
      title: '⚠️ মেন্টরশিপ আবেদন সংক্রান্ত আপডেট',
      message: `আপনার মেন্টরশিপ আবেদনটি এই মুহূর্তে অনুমোদন করা সম্ভব হয়নি। কারণ: ${reason || 'প্রয়োজনীয় অভিজ্ঞতার ঘাটতি'}`,
      type: 'warning',
      category: 'mentor',
      targetTab: 'mentor',
      actionLabel: 'পুনরায় আবেদন করুন',
      details: {
        badgeText: 'প্রত্যাখ্যাত (Rejected)',
        note: reason || 'প্রয়োজনীয় তথ্যাবলি হালনাগাদ করে পুনরায় আবেদন করুন।'
      }
    });
  };

  const markDirectMessageRead = (id: string) => {
    setDirectMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const markAllDirectMessagesRead = () => {
    setDirectMessages(prev => prev.map(m => ({ ...m, read: true })));
  };

  const sendDirectMessage = (msg: Omit<DirectMessageItem, 'id' | 'read'>) => {
    const newMsg: DirectMessageItem = {
      ...msg,
      id: `dmsg-${Date.now()}`,
      read: false
    };
    setDirectMessages(prev => [newMsg, ...prev]);
    playAppSound('message');
  };

  const openChatWindow = (contact: { id?: string; orderId?: string; senderName: string; senderRole?: string; senderAvatar?: string; initialMessage?: string }) => {
    const windowId = contact.id || `chat-${contact.senderName.replace(/\s+/g, '-').toLowerCase()}`;
    setActiveMessengerConversationId(windowId);
    
    setActiveChatWindows(prev => {
      const existing = prev.find(w => w.id === windowId || w.senderName === contact.senderName);
      if (existing) {
        return [...prev.filter(w => w.id !== existing.id), { ...existing, minimized: false, orderId: contact.orderId || existing.orderId }];
      }
      
      const newWin: ActiveChatWindow = {
        id: windowId,
        orderId: contact.orderId,
        senderName: contact.senderName,
        senderRole: contact.senderRole || 'customer',
        senderAvatar: contact.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        minimized: false,
        messages: contact.initialMessage ? [
          {
            id: `msg-${Date.now()}-1`,
            senderName: contact.senderName,
            senderAvatar: contact.senderAvatar,
            isSelf: false,
            text: contact.initialMessage,
            time: 'এখন'
          }
        ] : [
          {
            id: `msg-${Date.now()}-1`,
            senderName: contact.senderName,
            senderAvatar: contact.senderAvatar,
            isSelf: false,
            text: `হ্যালো! আমি ${contact.senderName}। কাজ বা প্রজেক্ট সম্পর্কিত যেকোনো তথ্যের জন্য ইনবক্সে মেসেজ করুন।`,
            time: '১০ মিনিট আগে'
          }
        ]
      };
      return [...prev, newWin];
    });

    // Floating mini chat popup window opens on screen directly over the current view
    // (User can view their orders and close popup with 'X' button)
  };

  const closeChatWindow = (id: string) => {
    setActiveChatWindows(prev => prev.filter(w => w.id !== id));
  };

  const openMessengerInbox = (conversationId?: string, initialTab: 'messages' | 'notifications' | 'courses' = 'messages', orderId?: string) => {
    setInitialMessengerTab(initialTab);
    if (conversationId) {
      setActiveMessengerConversationId(conversationId);
      setActiveMessengerOrderId(orderId || null);
      // If an orderId or active chat needs to be registered, sync it
      if (orderId) {
        setActiveChatWindows(prev => {
          const existing = prev.find(w => w.id === conversationId);
          if (existing) {
            return prev.map(w => w.id === conversationId ? { ...w, orderId, minimized: false } : w);
          }
          return prev;
        });
      }
    } else {
      setActiveMessengerConversationId(null);
      setActiveMessengerOrderId(null);
    }
    // Clear floating popup windows so full messenger is focused
    setActiveChatWindows([]);
    setIsNotificationCenterOpen(false);
    setIsMessengerInboxOpen(true);
  };

  const closeMessengerInbox = () => {
    setActiveMessengerConversationId(null);
    setActiveMessengerOrderId(null);
    setIsMessengerInboxOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const openNotificationCenter = () => {
    openMessengerInbox(undefined, 'notifications');
  };

  const closeNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
    setIsMessengerInboxOpen(false);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleMinimizeChatWindow = (id: string) => {
    setActiveChatWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w));
  };

  const sendChatMessage = (windowId: string, text: string, meetLink?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: currentUser?.name || 'আমি',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      isSelf: true,
      text,
      time: 'এখন',
      meetLink
    };

    // Find the target chat window to associate with order and decrement unread counter on reply
    const currentWindows = activeChatWindows;
    const targetWin = currentWindows.find(w => w.id === windowId);
    const targetOrderId = targetWin?.orderId;
    const targetSenderName = targetWin?.senderName;

    // Decrement unread message count for this order upon sending a reply
    setMarketplaceOrders(prev => prev.map(o => {
      const isMatched = (targetOrderId && o.id === targetOrderId) ||
        (targetSenderName && (o.buyerName === targetSenderName || o.sellerName === targetSenderName));
      if (isMatched) {
        const currentCount = o.unreadMessageCount ?? 0;
        return {
          ...o,
          unreadMessageCount: Math.max(0, currentCount - 1)
        };
      }
      return o;
    }));

    setActiveChatWindows(prev => prev.map(w => {
      if (w.id === windowId) {
        return {
          ...w,
          messages: [...w.messages, userMsg]
        };
      }
      return w;
    }));
    playAppSound('message');

    // Auto response for ongoing active messaging thread
    if (!meetLink) {
      setTimeout(() => {
        setActiveChatWindows(prev => prev.map(w => {
          if (w.id === windowId) {
            const autoReplies = [
              "ধন্যবাদ ভাইয়া! আপনার মেসেজটি পেয়েছি, কাজ দ্রুত এগিয়ে নিচ্ছি।",
              "জি অবশ্যই! আমি বিষয়টি ড্যাশবোর্ডে ফাইলসহ আপডেট করে দেবো।",
              "কোনো সংশোধনী থাকলে বলুন, আমরা এখনই গুগল মিটে লাইভ ডিসকাশন করতে পারি!"
            ];
            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
            const autoReply: ChatMessage = {
              id: `msg-reply-${Date.now()}`,
              senderName: w.senderName,
              senderAvatar: w.senderAvatar,
              isSelf: false,
              text: randomReply,
              time: 'এখন'
            };
            return {
              ...w,
              messages: [...w.messages, autoReply]
            };
          }
          return w;
        }));
        playAppSound('message');
      }, 1200);
    }
  };

  const createGoogleMeetCall = (windowId: string) => {
    const randomCode = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const meetUrl = `https://meet.google.com/${randomCode}`;
    sendChatMessage(windowId, `📹 সরাসরি গুগুল মিট (Google Meet) ভিডিও কনফারেন্স লিংক প্রস্তুত করা হয়েছে। ক্লিক করে যুক্ত হন!`, meetUrl);
  };

  const toggleUserBlock = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, blocked: !u.blocked } : u));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const requestTeacherPayout = (payoutData: Omit<TeacherPayout, 'id' | 'requestedAt' | 'status'>) => {
    const newPayout: TeacherPayout = {
      ...payoutData,
      id: `pay-${Date.now()}`,
      status: 'Pending',
      requestedAt: new Date().toLocaleString('bn-BD', { hour12: true })
    };
    setPayouts(prev => [newPayout, ...prev]);
  };

  const updatePayoutStatus = (payoutId: string, status: TeacherPayout['status'], txId?: string) => {
    setPayouts(prev => prev.map(p => {
      if (p.id === payoutId) {
        return {
          ...p,
          status,
          transactionId: txId || p.transactionId,
          processedAt: new Date().toLocaleString('bn-BD', { hour12: true })
        };
      }
      return p;
    }));
  };

  const sendTeacherNotice = (noticeData: Omit<TeacherNotice, 'id' | 'sentAt'>) => {
    const newNotice: TeacherNotice = {
      ...noticeData,
      id: `tnotice-${Date.now()}`,
      sentAt: new Date().toLocaleString('bn-BD', { hour12: true }),
      read: false
    };
    setTeacherNotices(prev => [newNotice, ...prev]);

    // Also add to global notifications for visibility
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📢 সাপোট নোটিশ: ${noticeData.subject}`,
        message: noticeData.message,
        time: "এখনই",
        read: false,
        type: "info"
      },
      ...prev
    ]);
  };

  // Profile Update Function
  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Assignment Functions
  const addAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsgn: Assignment = {
      ...assignmentData,
      id: `asgn-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAsgn, ...prev]);
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const submitAssignment = (subData: Omit<AssignmentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: AssignmentSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleString('bn-BD', { hour12: true }),
      status: 'submitted'
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  const gradeSubmission = (submissionId: string, points: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      points,
      feedback,
      status: 'graded'
    } : s));
  };

  // Customer Project Functions
  const createCustomerProject = (projData: Omit<CustomerProject, 'id' | 'createdAt' | 'status'>) => {
    const createdAtIso = new Date().toISOString();
    const newProj: CustomerProject = {
      ...projData,
      id: `proj-${Date.now()}`,
      status: 'Pending Review',
      createdAt: createdAtIso.split('T')[0]
    };
    setCustomerProjects(prev => [newProj, ...prev]);

    // Also automatically create a MarketplaceOrder for PTEN IT Agency Service
    const orderAmount = projData.priceEstimate || 5000;
    const agencyOrder: MarketplaceOrder = {
      id: `ord-ptenit-${Date.now()}`,
      type: 'custom_agency_order',
      title: projData.serviceTitle || 'PTEN IT এজেন্সির কাস্টম প্রজেক্ট',
      category: projData.category || 'PTEN IT Agency',
      buyerId: projData.customerId || currentUser?.id || `guest-${Date.now()}`,
      buyerName: projData.customerName || currentUser?.name || 'সম্মানিত ক্লায়েন্ট',
      buyerEmail: projData.customerEmail || currentUser?.email || 'client@ptenit.com',
      buyerPhone: projData.customerPhone || currentUser?.mobile || '01700000000',
      sellerId: 'pending_expert',
      sellerName: 'এক্সপার্ট রিসিভড অপেক্ষমান',
      sellerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      isInternalStaff: true,
      packageType: 'Custom',
      amount: orderAmount,
      adminCommission: Math.round(orderAmount * 0.1),
      sellerPayout: Math.round(orderAmount * 0.9),
      paymentMethod: 'PTEN IT Official Escrow',
      transactionId: `TRX-PTENIT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending_approval',
      isPublicOffer: true,
      reachCount: Math.floor(Math.random() * 40) + 20,
      likesCount: Math.floor(Math.random() * 10) + 2,
      budgetRange: projData.budgetRange || '৳১৫,০০০ - ৳৩০,০০০',
      deliveryNote: projData.description,
      createdAt: createdAtIso,
      deadlineDate: projData.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => [agencyOrder, ...prev]);
  };

  const updateCustomerProjectStatus = (id: string, status: CustomerProject['status'], priceEstimate?: number) => {
    setCustomerProjects(prev => prev.map(p => p.id === id ? {
      ...p,
      status,
      ...(priceEstimate !== undefined ? { priceEstimate } : {}),
      updatedAt: new Date().toISOString().split('T')[0]
    } : p));
  };

  // Marketplace & Agency Dispatch Functions
  const createGig = (newGig: Omit<MarketplaceGig, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'salesCount'>) => {
    const isAgencyAdmin = newGig.sellerId === 'ptenit-official' || newGig.sellerId === 'ptenit-agency' || newGig.isAgencyStaff;
    
    // Enforce maximum 6 gigs limit per regular seller (not agency admin)
    if (!isAgencyAdmin) {
      const userGigCount = gigs.filter(g =>
        (newGig.sellerId && g.sellerId === newGig.sellerId) ||
        (newGig.sellerName && g.sellerName.toLowerCase() === newGig.sellerName.toLowerCase())
      ).length;

      if (userGigCount >= 6) {
        console.warn("Gig limit reached: A seller cannot create more than 6 gigs.");
        return;
      }
    }

    const defaultFeatures = ['কাস্টম ডিজাইন ও ডেভেলপমেন্ট', 'রেসপন্সিভ লেআউট', 'ফুল টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি'];

    const packages = newGig.packages || {
      basic: {
        name: 'বেসিক প্যাকেজ',
        price: 5000,
        deliveryDays: 3,
        revisions: '3',
        features: defaultFeatures.slice(0, 2)
      },
      standard: {
        name: 'স্ট্যান্ডার্ড প্যাকেজ',
        price: 12000,
        deliveryDays: 5,
        revisions: '5',
        features: defaultFeatures.slice(0, 3)
      },
      premium: {
        name: 'প্রিমিয়াম প্যাকেজ',
        price: 25000,
        deliveryDays: 7,
        revisions: 'Unlimited',
        features: defaultFeatures
      }
    };

    const created: MarketplaceGig = {
      ...newGig,
      packages,
      id: `gig-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGigs(prev => [created, ...prev]);
  };

  const updateGig = (id: string, updated: Partial<MarketplaceGig>) => {
    setGigs(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const deleteGig = (id: string) => {
    setGigs(prev => prev.filter(g => g.id !== id));
  };

  const createJob = (newJob: Omit<MarketplaceJob, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => {
    const created: MarketplaceJob = {
      ...newJob,
      id: `job-${Date.now()}`,
      proposalsCount: 0,
      status: newJob.assignedStaffId ? 'assigned' : 'open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [created, ...prev]);

    // If custom assigned or internal staff only, also create an agency order
    if (newJob.assignedStaffId) {
      const order: MarketplaceOrder = {
        id: `ord-mkt-${Date.now()}`,
        type: 'custom_agency_order',
        jobId: created.id,
        title: newJob.title,
        category: newJob.category,
        buyerId: newJob.buyerId,
        buyerName: newJob.buyerName,
        buyerEmail: newJob.buyerEmail,
        buyerPhone: newJob.buyerPhone,
        sellerId: newJob.assignedStaffId,
        sellerName: newJob.assignedStaffName || 'PTENit Staff',
        isInternalStaff: true,
        packageType: 'Custom',
        amount: newJob.budget,
        adminCommission: Math.round(newJob.budget * 0.1),
        sellerPayout: Math.round(newJob.budget * 0.9),
        status: 'in_progress',
        createdAt: new Date().toISOString().split('T')[0],
        deadlineDate: new Date(Date.now() + (newJob.deadlineDays || 7) * 86400000).toISOString().split('T')[0]
      };
      setMarketplaceOrders(prev => [order, ...prev]);
    }
  };

  const updateJobStatus = (id: string, status: MarketplaceJob['status'], assignedStaffId?: string, assignedStaffName?: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === id) {
        return {
          ...j,
          status,
          ...(assignedStaffId ? { assignedStaffId, assignedStaffName } : {})
        };
      }
      return j;
    }));
  };

  const submitProposal = (newProp: Omit<MarketplaceProposal, 'id' | 'createdAt' | 'status'>) => {
    const created: MarketplaceProposal = {
      ...newProp,
      id: `prop-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProposals(prev => [created, ...prev]);
    setJobs(prev => prev.map(j => j.id === newProp.jobId ? { ...j, proposalsCount: (j.proposalsCount || 0) + 1 } : j));
  };

  const acceptProposalAndCreateOrder = (jobId: string, proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    const job = jobs.find(j => j.id === jobId);
    if (!prop || !job) return;

    setProposals(prev => prev.map(p => p.jobId === jobId ? { ...p, status: p.id === proposalId ? 'accepted' : 'rejected' } : p));
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'in_progress', assignedStaffId: prop.freelancerId, assignedStaffName: prop.freelancerName } : j));

    const order: MarketplaceOrder = {
      id: `ord-mkt-${Date.now()}`,
      type: 'job_order',
      jobId: job.id,
      title: job.title,
      category: job.category,
      buyerId: job.buyerId,
      buyerName: job.buyerName,
      buyerEmail: job.buyerEmail,
      buyerPhone: job.buyerPhone,
      sellerId: prop.freelancerId,
      sellerName: prop.freelancerName,
      sellerAvatar: prop.freelancerAvatar,
      isInternalStaff: prop.isAgencyStaff,
      packageType: 'Custom',
      amount: prop.bidAmount,
      adminCommission: Math.round(prop.bidAmount * 0.1),
      sellerPayout: Math.round(prop.bidAmount * 0.9),
      paymentMethod: 'Escrow (bKash/Nagad)',
      transactionId: `TRX-MKT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'in_progress',
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + prop.deliveryDays * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => [order, ...prev]);
  };

  const createDirectGigOrder = (
    gigId: string,
    packageType: 'basic' | 'standard' | 'premium',
    customNote?: string,
    buyerDetails?: { name?: string; email?: string; phone?: string; paymentMethod?: string; transactionId?: string }
  ) => {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return null;

    const pkg = gig.packages[packageType] || gig.packages.standard || gig.packages.basic;
    const buyerName = buyerDetails?.name || currentUser?.name || 'সম্মানিত ক্লায়েন্ট';
    const buyerEmail = buyerDetails?.email || currentUser?.email || 'client@ptenit.com';
    const buyerPhone = buyerDetails?.phone || currentUser?.mobile || currentUser?.phone || '01700000000';
    const buyerId = currentUser?.id || `guest-${Date.now()}`;

    const order: MarketplaceOrder = {
      id: `ord-mkt-${Date.now()}`,
      type: 'gig_order',
      gigId: gig.id,
      title: gig.title,
      category: gig.category,
      buyerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      sellerId: gig.sellerId,
      sellerName: gig.sellerName,
      sellerAvatar: gig.sellerAvatar,
      isInternalStaff: gig.isAgencyStaff,
      packageType: packageType === 'basic' ? 'Basic' : packageType === 'standard' ? 'Standard' : 'Premium',
      amount: pkg.price,
      adminCommission: Math.round(pkg.price * 0.1),
      sellerPayout: Math.round(pkg.price * 0.9),
      paymentMethod: buyerDetails?.paymentMethod || 'Escrow (bKash/Nagad)',
      transactionId: buyerDetails?.transactionId || `TRX-GIG-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      deliveryNote: customNote,
      createdAt: new Date().toISOString(),
      deadlineDate: new Date(Date.now() + pkg.deliveryDays * 86400000).toISOString().split('T')[0]
    };
    setMarketplaceOrders(prev => [order, ...prev]);
    setGigs(prev => prev.map(g => g.id === gigId ? { ...g, salesCount: (g.salesCount || 0) + 1 } : g));

    // Send notifications & direct messages targeted to Marketplace
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}-seller`,
        title: '🛒 নতুন মার্কেটপ্লেস গিগ অর্ডার!',
        message: `আপনার "${gig.title}" গিগটির একটি নতুন অর্ডার (৳${pkg.price}) প্লেস হয়েছে। (অর্ডার আইডি: #${order.id})`,
        time: 'এখনই',
        read: false,
        type: 'success',
        targetTab: 'marketplace',
        targetId: order.id
      },
      {
        id: `notif-${Date.now()}-buyer`,
        title: '🎉 অর্ডার নিশ্চিত করা হয়েছে!',
        message: `${gig.sellerName}-এর "${gig.title}" গিগে আপনার অর্ডার #${order.id} প্লেস হয়েছে। সেলারের সাথে চ্যাট করুন।`,
        time: 'এখনই',
        read: false,
        type: 'info',
        targetTab: 'marketplace',
        targetId: order.id
      },
      ...prev
    ]);

    setDirectMessages(prev => [
      {
        id: `dmsg-${Date.now()}`,
        senderName: `${buyerName} (বায়ার)`,
        senderRole: 'customer',
        senderAvatar: currentUser?.avatar,
        recipientRole: 'instructor',
        text: `সালাম! আমি "${gig.title}" এর ${pkg.name || packageType} প্যাকেজটি (৳${pkg.price}) প্লেস করেছি। (অর্ডার আইডি: #${order.id})।`,
        time: 'এখনই',
        read: false,
        orderId: order.id,
        targetTab: 'marketplace'
      },
      ...prev
    ]);

    return order;
  };

  const deliverMarketplaceOrder = (orderId: string, note: string, fileUrl?: string, fileName?: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'in_review',
          deliveryNote: note,
          deliveryFileUrl: fileUrl,
          deliveryFileName: fileName,
          deliveredAt: new Date().toISOString().split('T')[0]
        };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '📦 অর্ডার ডেলিভারি সম্পন্ন হয়েছে!',
        message: `অর্ডার ID #${orderId} সফলভাবে ডেলিভারি করা হয়েছে। রিভিউ চেক করুন।`,
        time: 'এখনই',
        read: false,
        type: 'info',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const requestOrderRevision = (orderId: string, note: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'revision_requested', revisionNote: note };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🔄 রিভিশন রিকোয়েস্ট জমা পড়েছে',
        message: `অর্ডার ID #${orderId} এর রিভিশন রিকোয়েস্ট এসেছে: "${note}"`,
        time: 'এখনই',
        read: false,
        type: 'warning',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const approveOrderAndReleaseEscrow = (orderId: string, rating = 5, reviewComment?: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const bonus = o.sellerReviewBonus || 0;
        const currentPayout = o.sellerPayout || Math.round((o.amount || 0) * 0.9);
        const finalPayout = currentPayout + bonus;
        return {
          ...o,
          status: 'completed',
          rating,
          reviewComment,
          sellerPayout: finalPayout
        };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '🎉 প্রজেক্ট কমপ্লিট & এস্ক্রো পেমেন্ট রিলিজ!',
        message: `অর্ডার ID #${orderId} সফলভাবে সম্পন্ন হয়েছে এবং ফান্ড রিলিজ করা হয়েছে। (রেটিং: ${rating}★)`,
        time: 'এখনই',
        read: false,
        type: 'success',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const cancelMarketplaceOrder = (orderId: string, reason?: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'cancelled', revisionNote: reason };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: '❌ প্রজেক্ট অর্ডার বাতিল করা হয়েছে',
        message: `অর্ডার ID #${orderId} বাতিল করা হয়েছে। কারণ: ${reason || 'পারস্পরিক সম্মতি'}`,
        time: 'এখনই',
        read: false,
        type: 'warning',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const updateMarketplaceOrderStatus = (orderId: string, status: MarketplaceOrder['status'], updateNote?: string) => {
    setMarketplaceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newUpdates = updateNote ? [
          ...(o.updates || []),
          { id: `upd-${Date.now()}`, date: new Date().toLocaleString('bn-BD', { hour12: true }), note: updateNote, sender: currentUser?.name || 'Seller' }
        ] : (o.updates || []);
        return {
          ...o,
          status,
          updates: newUpdates
        };
      }
      return o;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `📦 অর্ডার স্ট্যাটাস আপডেট: ${status === 'in_progress' ? 'কাজ শুরু করা হয়েছে' : status}`,
        message: `অর্ডার ID #${orderId} এর স্ট্যাটাস আপডেট করা হয়েছে। ${updateNote ? `নোট: ${updateNote}` : ''}`,
        time: 'এখনই',
        read: false,
        type: 'info',
        targetTab: 'marketplace',
        targetId: orderId
      },
      ...prev
    ]);
  };

  const addMarketplaceOrder = (order: MarketplaceOrder) => {
    setMarketplaceOrders(prev => [order, ...prev]);
  };

  const dispatchJobToStaff = (jobId: string, staffId: string, staffName: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, status: 'assigned', visibility: 'custom_assigned', assignedStaffId: staffId, assignedStaffName: staffName };
      }
      return j;
    }));

    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const order: MarketplaceOrder = {
        id: `ord-mkt-${Date.now()}`,
        type: 'custom_agency_order',
        jobId: job.id,
        title: job.title,
        category: job.category,
        buyerId: job.buyerId,
        buyerName: job.buyerName,
        buyerEmail: job.buyerEmail,
        buyerPhone: job.buyerPhone,
        sellerId: staffId,
        sellerName: staffName,
        isInternalStaff: true,
        packageType: 'Custom',
        amount: job.budget,
        adminCommission: Math.round(job.budget * 0.1),
        sellerPayout: Math.round(job.budget * 0.9),
        status: 'in_progress',
        createdAt: new Date().toISOString().split('T')[0],
        deadlineDate: new Date(Date.now() + (job.deadlineDays || 7) * 86400000).toISOString().split('T')[0]
      };
      setMarketplaceOrders(prev => [order, ...prev]);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const deleteMarketplaceOrder = (id: string) => {
    setMarketplaceOrders(prev => prev.filter(o => o.id !== id));
  };

  const updateMarketplaceOrder = (id: string, updates: Partial<MarketplaceOrder>) => {
    setMarketplaceOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const addDigitalProduct = (product: Omit<DigitalProduct, 'id' | 'createdAt' | 'salesCount'>) => {
    const newProd: DigitalProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDigitalProducts(prev => [newProd, ...prev]);
  };

  const updateDigitalProduct = (id: string, updatedFields: Partial<DigitalProduct>) => {
    setDigitalProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteDigitalProduct = (id: string) => {
    setDigitalProducts(prev => prev.filter(p => p.id !== id));
  };

  const deleteTeacherPayout = (id: string) => {
    setPayouts(prev => prev.filter(p => p.id !== id));
  };

  const deleteTeacherNotice = (id: string) => {
    setTeacherNotices(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        lang,
        setLang,
        t,
        darkMode,
        toggleDarkMode,
        currentUser,
        ptenitUser,
        marketplaceUser,
        setPtenitUser,
        setMarketplaceUser,
        loginMarketplace,
        signupMarketplace,
        logoutMarketplace,
        demoLoginMarketplace,
        updateMarketplaceProfile,
        users,
        courses,
        services,
        gallery,
        testimonials,
        enrollments,
        certificates,
        offers,
        siteSettings,
        orders,
        contactMessages,
        notifications,
        directMessages,
        activeChatWindows,
        activeMessengerConversationId,
        setActiveMessengerConversationId,
        activeMessengerOrderId,
        setActiveMessengerOrderId,
        isMessengerInboxOpen,
        setIsMessengerInboxOpen,
        initialMessengerTab,
        openMessengerInbox,
        closeMessengerInbox,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        openNotificationCenter,
        closeNotificationCenter,
        clearAllNotifications,
        deleteNotification,
        assignments,
        submissions,
        customerProjects,
        payouts,
        teacherNotices,
        gigs,
        jobs,
        proposals,
        marketplaceOrders,
        digitalProducts,
        addDigitalProduct,
        updateDigitalProduct,
        deleteDigitalProduct,
        createGig,
        updateGig,
        deleteGig,
        createJob,
        updateJobStatus,
        submitProposal,
        acceptProposalAndCreateOrder,
        createDirectGigOrder,
        deliverMarketplaceOrder,
        requestOrderRevision,
        approveOrderAndReleaseEscrow,
        cancelMarketplaceOrder,
        updateMarketplaceOrderStatus,
        addMarketplaceOrder,
        dispatchJobToStaff,
        login,
        signup,
        logout,
        demoLogin,
        switchRole,
        updateProfile,
        addUser,
        deleteUser,
        deleteOrder,
        deleteJob,
        deleteMarketplaceOrder,
        updateMarketplaceOrder,
        deleteTeacherPayout,
        deleteTeacherNotice,
        requestTeacherPayout,
        updatePayoutStatus,
        sendTeacherNotice,
        addAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        createCustomerProject,
        updateCustomerProjectStatus,
        addCourse,
        updateCourse,
        deleteCourse,
        acceptCourseOffer,
        declineCourseOffer,
        enrollCourse,
        updateLessonProgress,
        addService,
        updateService,
        deleteService,
        addGalleryItem,
        deleteGalleryItem,
        addTestimonial,
        deleteTestimonial,
        updateOffers,
        updateSiteSettings,
        issueCertificate,
        getCertificateByCode,
        updateOrderStatus,
        sendContactMessage,
        markMessageRead,
        markNotificationRead,
        markAllNotificationsRead,
        sendCentralNotification,
        applyForMentorship,
        approveMentorApplication,
        rejectMentorApplication,
        markDirectMessageRead,
        markAllDirectMessagesRead,
        sendDirectMessage,
        openChatWindow,
        closeChatWindow,
        toggleMinimizeChatWindow,
        sendChatMessage,
        createGoogleMeetCall,
        toggleUserBlock,
        playAppSound
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
