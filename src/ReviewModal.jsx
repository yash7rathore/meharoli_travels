import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReviewModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Please enter your name and review text.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get initials for avatar badge
      const nameParts = name.trim().split(" ");
      const avatar =
        nameParts.length > 1
          ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
          : nameParts[0].substring(0, 2).toUpperCase();

      await addDoc(collection(db, "reviews"), {
        name: name.trim(),
        city: city.trim() || "India",
        rating: Number(rating),
        text: text.trim(),
        avatar: avatar,
        status: "Pending", // Requires Admin Approval
        createdAt: serverTimestamp(),
      });

      alert(
        "Thank you for your review! ⭐\nYour feedback has been submitted successfully and will appear on the website once approved by our team."
      );
      setName("");
      setCity("");
      setRating(5);
      setText("");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-orange-500/20 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-2 border border-amber-500/30">
            ⭐
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-800">
            Write a Customer Review
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Share your travel experience with Meharoli Tours &amp; Travels
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Jaipur, Delhi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm outline-none"
              />
            </div>
          </div>

          {/* Interactive Star Rating Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Review / Feedback *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about your cab driver, hotel stay, guided tour, punctuality..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-orange-500/30 transition cursor-pointer text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Submitting Review..." : "Submit Review ⭐"}
          </button>
        </form>
      </div>
    </div>
  );
}
