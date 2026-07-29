import { useEffect, useRef, useState } from "react";
import "./App.css";
import emailjs from '@emailjs/browser';

const jaipurSlides = [
  "/pictures/main-section/Jaipur_1.jpg",
  "/pictures/main-section/Jaipur_2.jpg",
  "/pictures/main-section/Jaipur_3.jpg",
  "/pictures/main-section/Jaipur_4.jpg",
  "/pictures/main-section/Jaipur_5.jpg",
  "/pictures/main-section/Jaipur_6.jpg",
  "/pictures/main-section/Jaipur_7.jpg",
];

function App() {
  const whatsappNumber = "918824976479"; // TODO: replace with real WhatsApp number
  const carScrollRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % jaipurSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollCars = (dir) => {
    if (carScrollRef.current) {
      carScrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  const scrollToForm = () => {
    const formSection = document.getElementById("enquiry-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  const handlePackageEnquiry = (pkgName) => {
    const packageInput = document.getElementById("package-name-field");
    if (packageInput) {
      packageInput.value = pkgName;
      packageInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    scrollToForm();
  };

  const packages = [
    {
      id: 1,
      name: "Jaipur City Highlights",
      tag: "Pink City",
      destinations: ["Hawa Mahal", "City Palace", "Jantar Mantar"],
      //priceFrom: "₹7,499",
      image: "/pictures/lalitajapa-jaipur-7798509_1920.jpg",
    },
    {
      id: 2,
      name: "Amer Fort & Lakeside",
      tag: "Heritage",
      destinations: ["Amer Fort", "Jal Mahal", "Nahargarh"],
      //priceFrom: "₹8,999",
      image: "/pictures/main-section/Jaipur_2.jpg",
    },
    {
      id: 3,
      name: "Jaipur Nights & Bazaars",
      tag: "Markets",
      destinations: ["Johari Bazaar", "Bapu Bazaar", "Chokhi Dhani"],
      //priceFrom: "₹9,499",
      image: "/pictures/main-section/Jaipur_3.jpg",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Hotels & Stays",
      description:
        "Handpicked stays in Jaipur from budget-friendly hotels to premium heritage properties.",
      image: "/pictures/lalitajapa-jaipur-7798509_1920.jpg",
    },
    {
      id: 2,
      title: "Tourist Attractions",
      description:
        "Guided visits to Hawa Mahal, Amer Fort, City Palace, Jantar Mantar and more.",
      image: "/pictures/main-section/Jaipur_4.jpg",
    },
    {
      id: 3,
      title: "Local Experiences",
      description:
        "Food walks, cultural shows and authentic Rajasthani experiences curated for you.",
      image: "/pictures/main-section/Jaipur_5.jpg",
    },
    {
      id: 4,
      title: "Transport & Travel Tips",
      description:
        "Airport and railway station transfers, local cabs and personalised assistance.",
      image: "/pictures/main-section/Jaipur_6.jpg",
    },
  ];

  const whyJaipur = [
    {
      id: 1,
      title: "Reliable Travel Partner",
      description:
        "Local Jaipur specialists crafting well-planned, hassle-free holidays.",
      image: "/pictures/lalitajapa-jaipur-7798509_1920.jpg",
    },
    {
      id: 2,
      title: "Premium Support",
      description:
        "Dedicated trip coordinator and on-ground support throughout your stay.",
      image: "/pictures/main-section/Jaipur_7.jpg",
    },
    {
      id: 3,
      title: "Secure & Transparent",
      description:
        "Clear inclusions, no hidden costs and secure payment options.",
      image: "/pictures/main-section/Jaipur_2.jpg",
    },
    {
      id: 4,
      title: "Customer Friendly",
      description:
        "Custom itineraries for families, couples, and groups of all sizes.",
      image: "/pictures/main-section/Jaipur_4.jpg",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      city: "Delhi",
      rating: 5,
      text: "Meharoli Tours and Travels made our Jaipur trip absolutely magical! The hotel was perfect, the guide was knowledgeable and everything was seamlessly organized. Highly recommended!",
      avatar: "PS",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      city: "Mumbai",
      rating: 5,
      text: "Booked a 4-day Jaipur package for our family of 6. The cabs were comfortable, AC was working, and the driver was very professional. Will definitely book again!",
      avatar: "RM",
    },
    {
      id: 3,
      name: "Sunita & Vikram",
      city: "Bengaluru",
      rating: 5,
      text: "Our honeymoon in Jaipur was beyond expectations. The team arranged a heritage property stay, candle-light dinner and private fort tour. Simply wonderful.",
      avatar: "SV",
    },
    {
      id: 4,
      name: "Anjali Patil",
      city: "Pune",
      rating: 5,
      text: "Very transparent pricing — no hidden charges at all. The itinerary covered all major attractions and we had plenty of free time too. Great experience overall!",
      avatar: "AP",
    },
    {
      id: 5,
      name: "Deepak Agarwal",
      city: "Hyderabad",
      rating: 5,
      text: "The WhatsApp support was quick and very helpful. They customised the trip according to our budget and we got more than what we expected. 5 stars!",
      avatar: "DA",
    },
    {
      id: 6,
      name: "Neha Joshi",
      city: "Ahmedabad",
      rating: 5,
      text: "Travelled with my parents for the first time and Meharoli Tours and Travels took care of everything. Senior-friendly hotels, easy pace itinerary and a very caring driver. Truly stress-free!",
      avatar: "NJ",
    },
  ];

  const cars = [
  {
    id: 1,
    name: "Maruti Dzire",
    type: "Sedan",
    capacity: "4 Passengers",
    ac: true,
    color: "#0891b2",
    image: "pictures/cars/dzire.jpeg",
    features: ["AC", "Luggage Space", "Music System"],
  },
  {
    id: 2,
    name: "Maruti Ertiga",
    type: "MPV",
    capacity: "6 Passengers",
    ac: true,
    color: "#0891b2",
    image: "pictures/cars/ertiga.jpeg",
    features: ["AC", "Luggage Space", "Music System"],
  },
  {
    id: 3,
    name: "Toyota Innova",
    type: "SUV",
    capacity: "6 Passengers",
    ac: true,
    color: "#059669",
    image: "pictures/cars/innova.jpeg",
    features: ["AC", "Premium Seats", "GPS", "USB Charging"],
  },
  {
    id: 4,
    name: "Toyota Crysta",
    type: "Premium SUV",
    capacity: "7 Passengers",
    ac: true,
    color: "#d97706",
    image: "pictures/cars/crysta.jpeg",
    features: ["AC", "Luxury Interior", "GPS", "USB Charging"],
  },
  {
    id: 5,
    name: "Tempo Traveller",
    type: "Mini Coach",
    capacity: "12–17 Passengers",
    ac: true,
    color: "#db2777",
    image: "pictures/cars/traveller.jpeg",
    features: ["AC", "Wide Seats", "Luggage Rack", "Music System"],
  },
  {
    id: 6,
    name: "Luxury Coach",
    type: "Bus",
    capacity: "30+ Passengers",
    ac: true,
    color: "#7c3aed",
    image: "pictures/cars/volvo.jpeg",
    features: ["AC", "Recliner Seats", "Onboard TV", "Restroom"],
  },
];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <img
            src="/pictures/main-section/guru_kripa.png"
            alt="Guru Kripa"
            className="guru-kripa-img"
          />
          <a
            href="#top"
            className="header-brand"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/pictures/main-section/logo-removebg-preview.png"
              alt="Meharoli Tours Logo"
              className="header-logo"
            />
            <div className="header-brand-text">
              <span className="header-brand-name">
                Mehar<span className="header-o">O</span>li
              </span>
              <span className="header-brand-sub">Tours &amp; Travels</span>
            </div>
          </a>

          <nav
            className={`header-nav${menuOpen ? " open" : ""}`}
            aria-label="Main navigation"
          >
            <a
              href="#top"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#packages"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Packages
            </a>
            <a
              href="#double-decker-package"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Double Decker
            </a>
            <a
              href="#cars"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Cars
            </a>
            <a
              href="#services"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Reviews
            </a>
            <a
              href="#about"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#enquiry-form-section"
              className="nav-item nav-cta"
              onClick={() => setMenuOpen(false)}
            >
              Book Now
            </a>
          </nav>

          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="h-line" />
            <span className="h-line" />
            <span className="h-line" />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        {/* Decorative background blobs */}
        <div className="hero-bg-effects" aria-hidden="true">
          <div className="hero-blob b1" />
          <div className="hero-blob b2" />
          <div className="hero-blob b3" />
          <div className="hero-dots" />
          {/* Travel ambience: clouds + stars */}
          <div className="travel-fx" aria-hidden="true">
            {/* Drifting clouds – left to right */}
            <div className="cloud cloud-1" />
            <div className="cloud cloud-2" />
            <div className="cloud cloud-3" />
            <div className="cloud cloud-4" />
            {/* Twinkling stars */}
            <div className="star s1" />
            <div className="star s2" />
            <div className="star s3" />
            <div className="star s4" />
            <div className="star s5" />
            <div className="star s6" />
            <div className="star s7" />
            <div className="star s8" />
          </div>
        </div>

        {/* Left – branding & CTA */}
        <div className="hero-left">
          <span className="hero-badge">
            ⭐ Rajasthan Certified Travel Partner
          </span>
          <h1 className="hero-title">
            <span aria-hidden="true">
              <span className="hero-title-line line-1">
                {"Mehar"}
                <span className="title-o-letter">
                  O
                  <img
                    src="/pictures/main-section/logo-removebg-preview.png"
                    alt=""
                    className="title-o-logo"
                  />
                </span>
                {"li"}
              </span>
              <span className="hero-title-line line-3">
                Tours &amp; Travels
              </span>
            </span>
            <span className="sr-only">Meharoli Tours and Travels</span>
          </h1>
          <p className="hero-tagline">
            Your trusted guide to Jaipur &amp; Rajasthan — crafting
            unforgettable journeys since 2004.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>1000+</strong>
              <small>Happy Clients</small>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>20+</strong>
              <small>Years Experience</small>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>4.9★</strong>
              <small>Google Rating</small>
            </div>
          </div>
          <div className="hero-cta-row">
            <button
              type="button"
              className="btn primary"
              onClick={() =>
                openWhatsApp(
                  "Hi Meharoli Tours and Travels, I would like to plan my Jaipur trip.",
                )
              }
            >
              Plan My Trip
            </button>
            <a href="#packages" className="btn ghost">
              View Packages
            </a>
          </div>
        </div>

        {/* Right – photo carousel */}
        <div className="hero-right">
          <div className="hero-img-wrap">
            {jaipurSlides.map((src, i) => (
              <img
                key={src}
                className={`hero-img${i === heroSlide ? " active" : ""}`}
                src={src}
                alt={`Jaipur - view ${i + 1}`}
              />
            ))}
            <div className="hero-img-badge">
              <strong>20+</strong>
              <small>Years of Experience</small>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section className="highlights" aria-label="Why travel with Meharoli">
          <div className="highlights-strip">
            <div className="highlights-track">
              <div className="highlight-item">⭐ Best Price Guaranteed</div>
              <div className="highlight-item">🕐 24/7 Customer Support</div>
              <div className="highlight-item">
                🛡️ 100% Secure &amp; Covid Safety
              </div>
              <div className="highlight-item">🌟 4.9 Star Google Reviews</div>
              <div className="highlight-item">🏆 20+ Years of Experience</div>
              <div className="highlight-item">
                💳 Pay Online with Card &amp; UPI
              </div>
              {/* duplicate for seamless loop */}
              <div className="highlight-item" aria-hidden="true">
                ⭐ Best Price Guaranteed
              </div>
              <div className="highlight-item" aria-hidden="true">
                🕐 24/7 Customer Support
              </div>
              <div className="highlight-item" aria-hidden="true">
                🛡️ 100% Secure &amp; Covid Safety
              </div>
              <div className="highlight-item" aria-hidden="true">
                🌟 4.9 Star Google Reviews
              </div>
              <div className="highlight-item" aria-hidden="true">
                🏆 20+ Years of Experience
              </div>
              <div className="highlight-item" aria-hidden="true">
                💳 Pay Online with Card &amp; UPI
              </div>
            </div>
          </div>
        </section>

        <div className="enquiry-fullbleed">
          <section className="enquiry" id="enquiry-form-section">
            <div className="section-heading">
              <h2>Send an Enquiry</h2>
              <p>
                Share a few details and we will get back with a customised quote
                and itinerary suggestions.
              </p>
            </div>
            <div className="enquiry-layout">
              <form
  className="enquiry-form"
  onSubmit={(e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      destination: e.target.destination.value,
      travel_date: e.target['travel-date'].value,
      travellers: e.target.travellers.value,
      message: e.target.message.value,
    };

    emailjs
      .send(
        'service_ddemm88',       // replace with your Service ID
        'template_io5ljmk',      // replace with your Template ID
        formData,
        '9AJfyV2Fy_U8DRKyi'        // replace with your Public Key
      )
      .then(() => {
        alert('Thank you! Your enquiry has been received. We will contact you shortly.');
        e.target.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert('Something went wrong. Please try WhatsApp or call us directly.');
      });
  }}
>
                <div className="form-row two-cols">
                  <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="form-row two-cols">
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="destination">Destination / Tour</label>
                    <input
                      id="destination"
                      name="destination"
                      type="text"
                      placeholder="e.g. Jaipur Day Tour"
                    />
                  </div>
                </div>
                <div className="form-row two-cols">
                  <div className="form-field">
                    <label htmlFor="travel-date">Travel Date</label>
                    <input id="travel-date" name="travel-date" type="date" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="travellers">Number of Travellers</label>
                    <input
                      id="travellers"
                      name="travellers"
                      type="number"
                      min="1"
                      placeholder="2"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="message">Additional details (optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    placeholder="Share preferences like dates, hotel category, or special requests"
                  ></textarea>
                </div>

                <button type="submit" className="btn primary full">
                  Submit enquiry
                </button>
              </form>
            </div>
          </section>
        </div>
        {/* end enquiry-fullbleed */}

        {/* ── SPECIAL DOUBLE DECKER PACKAGE ── */}
        <section className="jaipur-details" id="double-decker-package">
          <div className="jaipur-details-inner">
            <div className="jaipur-banner">
              <img
                className="decker-static-img"
                src="/pictures/Double decker.png"
                alt="Double Decker Bus - Jaipur Tour"
              />
              <div className="decker-badge">
                🚌 Special Double Decker Package
              </div>
              <p className="jaipur-banner-text">
                Explore the Pink City like never before — from the open-top
                upper deck of our iconic Double Decker bus, cruise through royal
                forts, bazaars and palaces with the wind in your hair.
              </p>
              <p className="decker-price-tag">
                Starting at <strong>₹200 (Non-AC) / ₹300 (AC)</strong> / person
              </p>
              <button
                type="button"
                className="btn primary jaipur-banner-btn"
                onClick={() =>
                  handlePackageEnquiry("Special Double Decker Package")
                }
              >
                Book Double Decker Tour
              </button>
            </div>
          </div>
        </section>

        <section className="packages" id="packages">
          <div className="section-heading">
            <h2>Featured Holiday Packages</h2>
            <p>
              Carefully designed bundles including stays, sightseeing, meals and
              comfortable cabs, so you only focus on enjoying the journey.
            </p>
          </div>
          <div className="packages-carousel-wrap">
            <div className="packages-grid">
              {packages.map((pkg) => (
                <article key={pkg.id} className="package-card">
                  <div
                    className="package-image"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${pkg.image})` }}
                  >
                    <div className="package-badge">{pkg.tag}</div>
                  </div>
                  <div className="package-body">
                    <h3>{pkg.name}</h3>
                    <p className="package-destinations">
                      Destinations: {pkg.destinations.join(" · ")}
                    </p>
                    <ul className="package-includes">
                      <li>Comfortable hotels</li>
                      <li>Private cab transfers</li>
                      <li>Guided sightseeing</li>
                      <li>Breakfast & selected meals</li>
                    </ul>
                    <div className="package-actions">
                      <button
                        type="button"
                        className="btn primary full"
                        onClick={() => handlePackageEnquiry(pkg.name)}
                      >
                        Send enquiry
                      </button>
                      <button
                        type="button"
                        className="btn ghost full"
                        onClick={() =>
                          openWhatsApp(
                            `Hi Meharoli Tours and Travels, I want to know more about the ${pkg.name} package.`,
                          )
                        }
                      >
                        WhatsApp about this
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="testimonials" id="testimonials">
          <div className="section-heading">
            <h2>What Our Travellers Say</h2>
            <p>
              Thousands of happy travellers have explored Jaipur with us.
              Here&apos;s what some of them had to share.
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonials-track">
              {testimonials.map((t) => (
                <article key={t.id} className="testimonial-card">
                  <div className="testimonial-stars">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                  <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-city">{t.city}</div>
                    </div>
                  </div>
                </article>
              ))}
              {/* duplicate for seamless mobile loop */}
              {testimonials.map((t) => (
                <article
                  key={`d-${t.id}`}
                  className="testimonial-card"
                  aria-hidden="true"
                >
                  <div className="testimonial-stars">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                  <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-city">{t.city}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARS ── */}
        <section className="cars-section" id="cars">
          <div className="section-heading">
            <h2>Book a Vehicle</h2>
            <p>
              Choose from our well-maintained fleet of AC vehicles — ideal for
              solo travellers, families and large groups.
            </p>
          </div>
          <div className="cars-carousel-wrapper">
            <button
              type="button"
              className="cars-scroll-btn left"
              onClick={() => scrollCars(-1)}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <div className="cars-carousel" ref={carScrollRef}>
              {cars.map((car) => (
                <article key={car.id} className="car-card">
                  <div className="car-card-top" style={{ background: car.color }}>
  <img
    src={car.image}
    alt={car.name}
    className="car-card-img"
    onError={(e) => { e.target.style.display = 'none'; }}
  />
  <span className="car-type-badge">{car.type}</span>
</div>
                  <div className="car-card-body">
                    <h3 className="car-name">{car.name}</h3>
                    <p className="car-capacity">👥 {car.capacity}</p>
                    <ul className="car-features">
                      {car.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <p className="car-price">From {car.priceFrom}</p>
                    <button
                      type="button"
                      className="btn primary full"
                      onClick={() =>
                        openWhatsApp(
                          `Hi Meharoli Tours and Travels, I want to book a ${car.name} (${car.type}) for my Jaipur trip.`,
                        )
                      }
                    >
                      Book Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <button
              type="button"
              className="cars-scroll-btn right"
              onClick={() => scrollCars(1)}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </section>

        {/* ── RAJASTHAN TOURISM CERTIFICATE ── */}
        <section className="cert-section">
          <div className="cert-inner">
            <div className="cert-badge-wrap">
              <div className="cert-badge">
                <div className="cert-badge-seal">🏛</div>
                <div className="cert-badge-text">
                  <span className="cert-badge-title">
                    Certified &amp; Recognized
                  </span>
                  <span className="cert-badge-sub">
                    Rajasthan Tourism Department
                  </span>
                </div>
              </div>
            </div>
            <div className="cert-content">
              <h2>Trusted by Rajasthan Tourism</h2>
              <p>
                Meharoli Tours and Travels is an officially recognized travel
                operator under the <strong>Rajasthan Tourism Department</strong>
                , Government of Rajasthan. Our registration ensures you travel
                with a licensed, accountable and government-verified agency.
              </p>
              <ul className="cert-points">
                <li>✅ Licensed under Rajasthan Tourism Act</li>
                <li>✅ Verified guides &amp; certified drivers</li>
                <li>✅ Insured vehicles &amp; passengers</li>
                <li>✅ Complaint redressal through Tourism Helpline</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="services" id="services">
          <div className="section-heading services-heading">
            <h2>Complete Traveling Services</h2>
            <p>
              Plan as you want to. Book hotels, sightseeing and transport the
              way you like with fully customisable options.
            </p>
          </div>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.id} className="service-card">
                <div
                  className="service-icon"
                  aria-hidden="true"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-jaipur" id="about">
          <div className="about-jaipur-inner">
            <div className="about-jaipur-text">
              <h2>About Jaipur Tourism</h2>
              <p>
                Known as the "Pink City", Jaipur blends royal palaces, bustling
                bazaars and colourful streets with warm Rajasthani hospitality.
              </p>
              <p>
                From the iconic Hawa Mahal and Amer Fort to serene lakes and
                vibrant markets, Jaipur offers a perfect mix of history, culture
                and photo-worthy spots for every traveller.
              </p>
              <p>
                Whether you are planning a short weekend escape or an extended
                Rajasthan circuit, Meharoli Tours and Travels designs Jaipur
                holidays that match your pace and budget.
              </p>
              <button
                type="button"
                className="btn primary about-btn"
                onClick={() =>
                  openWhatsApp(
                    "Hi Meharoli Tours and Travels, I want to talk to a Jaipur travel expert.",
                  )
                }
              >
                Talk to an Expert
              </button>
            </div>
            <div className="about-jaipur-image" aria-hidden="true">
              <div className="about-jaipur-photo" />
            </div>
          </div>
        </section>

        <section className="why-jaipur">
          <div className="section-heading services-heading">
            <h2>Why Book Jaipur With Us</h2>
            <p>
              Enjoy expert planning, trusted local partners and end-to-end trip
              support so you can relax and soak in the Pink City.
            </p>
          </div>
          <div className="why-grid">
            {whyJaipur.map((item) => (
              <article key={item.id} className="why-card">
                <div
                  className="why-icon"
                  aria-hidden="true"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <h3 className="why-title">{item.title}</h3>
                <p className="why-description">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo-mark">MT</div>
            <div>
              <div className="brand-name">Meharoli Tours and Travels</div>
              <div className="brand-tagline">
                Jaipur &amp; Rajasthan specialists
              </div>
            </div>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h4>Jaipur Packages</h4>
              <ul>
                <li>Weekend Pink City Getaway</li>
                <li>Jaipur with Amer &amp; Nahargarh</li>
                <li>Jaipur, Ajmer &amp; Pushkar</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <ul>
                <li>Dilip Singh Meharoli: +91 9829017853</li>
                <li>Namrata Shekhawat: +91 88249 76479</li>
                <li>Yashwant Rathore : +91 97844 91826</li>
                <li>Email: meharolitours.travels@gmail.com</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Quick Actions</h4>
              <button
                type="button"
                className="btn primary footer-whatsapp"
                onClick={() =>
                  openWhatsApp(
                    "Hi Meharoli Tours and Travels, I would like to plan my Jaipur holiday.",
                  )
                }
              >
                Chat on WhatsApp
              </button>
              <div className="footer-socials">
                <a
                  href="https://wa.me/918824976479"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.407A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.958 7.958 0 01-4.078-1.123l-.292-.173-3.027.854.855-3.02-.19-.31A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/meharolitourstravels?igsh=MTg3OWtlYjBoZGVqaA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@meharolitoursandtravels?si=uVJoAWQhV00Mt6XQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn youtube"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1ZYMfib2Wd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn facebook"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Meharoli Tours and Travels. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
