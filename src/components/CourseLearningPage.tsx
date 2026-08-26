import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Upload,
  HelpCircle,
  Award,
  Sparkles,
  BookOpen,
  Video,
  ExternalLink,
  Code,
  Clock,
  Play,
  Share2,
  Check,
  MessageSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Lesson, CourseModule } from '../types';

interface CourseLearningPageProps {
  courseId: string;
  onBack: () => void;
  onViewCertificate: (code: string) => void;
  initialTab?: 'video' | 'live' | 'assignment' | 'quiz' | 'resources' | 'certificate' | 'notes' | 'ai-tutor';
}

export const CourseLearningPage: React.FC<CourseLearningPageProps> = ({
  courseId,
  onBack,
  onViewCertificate,
  initialTab = 'video'
}) => {
  const { courses, enrollments, currentUser, updateLessonProgress } = useData();

  const course = courses.find(c => c.id === courseId) || {
    id: courseId,
    title: 'প্রফেশনাল ফুল স্ট্যাক ওয়েব ডেভেলপমেন্ট মাস্টারক্লাস',
    instructor: 'প্রকৌশলী আল-আমিন',
    category: 'ওয়েব ডেভেলপমেন্ট',
    duration: '৮ সপ্তাহ (২৪ ঘন্টা)',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    modules: []
  };

  const enrollment = currentUser
    ? enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId)
    : null;

  // Robust default modules with realistic curriculum
  const defaultModules: CourseModule[] = [
    {
      id: 'mod-1',
      courseId: course.id,
      title: 'মডিউল ১: ফ্রন্টএন্ড আর্কিটেকচার ও React Core',
      order: 1,
      lessons: [
        {
          id: 'les-1',
          courseId: course.id,
          moduleId: 'mod-1',
          title: 'লেসন ১: React Components, State ও Lifecycle পরিচিতি',
          duration: '২৫ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          pdfResourceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          content: 'রিঅ্যাক্ট ফ্রেমওয়ার্কের কোর মেকানিজম, স্টেট ও প্রপস ড্রিলিং সমাধান এবং কম্পোনেন্ট লাইফসাইকেল নিয়ে বিস্তারিত আলোচনা।',
          isFreePreview: true,
          order: 1
        },
        {
          id: 'les-2',
          courseId: course.id,
          moduleId: 'mod-1',
          title: 'লেসন ২: Tailwind CSS ও আধুনিক রেসপনসিভ লেআউট',
          duration: '৩২ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'টেইলউইন্ড সিএসএস দিয়ে আধুনিক রেসপনসিভ গ্রিড, ফ্লেক্সবক্স ও ডার্ক মোড ইন্টারফেস তৈরি।',
          isFreePreview: false,
          order: 2
        },
        {
          id: 'les-3',
          courseId: course.id,
          moduleId: 'mod-1',
          title: 'লেসন ৩: Redux Toolkit দিয়ে গ্লোবাল স্টেট ম্যানেজমেন্ট',
          duration: '৪০ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'গ্লোবাল স্টেট ম্যানেজমেন্টে রিডাক্স টুলকিট এবং এসিঙ্ক থাঙ্কের বাস্তব প্রজেক্টে ব্যবহার।',
          isFreePreview: false,
          order: 3
        }
      ]
    },
    {
      id: 'mod-2',
      courseId: course.id,
      title: 'মডিউল ২: Node.js, Express ও ব্যাকএন্ড API',
      order: 2,
      lessons: [
        {
          id: 'les-4',
          courseId: course.id,
          moduleId: 'mod-2',
          title: 'লেসন ৪: Express সার্ভার সেটআপ ও REST API রাউটিং',
          duration: '৩৫ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'এক্সপ্রেস ফ্রেমওয়ার্কে সুরক্ষিত REST API রাউটিং এবং কাস্টম মিডলওয়্যার কনফিগারেশন।',
          isFreePreview: false,
          order: 4
        },
        {
          id: 'les-5',
          courseId: course.id,
          moduleId: 'mod-2',
          title: 'লেসন ৫: JWT সিকিউর অথেন্টিকেশন ও ইউজার পারমিশন',
          duration: '৪৫ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'JWT সিকিউর টোকেন অথেন্টিকেশন এবং রোল-ভিত্তিক অ্যাক্সেস পারমিশন বাস্তবায়ন।',
          isFreePreview: false,
          order: 5
        }
      ]
    },
    {
      id: 'mod-3',
      courseId: course.id,
      title: 'মডিউল ৩: লাইভ প্রজেক্ট, পেমেন্ট ও ক্যারিয়ার গাইডলাইন',
      order: 3,
      lessons: [
        {
          id: 'les-6',
          courseId: course.id,
          moduleId: 'mod-3',
          title: 'লেসন ৬: বিকাশ ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন',
          duration: '৫০ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'রিয়েল-টাইম মার্চেন্ট পেমেন্ট প্রসেসিং ও ওয়েব হুক হ্যান্ডলিং।',
          isFreePreview: false,
          order: 6
        },
        {
          id: 'les-7',
          courseId: course.id,
          moduleId: 'mod-3',
          title: 'লেসন ৭: ফ্রিল্যান্সিং মার্কেটপ্লেস ও প্রজেক্ট কৌশল',
          duration: '৩৮ মিনিট',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: 'মার্কেটপ্লেসে প্রফেশনাল প্রপোজাল লিখন এবং ক্লায়েন্ট কমিউনিকেশন কৌশল।',
          isFreePreview: false,
          order: 7
        }
      ]
    }
  ];

  const activeModules = (course.modules && course.modules.length > 0) ? course.modules : defaultModules;

  // Flatten lessons
  const allLessons: Lesson[] = [];
  activeModules.forEach(m => {
    allLessons.push(...m.lessons);
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || 'les-1'
  );
  const [activeTab, setActiveTab] = useState<'video' | 'live' | 'assignment' | 'quiz' | 'resources' | 'certificate' | 'notes' | 'ai-tutor'>(initialTab);
  const [assignmentRepoLink, setAssignmentRepoLink] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  
  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const quizQuestions = [
    {
      q: 'React-এ অপ্রয়োজনীয় কম্পোনেন্ট রি-রেন্ডার রোধে কোন হুক সবচেয়ে বেশি উপযোগী?',
      options: ['useMemo ও useCallback', 'useEffect ও useState', 'useContext', 'useRef'],
      correct: 0
    },
    {
      q: 'Redux Toolkit-এ Async অপারেশন পরিচালনার জন্য কী ব্যবহৃত হয়?',
      options: ['createAsyncThunk', 'createSlice', 'configureStore', 'useDispatch'],
      correct: 0
    },
    {
      q: 'JWT টোকেন ক্লায়েন্ট সাইডে সংরক্ষণে সবচেয়ে সুরক্ষিত মাধ্যম কোনটি?',
      options: ['HttpOnly সিকিউর কুকি', 'প্লেইন টেক্সট ফাইল', 'URL কুয়েরি প্যারামিটার', 'গ্লোবাল ভেরিয়েবল'],
      correct: 0
    }
  ];

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiAsking, setIsAiAsking] = useState(false);

  const currentLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id);
  const [showCertModal, setShowCertModal] = useState(false);

  const completedLessons = enrollment?.completedLessons || ['les-1', 'les-2'];
  const isCurrentLessonCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

  const handleMarkComplete = () => {
    if (currentLesson) {
      updateLessonProgress(course.id, currentLesson.id);
      if (completedLessons.length + 1 >= allLessons.length) {
        setShowCertModal(true);
      }
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentLessonIndex + 1].id);
      setActiveTab('video');
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1].id);
      setActiveTab('video');
    }
  };

  const handleAskGeminiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiAsking) return;
    setIsAiAsking(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `টপিক: ${currentLesson?.title || 'সাধারণ পাঠ'}\nকোর্স: ${course.title}\nশিক্ষার্থীর প্রশ্ন: ${aiQuestion}`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.reply || 'দুঃখিত, উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।');
    } catch (err) {
      setAiAnswer('এআই টিউটরের সাথে সংযোগে সাময়িক সমস্যা হয়েছে।');
    } finally {
      setIsAiAsking(false);
    }
  };

  const progressPercent = Math.round(((completedLessons.length) / (allLessons.length || 1)) * 100);

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col font-sans selection:bg-[#1DB954] selection:text-black">
      
      {/* 1. TOP HEADER: Compact, Clean, Smart */}
      <header className="bg-slate-900 border-b border-slate-800/90 px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold text-xs cursor-pointer shrink-0 border border-slate-700/60"
            title="পূর্ববর্তী পেজে ফিরে যান"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ফিরে যান</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              ইন্সট্রাকটর: <span className="text-slate-200">{typeof course.instructor === 'object' ? (course.instructor as any)?.name : (course.instructor || 'প্রকৌশলী আল-আমিন')}</span>
            </p>
          </div>
        </div>

        {/* Right Header Tools: Mobile Syllabus Toggle & Certificate */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700/70 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>সিলেবাস ({allLessons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('certificate')}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">সার্টিফিকেট</span>
          </button>
        </div>
      </header>

      {/* 2. PROGRESS SUB-HEADER */}
      <div className="bg-slate-900/70 border-b border-slate-800/80 px-3.5 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0" />
          <span className="text-slate-300 font-bold text-[11px] sm:text-xs truncate">
            বর্তমান পাঠ: <strong className="text-white">{currentLesson?.title}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[11px] text-slate-300 font-bold">
            প্রগ্রেস: <strong className="text-[#1DB954] font-black">{completedLessons.length}/{allLessons.length} সম্পন্ন ({progressPercent}%)</strong>
          </span>
          <div className="w-20 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1DB954] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. MAIN SMART TWO-COLUMN LAYOUT: VIDEO FIRST (ALWAYS ON TOP) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* LEFT / TOP MAIN CONTENT: VIDEO PLAYER + ACTION BAR + TABS (ALWAYS FIRST ON MOBILE & DESKTOP) */}
        <main className="lg:col-span-8 xl:col-span-9 p-3 sm:p-5 space-y-4 overflow-y-auto max-h-none lg:max-h-[calc(100vh-95px)] order-1">
          
          {/* Main Video Player Screen - Top Priority */}
          <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            {currentLesson?.videoUrl ? (
              <iframe
                src={`${currentLesson.videoUrl}?autoplay=0&rel=0`}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 bg-slate-950">
                <PlayCircle className="w-12 h-12 text-[#1DB954] animate-pulse" />
                <p className="font-bold text-white text-sm">ভিডিও লেসন প্রস্তুত হচ্ছে...</p>
              </div>
            )}
          </div>

          {/* Lesson Controller Bar: Lesson Index + Prev/Next + Complete Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800">
            <div className="min-w-0">
              <span className="text-[11px] font-black text-[#1DB954]">
                লেসন {currentLessonIndex + 1} / {allLessons.length} ({currentLesson?.duration || '২৫ মিনিট'})
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate">
                {currentLesson?.title || 'ক্লাস ভিডিও'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-white cursor-pointer text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                title="পূর্ববর্তী লেসন"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">পূর্ববর্তী</span>
              </button>

              <button
                type="button"
                onClick={handleMarkComplete}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-[#1DB954] hover:bg-emerald-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentLessonCompleted ? 'সম্পন্ন হয়েছে ✓' : 'সম্পন্ন করুন'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-white cursor-pointer text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                title="পরবর্তী লেসন"
              >
                <span className="hidden sm:inline">পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="space-y-3 pt-1">
            <div className="flex border-b border-slate-800 gap-1 sm:gap-2 text-xs font-extrabold overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'video' ? 'bg-[#1DB954] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>বিবরণ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('live')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'live' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span>লাইভ ক্লাস</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('assignment')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'assignment' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>অ্যাসাইনমেন্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'quiz' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>কুইজ টেস্ট</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>সোর্স ফাইল</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ai-tutor')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'ai-tutor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI টিউটর</span>
              </button>
            </div>

            {/* TAB CONTENT 1: LESSON INFO */}
            {activeTab === 'video' && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300 text-xs sm:text-sm space-y-2.5">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-[#1DB954]" />
                  <span>লেসনের মূল আলোচ্য বিষয়:</span>
                </h3>
                <p className="leading-relaxed text-slate-300 text-xs sm:text-sm">
                  {currentLesson?.content || 'এই লেসনে প্রজেক্ট আর্কিটেকচার, প্র্যাকটিক্যাল কোডিং ও স্ট্যান্ডার্ড নিয়ম বিস্তারিতভাবে আলোচনা করা হয়েছে।'}
                </p>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>ক্লাস সময়কাল: {currentLesson?.duration || '২৫ মিনিট'}</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: LIVE CLASS */}
            {activeTab === 'live' && (
              <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                      <Video className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm sm:text-base">লাইভ ডাউট ও মেন্টর সেশন</h3>
                      <p className="text-xs text-red-400 font-bold">আজ রাত ৯:০০ টায় সরাসরি লাইভ ক্লাস শুরু হবে</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    লাইভ রুম
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  ইন্সট্রাকটরের সাথে সরাসরি প্রশ্ন-উত্তর এবং প্রজেক্টের রিয়েল-টাইম সমস্যা সমাধানের জন্য নিচের লিংকে যোগ দিন।
                </p>

                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>গুগল মিট লাইভ ক্লাসে যোগ দিন</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            )}

            {/* TAB CONTENT 3: ASSIGNMENTS (এই কোর্সের সব অ্যাসাইনমেন্টের তালিকা) */}
            {activeTab === 'assignment' && (
              <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-sm sm:text-base">
                        কোর্সের সকল অ্যাসাইনমেন্ট তালিকা (All Course Assignments)
                      </h3>
                      <p className="text-xs text-slate-400">প্রতিটি অ্যাসাইনমেন্ট সম্পন্ন করে রিভিউ ও মার্কস সংগ্রহ করুন</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    মোট ৩টি অ্যাসাইনমেন্ট
                  </span>
                </div>

                {/* List of All Assignments */}
                <div className="space-y-3">
                  {/* Assignment 1 - Completed */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        ১. ই-কমার্স শপ ড্যাশবোর্ড UI ও Redux স্টেট ম্যানেজমেন্ট
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        মার্কস: ১০০/১০০ (A+) ✓
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">স্ট্যাটাস: ইন্সট্রাকটর কর্তৃক সফলভাবে যাচাই ও রিভিউ সম্পন্ন হয়েছে।</p>
                  </div>

                  {/* Assignment 2 - Pending Submission */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        ২. JWT সিকিউর অথেন্টিকেশন, রিফ্রেশ টোকেন ও Protected Routes
                      </span>
                      {assignmentSubmitted ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                          জমা দেওয়া হয়েছে ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
                          পেন্ডিং (জমা দিন)
                        </span>
                      )}
                    </div>

                    {assignmentSubmitted ? (
                      <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs">
                        ✓ আপনার অ্যাসাইনমেন্ট ২ সফলভাবে জমা হয়েছে! ইন্সট্রাকটর কোড রিভিউ করে ফিডব্যাক প্রদান করবেন।
                      </div>
                    ) : (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (!assignmentRepoLink.trim()) {
                            alert('দয়া করে আপনার গিটহাব বা প্রজেক্ট লিংক দিন');
                            return;
                          }
                          setAssignmentSubmitted(true);
                        }}
                        className="space-y-2.5 text-xs pt-1"
                      >
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">
                            গিটহাব রিপোজিটরি / লাইভ প্রজেক্ট লিংক:
                          </label>
                          <input
                            type="url"
                            placeholder="https://github.com/username/jwt-auth-project"
                            value={assignmentRepoLink}
                            onChange={e => setAssignmentRepoLink(e.target.value)}
                            required
                            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">
                            সংক্ষিপ্ত বিবরণ ও সমাধান নোটস:
                          </label>
                          <textarea
                            rows={2}
                            placeholder="কী কী ফিচার বাস্তবায়ন করেছেন..."
                            value={assignmentNotes}
                            onChange={e => setAssignmentNotes(e.target.value)}
                            className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>অ্যাসাইনমেন্ট ২ জমা দিন</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Assignment 3 - Upcoming */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 opacity-75">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        ৩. ফাইনাল ক্যাপস্টোন প্রজেক্ট ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        লকড (মডিউল ৩ শেষ হলে খুলবে)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">পরবর্তী লেসনগুলো সম্পন্ন করলে এটি আনলক হবে।</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: MODULE QUIZ */}
            {activeTab === 'quiz' && (
              <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>মডিউল কুইজ টেস্ট</span>
                  </h3>
                  {quizScore !== null && (
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[11px] font-bold rounded">
                      স্কোর: {quizScore}/{quizQuestions.length} ({Math.round((quizScore/quizQuestions.length)*100)}%)
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {quizQuestions.map((qObj, qIdx) => (
                    <div key={qIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-100">
                        {qIdx + 1}. {qObj.q}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {qObj.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                              className={`p-2 rounded-lg text-left text-xs font-medium transition border cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-400'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    let score = 0;
                    quizQuestions.forEach((q, idx) => {
                      if (selectedQuizAnswers[idx] === q.correct) score++;
                    });
                    setQuizScore(score);
                    alert(`কুইজ সম্পন্ন হয়েছে! প্রাপ্ত স্কোর: ${score}/${quizQuestions.length}`);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  ফলাফল দেখুন
                </button>
              </div>
            )}

            {/* TAB CONTENT 5: SOURCE CODE & RESOURCES */}
            {activeTab === 'resources' && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#1DB954]" />
                  <span>সোর্স কোড ও ফাইলস</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <p className="text-xs font-bold text-white">প্রজেক্ট সোর্স কোড ডাউনলোড</p>
                    <p className="text-[11px] text-slate-400">মডিউল অনুযায়ী আপডেটেড কোড ও কনফিগ ফাইল।</p>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954] hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড করুন</span>
                    </a>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <p className="text-xs font-bold text-white">গিটহাব রিপোজিটরি</p>
                    <p className="text-[11px] text-slate-400">স্টেপ-বাই-স্টেপ ব্রাঞ্চ ও কমিট হিস্ট্রি।</p>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>রিপোজিটরি দেখুন</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: CERTIFICATE (কোর্স সম্পূর্ণ না হলে লক থাকবে) */}
            {activeTab === 'certificate' && (
              <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-amber-400/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-400/20 text-amber-400 rounded-xl border border-amber-400/30">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm sm:text-base">অফিসিয়াল ভেরিফাইড সার্টিফিকেট</h3>
                    <p className="text-xs text-amber-300">কোর্স সফলভাবে সম্পন্ন করে সার্টিফিকেট গ্রহণ করুন</p>
                  </div>
                </div>

                {progressPercent < 100 ? (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Clock className="w-4 h-4" />
                      <span>কোর্স সম্পন্ন হওয়ার পর সার্টিফিকেট আনলক হবে ({progressPercent}% সম্পন্ন হয়েছে)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      সার্টিফিকেট অর্জন করতে কোর্সের সবগুলো লেসন ভিডিও সম্পন্ন করুন এবং প্রয়োজনীয় অ্যাসাইনমেন্ট জমা দিন। সম্পূর্ণ ১০০% সম্পন্ন হলে স্বয়ংক্রিয়ভাবে ডাউনলোড বাটন দৃশ্যমান হবে।
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/50 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <Award className="w-4 h-4" />
                      <span>অভিনন্দন! কোর্স সফলভাবে সম্পন্ন হয়েছে</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      সার্টিফিকেট নম্বর: <strong className="text-amber-400 font-mono">PTENIT-CERT-2026-8891</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => onViewCertificate('PTENIT-CERT-2026-8891')}
                      className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow transition"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>সার্টিফিকেট প্রিভিউ ও ডাউনলোড</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 7: AI TUTOR */}
            {activeTab === 'ai-tutor' && (
              <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#1DB954]/20 text-[#1DB954] rounded-lg border border-[#1DB954]/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">AI কোডিং টিউটর</h3>
                    <p className="text-xs text-[#1DB954]">লেসন বা কোড সমস্যা নিয়ে যেকোনো প্রশ্ন করুন</p>
                  </div>
                </div>

                <form onSubmit={handleAskGeminiTutor} className="space-y-2 text-xs">
                  <textarea
                    rows={2}
                    placeholder="আপনার প্রশ্ন এখানে লিখুন..."
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    type="submit"
                    disabled={isAiAsking}
                    className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAiAsking ? 'উত্তর খোঁজা হচ্ছে...' : 'উত্তর জানুন'}</span>
                  </button>
                </form>

                {aiAnswer && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    <p className="font-bold text-[#1DB954] mb-1">এআই টিউটর:</p>
                    {aiAnswer}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: SYLLABUS & LESSON LIST (Clean, compact, on desktop right / on mobile collapsible) */}
        <aside
          className={`lg:col-span-4 xl:col-span-3 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 p-3 sm:p-4 space-y-3 overflow-y-auto max-h-none lg:max-h-[calc(100vh-95px)] order-2 ${
            isSidebarOpenMobile ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h2 className="font-black text-xs sm:text-sm text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1DB954]" />
              <span>কোর্স সিলেবাস</span>
            </h2>
            <span className="text-xs text-[#1DB954] font-black">
              {allLessons.length} টি লেসন
            </span>
          </div>

          {/* Module List */}
          <div className="space-y-3">
            {activeModules.map((module, mIdx) => (
              <div key={module.id || mIdx} className="space-y-1">
                <p className="text-[11px] font-black text-slate-400 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/50 truncate">
                  {module.title}
                </p>
                <div className="space-y-1">
                  {module.lessons.map((lesson, lIdx) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id || lIdx}
                        type="button"
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setActiveTab('video');
                          setIsSidebarOpenMobile(false);
                        }}
                        className={`w-full p-2 rounded-lg text-left text-xs font-bold transition flex items-center justify-between cursor-pointer border ${
                          isActive
                            ? 'bg-[#1DB954] text-white border-emerald-400 shadow-sm'
                            : isDone
                            ? 'bg-slate-800/60 text-emerald-400 border-slate-700/60 hover:bg-slate-800'
                            : 'bg-slate-950/80 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 pr-1.5">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          )}
                          <span className="truncate text-[11px] sm:text-xs">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] opacity-75 shrink-0 font-mono">{lesson.duration || '২৫ মি.'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Auto-Certificate Celebration Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 p-5 sm:p-6 rounded-2xl max-w-sm w-full text-center space-y-3 shadow-2xl relative animate-in fade-in zoom-in font-bengali">
            <div className="w-12 h-12 bg-emerald-500/20 text-[#1DB954] rounded-xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-full text-[10px] font-black">
                🎉 ১০০% কোর্স সম্পূর্ণ
              </span>
              <h3 className="text-base font-extrabold text-white">
                অভিনন্দন! কোর্স সম্পন্ন হয়েছে
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{course.title}" কোর্সের সকল পাঠ শেষ করায় আপনার নামে সার্টিফিকেট প্রস্তুত হয়েছে।
              </p>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowCertModal(false);
                  if (enrollment?.certificateId) {
                    onViewCertificate(enrollment.certificateId);
                  }
                }}
                className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 cursor-pointer transition"
              >
                <Award className="w-4 h-4" />
                <span>সার্টিফিকেট ডাউনলোড করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
