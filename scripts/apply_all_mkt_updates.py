with open("src/components/MarketplaceSection.tsx", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Update Buyer 3% Bonus Notice (lines 12500-12515)
old_box = """                                      {isCancelled ? (
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

new_box = """                                      {isCancelled ? (
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

if old_box in code:
    code = code.replace(old_box, new_box, 1)
    print("1. Replaced Buyer 3% box")
else:
    print("1. Failed to find Buyer 3% box")

# 2. Update Buyer Chat Button (lines 12582-12608)
old_buyer_btn = """                                        {/* 1. Chat Message Button */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setReadOrderIds(prev => ({ ...prev, [ord.id]: true }));
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

new_buyer_btn = """                                        {/* 1. Chat Message Button */}
                                        {isCompleted || isCancelled ? (
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
                                              setReadOrderIds(prev => ({ ...prev, [ord.id]: true }));
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

if old_buyer_btn in code:
    code = code.replace(old_buyer_btn, new_buyer_btn, 1)
    print("2. Replaced Buyer chat button")
else:
    print("2. Failed to find Buyer chat button")

# 3. Update Seller Chat Button (around line 7290)
old_seller_btn = """                                      {/* 1. Chat Message Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          openChatWindow({
                                            id: `chat-order-${ord.id}`,
                                            orderId: ord.id,
                                            senderName: ord.buyerName,
                                            senderRole: "customer",
                                            initialMessage: `আসসালামু আলাইকুম ${ord.buyerName}! প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                                          });
                                        }}
                                        className="flex-1 py-1.5 sm:py-2 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        title="বায়ারকে মেসেজ দিন"
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

new_seller_btn = """                                      {/* 1. Chat Message Button */}
                                      {isCompleted || ord.status === 'cancelled' ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            openChatWindow({
                                              id: `chat-order-${ord.id}`,
                                              orderId: ord.id,
                                              senderName: ord.buyerName,
                                              senderRole: "customer",
                                              isClosed: true,
                                              isReadOnly: true,
                                              initialMessage: `আসসালামু আলাইকুম ${ord.buyerName}! প্রজেক্ট #${ord.id.slice(-6)} এর মেসেজিং সংরক্ষিত রয়েছে।`
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
                                              senderName: ord.buyerName,
                                              senderRole: "customer",
                                              initialMessage: `আসসালামু আলাইকুম ${ord.buyerName}! প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                                            });
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                          title="বায়ারকে মেসেজ দিন"
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

if old_seller_btn in code:
    code = code.replace(old_seller_btn, new_seller_btn, 1)
    print("3. Replaced Seller chat button")
else:
    print("3. Failed to find Seller chat button")

# 4. Update Modal Chat Button (around line 14209)
old_modal_btn = """                  <button
                    type="button"
                    onClick={() => {
                      setViewingOrderDetails(null);
                      openChatWindow({
                        id: `chat-order-${viewingOrderDetails.id}`,
                        orderId: viewingOrderDetails.id,
                        senderName: viewingOrderDetails.buyerName,
                        senderRole: "customer",
                        initialMessage: `আসসালামু আলাইকুম ${viewingOrderDetails.buyerName}! প্রজেক্ট #${viewingOrderDetails.id.slice(-6)} ("${viewingOrderDetails.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                      });
                    }}
                    className="py-2 px-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                    <span>মেসেজ দিন</span>
                  </button>"""

new_modal_btn = """                  {viewingOrderDetails.status === 'completed' || viewingOrderDetails.status === 'cancelled' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setViewingOrderDetails(null);
                        openChatWindow({
                          id: `chat-order-${viewingOrderDetails.id}`,
                          orderId: viewingOrderDetails.id,
                          senderName: viewingOrderDetails.buyerName,
                          senderRole: "customer",
                          isClosed: true,
                          isReadOnly: true,
                          initialMessage: `আসসালামু আলাইকুম ${viewingOrderDetails.buyerName}! প্রজেক্ট #${viewingOrderDetails.id.slice(-6)} এর মেসেজিং সংরক্ষিত রয়েছে।`
                        });
                      }}
                      className="py-2 px-3 bg-slate-600 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                      title="চ্যাট বন্ধ (নতুন অর্ডার ছাড়া মেসেজ দেওয়া যাবে না)"
                    >
                      <Lock className="w-3.5 h-3.5 text-white/80" />
                      <span>চ্যাট বন্ধ</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setViewingOrderDetails(null);
                        openChatWindow({
                          id: `chat-order-${viewingOrderDetails.id}`,
                          orderId: viewingOrderDetails.id,
                          senderName: viewingOrderDetails.buyerName,
                          senderRole: "customer",
                          initialMessage: `আসসালামু আলাইকুম ${viewingOrderDetails.buyerName}! প্রজেক্ট #${viewingOrderDetails.id.slice(-6)} ("${viewingOrderDetails.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                        });
                      }}
                      className="py-2 px-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                      <span>মেসেজ দিন</span>
                    </button>
                  )}"""

if old_modal_btn in code:
    code = code.replace(old_modal_btn, new_modal_btn, 1)
    print("4. Replaced Modal chat button")
else:
    print("4. Failed to find Modal chat button")

# 5. Update Buyer Payment History mapping (line 10471)
old_trx_map = """                                   const orderTransactions = allBuyerOrders.map((ord, idx) => ({
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

new_trx_map = """                                   const orderTransactions = allBuyerOrders.map((ord, idx) => {
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

if old_trx_map in code:
    code = code.replace(old_trx_map, new_trx_map, 1)
    print("5. Replaced Buyer orderTransactions map")
else:
    print("5. Failed to find Buyer orderTransactions map")

# 6. Update Buyer Payment History Badge (lines 10626-10632)
old_trx_badge = """                                           <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                                             trx.isEscrow
                                               ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                               : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                           }`}>
                                             {trx.status}
                                           </span>"""

new_trx_badge = """                                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                             trx.isCancelled
                                               ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                                               : trx.isEscrow
                                               ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                               : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                           }`}>
                                             {trx.status}
                                           </span>"""

if old_trx_badge in code:
    code = code.replace(old_trx_badge, new_trx_badge, 1)
    print("6. Replaced Buyer transaction badge")
else:
    print("6. Failed to find Buyer transaction badge")

with open("src/components/MarketplaceSection.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Finished applying updates to MarketplaceSection.tsx")
