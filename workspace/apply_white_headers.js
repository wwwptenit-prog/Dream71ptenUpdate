const fs = require('fs');

const file = 'src/components/MarketplaceSection.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Category view update
const catTarget = '{/* VIEW 2: DEDICATED FULL-PAGE CATEGORY VIEW (WHEN A CATEGORY IS SELECTED) */}\n              {!searchQuery.trim() && activeSubTab === \'gigs\' && selectedCategory !== \'All\' && (\n                <div className="space-y-4 font-bengali animate-fadeIn pb-8">';

const catReplacement = `{/* VIEW 2: DEDICATED FULL-PAGE CATEGORY VIEW (WHEN A CATEGORY IS SELECTED) */}
              {!searchQuery.trim() && activeSubTab === 'gigs' && selectedCategory !== 'All' && (
                <div className="space-y-3 sm:space-y-4 font-bengali animate-fadeIn pb-8 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
                  {/* Mobile View Category Return Bar - Clean White */}
                  <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                        <span>সকল সার্ভিস</span>
                      </button>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {selectedCategory}
                      </h2>
                    </div>
                    <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                      {filteredGigs.length}টি গিগ
                    </span>
                  </div>`;

if (code.includes(catTarget)) {
  code = code.replace(catTarget, catReplacement);
  console.log('Category view updated!');
} else {
  console.log('catTarget not found');
}

// 2. Saved gigs view update
const savedTarget = '{/* SAVED GIGS / FAVORITES VIEW (WORKS FOR LOGGED IN & GUEST USERS) */}\n          {activeSubTab === \'saved_gigs\' && !selectedGig && (\n            <div className="space-y-4 font-bengali animate-fadeIn pb-12 pt-1 sm:pt-0">';

const savedReplacement = `{/* SAVED GIGS / FAVORITES VIEW (WORKS FOR LOGGED IN & GUEST USERS) */}
          {activeSubTab === 'saved_gigs' && !selectedGig && (
            <div className="space-y-3 sm:space-y-4 font-bengali animate-fadeIn pb-12 pt-1 sm:pt-0 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
              {/* Mobile View Saved Gigs Return Bar - Clean White */}
              <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>মার্কেটপ্লেস</span>
                  </button>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    পছন্দের গিগসমূহ
                  </h2>
                </div>
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded-full shrink-0">
                  {savedGigIds.length}টি সেভড
                </span>
              </div>`;

if (code.includes(savedTarget)) {
  code = code.replace(savedTarget, savedReplacement);
  console.log('Saved gigs view updated!');
} else {
  console.log('savedTarget not found');
}

// 3. PTENit Services view update
const ptenitTarget = '{/* DEDICATED FULL-PAGE PTENIT AGENCY SERVICES TAB */}\n          {activeSubTab === \'ptenit-services\' && (\n            <div className="space-y-4 font-bengali animate-fadeIn pb-8">';

const ptenitReplacement = `{/* DEDICATED FULL-PAGE PTENIT AGENCY SERVICES TAB */}
          {activeSubTab === 'ptenit-services' && (
            <div className="space-y-3 sm:space-y-4 font-bengali animate-fadeIn pb-8 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
              {/* Mobile View PTENit Services Return Bar - Clean White */}
              <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>মার্কেটপ্লেস</span>
                  </button>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    অফিশিয়াল সার্ভিসেস
                  </h2>
                </div>
                <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                  {services.length}টি সার্ভিস
                </span>
              </div>`;

if (code.includes(ptenitTarget)) {
  code = code.replace(ptenitTarget, ptenitReplacement);
  console.log('PTENit services view updated!');
} else {
  console.log('ptenitTarget not found');
}

// 4. Courses view update
const coursesTarget = '{/* DEDICATED FULL-PAGE PTENIT ACADEMY COURSES TAB */}\n          {activeSubTab === \'courses\' && (\n            <div className="space-y-4 animate-fadeIn font-bengali pb-12 pt-1 sm:pt-0">';

const coursesReplacement = `{/* DEDICATED FULL-PAGE PTENIT ACADEMY COURSES TAB */}
          {activeSubTab === 'courses' && (
            <div className="space-y-3 sm:space-y-4 animate-fadeIn font-bengali pb-12 pt-1 sm:pt-0 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
              {/* Mobile View Courses Return Bar - Clean White */}
              <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>মার্কেটপ্লেস</span>
                  </button>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    একাডেমি কোর্সসমূহ
                  </h2>
                </div>
                <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full shrink-0">
                  {courses.length}টি কোর্স
                </span>
              </div>`;

if (code.includes(coursesTarget)) {
  code = code.replace(coursesTarget, coursesReplacement);
  console.log('Courses view updated!');
} else {
  console.log('coursesTarget not found');
}

fs.writeFileSync(file, code, 'utf8');
