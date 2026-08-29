with open("src/components/MarketplaceSection.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Replace orderTransactions
start_idx = -1
for i, l in enumerate(lines):
    if "const orderTransactions = allBuyerOrders.map((ord, idx) => ({" in l:
        start_idx = i
        break

if start_idx != -1:
    end_idx = start_idx + 13
    new_trx_code = """                                  const orderTransactions = allBuyerOrders.map((ord, idx) => {
                                    const isCompleted = ord.status === 'completed';
                                    const isCancelled = ord.status === 'cancelled';
                                    const bonus = ord.buyerBonus || Math.round((ord.amount || 0) * 0.03);
                                    return {
                                      id: `TRX-${ord.id ? ord.id.replace('ord-mkt-', '').substring(0, 6).toUpperCase() : `ORD-${idx + 1}`}`,
                                      invId: `INV-${idx + 101}`,
                                      type: 'orders',
                                      typeName: 'সার্ভিস অর্ডার',
                                      title: ord.title || 'কাস্টম প্রজেক্ট অর্ডার',
                                      amount: ord.amount || 12000,
                                      bonusAmount: isCancelled ? bonus : 0,
                                      method: ord.paymentMethod || (idx % 2 === 0 ? 'bKash' : 'Nagad'),
                                      date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('bn-BD') : '১৮/০৮/২৬',
                                      status: isCompleted ? 'পরিশোধিত' : isCancelled ? 'বাতিল ও রিফান্ড (+৩% বোনাস)' : 'হোল্ড (এসক্রো)',
                                      statusType: isCompleted ? 'completed' : isCancelled ? 'cancelled' : 'escrow',
                                      isEscrow: !isCompleted && !isCancelled,
                                      isCancelled,
                                      seller: ord.sellerName || 'এক্সপার্ট'
                                    };
                                  });
"""
    lines[start_idx:end_idx] = [new_trx_code]
    print("Replaced orderTransactions successfully")

code = "".join(lines)

# Replace transaction badge
old_badge = """                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                                            trx.isEscrow
                                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                          }`}>
                                            {trx.status}
                                          </span>"""

new_badge = """                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                            trx.isCancelled
                                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                              : trx.isEscrow
                                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                          }`}>
                                            {trx.status}
                                          </span>"""

if old_badge in code:
    code = code.replace(old_badge, new_badge, 1)
    print("Replaced trx badge successfully")
else:
    print("Failed to replace trx badge")

# Add payReleaseModalOrder Modal right before {/* BUYER PROFILE & SECURITY UPDATE MODAL */}
release_modal_code = """      {/* BUYER ORDER PAYMENT RELEASE MODAL */}
      {payReleaseModalOrder && (() => {
        const orderCountdown = getOrderCountdown(payReleaseModalOrder, nowTimestamp);
        const buyerPenalty = orderCountdown?.buyerPenalty || payReleaseModalOrder.buyerReviewPenalty || 0;
        const sellerBonus = orderCountdown?.sellerBonus || payReleaseModalOrder.sellerReviewBonus || 0;
        const isOverdue = orderCountdown?.isReviewOverdue;
        const finalPayout = (payReleaseModalOrder.sellerPayout || Math.round((payReleaseModalOrder.amount || 0) * 0.9)) + sellerBonus;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-bengali">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPayReleaseModalOrder(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#1DB954] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    এসক্রো ফান্ড রিলিজ ও কাজ এক্সেপ্ট
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    অর্ডার #{payReleaseModalOrder.id.slice(-6).toUpperCase()} • সেলার: {payReleaseModalOrder.sellerName}
                  </p>
                </div>
              </div>

              {/* Project Card */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {payReleaseModalOrder.title}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold block">অর্ডার বাজেট (এসক্রো)</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      ৳{(payReleaseModalOrder.amount || 0).toLocaleString("bn-BD")}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-[#1DB954] font-bold block">সেলার পেআউট</span>
                    <span className="text-sm font-black text-[#1DB954] font-mono">
                      ৳{finalPayout.toLocaleString("bn-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* 24h Review Delay / Penalty Notice */}
              {isOverdue ? (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-black text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>২৪ ঘণ্টার রিলিজ সময় অতিক্রান্ত ({orderCountdown?.delayText})</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-black">
                      জরিমানা প্রযোজ্য
                    </span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed">
                    ২৪ ঘণ্টার মধ্যে রিলিজ না করায় বায়ার থেকে ৫% লেট ফি (৳{buyerPenalty.toLocaleString("bn-BD")}) এবং সেলারকে ক্ষতিপূরণ হিসেবে +২% বোনাস (৳{sellerBonus.toLocaleString("bn-BD")}) পেআউটে যোগ করা হয়েছে।
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span>২৪ ঘণ্টার নির্ধারিত সময়ের ভেতর রিলিজ প্রক্রিয়া সম্পন্ন হচ্ছে।</span>
                </div>
              )}

              {/* Star Rating Section */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 block">
                  সেলার কাজের মান ও রেটিং প্রদান করুন:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setBuyerRating(star)}
                      className={`p-1.5 rounded-xl transition cursor-pointer ${
                        star <= buyerRating
                          ? 'text-amber-500 scale-110'
                          : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-600 ml-2 font-mono">
                    {buyerRating}.0 স্টার
                  </span>
                </div>
                <textarea
                  value={buyerReviewText}
                  onChange={e => setBuyerReviewText(e.target.value)}
                  placeholder="সেলারের কাজের প্রতি আপনার মন্তব্য বা অভিজ্ঞতা লিখুন (ঐচ্ছিক)..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayReleaseModalOrder(null)}
                  className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveOrderAndReleaseEscrow(payReleaseModalOrder.id, buyerRating, buyerReviewText);
                    setPayReleaseModalOrder(null);
                    setBuyerReviewText("");
                  }}
                  className="flex-[2] py-2.5 px-4 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>ফান্ড রিলিজ ও কাজ এক্সেপ্ট</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

"""

code = code.replace("{/* BUYER PROFILE & SECURITY UPDATE MODAL */}", release_modal_code + "      {/* BUYER PROFILE & SECURITY UPDATE MODAL */}", 1)

with open("src/components/MarketplaceSection.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Finished applying all edits to MarketplaceSection.tsx")
