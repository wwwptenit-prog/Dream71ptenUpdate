import sys

def main():
    with open("src/components/MarketplaceSection.tsx", "r", encoding="utf-8") as f:
        code = f.read()

    # 1. Update Buyer order card 3% bonus box
    old_bonus_box = """                                       {isCancelled ? (
                                         <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-2.5 space-y-1">
                                           <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black text-amber-700 dark:text-amber-300">
                                             <div className="flex items-center gap-1.5">
                                               <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 shrink-0" />
                                               <span>সময়োত্তীর্ণ বাতিল • ৩% ক্ষতিপূরণ বোনাস ওয়ালেটে জমা</span>
                                             </div>
                                             <span className="px-2 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] font-black bg-amber-500 text-white">
                                               ৩% বোনাস
                                             </span>
                                           </div>
                                           <p className="text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-200 font-medium">
                                             নির্দিষ্ট সময়ে সেলার প্রজেক্ট জমা না দেওয়ায় প্রজেক্টটি বাতিল করে আপনার বায়ার ওয়ালেটে ৩% ক্ষতিপূরণ বোনাস (৳{((ord.amount || 18000) * 0.03).toLocaleString("bn-BD")}) ক্রেডিট করা হয়েছে।
                                           </p>
                                         </div>
                                       ) : ("""

    new_bonus_box = """                                       {isCancelled ? (
                                         <div className="py-2 px-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 mb-2 flex items-center justify-between gap-2 text-[10px] sm:text-xs">
                                           <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 min-w-0">
                                             <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/30 shrink-0" />
                                             <span className="truncate">সময়োত্তীর্ণ বাতিল • ৩% বোনাস (৳{Math.round((ord.amount || 18000) * 0.03).toLocaleString("bn-BD")}) ওয়ালেটে জমা</span>
                                           </div>
                                           <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-white shrink-0">
                                             ৩% বোনাস
                                           </span>
                                         </div>
                                       ) : ("""

    if old_bonus_box in code:
        code = code.replace(old_bonus_box, new_bonus_box, 1)
        print("Updated Buyer bonus box")
    else:
        print("Buyer bonus box pattern not matched")

    # 2. Update Buyer order card message button to lock when completed or cancelled
    old_buyer_msg_btn = """                                        <button
                                           type="button"
                                           onClick={() => {
                                             openChatWindow({
                                               id: `chat-order-${ord.id}`,
                                               orderId: ord.id,
                                               senderName: ord.sellerName || "সাবরিনা চৌধুরী",
                                               senderRole: "seller",
                                               senderAvatar: ord.sellerAvatar,
                                               initialMessage: `আসসালামু আলাইকুম ${ord.sellerName || "সেলার"}! আমি আমার প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") এর জন্য যোগাযোগ করছি।`
                                             });
                                           }}
                                           className="flex-1 py-1.5 sm:py-2 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                           title="সেলারকে মেসেজ দিন"
                                         >
                                           <div className="relative shrink-0">
                                             <MessageSquare className="w-3.5 h-3.5 text-white fill-white/20" />
                                             {unreadCount > 0 && (
                                               <span className="absolute -top-2 -right-2 min-w-[15px] h-[15px] px-1 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                                                 {unreadCount}
                                               </span>
                                             )}
                                           </div>
                                           <span>মেসেজ</span>
                                         </button>"""

    new_buyer_msg_btn = """                                        {isCompleted || isCancelled ? (
                                           <button
                                             type="button"
                                             onClick={() => {
                                               openChatWindow({
                                                 id: `chat-order-${ord.id}`,
                                                 orderId: ord.id,
                                                 senderName: ord.sellerName || "সাবরিনা চৌধুরী",
                                                 senderRole: "seller",
                                                 senderAvatar: ord.sellerAvatar,
                                                 isClosed: true,
                                                 isReadOnly: true,
                                                 initialMessage: `আসসালামু আলাইকুম ${ord.sellerName || "সেলার"}! প্রজেক্ট #${ord.id.slice(-6)} এর মেসেজিং সংরক্ষিত রয়েছে।`
                                               });
                                             }}
                                             className="flex-1 py-1.5 sm:py-2 px-2 bg-slate-600 hover:bg-slate-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                             title="চ্যাট বন্ধ (নতুন অর্ডার ছাড়া মেসেজ দেওয়া যাবে না)"
                                           >
                                             <Lock className="w-3.5 h-3.5 text-white/80" />
                                             <span>চ্যাট বন্ধ</span>
                                           </button>
                                         ) : (
                                           <button
                                             type="button"
                                             onClick={() => {
                                               openChatWindow({
                                                 id: `chat-order-${ord.id}`,
                                                 orderId: ord.id,
                                                 senderName: ord.sellerName || "সাবরিনা চৌধুরী",
                                                 senderRole: "seller",
                                                 senderAvatar: ord.sellerAvatar,
                                                 initialMessage: `আসসালামু আলাইকুম ${ord.sellerName || "সেলার"}! আমি আমার প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") এর জন্য যোগাযোগ করছি।`
                                               });
                                             }}
                                             className="flex-1 py-1.5 sm:py-2 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                             title="সেলারকে মেসেজ দিন"
                                           >
                                             <div className="relative shrink-0">
                                               <MessageSquare className="w-3.5 h-3.5 text-white fill-white/20" />
                                               {unreadCount > 0 && (
                                                 <span className="absolute -top-2 -right-2 min-w-[15px] h-[15px] px-1 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                                                   {unreadCount}
                                                 </span>
                                               )}
                                             </div>
                                             <span>মেসেজ</span>
                                           </button>
                                         )}"""

    if old_buyer_msg_btn in code:
        code = code.replace(old_buyer_msg_btn, new_buyer_msg_btn, 1)
        print("Updated Buyer message button")
    else:
        print("Buyer message button pattern not matched")

    # 3. Update Buyer payment history transactions
    old_buyer_trx = """                                   const orderTransactions = allBuyerOrders.map((ord, idx) => ({
                                     id: `TRX-${ord.id ? ord.id.replace('ord-mkt-', '').substring(0, 6).toUpperCase() : `ORD-${idx + 1}`}`,
                                     invId: `INV-${idx + 101}`,
                                     type: 'orders',
                                     typeName: 'সার্ভিস',
                                     title: ord.title || 'কাস্টম ফুল-স্ট্যাক ওয়েবসাইট ডেভেলপমেন্ট',
                                     amount: ord.amount || 12000,
                                     method: idx % 2 === 0 ? 'bKash' : 'Nagad',
                                     date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('bn-BD') : '১৮/০৮/২৬',
                                     status: ord.status === 'completed' ? 'পরিশোধিত' : 'হোল্ড (এসক্রো)',
                                     isEscrow: ord.status !== 'completed',
                                     seller: ord.sellerName || 'এক্সপার্ট'
                                   }));"""

    new_buyer_trx = """                                   const orderTransactions = allBuyerOrders.map((ord, idx) => {
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
                                   });"""

    if old_buyer_trx in code:
        code = code.replace(old_buyer_trx, new_buyer_trx, 1)
        print("Updated Buyer transactions")
    else:
        print("Buyer transactions pattern not matched")

    # 4. Update Buyer payment history badge display
    old_badge_trx = """                                           <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                                             trx.isEscrow
                                               ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                               : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                           }`}>
                                             {trx.status}
                                           </span>"""

    new_badge_trx = """                                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                             trx.isCancelled
                                               ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                               : trx.isEscrow
                                               ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                               : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                           }`}>
                                             {trx.status}
                                           </span>"""

    if old_badge_trx in code:
        code = code.replace(old_badge_trx, new_badge_trx, 1)
        print("Updated Buyer transactions badge")
    else:
        print("Buyer transactions badge pattern not matched")

    with open("src/components/MarketplaceSection.tsx", "w", encoding="utf-8") as f:
        f.write(code)

    print("Finished MarketplaceSection update script.")

if __name__ == "__main__":
    main()
