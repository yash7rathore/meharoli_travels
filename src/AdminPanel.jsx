import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export default function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [enquiries, setEnquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("enquiries"); // 'enquiries' or 'reviews'

  // Simple Admin Authentication Passcode check (meharoli123)
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "meharoli123" || passcode === "admin123") {
      setIsAuthenticated(true);
      setAuthError("");
      localStorage.setItem("meharoli_admin_auth", "true");
    } else {
      setAuthError("Incorrect Admin PIN / Password. Please try again.");
    }
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("meharoli_admin_auth");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Listen to Firestore Enquiries in Real-time
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
      const unsubscribeEnquiries = onSnapshot(
        q,
        (snapshot) => {
          const docsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEnquiries(docsData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching enquiries:", error);
          setLoading(false);
        }
      );

      // Listen to Firestore Reviews in Real-time
      const qReviews = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const unsubscribeReviews = onSnapshot(
        qReviews,
        (snapshot) => {
          const revsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(revsData);
        },
        (err) => console.error("Error fetching reviews:", err)
      );

      return () => {
        unsubscribeEnquiries();
        unsubscribeReviews();
      };
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update Enquiry Status in Firestore
  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      const enquiryRef = doc(db, "enquiries", enquiryId);
      await updateDoc(enquiryRef, { status: newStatus });
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  // Delete Enquiry from Firestore
  const handleDelete = async (enquiryId, clientName) => {
    if (window.confirm(`Are you sure you want to delete enquiry from "${clientName}"?`)) {
      try {
        await deleteDoc(doc(db, "enquiries", enquiryId));
      } catch (error) {
        alert("Error deleting entry: " + error.message);
      }
    }
  };

  // Review Status Approval Handler
  const handleReviewStatus = async (reviewId, newStatus) => {
    try {
      await updateDoc(doc(db, "reviews", reviewId), { status: newStatus });
    } catch (error) {
      alert("Error updating review status: " + error.message);
    }
  };

  // Delete Review Handler
  const handleDeleteReview = async (reviewId, authorName) => {
    if (window.confirm(`Are you sure you want to delete review by "${authorName}"?`)) {
      try {
        await deleteDoc(doc(db, "reviews", reviewId));
      } catch (error) {
        alert("Error deleting review: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("meharoli_admin_auth");
    setIsAuthenticated(false);
  };

  // Filtering enquiries based on status and search query
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.phone && item.phone.includes(searchLower)) ||
      (item.destination && item.destination.toLowerCase().includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => !e.status || e.status === "New").length;
  const confirmedCount = enquiries.filter((e) => e.status === "Confirmed").length;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-500/20 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
          >
            ✕
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-500/10 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-3 border border-orange-500/30">
              🔐
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-800">Admin Login</h2>
            <p className="text-xs text-gray-500 mt-1">Meharoli Tours &amp; Travels Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Enter Admin PIN / Password
              </label>
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm outline-none transition"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-600 transition cursor-pointer text-sm"
            >
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900 text-slate-100 flex flex-col overflow-hidden animate-fadeIn">
      {/* Admin Navbar Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg border border-orange-500/30">
            📊
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg font-serif text-white leading-tight">
              Meharoli Travels — Admin Control Center
            </h1>
            <p className="text-[11px] text-orange-400 font-medium">
              🔥 Firebase Real-time Database Connected
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition"
          >
            Close ✕
          </button>
        </div>
      </header>

      {/* Admin Body Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                📩
              </div>
              <div>
                <span className="text-2xl font-black text-white">{totalCount}</span>
                <p className="text-xs text-slate-400 font-medium">Total Enquiries</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-2xl">
                🔴
              </div>
              <div>
                <span className="text-2xl font-black text-rose-400">{newCount}</span>
                <p className="text-xs text-slate-400 font-medium">New / Pending</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl">
                🟢
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">{confirmedCount}</span>
                <p className="text-xs text-slate-400 font-medium">Confirmed Bookings</p>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl">
                💳
              </div>
              <div>
                <span className="text-2xl font-black text-amber-400">Razorpay</span>
                <p className="text-xs text-slate-400 font-medium">Online Payments</p>
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("enquiries")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "enquiries"
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              <span>📩 Client Enquiries</span>
              <span className="bg-slate-900 px-2 py-0.5 rounded-full text-xs font-mono">
                {enquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              <span>⭐ Customer Reviews</span>
              {reviews.filter((r) => r.status === "Pending").length > 0 && (
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-mono font-bold animate-pulse">
                  {reviews.filter((r) => r.status === "Pending").length} New
                </span>
              )}
            </button>
          </div>

          {activeTab === "enquiries" ? (
            <>
              {/* Search & Filter Bar */}
              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by client name, phone number, destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs text-slate-400 font-medium shrink-0">Filter:</span>
                  {["All", "New", "Contacted", "Confirmed", "Cancelled"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        filterStatus === st
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-slate-900 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enquiries List Section */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-5 py-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-950/40">
                  <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>📋 Live Customer Enquiries</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({filteredEnquiries.length} entries found)
                    </span>
                  </h2>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-slate-400 text-sm animate-pulse">
                    ⏳ Loading enquiries from Firebase Realtime Database...
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <p className="text-lg font-bold mb-1">No enquiries found</p>
                    <p className="text-xs text-slate-500">
                      {searchQuery || filterStatus !== "All"
                        ? "Try clearing your search filters."
                        : "When clients submit the form on the website, they will appear here instantly!"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/60">
                    {filteredEnquiries.map((enq) => {
                      const dateStr = enq.createdAt?.seconds
                        ? new Date(enq.createdAt.seconds * 1000).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : enq.dateSubmitted || "Just now";

                      const currentSt = enq.status || "New";

                      return (
                        <div
                          key={enq.id}
                          className="p-4 sm:p-5 hover:bg-slate-800/60 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                        >
                          {/* Left info */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm sm:text-base text-white">
                                {enq.name || "Anonymous Guest"}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                📅 {dateStr}
                              </span>
                              {/* Status Badge */}
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  currentSt === "New"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                    : currentSt === "Contacted"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : currentSt === "Confirmed"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-slate-700 text-slate-300 border-slate-600"
                                }`}
                              >
                                ● {currentSt}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                              {enq.phone && (
                                <span className="font-mono">📞 {enq.phone}</span>
                              )}
                              {enq.email && (
                                <span>✉️ {enq.email}</span>
                              )}
                              {enq.destination && (
                                <span className="text-orange-400 font-semibold">
                                  📍 Tour: {enq.destination}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-1">
                              {enq.travel_date && (
                                <span>🗓️ Travel Date: <strong className="text-slate-200">{enq.travel_date}</strong></span>
                              )}
                              {enq.travellers && (
                                <span>👥 Travellers: <strong className="text-slate-200">{enq.travellers}</strong></span>
                              )}
                            </div>

                            {enq.message && (
                              <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 mt-2 italic">
                                "{enq.message}"
                              </p>
                            )}
                          </div>

                          {/* Right Quick Actions */}
                          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-700/60">
                            {enq.phone && (
                              <>
                                <a
                                  href={`tel:${enq.phone}`}
                                  className="flex-1 lg:flex-none text-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition"
                                >
                                  📞 Call
                                </a>
                                <a
                                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hi ${enq.name}, thank you for inquiring with Meharoli Tours & Travels for your ${enq.destination || "Rajasthan"} trip! How can we assist you?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 lg:flex-none text-center px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                                >
                                  💬 WhatsApp
                                </a>
                              </>
                            )}

                            {/* Status selector dropdown */}
                            <select
                              value={currentSt}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                              className="bg-slate-900 text-xs font-semibold text-white border border-slate-700 rounded-xl px-2.5 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                              <option value="New">Status: New 🔴</option>
                              <option value="Contacted">Status: Contacted 🟡</option>
                              <option value="Confirmed">Status: Confirmed 🟢</option>
                              <option value="Cancelled">Status: Cancelled ⚪</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDelete(enq.id, enq.name)}
                              className="px-2.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 text-xs transition"
                              title="Delete entry"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── REVIEWS MANAGEMENT TAB ── */
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-950/40">
                <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>⭐ Customer Reviews Approval</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({reviews.length} total reviews submitted)
                  </span>
                </h2>
              </div>

              {reviews.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p className="text-lg font-bold mb-1">No customer reviews submitted yet</p>
                  <p className="text-xs text-slate-500">
                    When customers submit reviews on the website, they will appear here for your approval!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/60">
                  {reviews.map((rev) => {
                    const revDate = rev.createdAt?.seconds
                      ? new Date(rev.createdAt.seconds * 1000).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Recently";

                    const isApproved = rev.status === "Approved";
                    const isPending = !rev.status || rev.status === "Pending";

                    return (
                      <div
                        key={rev.id}
                        className="p-4 sm:p-5 hover:bg-slate-800/60 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-white">
                              {rev.name} ({rev.city})
                            </span>
                            <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {"★".repeat(rev.rating || 5)} ({rev.rating}/5)
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isApproved
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : isPending
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
                                  : "bg-slate-700 text-slate-400 border-slate-600"
                              }`}
                            >
                              ● {rev.status || "Pending"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              📅 {revDate}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 italic mt-1">
                            "{rev.text}"
                          </p>
                        </div>

                        {/* Approval Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                          {!isApproved ? (
                            <button
                              type="button"
                              onClick={() => handleReviewStatus(rev.id, "Approved")}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                            >
                              <span>🟢 Approve &amp; Publish</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReviewStatus(rev.id, "Rejected")}
                              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                              <span>🟡 Hide Review</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id, rev.name)}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 text-xs font-bold transition cursor-pointer"
                            title="Delete review"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
