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
  BookOpen
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Lesson } from '../types';

interface CourseLearningPageProps {
  courseId: string;
  onBack: () => void;
  onViewCertificate: (code: string) => void;
}

export const CourseLearningPage: React.FC<CourseLearningPageProps> = ({
  courseId,
  onBack,
  onViewCertificate
}) => {
  const { courses, enrollments, currentUser, updateLessonProgress } = useData();

  const course = courses.find(c => c.id === courseId);
  const enrollment = currentUser
    ? enrollments.find(e => e.userId === currentUser.id && e.courseId === courseId)
    : null;

  // Flatten lessons
  const allLessons: Lesson[] = [];
  course?.modules?.forEach(m => {
    allLessons.push(...m.lessons);
  });

  const [activeLessonId, setActiveLessonId] = useState<string>(
    allLessons[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'video' | 'resources' | 'assignment' | 'notes' | 'ai-tutor'>('video');
  const [studentNote, setStudentNote] = useState('');
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isAiAsking, setIsAiAsking] = useState(false);

  const handleAskGeminiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || isAiAsking) return;
    setIsAiAsking(true);
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Topic: ${currentLesson?.title || 'General Course'}\nCourse: ${course.title}\nStudent Question: ${aiQuestion}`,
        }),
      });
      const data = await res.json();
      setAiAnswer(data.reply || 'উত্তর পাওয়া যায়নি।');
    } catch (err) {
      setAiAnswer('Gemini AI টিউটর কানেক্ট করতে সমস্যা হয়েছে।');
    } finally {
      setIsAiAsking(false);
    }
  };

  if (!course) {
    return (
      <div className="py-20 text-center text-slate-400 font-bengali">
        কোর্স পাওয়া যায়নি।{' '}
        <button onClick={onBack} className="text-[#1DB954] underline">
          ফিরে যান
        </button>
      </div>
    );
  }

  const currentLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id);

  const [showCertModal, setShowCertModal] = useState(false);

  const completedLessons = enrollment?.completedLessons || [];
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
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col">
      
      {/* Top Header Navigation */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] text-[#1DB954] font-bold uppercase tracking-wider block">
              PTENit Classroom LMS
            </span>
            <h1 className="text-sm sm:text-base font-bold font-heading line-clamp-1">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Certificate Quick Trigger */}
        {enrollment?.certificateIssued && enrollment.certificateId && (
          <button
            onClick={() => onViewCertificate(enrollment.certificateId!)}
            className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer hover:bg-amber-300"
          >
            <Award className="w-4 h-4" />
            সনদপত্র ডাউনলোড
          </button>
        )}
      </div>

      {/* Main LMS Grid Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Sidebar: Lessons & Modules */}
        <div className="lg:col-span-4 xl:col-span-3 bg-slate-900 border-r border-slate-800 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm font-heading text-slate-200">
              কোর্স মডিউল ও লেসনস
            </h3>
            <span className="text-xs text-[#1DB954] font-bold font-mono">
              {completedLessons.length} / {allLessons.length} সম্পন্ন
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1DB954] h-full transition-all duration-300"
              style={{ width: `${enrollment?.progress || 0}%` }}
            />
          </div>

          {/* Modules List */}
          <div className="space-y-4 pt-2">
            {course.modules?.map(module => (
              <div key={module.id} className="space-y-1">
                <p className="text-xs font-bold text-slate-400 font-bengali uppercase tracking-wider px-2 py-1 bg-slate-800/60 rounded-md">
                  {module.title}
                </p>
                <div className="space-y-1">
                  {module.lessons.map(lesson => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full p-3 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-[#1DB954] text-white shadow-md'
                            : isDone
                            ? 'bg-slate-800/80 text-emerald-400 hover:bg-slate-800'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 shrink-0" />
                          )}
                          <span className="truncate font-bengali">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] opacity-80 shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
          
          {/* Video Player Box */}
          <div className="relative aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {currentLesson?.videoUrl ? (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-2">
                <PlayCircle className="w-16 h-16 text-[#1DB954] animate-pulse" />
                <p className="font-bold text-slate-300 font-bengali">ভিডিও লোড হচ্ছে...</p>
              </div>
            )}
          </div>

          {/* Lesson Title & Mark as Complete Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-[#1DB954] font-mono">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </span>
              <h2 className="text-xl font-bold font-heading text-white">
                {currentLesson?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIndex === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                title="পূর্ববর্তী লেসন"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleMarkComplete}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs font-bengali flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1DB954] hover:bg-emerald-500 text-white shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {isCurrentLessonCompleted ? 'সম্পন্ন করা হয়েছে ✓' : 'Mark as Complete (সম্পন্ন)'}
              </button>

              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                title="পরবর্তী লেসন"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs for PDF Resources, Assignments, Notes */}
          <div className="space-y-4">
            <div className="flex border-b border-slate-800 gap-6 text-xs sm:text-sm font-bold font-bengali">
              <button
                onClick={() => setActiveTab('video')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'video' ? 'border-[#1DB954] text-[#1DB954]' : 'border-transparent text-slate-400'
                }`}
              >
                লেসন বিবরণী
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'resources' ? 'border-[#1DB954] text-[#1DB954]' : 'border-transparent text-slate-400'
                }`}
              >
                পিডিএফ ও রিসোর্স
              </button>
              <button
                onClick={() => setActiveTab('assignment')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'assignment' ? 'border-[#1DB954] text-[#1DB954]' : 'border-transparent text-slate-400'
                }`}
              >
                এসাইনমেন্ট সাবমিশন
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'notes' ? 'border-[#1DB954] text-[#1DB954]' : 'border-transparent text-slate-400'
                }`}
              >
                ব্যক্তিগত নোটস
              </button>
              <button
                onClick={() => setActiveTab('ai-tutor')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ai-tutor' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-slate-400 hover:text-amber-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                Gemini AI টিউটর ✨
              </button>
            </div>

            {/* TAB: LESSON INFO */}
            {activeTab === 'video' && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-300 text-sm font-bengali space-y-2">
                <h3 className="font-bold text-white text-base">বিষয়বস্তু:</h3>
                <p>{currentLesson?.content || "এই লেসনে প্র্যাকটিক্যাল গাইডলাইন ও প্রজেক্ট ফাইল সম্পর্কে আলোচনা করা হয়েছে।"}</p>
              </div>
            )}

            {/* TAB: PDF RESOURCES */}
            {activeTab === 'resources' && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-300 text-sm font-bengali space-y-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1DB954]" /> ডাউনলোডযোগ্য ফাইলসমূহ:
                </h3>
                {currentLesson?.pdfResourceUrl ? (
                  <a
                    href={currentLesson.pdfResourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-[#1DB954] text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    লেসন নোটস পিডিএফ (PDF Download)
                  </a>
                ) : (
                  <p className="text-xs text-slate-500">এই লেসনের জন্য অতিরিক্ত কোনো ফাইল লিংক সংযুক্ত নেই।</p>
                )}
              </div>
            )}

            {/* TAB: ASSIGNMENT */}
            {activeTab === 'assignment' && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 font-bengali">
                <h3 className="font-bold text-white text-base">এসাইনমেন্ট জমা দিন</h3>
                {assignmentSubmitted ? (
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold">
                    ✓ আপনার এসাইনমেন্ট সফলভাবে ট্রেইনারের নিকট জমা হয়েছে!
                  </div>
                ) : (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      setAssignmentSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <textarea
                      rows={4}
                      placeholder="আপনার সাবমিশন নোটস বা গুগল ড্রাইভ প্রজেক্ট লিংক এখানে লিখুন..."
                      value={assignmentText}
                      onChange={e => setAssignmentText(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      সাবমিট করুন
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB: NOTES */}
            {activeTab === 'notes' && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 font-bengali">
                <h3 className="font-bold text-white text-base">ব্যক্তিগত লার্নিং নোটস</h3>
                <textarea
                  rows={4}
                  placeholder="পরবর্তীতে রিভিশন দেওয়ার জন্য গুরুত্বপূর্ণ তথ্য এখানে টাইপ করে রাখুন..."
                  value={studentNote}
                  onChange={e => setStudentNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                />
                <p className="text-[11px] text-slate-500">নোটগুলো আপনার ব্রাউজারে অটো-সেভ থাকে।</p>
              </div>
            )}

            {/* TAB: GEMINI AI TUTOR */}
            {activeTab === 'ai-tutor' && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-amber-500/40 space-y-4 font-bengali">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-400/20 text-amber-300 rounded-xl border border-amber-400/30">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Order Boss AI কোর্স টিউটর</h3>
                    <p className="text-xs text-amber-300/80">"{currentLesson?.title || 'লেসন'}" ক্লাসের যেকোনো প্রশ্ন বা বিষয়বস্তু নিয়ে সরাসরি এআই টিউটরের সাহায্য নিন</p>
                  </div>
                </div>

                <form onSubmit={handleAskGeminiTutor} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="উদাহরণ: এই লেসনের মূল বিষয়বস্তু কীভাবে কাজ করে সহজ করে বুঝিয়ে দাও..."
                    value={aiQuestion}
                    onChange={e => setAiQuestion(e.target.value)}
                    required
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isAiAsking || !aiQuestion.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    {isAiAsking ? 'উত্তর তৈরি হচ্ছে...' : 'এআই টিউটরকে প্রশ্ন করুন ✨'}
                  </button>
                </form>

                {aiAnswer && (
                  <div className="p-4 bg-slate-950 border border-emerald-500/50 rounded-2xl space-y-2 text-xs leading-relaxed">
                    <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" /> এআই টিউটরের উত্তর:
                    </p>
                    <div className="text-slate-200 whitespace-pre-wrap">{aiAnswer}</div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Auto-Certificate Celebration Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in font-bengali">
            <div className="w-16 h-16 bg-emerald-500/20 text-[#1DB954] rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-full text-[11px] font-black uppercase">
                🎉 ১০০% কোর্স সম্পূর্ণ ও অটো সার্টিফিকেট
              </span>
              <h3 className="text-xl font-black text-white">
                অভিনন্দন! আপনি কোর্স সম্পন্ন করেছেন!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                "{course.title}" কোর্সের সকল লেসন ও টাস্ক কমপ্লিট করায় আপনার নামে অফিসিয়াল সার্টিফিকেট স্বয়ংক্রিয়ভাবে জেনারেট হয়েছে।
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setShowCertModal(false);
                  if (enrollment?.certificateId) {
                    onViewCertificate(enrollment.certificateId);
                  }
                }}
                className="w-full py-3 bg-[#1DB954] hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Award className="w-4 h-4" />
                <span>অফিসিয়াল সার্টিফিকেট ডাউনলোড করুন</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
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
