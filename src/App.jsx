import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import emailjs from '@emailjs/browser';
import { Helmet } from "react-helmet-async";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";
import AdminPanel from "./AdminPanel";
import ReviewModal from "./ReviewModal";

const jaipurSlides = [
  {
    src: "/pictures/main-section/jaipur-jal-mahal-water-palace.jpg",
    alt: "Jal Mahal Water Palace in Jaipur Rajasthan India at sunset",
  },
  {
    src: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
    alt: "Amber Fort Fortress and Maota Lake in Amer Jaipur Rajasthan",
  },
  {
    src: "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
    alt: "Patrika Gate Pink Monument Entrance in Jawahar Circle Jaipur",
  },
  {
    src: "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg",
    alt: "Hawa Mahal Palace of Winds Architecture in Jaipur Pink City",
  },
  {
    src: "/pictures/main-section/jaipur-jal-mahal-lake-view.jpg",
    alt: "Jal Mahal Palace surrounded by Man Sagar Lake with flying birds in Jaipur",
  },
  {
    src: "/pictures/main-section/jaipur-hawa-mahal-pink-city-facade.jpg",
    alt: "Hawa Mahal Pink City Facade View in Jaipur Rajasthan",
  },
  {
    src: "/pictures/main-section/jaipur-albert-hall-museum.jpg",
    alt: "Albert Hall Museum Architecture in Jaipur Rajasthan India",
  },
];

const destinationsData = {
  delhi: {
    title: "Delhi",
    subtitle: "India's Historic Capital City",
    description: "Explore Delhi, where the ancient past blends seamlessly with a bustling, modern metropolis. From grand Mughal monuments to vibrant street food and markets, Delhi is a sensory adventure.",
    coverImage: "/pictures/delhi.jpg",
    images: [
      "/pictures/delhi.jpg",
      "/pictures/delhi_red_fort.jpg",
      "/pictures/delhi_qutub_minar.jpg"
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
      "/pictures/agra_fort.jpg",
      "/pictures/taj_marble_detail.jpg"
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
    coverImage: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
    images: [
      "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
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
        coverImage: "/pictures/main-section/jaipur-jal-mahal-water-palace.jpg",
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

const blogsData = [
  {
    id: "agra-taj-mahal-guide",
    title: "The Ultimate Guide to Agra: Taj Mahal & Beyond",
    excerpt: "Experience the romance of the Taj Mahal at sunrise, uncover the corridors of Agra Fort, and sample Agra's legendary local street food.",
    category: "Agra Guide",
    date: "July 29, 2026",
    readTime: "5 min read",
    coverImage: "/pictures/agra_tajmahal.jpg",
    images: [
      "/pictures/agra_tajmahal.jpg",
      "/pictures/taj_marble_detail.jpg",
      "/pictures/main-section/jaipur-jal-mahal-lake-view.jpg"
    ],
    content: [
      {
        heading: "Taj Mahal Sunrise: The Golden Hour",
        text: "There is nothing quite like watching the first rays of the morning sun strike the white marble dome of the Taj Mahal. To experience this, plan to arrive at the gates by 5:30 AM. The morning mist over the Yamuna River adds a mystical overlay to the view, and you'll beat the heavy midday crowds. Remember to book your tickets online in advance to skip the main queues."
      },
      {
        heading: "Exploring Agra Fort's Mughal Legacy",
        text: "After visiting the Taj, head to Agra Fort, a massive 16th-century red sandstone fortress. Walk through the grand Amar Singh Gate, explore the Jahangiri Mahal, and stand in the octagonal tower (Musamman Burj) where Emperor Shah Jahan spent his final years gazing out at the Taj Mahal. The fort is a masterpiece of design, blending Persian, Timurid, and Hindu architecture."
      },
      {
        heading: "Street Food & Marble Bazaars",
        text: "Agra is famous for its culinary delights. Don't leave without tasting Bedai (puffy fried bread stuffed with lentils) served with spicy potato curry and sweet, crispy Jalebi, Agra's traditional breakfast. For souvenirs, visit Taj Ganj or Sadar Bazar to purchase beautiful marble inlay replicas, leather crafts, and the famous 'Petha' (a translucent sweet made from ash gourd)."
      }
    ]
  },
  {
    id: "mandawa-fresco-art",
    title: "Mandawa: Shekhawati's Open-Air Art Gallery",
    excerpt: "Step back in time as we wander the corridors of Mandawa, exploring beautifully painted heritage Havelis adorned with vintage frescoes.",
    category: "Heritage & Art",
    date: "July 25, 2026",
    readTime: "4 min read",
    coverImage: "/pictures/mandawa.jpg",
    images: [
      "/pictures/mandawa.jpg",
      "/pictures/haveli_wall_detail.jpg",
      "/pictures/bikaner.jpg"
    ],
    content: [
      {
        heading: "The Painted Havelis of Mandawa",
        text: "Mandawa, situated in the Shekhawati region of Rajasthan, is world-famous for its grand Havelis (mansions) built by wealthy merchant families in the 18th and 19th centuries. What makes these structures unique is their walls, which are covered in rich, hand-painted frescoes. These murals depict everything from traditional mythology and royal processions to modern 19th-century inventions like trains and telephones."
      },
      {
        heading: "Must-Visit Havelis in Mandawa",
        text: "Make sure to visit the Sewaram Saraf Haveli, known for its pristine paintings, and the Hanuman Prasad Goenka Haveli, which has a fresco showing Lord Indra on his elephant. Castle Mandawa, now a heritage hotel, is another grand spot showcasing old weapons, portraits, and traditional courtyards."
      },
      {
        heading: "Shopping for Antiques & Local Art",
        text: "The local bazaars around Mandawa Castle are perfect for finding vintage chests, hand-painted wooden furniture, puppets, and traditional miniature paintings. Local artisans still practice the ancient painting styles, using natural dyes extracted from minerals and plants, which you can watch live in their workshops."
      }
    ]
  },
  {
    id: "rajasthan-secret-forts",
    title: "Secret Forts & Palaces of Royal Rajasthan",
    excerpt: "Go beyond the usual tourist trail and discover the lesser-known fortresses, palace views, and mountain lakes of Rajasthan.",
    category: "Adventure Tour",
    date: "July 20, 2026",
    readTime: "6 min read",
    coverImage: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
    images: [
      "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
      "/pictures/jodhpur.jpg",
      "/pictures/udaipur.jpg",
      "/pictures/jaisalmer_desert.jpg"
    ],
    content: [
      {
        heading: "Junagarh Fort, Bikaner: The Unconquered Palace",
        text: "While Jaipur's Amer Fort and Jodhpur's Mehrangarh are famous, Bikaner's Junagarh Fort is an underrated masterpiece. Unlike most forts built on hilltops, Junagarh was constructed on flat ground. Inside, you'll find incredibly preserved courtyards, gold-leaf-embellished halls, and even a historic World War I biplane model housed inside the Darbar Hall."
      },
      {
        heading: "Nakki Lake & Toad Rock, Mount Abu",
        text: "Escape the desert heat and head to Mount Abu, Rajasthan's only hill station. Nakki Lake is a sacred lake surrounded by Aravali hills, where you can paddle-boat in the cool breeze. Right above the lake sits Toad Rock, a massive natural boulder that looks like a toad about to leap. The views from the top at sunset are breath-taking."
      },
      {
        heading: "The Thar Desert Sunset of Jaisalmer",
        text: "Nothing compares to spending a night in the Thar Desert. Explore Jaisalmer's living Golden Fort (Sonar Qila), then head to Sam Sand Dunes. Ride a camel over the soft sand ridges, watch a colorful traditional Rajasthani folk dance program by the campfire, and sleep under a clear, un-polluted night sky filled with stars."
      }
    ]
  },
  {
    id: "delhi-street-food-markets",
    title: "Delhi Street Food & Local Bazaars Guide",
    excerpt: "A beginner-friendly guide to tasting the legendary street food of Old Delhi and shopping for traditional handicrafts at local markets.",
    category: "Food & Shopping",
    date: "July 15, 2026",
    readTime: "5 min read",
    coverImage: "/pictures/delhi.jpg",
    images: [
      "/pictures/delhi.jpg",
      "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
      "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg"
    ],
    content: [
      {
        heading: "The Flavors of Chandni Chowk",
        text: "Chandni Chowk in Old Delhi is the street food capital of India. Navigate its crowded lanes to visit the famous Paranthe Wali Gali, where flatbreads stuffed with everything from potatoes to bananas are deep-fried in ghee. Try the sweet, thick Jalebi at Old Famous Jalebi Wala, and cool down with Rabri Falooda at Giani's."
      },
      {
        heading: "Shopping at Dilli Haat & Janpath",
        text: "If you want to shop for authentic souvenirs, head to Dilli Haat, a relaxed open-air marketplace showcasing handloom clothing, embroidered textiles, leather bags, and wood carvings directly from rural artisans. If you are good at bargaining, check out Janpath Market for brass statues, colorful accessories, and fashionable clothes."
      },
      {
        heading: "Navigating Delhi's Historic Monuments",
        text: "In between meals, make time to visit Humayun's Tomb, a gorgeous red sandstone Mughal garden tomb, and the Qutub Minar complex. Using Delhi's air-conditioned Metro is the fastest and cleanest way to zip between Old Delhi's food markets and New Delhi's heritage monuments."
      }
    ]
  }
];

function DestinationDetailView({
  destinationKey,
  activeRajasthanCity,
  setActiveRajasthanCity,
  onClose,
  openWhatsApp,
  scrollToForm,
  onPayOnline
}) {
  const data = destinationsData[destinationKey];
  if (!data) return null;

  const [currentSlide, setCurrentSlide] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [destinationKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 10);
    return () => clearTimeout(t);
  }, [destinationKey]);

  useEffect(() => {
    if (!data.images || data.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data.images]);

  const pageUrl = `https://www.meharolitravels.com/#destination-${destinationKey}`;
  const pageTitle = `${data.title} Tour Packages & Sightseeing | Meharoli Tours`;
  const pageDesc = `${data.description} Book custom ${data.title} tour packages with direct AC taxi hire, premium hotel stays, and expert local guides.`;
  const pageImage = `https://www.meharolitravels.com${data.coverImage}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": `${data.title} Tour Packages`,
    "description": pageDesc,
    "image": pageImage,
    "url": pageUrl,
    "provider": {
      "@type": "TravelAgency",
      "name": "Meharoli Tours & Travels",
      "telephone": "+918824976479"
    }
  };

  return (
    <div className="destination-detail-page bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-16 animate-fadeIn">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => {
            window.location.hash = "#top";
            onClose();
          }}
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
                  {onPayOnline && (
                    <button
                      type="button"
                      onClick={onPayOnline}
                      className="flex-1 text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer border border-orange-500/40"
                    >
                      💳 Pay Deposit Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RazorpayButton({ buttonId = "pl_TK5OoEH10bnyk7", className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const form = document.createElement("form");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", buttonId);
    script.async = true;

    form.appendChild(script);
    containerRef.current.appendChild(form);
  }, [buttonId]);

  return (
    <div ref={containerRef} className={`razorpay-button-wrapper ${className}`} />
  );
}

function PaymentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="payment-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="payment-modal-header">
          <div className="payment-modal-badge">
            🔒 100% Secure Payment Gateway
          </div>
          <h2 className="payment-modal-title">Meharoli Tours &amp; Travels</h2>
          <p className="payment-modal-subtitle">
            Pay safely and instantly via UPI, Cards, NetBanking or Wallets
          </p>
        </div>

        <div className="payment-modal-body">
          <div className="payment-features-grid">
            <div className="payment-feature-item">
              <span className="p-icon">🔒</span>
              <div>
                <strong>SSL Encrypted</strong>
                <small>256-bit Protection</small>
              </div>
            </div>
            <div className="payment-feature-item">
              <span className="p-icon">⚡</span>
              <div>
                <strong>Instant Booking</strong>
                <small>Razorpay Verified</small>
              </div>
            </div>
            <div className="payment-feature-item">
              <span className="p-icon">📲</span>
              <div>
                <strong>UPI &amp; Cards</strong>
                <small>GPay, PhonePe &amp; Cards</small>
              </div>
            </div>
          </div>

          <div className="payment-button-container">
            <RazorpayButton buttonId="pl_TK5OoEH10bnyk7" />
          </div>

          <div className="payment-security-footer">
            <div className="payment-cards-icons">
              <span>💳 Credit/Debit Card</span>
              <span>📱 Google Pay</span>
              <span>📱 PhonePe</span>
              <span>📱 Paytm</span>
              <span>🏦 NetBanking</span>
            </div>
            <p className="payment-help-text">
              Need assistance? Call/WhatsApp:{" "}
              <a
                href="https://wa.me/918824976479"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 88249 76479
              </a>
            </p>
          </div>
        </div>
      </div>
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
  const [activeBlogKey, setActiveBlogKey] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState([]);

  // Fetch approved customer reviews from Firebase Firestore in Real-Time
  useEffect(() => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("status", "==", "Approved")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const liveRevs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApprovedReviews(liveRevs);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Error fetching approved reviews:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % jaipurSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTarget = (id, attempts = 0) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (attempts < 15) {
      setTimeout(() => scrollToTarget(id, attempts + 1), 40);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle URL Hash Deep-linking & SEO Title Sync for Crawlers & Visitors
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#admin" || hash === "#adminpanel") {
        setIsAdminOpen(true);
      } else if (hash.startsWith("#destination-")) {
        const dest = hash.replace("#destination-", "");
        if (destinationsData[dest]) {
          setActiveDestination(dest);
          setActiveBlogKey(null);
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      } else if (hash.startsWith("#blog-")) {
        const blogId = hash.replace("#blog-", "");
        const blog = blogsData.find((b) => b.id === blogId);
        if (blog) {
          setActiveBlogKey(blogId);
          setActiveDestination(null);
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      } else if (hash === "#blogs") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("blogs");
      } else if (hash.startsWith("#") && hash.length > 1 && hash !== "#top") {
        const targetId = hash.replace("#", "");
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget(targetId);
      } else if (hash === "" || hash === "#top") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update Page Title dynamically based on active view for search engines
  useEffect(() => {
    if (activeBlogKey) {
      const blog = blogsData.find((b) => b.id === activeBlogKey);
      if (blog) {
        document.title = `${blog.title} | Meharoli Travels Blog`;
      }
    } else if (activeDestination) {
      const dest = destinationsData[activeDestination];
      if (dest) {
        document.title = `${dest.title} Tour Packages & Sightseeing | Meharoli Tours`;
      }
    } else {
      document.title = "Meharoli Tours & Travels | Custom Rajasthan, Delhi & Agra Tour Packages";
    }
  }, [activeDestination, activeBlogKey]);

  const scrollCars = (dir) => {
    if (carScrollRef.current) {
      carScrollRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  const handleNavClick = (targetId) => {
    setMenuOpen(false);
    setActiveDestination(null);
    setActiveBlogKey(null);
    setDestDropdownOpen(false);

    if (targetId === "top") {
      window.location.hash = "#top";
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.location.hash = `#${targetId}`;
    scrollToTarget(targetId);
  };

  const scrollToForm = () => {
    handleNavClick("enquiry-form-section");
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, "_blank");
  };

  const [selectedPackage, setSelectedPackage] = useState("");
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const packageDropdownRef = useRef(null);

  const packageOptions = [
    { value: "Jaipur Royal Forts & Heritage Sightseeing", label: "Jaipur Royal Forts & Heritage Sightseeing" },
    { value: "Jaipur Cultural, Street Food & Chokhi Dhani Night Tour", label: "Jaipur Cultural & Chokhi Dhani Night Tour" },
    { value: "Khatu Shyam Ji & Salasar Balaji Divine Circuit", label: "Khatu Shyam Ji & Salasar Balaji Divine Circuit" },
    { value: "Ranthambore Tiger Safari & Wildlife Excursion", label: "Ranthambore Tiger Safari & Wildlife Excursion" },
    { value: "Golden Triangle (Delhi - Agra - Jaipur)", label: "Golden Triangle (Delhi - Agra - Jaipur)" },
    { value: "Maharaja Royal Rajasthan Circuit", label: "Maharaja Royal Rajasthan Circuit" },
    { value: "Jaipur Ajmer & Pushkar Holy Lake Day Excursion", label: "Jaipur Ajmer & Pushkar Holy Lake Tour" },
    { value: "Jaipur Abhaneri Stepwell & Agra Taj Mahal Excursion", label: "Jaipur Abhaneri Stepwell & Agra Taj Mahal Tour" },
    { value: "Custom Rajasthan Cab & Hotel Itinerary", label: "Custom Cab & Hotel Booking" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        packageDropdownRef.current &&
        !packageDropdownRef.current.contains(event.target)
      ) {
        setIsPackageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePackageEnquiry = (pkgName) => {
    setSelectedPackage(pkgName);
    setIsPackageDropdownOpen(false);
    scrollToForm();
  };

  const packages = [
    {
      id: 1,
      name: "Jaipur Royal Forts & Heritage Sightseeing",
      tag: "Most Popular",
      duration: "Full Day (8–10 Hours)",
      kms: "80 KMs Total",
      startingRate: "Starting @ $24 / Day (Private Cab)",
      destinations: ["Amer Fort", "Jaigarh (Jaivana Cannon)", "Nahargarh Sunset Point", "Jal Mahal", "Hawa Mahal", "City Palace", "Jantar Mantar", "Panna Meena Stepwell"],
      image: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
      tip: "🌅 Sunset Tip: Nahargarh Padao offers the best panoramic sunset view over Pink City!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$24" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$36" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$54" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$78" }
      ],
      includes: [
        "Private AC Cab Hire (Fuel Included)",
        "Dedicated Professional Chauffeur",
        "All Tolls, Parking & Driver Taxes Included (No Hidden Charges)",
        "Doorstep Hotel / Railway Station Pickup & Drop"
      ]
    },
    {
      id: 2,
      name: "Jaipur Cultural, Street Food & Chokhi Dhani Night Tour",
      tag: "Evening & Food Special",
      duration: "Evening Tour (4 PM – 10 PM)",
      kms: "60 KMs Total",
      startingRate: "Starting @ $26 / Evening Tour",
      destinations: ["Patrika Gate", "Albert Hall Museum (Night Lighting)", "Amer Fort Light & Sound Show", "Chokhi Dhani Ethnic Village & Rajasthani Thali", "Pink City Spice Walk"],
      image: "/pictures/main-section/jaipur-albert-hall-museum.jpg",
      tip: "💃 Live Kalbelia folk dance, puppet shows & authentic Dal Baati Churma included at Chokhi Dhani!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$26" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$42" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$60" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$84" }
      ],
      includes: [
        "Private AC Cab for Evening Sightseeing",
        "Drop to Chokhi Dhani Village & Driver Waiting",
        "All Tolls, Parking & Driver Charges Included",
        "Handpicked Food & Shopping Guide"
      ]
    },
    {
      id: 3,
      name: "Khatu Shyam Ji & Salasar Balaji Divine Circuit",
      tag: "Spiritual Special",
      duration: "Full Day (Same Day Return)",
      kms: "360 KMs Roundtrip",
      startingRate: "Starting @ $78 / Day (Roundtrip Cab)",
      destinations: ["Jaipur Pickup", "Khatu Shyam Ji (Reengus)", "Salasar Balaji Temple", "Return Jaipur Drop"],
      image: "/pictures/khatu_shyam_salasar_temple.jpg",
      tip: "🕉️ Priority Darshan guidance & comfortable highway AC transfers for families & senior citizens!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$78" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$90" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$102" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$150" }
      ],
      includes: [
        "Same Day Round-trip Private AC Cab",
        "Highways Toll Tax & State Taxes Included",
        "Experienced Highway Chauffeur",
        "Doorstep Pickup & Drop (Hotel / Residence)"
      ]
    },
    {
      id: 4,
      name: "Ranthambore Tiger Safari & Wildlife Excursion",
      tag: "🐅 Wild & Thrilling",
      duration: "Full Day (Same Day Afternoon Safari Possible)",
      kms: "380 KMs Roundtrip",
      startingRate: "Starting @ $72 / Day (Roundtrip Cab)",
      destinations: ["Jaipur Pickup", "Ranthambore Tiger Reserve (Canter/Gypsy Safari)", "Ranthambore Fort", "Trinetra Ganesh Temple", "Return Jaipur Drop"],
      image: "/pictures/ranthambore_tiger_safari.jpg",
      tip: "🐅 Wildlife Tip: Same-day Afternoon Safari booking assistance available! Best chance for Royal Bengal Tiger sightings in Zone 1-5.",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$72" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$90" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$102" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$138" }
      ],
      includes: [
        "Private AC Cab Round-trip (Jaipur ➔ Ranthambore ➔ Jaipur)",
        "Highway Toll Taxes, Parking & Fuel Included",
        "Doorstep Hotel / Airport Pickup & Evening Return Drop",
        "Ranthambore Fort & Trinetra Ganesh Mandir Sightseeing"
      ]
    },
    {
      id: 5,
      name: "Golden Triangle (Delhi - Agra - Jaipur)",
      tag: "Best Seller",
      duration: "5 Days / 4 Nights",
      kms: "1,000 KMs Total Circuit",
      startingRate: "Starting @ $43 / Day ($216 Total for 5 Days ~ $54 per person)",
      destinations: ["Delhi (Red Fort & Qutub)", "Agra (Taj Mahal & Agra Fort)", "Jaipur (Pink City Forts)"],
      image: "/pictures/agra_tajmahal.jpg",
      tip: "📸 Sunrise Taj Mahal visit included with professional local tour guide!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$216" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$264" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$300" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$420" }
      ],
      includes: [
        "Private AC Cab for Entire 5-Day Tour (~1,000 KMs)",
        "All Inter-state Tolls, Parking & Driver Taxes Included",
        "Taj Mahal Sunrise & Guided Local Sightseeing",
        "3★ / 4★ Hotel Booking Available on Request"
      ]
    },
    {
      id: 6,
      name: "Maharaja Royal Rajasthan Circuit",
      tag: "Grand Heritage",
      duration: "12 Days / 11 Nights",
      kms: "2,800 KMs Total Circuit",
      startingRate: "Starting @ $42 / Day ($504 Total for 12 Days ~ $126 per person)",
      destinations: ["Delhi", "Mandawa", "Bikaner", "Jaisalmer (Desert Safari)", "Jodhpur", "Udaipur", "Jaipur", "Agra"],
      image: "/pictures/bikaner.jpg",
      tip: "🐪 Thar Desert Camel Safari in Jaisalmer & Royal Lake Pichola Boat Cruise included!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$504" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$648" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$720" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$1,080" }
      ],
      includes: [
        "Private Chauffeur Cab for Entire 12-Day Tour (~2,800 KMs)",
        "All Inter-state Tolls, Parking & Driver Allowance Included",
        "Thar Desert Camel Safari in Jaisalmer & City Tours",
        "Heritage Palace Hotel Booking Available on Request"
      ]
    },
    {
      id: 7,
      name: "Jaipur Ajmer & Pushkar Holy Lake Day Excursion",
      tag: "🕌 Sacred Heritage",
      duration: "Full Day (Same Day Return)",
      kms: "300 KMs Roundtrip",
      startingRate: "Starting @ $58 / Day (Roundtrip Cab)",
      destinations: ["Jaipur Pickup", "Ajmer Dargah Sharif", "Ana Sagar Lake", "Pushkar Brahma Temple", "Pushkar Lake & Ghats", "Return Jaipur Drop"],
      image: "/pictures/pushkar_lake.jpg",
      tip: "🕉️ Visit the world's only Lord Brahma Temple and experience holy evening Aarti at Pushkar Lake!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$58" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$72" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$88" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$130" }
      ],
      includes: [
        "Same Day Round-trip Private AC Cab",
        "Ajmer Dargah & Pushkar Temple Sightseeing",
        "Highways Toll Tax & State Permit Included",
        "Doorstep Pickup & Drop (Hotel / Residence)"
      ]
    },
    {
      id: 8,
      name: "Jaipur Abhaneri Stepwell & Agra Taj Mahal Excursion",
      tag: "🕌 Taj Mahal Special",
      duration: "Same Day Excursion (12–14 Hours)",
      kms: "480 KMs Total Circuit",
      startingRate: "Starting @ $85 / Day (Jaipur to Agra Cab)",
      destinations: ["Jaipur Pickup", "Abhaneri Chand Baori Stepwell", "Fatehpur Sikri Palace", "Taj Mahal", "Agra Fort", "Agra / Jaipur Drop"],
      image: "/pictures/abhaneri_stepwell.jpg",
      tip: "📸 Explore Chand Baori (world's deepest stepwell) & UNESCO Taj Mahal in a single day private AC cab!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "$85" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "$110" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "$140" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "$195" }
      ],
      includes: [
        "Private AC Cab Hire (Fuel & Highway Tolls Included)",
        "Abhaneri Stepwell, Fatehpur Sikri & Agra Sightseeing",
        "Experienced Highway Chauffeur",
        "Doorstep Hotel / Airport Pickup & Drop"
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
      image: "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg",
    },
    {
      id: 3,
      title: "Local Experiences",
      description:
        "Food walks, cultural shows and authentic Rajasthani experiences curated for you.",
      image: "/pictures/main-section/jaipur-jal-mahal-lake-view.jpg",
    },
    {
      id: 4,
      title: "Transport & Travel Tips",
      description:
        "Airport and railway station transfers, local cabs and personalised assistance.",
      image: "/pictures/main-section/jaipur-hawa-mahal-pink-city-facade.jpg",
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
      image: "/pictures/main-section/jaipur-albert-hall-museum.jpg",
    },
    {
      id: 3,
      title: "Secure & Transparent",
      description:
        "Clear inclusions, no hidden costs and secure payment options.",
      image: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
    },
    {
      id: 4,
      title: "Customer Friendly",
      description:
        "Custom itineraries for families, couples, and groups of all sizes.",
      image: "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg",
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
    priceFrom: "$24 / day",
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
    priceFrom: "$36 / day",
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
    priceFrom: "$42 / day",
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
    priceFrom: "$54 / day",
    image: "/pictures/cars/crysta.jpeg",
    features: ["AC", "Luxury Interior", "GPS", "USB Charging"],
  },
  {
    id: 5,
    name: "Tempo Traveller",
    type: "Mini Coach",
    capacity: "12–20 Passengers",
    ac: true,
    color: "#db2777",
    priceFrom: "$78 / day",
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
    priceFrom: "$150 / day",
    image: "/pictures/cars/volvo.jpeg",
    features: ["AC", "Recliner Seats", "Onboard TV", "Restroom"],
  },
];

  return (
    <div className="app">
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <header className="app-header">
        <div className="header-inner">
          <a
            href="#top"
            className="header-brand"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("top");
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

          <button
            type="button"
            className="header-top-pay-btn"
            onClick={() => setIsPaymentModalOpen(true)}
          >
            💳 Pay Online
          </button>

          <img
            src="/pictures/main-section/guru_kripa.png"
            alt="Guru Kripa"
            className="guru-kripa-img"
          />

          <nav
            className={`header-nav${menuOpen ? " open" : ""}`}
            aria-label="Main navigation"
          >
            <a
              href="#top"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("top");
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
                    window.location.hash = "#destination-delhi";
                    setActiveDestination("delhi");
                    setActiveBlogKey(null);
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
                    window.location.hash = "#destination-agra";
                    setActiveDestination("agra");
                    setActiveBlogKey(null);
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
                    window.location.hash = "#destination-rajasthan";
                    setActiveDestination("rajasthan");
                    setActiveRajasthanCity(null);
                    setActiveBlogKey(null);
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
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("packages");
              }}
            >
              Packages
            </a>
            <a
              href="#double-decker-package"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("double-decker-package");
              }}
            >
              Double Decker
            </a>
            <a
              href="#cars"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("cars");
              }}
            >
              Cars
            </a>
            <a
              href="#services"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("services");
              }}
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("testimonials");
              }}
            >
              Reviews
            </a>
            <a
              href="#blogs"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("blogs");
              }}
            >
              Blogs
            </a>
            <a
              href="#about"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("about");
              }}
            >
              About
            </a>
            <a
              href="#enquiry-form-section"
              className="nav-item nav-cta"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("enquiry-form-section");
              }}
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
          onClose={() => handleNavClick("top")}
          openWhatsApp={openWhatsApp}
          scrollToForm={scrollToForm}
          onPayOnline={() => setIsPaymentModalOpen(true)}
        />
      ) : activeBlogKey ? (
        <BlogDetailView
          blogKey={activeBlogKey}
          onClose={() => handleNavClick("blogs")}
          openWhatsApp={openWhatsApp}
        />
      ) : (
        <>
          <Helmet>
            <title>Meharoli Tours &amp; Travels | Custom Rajasthan, Delhi &amp; Agra Tour Packages</title>
            <meta name="description" content="Book personalized tour packages for the Golden Triangle (Delhi, Agra, Jaipur), tiger safaris in Ranthambore, lake palaces in Udaipur, desert camping in Jaisalmer, and local shopping guides. Direct AC taxi hire, premium hotel bookings, and expert local guides." />
            <link rel="canonical" href="https://www.meharolitravels.com/" />
            <meta property="og:title" content="Meharoli Tours &amp; Travels | Custom Rajasthan, Delhi &amp; Agra Tour Packages" />
            <meta property="og:description" content="Book personalized tour packages for the Golden Triangle (Delhi, Agra, Jaipur), tiger safaris, lake palaces, desert camping, and local shopping guides." />
            <meta property="og:image" content="https://www.meharolitravels.com/pictures/agra_tajmahal.jpg" />
            <meta property="og:url" content="https://www.meharolitravels.com/" />
          </Helmet>
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
            <button
              type="button"
              className="nav-pay-btn"
              style={{ padding: "0.7rem 1.4rem", fontSize: "0.9rem" }}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              💳 Pay Online Now
            </button>
            <a href="#packages" className="btn ghost">
              View Packages
            </a>
          </div>
        </div>

        {/* Right – photo carousel */}
        <div className="hero-right">
          <div className="hero-img-wrap">
            {jaipurSlides.map((slide, i) => (
              <img
                key={slide.src}
                className={`hero-img${i === heroSlide ? " active" : ""}`}
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
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
              <div
                className="highlight-item cursor-pointer underline hover:text-orange-500"
                onClick={() => setIsPaymentModalOpen(true)}
              >
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
              <div
                className="highlight-item cursor-pointer underline hover:text-orange-500"
                onClick={() => setIsPaymentModalOpen(true)}
                aria-hidden="true"
              >
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
                onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = {
                    name: e.target.name.value,
                    phone: e.target.phone.value,
                    email: e.target.email.value,
                    destination: e.target.destination.value,
                    travel_date: e.target['travel-date'].value,
                    travellers: e.target.travellers.value,
                    message: e.target.message.value,
                    status: "New",
                    dateSubmitted: new Date().toLocaleString("en-IN"),
                    createdAt: serverTimestamp(),
                  };

                  // 1. Save to Firebase Firestore Database in Real-Time
                  try {
                    await addDoc(collection(db, "enquiries"), formData);
                  } catch (err) {
                    console.error("Firebase save error:", err);
                  }

                  // 2. Also send EmailJS Notification
                  emailjs
                    .send(
                      'service_ddemm88',
                      'template_io5ljmk',
                      formData,
                      '9AJfyV2Fy_U8DRKyi'
                    )
                    .then(() => {
                      alert('Thank you! Your enquiry has been received & saved. We will contact you shortly.');
                      e.target.reset();
                    })
                    .catch((error) => {
                      console.error('EmailJS error:', error);
                      alert('Thank you! Your enquiry has been saved. We will contact you shortly.');
                      e.target.reset();
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
                  <div
                    ref={packageDropdownRef}
                    className="form-field custom-select-container"
                  >
                    <label htmlFor="destination">Select Package / Tour *</label>
                    <input
                      type="hidden"
                      id="destination"
                      name="destination"
                      value={selectedPackage}
                      required
                    />

                    <button
                      type="button"
                      className={`custom-select-trigger ${isPackageDropdownOpen ? "active" : ""}`}
                      onClick={() => setIsPackageDropdownOpen((prev) => !prev)}
                    >
                      <span className={selectedPackage ? "custom-select-val-selected" : "custom-select-val-placeholder"}>
                        {selectedPackage
                          ? (packageOptions.find((opt) => opt.value === selectedPackage)?.label || selectedPackage)
                          : "-- Select Tour Package --"}
                      </span>
                      <span className={`custom-select-arrow ${isPackageDropdownOpen ? "open" : ""}`}>
                        ▼
                      </span>
                    </button>

                    {isPackageDropdownOpen && (
                      <div className="custom-select-menu">
                        {packageOptions.map((opt) => (
                          <div
                            key={opt.value}
                            className={`custom-select-item ${selectedPackage === opt.value ? "selected" : ""}`}
                            onClick={() => {
                              setSelectedPackage(opt.value);
                              setIsPackageDropdownOpen(false);
                            }}
                          >
                            <span>{opt.label}</span>
                            {selectedPackage === opt.value && (
                              <span className="check-mark">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                loading="lazy"
                decoding="async"
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
                    {pkg.startingRate && (
                      <div className="package-starting-rate-badge">
                        <span>🏷️ {pkg.startingRate}</span>
                      </div>
                    )}
                    <p className="package-destinations">
                      <strong>Route:</strong> {pkg.destinations.join(" → ")}
                    </p>

                    {pkg.tip && (
                      <div className="package-tip-box">
                        <span className="tip-icon">💡</span>
                        <span>{pkg.tip}</span>
                      </div>
                    )}

                    {pkg.carRates && pkg.carRates.length > 0 && (
                      <div className="package-fare-grid-box">
                        <div className="fare-grid-header">
                          <span>🚘 Vehicle Type</span>
                          <span>🏷️ Cab Fare</span>
                        </div>
                        {pkg.carRates.map((rate, rIdx) => (
                          <div key={rIdx} className="fare-grid-row">
                            <span className="car-name">{rate.car}</span>
                            <span className="car-price">{rate.fare}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="no-hidden-badge">
                      🛡️ <strong>No Hidden Charges:</strong> Toll, Parking, Fuel &amp; Driver Allowance Included!
                    </div>

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
                        📝 Send Enquiry
                      </button>
                      <button
                        type="button"
                        className="btn-whatsapp-green full"
                        onClick={() =>
                          openWhatsApp(
                            `Hi Meharoli Tours, I am interested in ${pkg.name}. Please share details & availability.`,
                          )
                        }
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.407A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.958 7.958 0 01-4.078-1.123l-.292-.173-3.027.854.855-3.02-.19-.31A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                        </svg>
                        <span>Get Upto 5% Off on WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        className="header-top-pay-btn full text-center justify-center"
                        style={{ margin: 0, padding: "0.6rem 1rem", fontSize: "0.85rem" }}
                        onClick={() => setIsPaymentModalOpen(true)}
                      >
                        💳 Pay Deposit &amp; Book
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRAVEL BLOGS & GUIDES ── */}
        <section className="blogs py-16 bg-slate-100/60" id="blogs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-3">
                Travel Stories &amp; Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-serif">
                Travel Guides &amp; Inspiration
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
                Explore insider tips, food guides, and secret heritage destinations curated by our expert local travel team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogsData.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer group"
                  onClick={() => {
                    window.location.hash = `#blog-${blog.id}`;
                    setActiveBlogKey(blog.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                      {blog.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs text-gray-400 font-medium mb-2">
                        <span>📅 {blog.date}</span>
                        <span>⏱ {blog.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 font-serif">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                        {blog.excerpt}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full py-2.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors duration-200 border border-orange-200 hover:border-orange-500 flex items-center justify-center gap-1"
                    >
                      Read Full Article →
                    </button>
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
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-3 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-orange-500/30 transition duration-300 inline-flex items-center gap-2 cursor-pointer border border-amber-300/40"
            >
              <span>⭐ Write a Review</span>
            </button>
          </div>
          <div className="testimonials-grid">
            <div className="testimonials-track">
              {[
                ...approvedReviews.map((r) => ({
                  id: r.id,
                  name: r.name,
                  city: r.city,
                  rating: r.rating || 5,
                  text: r.text,
                  avatar: r.avatar || "MK",
                })),
                ...testimonials,
              ].map((t, idx) => (
                <article key={t.id || idx} className="testimonial-card">
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
              {[
                ...approvedReviews.map((r) => ({
                  id: `d-${r.id}`,
                  name: r.name,
                  city: r.city,
                  rating: r.rating || 5,
                  text: r.text,
                  avatar: r.avatar || "MK",
                })),
                ...testimonials,
              ].map((t, idx) => (
                <article
                  key={`dup-${t.id || idx}`}
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
                    <p className="car-price font-semibold text-slate-700 text-sm">
                      Starting @ <strong className="text-orange-600 text-base">{car.priceFrom}</strong>
                    </p>
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

        {/* ── FOUNDER & LEADERSHIP SECTION ── */}
        <section className="founder-section py-16 bg-gradient-to-br from-orange-50/90 via-amber-50/80 to-amber-100/70 border border-orange-200/80 text-slate-900 relative overflow-hidden my-8 rounded-3xl mx-4 sm:mx-8 shadow-xl" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Photo Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group w-full max-w-sm">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/40">
                    <img
                      src="/pictures/dilip_singh_meharoli.jpg"
                      alt="Dilip Singh Meharoli - Founder & CEO"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-6 text-center">
                      <h3 className="text-2xl font-extrabold text-white font-serif tracking-wide">
                        Shri Dilip Singh Meharoli
                      </h3>
                      <p className="text-amber-400 text-sm font-semibold mt-1">
                        Founder &amp; Managing Director
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text & Accomplishments Column */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <span className="bg-orange-500/15 text-orange-700 border border-orange-500/30 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block w-fit mb-4">
                  Leadership &amp; Social Reformer
                </span>
                
                <h2 className="text-2xl sm:text-4xl font-extrabold font-serif leading-tight text-slate-900 mb-4">
                  Steered by 20+ Years of Tourism Excellence &amp; Dedicated Social Work
                </h2>

                <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6">
                  Founded under the vision of <strong className="text-orange-700">Shri Dilip Singh Meharoli</strong>, Meharoli Tours and Travels has grown into one of Rajasthan&apos;s premier travel organizations. With over two decades of hands-on expertise in Rajasthan tourism, Shri Dilip Singh Ji ensures that every guest experiences authentic Indian culture, top-tier luxury, and unmatched safety.
                </p>

                {/* Key Roles & Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/90 border border-orange-100/90 shadow-md rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="bg-orange-500/15 text-orange-600 p-2.5 rounded-xl text-xl flex-shrink-0">
                      🚘
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">President / Head</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Rajasthan Tour &amp; Travel Car Association</p>
                    </div>
                  </div>

                  <div className="bg-white/90 border border-orange-100/90 shadow-md rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="bg-amber-500/15 text-amber-600 p-2.5 rounded-xl text-xl flex-shrink-0">
                      🎗️
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">President (Adhyaksh)</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Shree Rajput Dahej Virodhi Sangh</p>
                    </div>
                  </div>

                  <div className="bg-white/90 border border-orange-100/90 shadow-md rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="bg-emerald-500/15 text-emerald-600 p-2.5 rounded-xl text-xl flex-shrink-0">
                      ⭐
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">20+ Years Experience</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Rajasthan, Delhi &amp; Agra Tourism Industry</p>
                    </div>
                  </div>

                  <div className="bg-white/90 border border-orange-100/90 shadow-md rounded-2xl p-4 flex items-start gap-3.5">
                    <div className="bg-purple-500/15 text-purple-600 p-2.5 rounded-xl text-xl flex-shrink-0">
                      🤝
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Social Reformer</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Active Anti-Dowry Campaigner &amp; Social Worker</p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-800 text-xs sm:text-sm leading-relaxed mb-6 italic border-l-4 border-orange-500 pl-4 py-2 bg-orange-500/10 rounded-r-xl font-medium">
                  &ldquo;We believe that true leadership lies in serving both our travelers and our society. We are committed to eradicating social evils like dowry while promoting ethical tourism across India.&rdquo;
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    type="button"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition duration-300 flex items-center gap-2 text-sm cursor-pointer"
                    onClick={() =>
                      openWhatsApp(
                        "Hi Shri Dilip Singh Meharoli, I want to book a custom travel itinerary with Meharoli Tours."
                      )
                    }
                  >
                    <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.407A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.958 7.958 0 01-4.078-1.123l-.292-.173-3.027.854.855-3.02-.19-.31A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
                    </svg>
                    <span>Connect on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    className="px-6 py-3 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-semibold rounded-xl border border-gray-300 shadow-sm transition duration-300 text-sm cursor-pointer"
                    onClick={scrollToForm}
                  >
                    📝 Request Custom Quote
                  </button>
                </div>

              </div>

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
            <img
              src="/pictures/main-section/logo-removebg-preview.png"
              alt="Meharoli Tours &amp; Travels Logo"
              className="footer-logo-img"
            />
            <div>
              <div className="brand-name">Meharoli Tours and Travels</div>
              <div className="brand-tagline">
                Jaipur &amp; Rajasthan specialists
              </div>
            </div>
          </div>
          <div className="footer-taxi-section">
            <h4 className="footer-taxi-title">
              Popular Taxi Services &amp; Intercity Cab Routes from Jaipur
              <span className="taxi-swipe-hint">👈 Slide Left-Right 👉</span>
            </h4>
            <div className="footer-taxi-grid">
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur City Taxi Tour."); }}>› Jaipur Taxi Tour</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need Jaipur Airport Transfer Pickup/Drop Cab."); }}>› Jaipur Airport Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Delhi Taxi."); }}>› Jaipur to Delhi Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Agra Taj Mahal Taxi."); }}>› Jaipur to Agra Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Ajmer Sharif Taxi."); }}>› Jaipur to Ajmer Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Pushkar Brahma Temple Taxi."); }}>› Jaipur to Pushkar Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Khatu Shyam Ji Temple Taxi."); }}>› Jaipur to Khatu Shyam Ji Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Salasar Balaji Temple Taxi."); }}>› Jaipur to Salasar Balaji Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Ranthambore Tiger Safari Taxi."); }}>› Jaipur to Ranthambore Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Jodhpur Blue City Taxi."); }}>› Jaipur to Jodhpur Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Udaipur Lake City Taxi."); }}>› Jaipur to Udaipur Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Jaisalmer Desert Safari Taxi."); }}>› Jaipur to Jaisalmer Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Bikaner Fort Taxi."); }}>› Jaipur to Bikaner Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mount Abu Hill Station Taxi."); }}>› Jaipur to Mount Abu Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Haridwar Rishikesh Taxi."); }}>› Jaipur to Haridwar Rishikesh Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mathura Vrindavan Taxi."); }}>› Jaipur to Mathura Vrindavan Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Chokhi Dhani Ethnic Village Taxi."); }}>› Jaipur to Chokhi Dhani Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Banasthali Vidyapith Taxi."); }}>› Jaipur to Banasthali Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Bharatpur Bird Sanctuary Taxi."); }}>› Jaipur to Bharatpur Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Sariska Tiger Reserve Taxi."); }}>› Jaipur to Sariska Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mandawa Haveli Heritage Taxi."); }}>› Jaipur to Mandawa Taxi</a>
              <a href="#enquiry-form-section" onClick={(e) => { e.preventDefault(); openWhatsApp("Hi Meharoli Tours, I need a cab fare quote for Golden Triangle Tour (Delhi-Agra-Jaipur)."); }}>› Taxi for Golden Triangle Tour</a>
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
        <div className="footer-bottom flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} Meharoli Tours and Travels. All rights
            reserved.
          </p>
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="text-xs text-slate-400 hover:text-orange-400 transition flex items-center gap-1.5 cursor-pointer bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700"
          >
            <span>🔐 Admin Portal</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

function BlogDetailView({ blogKey, onClose, openWhatsApp }) {
  const blog = blogsData.find((b) => b.id === blogKey);
  if (!blog) return null;

  const [currentSlide, setCurrentSlide] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [blogKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 10);
    return () => clearTimeout(t);
  }, [blogKey]);

  useEffect(() => {
    if (!blog.images || blog.images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blog.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [blog.images]);

  const pageUrl = `https://www.meharolitravels.com/#blog-${blogKey}`;
  const pageTitle = `${blog.title} | Meharoli Travels Blog`;
  const pageDesc = blog.excerpt;
  const pageImage = `https://www.meharolitravels.com${blog.coverImage}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": pageImage,
    "url": pageUrl,
    "datePublished": "2026-07-29",
    "author": {
      "@type": "Organization",
      "name": "Meharoli Tours & Travels"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Meharoli Tours & Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.meharolitravels.com/pictures/main-section/logo-removebg-preview.png"
      }
    }
  };

  return (
    <div className="blog-detail-page bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-16 animate-fadeIn">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={pageImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => onClose()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:text-orange-600 font-semibold rounded-lg shadow-sm border border-gray-200 transition hover:shadow-md cursor-pointer"
        >
          ← Back to All Blogs
        </button>
      </div>

      {/* Hero Banner Section with Slideshow */}
      <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl mb-10 relative h-[250px] sm:h-[400px]">
        {blog.images && blog.images.length > 0 ? (
          blog.images.map((src, idx) => (
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
            style={{ backgroundImage: `url(${blog.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-20">
          <span className="bg-orange-500 text-white text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full mb-3 inline-block">
            {blog.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mb-2">{blog.title}</h1>
          <div className="flex gap-4 text-xs sm:text-sm text-slate-200 font-medium">
            <span>📅 {blog.date}</span>
            <span>•</span>
            <span>⏱ {blog.readTime}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-100 mb-10">
        {blog.content.map((sec, idx) => (
          <div key={idx} className="mb-8 last:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 font-serif">{sec.heading}</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{sec.text}</p>
          </div>
        ))}

        {/* CTA box at end of blog */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white text-center shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold mb-2">Want to experience this yourself?</h3>
          <p className="text-sm text-orange-50 mb-6">Let us build a customized heritage &amp; travel itinerary for you today.</p>
          <button
            type="button"
            className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl shadow-md hover:bg-orange-50 transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
            onClick={() =>
              openWhatsApp(
                `Hi Meharoli Tours, I read your blog "${blog.title}" and would like to plan a custom trip.`
              )
            }
          >
            💬 Inquire via WhatsApp
          </button>
        </div>
      </article>
    </div>
  );
}

export default App;
