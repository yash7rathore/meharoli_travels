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

const destinationsData = {
  delhi: {
    title: "Delhi",
    subtitle: "India's Historic Capital City",
    description: "Explore Delhi, where the ancient past blends seamlessly with a bustling, modern metropolis. From grand Mughal monuments to vibrant street food and markets, Delhi is a sensory adventure.",
    coverImage: "/pictures/delhi.jpg",
    images: [
      "/pictures/delhi.jpg",
      "/pictures/main-section/Jaipur_3.jpg",
      "/pictures/main-section/Jaipur_4.jpg"
    ],
    markets: [
      {
        name: "Chandni Chowk",
        specialty: "Bridal wear, antique jewelry, street food & spices",
        desc: "One of the oldest and busiest markets in Old Delhi, dating back to the Mughal era. Explore its narrow lanes, packed with shops and historic eateries."
      },
      {
        name: "Dilli Haat",
        specialty: "Traditional Indian handicrafts & regional food stalls",
        desc: "An open-air food plaza and craft bazaar run by Delhi Tourism. A perfect, relaxed space to buy authentic handloom clothing and regional crafts."
      },
      {
        name: "Janpath & Sarojini Nagar",
        specialty: "Trendy clothes, accessories, and cheap souvenirs",
        desc: "Perfect for budget-friendly clothing shopping, local handicrafts, brass artifacts, and matching outfits."
      }
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Old Delhi Heritage & Rickshaw Rides",
        details: [
          "Start your morning with a visit to the grand Red Fort (Lal Qila), built by Emperor Shah Jahan.",
          "Explore Jama Masjid, one of the largest mosques in India, offering panoramic views of Old Delhi.",
          "Embark on an exciting cycle rickshaw ride through the chaotic lanes of Chandni Chowk.",
          "Stop at Khari Baoli, Asia's largest wholesale spice market, known for its rich colors and intense aromas."
        ]
      },
      {
        day: "Day 2",
        title: "New Delhi Monuments & Markets",
        details: [
          "Drive past the majestic India Gate, Rashtrapati Bhavan (President's Palace), and Parliament House.",
          "Visit Humayun's Tomb, a UNESCO World Heritage site and the architectural inspiration for the Taj Mahal.",
          "Explore the towering Qutub Minar complex, dating back to the 12th century.",
          "End the day shopping and dining at the upscale Khan Market or browsing traditional crafts at Dilli Haat."
        ]
      }
    ]
  },
  agra: {
    title: "Agra",
    subtitle: "The City of the Taj Mahal",
    description: "Witness the pinnacle of Mughal architecture and design. Home to three UNESCO World Heritage sites, Agra offers a magical dive into romantic royal history.",
    coverImage: "/pictures/agra_tajmahal.jpg",
    images: [
      "/pictures/agra_tajmahal.jpg",
      "/pictures/main-section/Jaipur_2.jpg",
      "/pictures/main-section/Jaipur_5.jpg"
    ],
    markets: [
      {
        name: "Sadar Bazar",
        specialty: "Agra Petha, premium leather footwear, & marble crafts",
        desc: "Agra's premier shopping destination. Bustling with shops selling leather jackets, handcrafted Mojri shoes, brass items, and mouth-watering sweets."
      },
      {
        name: "Kinari Bazar",
        specialty: "Bridal wear, textiles, and local jewelry",
        desc: "A historic wholesale bazaar located near Agra Fort. Great for picking up traditional block prints, colorful fabrics, and local handicrafts."
      },
      {
        name: "Taj Ganj",
        specialty: "Marble inlay replicas & stone carvings",
        desc: "Located right outside the Taj Mahal gates. Watch local artisans construct beautiful Pietra Dura (marble inlay) souvenirs using ancient techniques."
      }
    ],
    itinerary: [
      {
        day: "Same Day / Day 1",
        title: "The Ultimate Taj Sunrise & Agra Fort",
        details: [
          "At sunrise, experience the majestic Taj Mahal when the morning mist rises and the white marble glows in golden hues.",
          "Return to your hotel for breakfast, then visit the massive red sandstone walls of the Agra Fort.",
          "Explore the beautiful tomb of Itimad-ud-Daulah, affectionately known as the 'Baby Taj'.",
          "Catch a sunset view of the Taj Mahal across the river from the Mehtab Bagh gardens.",
          "Spend your evening exploring Sadar Bazar for shopping and enjoying authentic local snacks."
        ]
      }
    ]
  },
  rajasthan: {
    title: "Royal Rajasthan",
    subtitle: "The Land of Kings & Forts",
    description: "Welcome to India's most colorful state. Experience majestic forts perched on hills, romantic lake palaces, golden sand dunes, camel safaris, and rich royal heritage.",
    coverImage: "/pictures/main-section/Jaipur_2.jpg",
    images: [
      "/pictures/main-section/Jaipur_2.jpg",
      "/pictures/udaipur.jpg",
      "/pictures/jodhpur.jpg",
      "/pictures/jaisalmer_desert.jpg",
      "/pictures/bikaner.jpg",
      "/pictures/mandawa.jpg",
      "/pictures/mount_abu.jpg"
    ],
    cities: [
      {
        id: "jaipur",
        name: "Jaipur (Pink City)",
        tagline: "Capital of heritage, palaces, and gems",
        coverImage: "/pictures/main-section/Jaipur_1.jpg",
        markets: [
          {
            name: "Johari Bazar",
            specialty: "Gems, gold jewelry, and handmade tie-dye sarees"
          },
          {
            name: "Bapu Bazar",
            specialty: "Camel leather Mojri shoes, Sanganeri print fabrics, and pottery"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Forts & Royal Views",
            details: [
              "Explore the massive Amer Fort on the hilltop and its stunning Sheesh Mahal (Mirror Palace).",
              "Take a picture at Jal Mahal (Water Palace) in the middle of Man Sagar Lake.",
              "Visit Hawa Mahal (Palace of Winds) with its 953 small windows."
            ]
          },
          {
            day: "Day 2",
            title: "Palace & Observatory",
            details: [
              "Tour the Royal City Palace museum containing rare weapons and textiles.",
              "See the giant stone astronomical instruments at Jantar Mantar (UNESCO site).",
              "Go souvenir shopping at Bapu Bazar and enjoy authentic Rajasthani Thali."
            ]
          }
        ]
      },
      {
        id: "udaipur",
        name: "Udaipur (City of Lakes)",
        tagline: "The Venice of the East",
        coverImage: "/pictures/udaipur.jpg",
        markets: [
          {
            name: "Hathi Pol Bazar",
            specialty: "Miniature Rajasthani paintings and wooden toys"
          },
          {
            name: "Bada Bazar",
            specialty: "Bandhani print fabrics and handmade leather diaries"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Lake Cruise & City Palace",
            details: [
              "Tour the magnificent City Palace complex overlooking Lake Pichola.",
              "Take a sunset boat cruise on Lake Pichola, visiting the iconic Jag Mandir Palace.",
              "Visit Jagdish Temple, a large Hindu temple in the heart of the city."
            ]
          },
          {
            day: "Day 2",
            title: "Royal Gardens & Fortresses",
            details: [
              "Visit Saheliyon-ki-Bari (Garden of the Maids) with fountains and marble elephants.",
              "Take a cable car ride up to Mansapurna Karni Mata temple for panoramic views.",
              "Drive up to the Monsoon Palace (Sajjangarh) for a spectacular panoramic sunset."
            ]
          }
        ]
      },
      {
        id: "jodhpur",
        name: "Jodhpur (Blue City)",
        tagline: "Sun-drenched blue houses and mighty forts",
        coverImage: "/pictures/jodhpur.jpg",
        markets: [
          {
            name: "Clock Tower Market (Sadar Market)",
            specialty: "Hand-ground spices, Mathaniya red chilies, and handicrafts"
          },
          {
            name: "Mochi Bazar",
            specialty: "Intricately embroidered Jodhpuri Mojri shoes"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Mehrangarh Fort & Jaswant Thada",
            details: [
              "Climb Mehrangarh Fort, towering 400 feet above the city with incredible views of blue houses.",
              "Visit Jaswant Thada, a peaceful white marble cenotaph dedicated to Maharaja Jaswant Singh II.",
              "Walk through the blue-painted residential lanes of Old Jodhpur.",
              "Shop at Sadar Market and try the famous Shahi Samosa and Makhaniya Lassi."
            ]
          }
        ]
      },
      {
        id: "jaisalmer",
        name: "Jaisalmer (Golden City)",
        tagline: "Thar desert camping and living sandstone forts",
        coverImage: "/pictures/jaisalmer_desert.jpg",
        markets: [
          {
            name: "Sadar Bazar",
            specialty: "Puppets, camel leather bags, and silver tribal jewelry"
          },
          {
            name: "Bhatia Bazar",
            specialty: "Mirror-work textiles and antique wood carvings"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Sandstone Havelis & Golden Fort",
            details: [
              "Explore Jaisalmer Fort (Sonar Qila), a living fort where 1/4th of the city's population resides.",
              "Visit Patwon ki Haveli, a cluster of five grand havelis with intricate stone lattices.",
              "Take a walk around the serene Gadisar Lake at sunset."
            ]
          },
          {
            day: "Day 2",
            title: "Desert Dunes & Camp Nights",
            details: [
              "Drive to Sam Sand Dunes in the Thar Desert (40 km from Jaisalmer).",
              "Enjoy a thrilling Jeep Dune Bashing session and a camel safari at sunset.",
              "Check into a luxury desert camp, complete with cultural folk dances and buffet dinner."
            ]
          }
        ]
      },
      {
        id: "bikaner",
        name: "Bikaner",
        tagline: "Magnificent red sandstone palaces and desert heritage",
        coverImage: "/pictures/bikaner.jpg",
        markets: [
          {
            name: "Kote Gate Market",
            specialty: "Camel leather goods, Bikaneri bhujia, local sweets, and Kundan jewelry"
          },
          {
            name: "Station Road Market",
            specialty: "Spices, dry fruits, and handloom fabrics"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Junagarh Fort & Karni Mata Temple",
            details: [
              "Visit the massive Junagarh Fort, an un-conquered fort displaying grand royal chambers.",
              "Travel to the unique Karni Mata Temple (Rat Temple) in Deshnoke, known for its sacred white rats.",
              "Tour the National Research Centre on Camel, the largest camel breeding farm in Asia.",
              "Stroll through the heritage Havelis of Old Bikaner and sample famous Bikaneri Bhujia."
            ]
          }
        ]
      },
      {
        id: "mandawa",
        name: "Mandawa",
        tagline: "An open-air art gallery of beautiful historic frescoed Havelis",
        coverImage: "/pictures/mandawa.jpg",
        markets: [
          {
            name: "Mandawa Main Bazar",
            specialty: "Hand-painted wooden items, puppets, antiques, and local paintings"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Heritage Havelis & Fresco Walk",
            details: [
              "Take a guided walk to see the beautifully painted frescoes of Sewaram Saraf Haveli and Ram Pratap Nemani Haveli.",
              "Visit the Mandawa Castle, a beautiful fort-hotel showcasing historic artifacts and weapons.",
              "Explore local art stores where artists practice traditional miniature painting styles."
            ]
          }
        ]
      },
      {
        id: "mount_abu",
        name: "Mount Abu",
        tagline: "Rajasthan's only scenic hill station of lakes and temples",
        coverImage: "/pictures/mount_abu.jpg",
        markets: [
          {
            name: "Nakki Lake Mall Road",
            specialty: "Rajasthani handicrafts, wooden toys, leather artifacts, and warm shawls"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Scenic Nakki Lake & Sunsets",
            details: [
              "Enjoy a relaxing paddle boat ride on the scenic Nakki Lake.",
              "Walk up to Toad Rock, a massive natural boulder shaped like a toad overlooking the lake.",
              "Experience the spectacular panoramic sunset view from Sunset Point."
            ]
          },
          {
            day: "Day 2",
            title: "Dilwara Temples & Peaks",
            details: [
              "Tour the Dilwara Jain Temples, world-famous for their breathtakingly detailed marble carvings.",
              "Drive up to Guru Shikhar, the highest peak of the Aravali Range, for spectacular mountain views.",
              "Visit the serene Achalgarh Fort and its ancient temples."
            ]
          }
        ]
      },
      {
        id: "pushkar",
        name: "Pushkar (Holy Town)",
        tagline: "Sacred ghats, temples, and spiritual bazaars",
        coverImage: "/pictures/pushkar.jpg",
        markets: [
          {
            name: "Pushkar Sadar Bazar",
            specialty: "Spiritual incense, rose waters, hippie clothes, and silver jewelry"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Temple Visits & Lake Ghats",
            details: [
              "Visit the rare 14th-century Lord Brahma Temple, one of the few in the world.",
              "Walk down the 52 sacred ghats of Pushkar Lake to witness local Hindu rituals.",
              "Stroll through the spiritual Sadar Bazar packed with local rose products and handicrafts.",
              "Climb up the Savitri Temple hill (by foot or cable car) for a gorgeous sunset view of the lake."
            ]
          }
        ]
      }
    ]
  }
};

function DestinationDetailView({
  destinationKey,
  activeRajasthanCity,
  setActiveRajasthanCity,
  onClose,
  openWhatsApp,
  scrollToForm
}) {
  const data = destinationsData[destinationKey];
  if (!data) return null;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!data.images || data.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data.images]);

  return (
    <div className="destination-detail-page bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-16 animate-fadeIn">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-orange-600 font-semibold rounded-lg shadow-sm border border-gray-200 transition hover:shadow-md cursor-pointer"
        >
          ← Back to Homepage
        </button>
      </div>

      {/* Hero Banner Section with Slideshow */}
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl mb-10 relative h-[250px] sm:h-[350px]">
        {data.images && data.images.length > 0 ? (
          data.images.map((src, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-20">
          <span className="bg-orange-500 text-white text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full mb-3 inline-block">
            Explore Destination
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif mb-2">{data.title}</h1>
          <p className="text-sm sm:text-lg text-slate-200 font-medium max-w-2xl">{data.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">About {data.title}</h2>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{data.description}</p>
      </div>

      {/* Rajasthan Main Cities Grid */}
      {destinationKey === "rajasthan" && !activeRajasthanCity && (
        <div className="max-w-7xl mx-auto mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-serif">Main Cities of Rajasthan</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Click a city below to view its detailed itinerary & famous local shopping markets</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.cities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${city.coverImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-600 text-xs sm:text-sm italic mb-4">{city.tagline}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRajasthanCity(city);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-sm hover:shadow cursor-pointer"
                  >
                    View Itinerary & Markets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Rajasthan City View / Delhi Agra View */}
      {((destinationKey !== "rajasthan") || (destinationKey === "rajasthan" && activeRajasthanCity)) && (
        <div className="max-w-7xl mx-auto">
          {/* Back to Cities list for Rajasthan */}
          {destinationKey === "rajasthan" && (
            <button
              type="button"
              onClick={() => setActiveRajasthanCity(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold rounded-lg text-xs mb-6 transition cursor-pointer"
            >
              ← Back to Rajasthan Cities
            </button>
          )}

          {/* Active City Header */}
          {activeRajasthanCity && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-6 items-center">
              <div 
                className="w-full sm:w-1/3 h-40 bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url(${activeRajasthanCity.coverImage})` }}
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-serif mb-1">{activeRajasthanCity.name}</h2>
                <p className="text-orange-500 font-medium text-sm sm:text-base italic mb-3">{activeRajasthanCity.tagline}</p>
                <p className="text-gray-600 text-xs sm:text-sm">Explore our curated day-by-day itinerary and local market recommendations below.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Itinerary Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 border-b pb-3 border-gray-200 font-serif">
                🗺️ Suggested Itinerary
              </h3>
              {(activeRajasthanCity || data).itinerary.map((item, index) => (
                <div key={index} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-orange-100 text-orange-600 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
                      {item.day}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-800">{item.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        <span className="text-orange-500 mt-1 flex-shrink-0">🔸</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Local Markets Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2 border-b pb-3 border-gray-200 font-serif">
                🛍️ Local Shopping Markets
              </h3>
              {(activeRajasthanCity || data).markets.map((market, index) => (
                <div key={index} className="bg-orange-50/40 p-5 rounded-2xl shadow-sm border border-orange-100/60 hover:bg-orange-50 transition duration-300">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                      🛒 {market.name}
                    </h4>
                  </div>
                  <div className="mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded">
                      Specialty: {market.specialty}
                    </span>
                  </div>
                  {market.desc && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{market.desc}</p>
                  )}
                </div>
              ))}

              {/* Package Call-to-action */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg mt-4">
                <h4 className="text-lg font-bold mb-2">Plan your custom holiday!</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Want to customize this itinerary or add more destinations? Contact our travel specialists. We arrange comfortable AC cabs, handpicked hotels, and local guides.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const cityName = activeRajasthanCity ? activeRajasthanCity.name : data.title;
                      openWhatsApp(`Hi, I am interested in planning a trip to ${cityName} with local market visits.`);
                    }}
                    className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer"
                  >
                    💬 WhatsApp Enquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        scrollToForm();
                        const packageInput = document.getElementById("package-name-field");
                        if (packageInput) {
                          const cityName = activeRajasthanCity ? activeRajasthanCity.name : data.title;
                          packageInput.value = `${cityName} Custom Tour`;
                          packageInput.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                      }, 200);
                    }}
                    className="flex-1 text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer"
                  >
                    📝 Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const whatsappNumber = "918824976479"; // TODO: replace with real WhatsApp number
  const carScrollRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [heroSlide, setHeroSlide] = useState(0);
  const [activeDestination, setActiveDestination] = useState(null);
  const [activeRajasthanCity, setActiveRajasthanCity] = useState(null);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);

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
      name: "Golden Triangle",
      tag: "Best Seller",
      duration: "5 Days / 4 Nights",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur (Pink City)"],
      image: "/pictures/agra_tajmahal.jpg",
      includes: [
        "3★ / 4★ Hotels with Breakfast",
        "Private AC Sedan/SUV Cab",
        "Expert Local Tour Guides",
        "All Tolls, Parking & Taxes Included"
      ]
    },
    {
      id: 2,
      name: "Maharaja Heritage Trail",
      tag: "Grand Heritage",
      duration: "10 Days / 9 Nights",
      destinations: ["Delhi", "Mandawa", "Bikaner", "Jodhpur", "Udaipur", "Jaipur", "Agra"],
      image: "/pictures/bikaner.jpg",
      includes: [
        "Heritage Palace Hotel Stays",
        "Private Chauffeur Cab",
        "Thar Desert Camel Safari",
        "Guided Royal City Tours"
      ]
    },
    {
      id: 3,
      name: "Golden Triangle and Tiger Safari",
      tag: "Wildlife Special",
      duration: "6 Days / 5 Nights",
      destinations: ["Delhi", "Agra", "Ranthambore (Tiger Safari)", "Jaipur"],
      image: "/pictures/ranthambore_tiger.jpg",
      includes: [
        "Luxury Resort Stays",
        "2 Open-Gypsy Jungle Safaris",
        "Taj Mahal Sunrise Sightseeing",
        "Dedicated Chauffeur & Transfers"
      ]
    },
    {
      id: 4,
      name: "Golden Triangle and Lake Palace",
      tag: "Luxury & Lakes",
      duration: "8 Days / 7 Nights",
      destinations: ["Delhi", "Agra", "Jaipur", "Udaipur (Lake Pichola)"],
      image: "/pictures/udaipur.jpg",
      includes: [
        "Lake view stays in Udaipur",
        "Boat Cruise on Lake Pichola",
        "Private AC Cab Transfers",
        "All Monument Entrance Tickets"
      ]
    }
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
    image: "/pictures/cars/dzire.jpeg",
    features: ["AC", "Luggage Space", "Music System"],
  },
  {
    id: 2,
    name: "Maruti Ertiga",
    type: "MPV",
    capacity: "6 Passengers",
    ac: true,
    color: "#0891b2",
    image: "/pictures/cars/ertiga.jpeg",
    features: ["AC", "Luggage Space", "Music System"],
  },
  {
    id: 3,
    name: "Toyota Innova",
    type: "SUV",
    capacity: "6 Passengers",
    ac: true,
    color: "#059669",
    image: "/pictures/cars/innova.jpeg",
    features: ["AC", "Premium Seats", "GPS", "USB Charging"],
  },
  {
    id: 4,
    name: "Toyota Crysta",
    type: "Premium SUV",
    capacity: "7 Passengers",
    ac: true,
    color: "#d97706",
    image: "/pictures/cars/crysta.jpeg",
    features: ["AC", "Luxury Interior", "GPS", "USB Charging"],
  },
  {
    id: 5,
    name: "Tempo Traveller",
    type: "Mini Coach",
    capacity: "12–17 Passengers",
    ac: true,
    color: "#db2777",
    image: "/pictures/cars/traveller.jpeg",
    features: ["AC", "Wide Seats", "Luggage Rack", "Music System"],
  },
  {
    id: 6,
    name: "Luxury Coach",
    type: "Bus",
    capacity: "30+ Passengers",
    ac: true,
    color: "#7c3aed",
    image: "/pictures/cars/volvo.jpeg",
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
            onClick={() => {
              setMenuOpen(false);
              setActiveDestination(null);
            }}
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
              onClick={() => {
                setMenuOpen(false);
                setActiveDestination(null);
              }}
            >
              Home
            </a>
            
            <div 
              className={`nav-dropdown${destDropdownOpen ? " open-mobile open-desktop" : ""}`}
              onMouseEnter={() => setDestDropdownOpen(true)}
              onMouseLeave={() => setDestDropdownOpen(false)}
            >
              <button
                type="button"
                className="dropdown-trigger"
                onClick={() => setDestDropdownOpen(!destDropdownOpen)}
              >
                Destinations <span className="dropdown-arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setActiveDestination("delhi");
                    setMenuOpen(false);
                    setDestDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Delhi
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setActiveDestination("agra");
                    setMenuOpen(false);
                    setDestDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Agra
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setActiveDestination("rajasthan");
                    setActiveRajasthanCity(null);
                    setMenuOpen(false);
                    setDestDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Royal Rajasthan
                </button>
              </div>
            </div>
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
      {activeDestination ? (
        <DestinationDetailView
          destinationKey={activeDestination}
          activeRajasthanCity={activeRajasthanCity}
          setActiveRajasthanCity={setActiveRajasthanCity}
          onClose={() => setActiveDestination(null)}
          openWhatsApp={openWhatsApp}
          scrollToForm={scrollToForm}
        />
      ) : (
        <>
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
            ⭐ Rajasthan Certified Travel Partner | 🌐 Trusted by US, UK & Global Travelers
          </span>
          <h1 className="hero-title">
            <span aria-hidden="true">
              <span className="hero-title-line line-1">
                {"Mehar"}
                <span className="title-o-letter">
                  O
                  <img
                    src="/pictures/main-section/logo-removebg-preview.png"
                    alt="Meharoli Logo"
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
            Crafting custom luxury tour packages across Rajasthan, Delhi &amp; Agra for international guests from USA, UK, Europe, Australia, New Zealand &amp; worldwide.
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
                    <div className="package-title-row">
                      <h3>{pkg.name}</h3>
                      {pkg.duration && (
                        <span className="package-duration-badge">⏱ {pkg.duration}</span>
                      )}
                    </div>
                    <p className="package-destinations">
                      <strong>Route:</strong> {pkg.destinations.join(" → ")}
                    </p>
                    <ul className="package-includes">
                      {pkg.includes ? (
                        pkg.includes.map((inc, idx) => (
                          <li key={idx}>{inc}</li>
                        ))
                      ) : (
                        <>
                          <li>Comfortable hotels</li>
                          <li>Private cab transfers</li>
                          <li>Guided sightseeing</li>
                          <li>Breakfast & selected meals</li>
                        </>
                      )}
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
        </>
      )}

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
              <h4>Holiday Packages</h4>
              <ul>
                <li><a href="#packages" className="hover:text-orange-500 transition-colors">Golden Triangle Tour</a></li>
                <li><a href="#packages" className="hover:text-orange-500 transition-colors">Maharaja Heritage Trail</a></li>
                <li><a href="#packages" className="hover:text-orange-500 transition-colors">Tiger Safari &amp; Wildlife Special</a></li>
                <li><a href="#packages" className="hover:text-orange-500 transition-colors">Lake Palace Luxury Tour</a></li>
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
