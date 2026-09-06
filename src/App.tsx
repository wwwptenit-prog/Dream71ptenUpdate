import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { GlitterParticles } from './components/GlitterParticles';
import { StatsCounter } from './components/StatsCounter';
import { PromotionalOfferBanner } from './components/PromotionalOfferBanner';
import { ServicesSection } from './components/ServicesSection';
import { DigitalProductsSection } from './components/DigitalProductsSection';
import { CourseCard } from './components/CourseCard';
import { CoursesSection } from './components/CoursesSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { OfficeLocation } from './components/OfficeLocation';
import { Course } from './types';

// Performance optimization: Lazy load heavy sub-systems and dashboards on-demand
const CourseDetailModal = React.lazy(() => import('./components/CourseDetailModal').then(m => ({ default: m.CourseDetailModal })));
const StudentDashboard = React.lazy(() => import('./components/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const CourseLearningPage = React.lazy(() => import('./components/CourseLearningPage').then(m => ({ default: m.CourseLearningPage })));
const CertificateModal = React.lazy(() => import('./components/CertificateModal').then(m => ({ default: m.CertificateModal })));
const CertificateVerifyPage = React.lazy(() => import('./components/CertificateVerifyPage').then(m => ({ default: m.CertificateVerifyPage })));
const AuthModal = React.lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(m => ({ default: m.AdminPanel })));
const TeacherDashboard = React.lazy(() => import('./components/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const CustomerDashboard = React.lazy(() => import('./components/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const MarketplaceSection = React.lazy(() => import('./components/MarketplaceSection').then(m => ({ default: m.MarketplaceSection })));
const FloatingMessengerWindows = React.lazy(() => import('./components/FloatingMessengerWindows').then(m => ({ default: m.FloatingMessengerWindows })));
const NotificationCenterModal = React.lazy(() => import('./components/NotificationCenterModal').then(m => ({ default: m.NotificationCenterModal })));

const LazyFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-9 h-9 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    <span className="mt-3 text-xs text-slate-400 font-medium tracking-wide">লোড হচ্ছে...</span>
  </div>
);

const MainAppContent: React.FC = () => {
  const { currentUser, courses, siteSettings, closeMessengerInbox, marketplaceMode } = useData();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>('All');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [learningCourseId, setLearningCourseId] = useState<string | null>(null);
  const [activeCertificateCode, setActiveCertificateCode] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [heroZoneMouseCoords, setHeroZoneMouseCoords] = useState<{ x: number; y: number } | null>(null);

  const handleHeroZoneMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHeroZoneMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleHeroZoneTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHeroZoneMouseCoords({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
    }
  };

  const handleHeroZoneMouseLeave = () => {
    setHeroZoneMouseCoords(null);
  };

  // Robust Multi-level Navigation History Stack
  interface NavHistoryItem {
    tab: string;
    category?: string;
    courseId?: string | null;
  }
  const [navHistory, setNavHistory] = useState<NavHistoryItem[]>([]);
  const [previousNavState, setPreviousNavState] = useState<NavHistoryItem | null>(null);
  const [learningInitialTab, setLearningInitialTab] = useState<'video' | 'live' | 'assignment' | 'quiz' | 'resources' | 'certificate' | 'notes' | 'ai-tutor'>('video');

  const handleSetActiveTab = (tab: string, category?: string, pushHistory = true) => {
    if (closeMessengerInbox) {
      closeMessengerInbox();
    }

    if (tab === activeTab && (!category || category === marketplaceCategory)) {
      return;
    }

    if (pushHistory) {
      setNavHistory(prev => [
        ...prev.slice(-20), // keep last 20 history steps
        { tab: activeTab, category: marketplaceCategory, courseId: learningCourseId }
      ]);
      try {
        window.history.pushState({ tab, category: category || 'All' }, '');
      } catch (e) {
        // ignore history errors
      }
    }

    if (category) {
      setMarketplaceCategory(category);
    } else if (tab === 'student-dashboard') {
      setMarketplaceCategory('my-courses');
    } else if (tab === 'teacher-dashboard') {
      setMarketplaceCategory('selling');
    } else if (tab === 'customer-dashboard') {
      setMarketplaceCategory('buying');
    } else if (tab === 'marketplace') {
      setMarketplaceCategory(marketplaceMode === 'selling' ? 'selling' : 'All');
    }
    setActiveTab(tab);
  };

  const handleStartLearning = (
    courseId: string,
    tabMode: 'video' | 'live' | 'assignment' | 'quiz' | 'resources' | 'certificate' | 'notes' | 'ai-tutor' = 'video',
    originCategoryOverride?: string
  ) => {
    // Record origin navigation state. By default learning initiates from Student Hub / My Courses
    const originTab = activeTab !== 'learning' ? activeTab : (currentUser ? 'student-dashboard' : 'marketplace');
    const originCategory = originCategoryOverride || (originTab === 'courses' ? 'courses' : (marketplaceCategory || 'my-courses'));

    setPreviousNavState({
      tab: originTab,
      category: originCategory
    });
    setNavHistory(prev => [
      ...prev.slice(-20),
      { tab: originTab, category: originCategory }
    ]);
    try {
      window.history.pushState({ tab: 'learning', courseId }, '');
    } catch (e) {}
    setLearningInitialTab(tabMode);
    setLearningCourseId(courseId);
    setActiveTab('learning');
  };

  // Comprehensive Universal Back Button Handler
  const handleGoBack = () => {
    // 1. Close Certificate Modal if open
    if (activeCertificateCode) {
      setActiveCertificateCode(null);
      return;
    }

    // 2. Close Course Detail Modal if open
    if (selectedCourseId) {
      setSelectedCourseId(null);
      return;
    }

    // 3. If in Classroom / Learning mode, return directly to Student Hub / My Courses where (নতুন কোর্স ব্রাউজ →) is located
    if (activeTab === 'learning' || learningCourseId) {
      setLearningCourseId(null);
      const targetTab = (previousNavState && previousNavState.tab !== 'learning' && previousNavState.tab)
        ? previousNavState.tab
        : (currentUser ? 'student-dashboard' : 'marketplace');
      
      const targetCategory = (previousNavState && previousNavState.category)
        ? previousNavState.category
        : (targetTab === 'courses' ? 'courses' : 'my-courses');

      setMarketplaceCategory(targetCategory);
      setActiveTab(targetTab);
      setPreviousNavState(null);
      return;
    }

    // 4. Pop from Navigation History Stack
    if (navHistory.length > 0) {
      let prevEntry: { tab: string; category?: string } | null = null;
      let newHistory = [...navHistory];
      while (newHistory.length > 0) {
        const candidate = newHistory.pop()!;
        if (candidate.tab !== activeTab || (candidate.category && candidate.category !== marketplaceCategory)) {
          prevEntry = candidate;
          break;
        }
      }
      setNavHistory(newHistory);
      if (prevEntry) {
        if (prevEntry.category) {
          setMarketplaceCategory(prevEntry.category);
        }
        setActiveTab(prevEntry.tab);
        return;
      }
    }

    // 5. Default fallback to home or student-dashboard
    if (activeTab !== 'home') {
      setActiveTab(currentUser ? 'student-dashboard' : 'home');
    }
  };

  // Listen to browser / device back button
  useEffect(() => {
    const handlePopState = () => {
      handleGoBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navHistory, activeTab, learningCourseId, selectedCourseId, activeCertificateCode, previousNavState]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Dynamic SEO & Meta Tags Manager Effect
  useEffect(() => {
    if (!siteSettings) return;

    if (siteSettings.seoTitle) {
      document.title = siteSettings.seoTitle;
    }

    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLinkTag = (rel: string, href: string) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', siteSettings.metaDescription || '');
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', siteSettings.metaKeywords || '');
    setMetaTag('meta[name="google-site-verification"]', 'name', 'google-site-verification', siteSettings.googleSiteVerification || '');

    setMetaTag('meta[property="og:title"]', 'property', 'og:title', siteSettings.ogTitle || siteSettings.seoTitle || '');
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', siteSettings.ogDescription || siteSettings.metaDescription || '');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', siteSettings.ogImageUrl || '');
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', siteSettings.ogType || 'website');

    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', siteSettings.twitterCard || 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', siteSettings.ogTitle || siteSettings.seoTitle || '');
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', siteSettings.ogDescription || siteSettings.metaDescription || '');
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', siteSettings.ogImageUrl || '');
    if (siteSettings.twitterHandle) {
      setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', siteSettings.twitterHandle);
    }

    if (siteSettings.canonicalUrl) {
      setLinkTag('canonical', siteSettings.canonicalUrl);
    }

    if (siteSettings.structuredDataJson) {
      try {
        let script = document.querySelector('#seo-structured-data') as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script');
          script.id = 'seo-structured-data';
          script.type = 'application/ld+json';
          document.head.appendChild(script);
        }
        script.textContent = siteSettings.structuredDataJson;
      } catch (e) {
        console.error('Invalid structured data JSON', e);
      }
    }
  }, [siteSettings]);

  // Quick enroll trigger
  const handleQuickEnroll = (course: Course) => {
    setSelectedCourseId(course.id);
  };

  // If in learning classroom mode, render full-screen LMS
  if (activeTab === 'learning' && learningCourseId) {
    return (
      <React.Suspense fallback={<LazyFallback />}>
        <CourseLearningPage
          courseId={learningCourseId}
          initialTab={learningInitialTab}
          onBack={handleGoBack}
          onViewCertificate={(code) => setActiveCertificateCode(code)}
        />
      </React.Suspense>
    );
  }

  const isDashboardView = ['admin', 'teacher-dashboard', 'student-dashboard', 'customer-dashboard', 'learning', 'dashboard', 'marketplace'].includes(activeTab);

  return (
    <div
      style={siteSettings?.customScalePercent && siteSettings.customScalePercent !== 100 ? { zoom: `${siteSettings.customScalePercent}%` } : undefined}
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-white dark:text-slate-100 flex flex-col font-sans selection:bg-[#1DB954] selection:text-white max-w-full overflow-x-hidden"
    >
      
      {/* Top Main Navbar (Only shown on public website pages) */}
      {!isDashboardView && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          openAuthModal={() => setAuthModalOpen(true)}
          openCourseDetail={(courseId) => setSelectedCourseId(courseId)}
        />
      )}

      {/* Page Routing Views */}
      <main className="flex-1 max-w-full overflow-x-hidden">
        <React.Suspense fallback={<LazyFallback />}>
          {/* VIEW 1: HOME PAGE */}
          {activeTab === 'home' && (
            <>
              {/* Combined Hero & Eid Mega Offer Zone with unified glittering starfield ("সেইম হিরো শেকশন এবং (ঈদ মেগা অফার!) পযন্ত কনটাইনিয়ারে স্টার গুলা বিসন্ত থাকবে, বাট কালার স্ব স্ব থাকবে") */}
              <div
                onMouseMove={handleHeroZoneMouseMove}
                onTouchMove={handleHeroZoneTouchMove}
                onMouseLeave={handleHeroZoneMouseLeave}
                className="relative w-full overflow-hidden"
              >
                {/* 1. Hero Section (signature deep navy background) */}
                <Hero setActiveTab={handleSetActiveTab} mouseCoords={heroZoneMouseCoords} />

                {/* 2. Eid Mega Offer Banner (emerald-to-teal gradient background) */}
                <PromotionalOfferBanner setActiveTab={handleSetActiveTab} />

                {/* 3. Continuous Glittering Starfield spanning seamlessly across Hero down through Eid Mega Offer Banner */}
                <GlitterParticles mouseCoords={heroZoneMouseCoords} />
              </div>

              <StatsCounter />
              <ServicesSection setActiveTab={handleSetActiveTab} isStandalonePage={false} />
              <CoursesSection
                onOpenDetail={(id) => setSelectedCourseId(id)}
                onQuickEnroll={handleQuickEnroll}
                onStartLearning={handleStartLearning}
                setActiveTab={handleSetActiveTab}
                isStandalonePage={false}
              />
              <GallerySection />
              <OfficeLocation />
            </>
          )}

          {/* VIEW 2: COURSES PAGE */}
          {activeTab === 'courses' && (
            <CoursesSection
              onOpenDetail={(id) => setSelectedCourseId(id)}
              onQuickEnroll={handleQuickEnroll}
              onStartLearning={handleStartLearning}
              setActiveTab={handleSetActiveTab}
              onBack={handleGoBack}
              isStandalonePage={true}
            />
          )}

          {/* VIEW 3: SERVICES PAGE */}
          {activeTab === 'services' && (
            <ServicesSection
              setActiveTab={handleSetActiveTab}
              openAuthModal={() => setAuthModalOpen(true)}
              isStandalonePage={true}
              onBack={handleGoBack}
            />
          )}

          {/* VIEW 3.2: DIGITAL PRODUCTS STANDALONE PAGE */}
          {activeTab === 'digital-products' && (
            <DigitalProductsSection
              setActiveTab={handleSetActiveTab}
              isStandalonePage={true}
              onBack={handleGoBack}
            />
          )}

          {/* VIEW 3.5: MARKETPLACE PAGE */}
          {activeTab === 'marketplace' && (
            <MarketplaceSection
              setActiveTab={handleSetActiveTab}
              activeTab={activeTab}
              openAuthModal={() => setAuthModalOpen(true)}
              initialCategory={marketplaceCategory}
              onStartLearning={handleStartLearning}
              onOpenDetail={(id) => setSelectedCourseId(id)}
            />
          )}

          {/* VIEW 4: ABOUT PAGE */}
          {activeTab === 'about' && (
            <AboutSection onBack={handleGoBack} />
          )}

          {/* VIEW 5: GALLERY PAGE */}
          {activeTab === 'gallery' && (
            <GallerySection onBack={handleGoBack} />
          )}

          {/* VIEW 6: CERTIFICATE VERIFICATION PORTAL */}
          {(activeTab === 'verify' || activeTab === 'verify-cert') && (
            <CertificateVerifyPage onBack={handleGoBack} />
          )}

          {/* VIEW 7: ROLE-SPECIFIC DASHBOARDS */}
          {activeTab === 'teacher-dashboard' && (
            <MarketplaceSection
              setActiveTab={handleSetActiveTab}
              activeTab={activeTab}
              openAuthModal={() => setAuthModalOpen(true)}
              initialCategory={marketplaceCategory || "selling"}
              onStartLearning={handleStartLearning}
            />
          )}

          {activeTab === 'customer-dashboard' && (
            <MarketplaceSection
              setActiveTab={handleSetActiveTab}
              activeTab={activeTab}
              openAuthModal={() => setAuthModalOpen(true)}
              initialCategory={marketplaceCategory || "buying"}
              onStartLearning={handleStartLearning}
            />
          )}

          {activeTab === 'student-dashboard' && (
            <MarketplaceSection
              setActiveTab={handleSetActiveTab}
              activeTab={activeTab}
              openAuthModal={() => setAuthModalOpen(true)}
              initialCategory={marketplaceCategory || "my-courses"}
              onStartLearning={handleStartLearning}
            />
          )}

          {activeTab === 'dashboard' && (
            <>
              {currentUser?.role === 'admin' ? (
                <AdminPanel setActiveTab={handleSetActiveTab} />
              ) : currentUser?.role === 'instructor' ? (
                <MarketplaceSection
                  setActiveTab={handleSetActiveTab}
                  activeTab={activeTab}
                  openAuthModal={() => setAuthModalOpen(true)}
                  initialCategory={marketplaceCategory || "selling"}
                  onStartLearning={handleStartLearning}
                />
              ) : (
                <MarketplaceSection
                  setActiveTab={handleSetActiveTab}
                  activeTab={activeTab}
                  openAuthModal={() => setAuthModalOpen(true)}
                  initialCategory={marketplaceCategory || "my-courses"}
                  onStartLearning={handleStartLearning}
                />
              )}
            </>
          )}

          {/* VIEW 8: ADMIN CONTROL PANEL */}
          {activeTab === 'admin' && (
            <AdminPanel setActiveTab={handleSetActiveTab} />
          )}

          {/* VIEW 9: CONTACT PAGE */}
          {activeTab === 'contact' && (
            <OfficeLocation />
          )}
        </React.Suspense>
      </main>

      {/* Main Footer (Only on public website pages) */}
      {!isDashboardView && (
        <Footer setActiveTab={handleSetActiveTab} />
      )}

      {/* Modals Container */}
      <React.Suspense fallback={null}>
        {selectedCourseId && (
          <CourseDetailModal
            courseId={selectedCourseId}
            onClose={() => setSelectedCourseId(null)}
            openAuthModal={() => setAuthModalOpen(true)}
            onStartLearning={handleStartLearning}
          />
        )}

        {activeCertificateCode && (
          <CertificateModal
            certificateCode={activeCertificateCode}
            onClose={() => setActiveCertificateCode(null)}
          />
        )}

        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={() => {
              handleSetActiveTab('home');
            }}
          />
        )}

        {/* Facebook-style Messenger Floating Chat Windows */}
        <FloatingMessengerWindows onNavigateTab={handleSetActiveTab} />

        {/* Central Mobile & Desktop Notification Center Modal */}
        <NotificationCenterModal onNavigateTab={handleSetActiveTab} />
      </React.Suspense>

    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainAppContent />
    </DataProvider>
  );
}
