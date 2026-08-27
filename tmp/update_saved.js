const fs = require('fs');

let mkt = fs.readFileSync('src/components/MarketplaceSection.tsx', 'utf8');

let target = `              {activeSubTab === "saved_gigs" && (
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-colors w-full">
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGig(null);
                          setViewMode("buying");
                          setActiveSubTab("gigs");
                          setSelectedCategory("All");
                          setSearchQuery("");
                          if (setActiveTab) setActiveTab("marketplace", "All", true);
                        }}
                        className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                        title="হোমে ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">Saved Gigs</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0" />
                          {savedGigIds && savedGigIds.length > 0 && (
                            <span className="bg-[#1DB954] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shrink-0">
                              {savedGigIds.length}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans truncate">
                          PTENit Saved Services
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}`;

let replacement = `              {activeSubTab === "saved_gigs" && (
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-colors w-full">
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGig(null);
                          setViewMode("buying");
                          setActiveSubTab("gigs");
                          setSelectedCategory("All");
                          setSearchQuery("");
                          if (setActiveTab) setActiveTab("marketplace", "All", true);
                        }}
                        className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                        title="হোমে ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">Saved Gigs</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0" />
                          {savedGigIds && savedGigIds.length > 0 && (
                            <span className="bg-[#1DB954] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shrink-0">
                              {savedGigIds.length}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans truncate">
                          PTENit Saved Services
                        </p>
                      </div>
                    </div>

                    {/* Right: Search + Settings */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsSavedSearchActive(!isSavedSearchActive)}
                        className={\`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center \${
                          isSavedSearchActive || savedSearchQuery
                            ? "bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }\`}
                        title="সার্চ করুন"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSubTab("settings")}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center"
                        title="সেটিংস"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* COLLAPSIBLE SAVED GIGS SEARCH BAR */}
                  {isSavedSearchActive && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full animate-in fade-in duration-150">
                      <div className="w-full max-w-md mx-auto relative flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={savedSearchQuery}
                          onChange={(e) => setSavedSearchQuery(e.target.value)}
                          placeholder="সেভ করা গিগ সার্চ করুন..."
                          className="w-full pl-9 pr-8 py-1.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent shadow-xs"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSavedSearchQuery("");
                            setIsSavedSearchActive(false);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition cursor-pointer"
                          title="সার্চ বন্ধ করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}`;

if (mkt.includes(target)) {
  mkt = mkt.replace(target, replacement);
  fs.writeFileSync('src/components/MarketplaceSection.tsx', mkt, 'utf8');
  console.log('Saved gigs header updated successfully');
} else {
  console.log('Target not found');
}
