import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    title: "Rajasthan",
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
      },
      {
        id: "ranakpur",
        name: "Ranakpur",
        tagline: "World-famous 1,444 carved marble pillar Jain temple in Aravali valley",
        coverImage: "/pictures/ranakpur.jpg",
        markets: [
          {
            name: "Ranakpur Craft Emporium",
            specialty: "Marble sculptures, stone carvings, and traditional wooden crafts"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Marble Temple Wonder & Aravali Scenic Drive",
            details: [
              "Explore the 15th-century Ranakpur Adinath Jain Temple, famous for 1,444 uniquely carved marble pillars.",
              "Visit the nearby Surya Narayan Temple featuring intricate sun god relief carvings.",
              "Enjoy a tranquil nature walk in the lush forested Aravali valley."
            ]
          }
        ]
      },
      {
        id: "kumbhalgarh",
        name: "Kumbhalgarh",
        tagline: "UNESCO fort home to the Great Wall of India (36 KMs) & Badal Mahal",
        coverImage: "/pictures/kumbhalgarh.jpg",
        markets: [
          {
            name: "Kumbhalgarh Fort Artisan Bazaar",
            specialty: "Handcrafted wooden artifacts, Rajasthani puppets, and tribal jewelry"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Great Wall of India & Cloud Palace",
            details: [
              "Walk along the 36-kilometer fort wall of Kumbhalgarh (second longest continuous wall in the world).",
              "Tour Badal Mahal (Palace of Clouds) located at the highest point of the fort.",
              "Attend the mesmerizing evening Light & Sound Show illuminating the fort ramparts."
            ]
          }
        ]
      },
      {
        id: "chittorgarh",
        name: "Chittorgarh",
        tagline: "Pride of Rajputana with Vijay Stambha & Rani Padmini Palace fort",
        coverImage: "/pictures/chittorgarh.jpg",
        markets: [
          {
            name: "Chittorgarh Fort Craft Market",
            specialty: "Akola print fabrics, wooden toys, and brass metallic artwork"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Massive Victory Fort & Royal Palaces",
            details: [
              "Explore UNESCO World Heritage Chittorgarh Fort, spanning over 700 acres atop a hill.",
              "Marvel at the 9-story Vijay Stambha (Victory Tower) built by Maharana Kumbha in 1448.",
              "Visit Rani Padmini Palace situated in the midst of a lotus pool and Kirti Stambha."
            ]
          }
        ]
      },
      {
        id: "bundi",
        name: "Bundi",
        tagline: "City of blue houses, painted Garh Palace & ancient stepwells",
        coverImage: "/pictures/bundi.jpg",
        markets: [
          {
            name: "Bundi Main Bazaar",
            specialty: "Bundi school miniature paintings, Kota Doria sarees, and brass lanterns"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Stepwells & Royal Mural Galleries",
            details: [
              "Tour Garh Palace and its world-renowned Chitrashala featuring vibrant 18th-century miniature frescoes.",
              "Visit Taragarh Fort overlooking the blue city and Nawal Sagar Lake.",
              "Marvel at the intricate stone carvings of Raniji ki Baori (Queen's Stepwell)."
            ]
          }
        ]
      },
      {
        id: "kota",
        name: "Kota",
        tagline: "Seven Wonders Park, Chambal Riverfront & Kishore Sagar Palace",
        coverImage: "/pictures/kota.jpg",
        markets: [
          {
            name: "Rampura Bazaar",
            specialty: "Authentic Kota Doria silk sarees, Kota stone artifacts, and local Namkeen"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Chambal Riverfront & Seven Wonders",
            details: [
              "Stroll through the newly constructed world-class Chambal Riverfront garden.",
              "Visit Seven Wonders Park featuring miniature replicas of world monuments along Kishore Sagar Lake.",
              "Tour Kota Garh Palace & Rao Madho Singh Museum showcasing royal armor and weapons."
            ]
          }
        ]
      },
      {
        id: "sariska",
        name: "Sariska",
        tagline: "Royal Bengal Tiger safari reserve & ancient Kankwari Fort",
        coverImage: "/pictures/sariska.jpg",
        markets: [
          {
            name: "Alwar Sadar Bazaar",
            specialty: "Famous Alwar Milk Cake (Mawa Petha), silver crafts, and leather Mojris"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Tiger Safari & Haunted Bhangarh Excursion",
            details: [
              "Embark on an open 4x4 Jeep Jungle Safari inside Sariska Tiger Reserve to spot Royal Bengal Tigers & leopards.",
              "Visit the ancient 17th-century Kankwari Fort located inside the forest reserve.",
              "Optional excursion to the famous haunted Bhangarh Fort ruins."
            ]
          }
        ]
      },
      {
        id: "ajmer",
        name: "Ajmer",
        tagline: "Holy shrine of Khwaja Moinuddin Chishti & Ana Sagar Lake",
        coverImage: "/pictures/ajmer.jpg",
        markets: [
          {
            name: "Dargah Bazaar",
            specialty: "Attar natural perfumes, velvet chadors, rose garlands, and Sohan Halwa"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Sacred Shrine & Scenic Lakes",
            details: [
              "Pay homage at the revered Ajmer Sharif Dargah of Sufi Saint Khwaja Moinuddin Chishti.",
              "Visit Adhai Din Ka Jhonpra, an ancient mosque featuring intricate Indo-Islamic arches.",
              "Enjoy a sunset boat cruise on Ana Sagar Lake surrounded by marble Daulat Bagh pavilions."
            ]
          }
        ]
      },
      {
        id: "jawai",
        name: "Jawai",
        tagline: "Land of wild leopards coexisting with Rabari shepherds on granite hills",
        coverImage: "/pictures/jawai.jpg",
        markets: [
          {
            name: "Rabari Tribal Craft Market",
            specialty: "Handwoven wool shawls, traditional red turbans, and silver tribal jewelry"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Granite Hill Leopard Safari & Rabari Culture",
            details: [
              "Take a specialized open 4x4 Jeep safari across granite rock formations tracking wild leopards.",
              "Visit Jawai Dam reservoir, home to hundreds of mugger crocodiles and migratory flamingos.",
              "Guided village eco-walk with native Rabari tribal shepherds."
            ]
          }
        ]
      },
      {
        id: "osian",
        name: "Osian",
        tagline: "Khajuraho of Rajasthan with 8th-century Sun Temple & Thar sand dunes",
        coverImage: "/pictures/osian.jpg",
        markets: [
          {
            name: "Osian Temple Street",
            specialty: "Sandstone carved miniatures, temple souvenirs, and camel leather crafts"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Ancient Temples & Sunset Desert Safari",
            details: [
              "Tour 8th-century Sun Temple & Sachiya Mata Temple famous for detailed erotic stone relief carvings.",
              "Explore the ancient Mahavira Jain Temple complex built in 783 AD.",
              "Experience a camel ride at sunset across Osian sand dunes followed by desert camp tea."
            ]
          }
        ]
      },
      {
        id: "khichan",
        name: "Khichan",
        tagline: "World-famous winter sanctuary for thousands of Demoiselle Cranes (Kurjan)",
        coverImage: "/pictures/khichan.jpg",
        markets: [
          {
            name: "Village Craft Walk",
            specialty: "Handmade organic cotton quilts, bird art, and local desert grains"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Demoiselle Crane Bird Spectacle",
            details: [
              "Witness thousands of migratory Demoiselle Cranes (Kurjan) swooping down to feed at Chugga Ghar at sunrise.",
              "Learn about Khichan's eco-friendly community conservation tradition.",
              "Stroll through quiet desert village lanes and historic red sandstone havelis."
            ]
          }
        ]
      },
      {
        id: "sambhar",
        name: "Sambhar",
        tagline: "India's largest inland salt lake, white salt flatlands & flamingo sanctuary",
        coverImage: "/pictures/sambhar.jpg",
        markets: [
          {
            name: "Sambhar Heritage Market",
            specialty: "Pure rock salt lamps, local terracotta pottery, and salt crafts"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "White Salt Flats & Vintage Salt Train",
            details: [
              "Drive across the endless white salt flatlands of India's largest inland salt lake.",
              "Take a ride on the century-old historic Sambhar Salt Railway train.",
              "Visit Shakambhari Devi Temple and watch pink flamingos wading in shallow salt waters."
            ]
          }
        ]
      },
      {
        id: "bharatpur",
        name: "Bharatpur",
        tagline: "UNESCO World Heritage Keoladeo Ghana Bird Sanctuary & Lohagarh Fort",
        coverImage: "/pictures/bharatpur.jpg",
        markets: [
          {
            name: "Main Market Bharatpur",
            specialty: "Brassware ornaments, wooden birds, and traditional Indian sweets"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Cycle Rickshaw Bird Safari & Unbreached Fort",
            details: [
              "Guided cycle-rickshaw safari through UNESCO Keoladeo National Park, home to over 370 bird species.",
              "Visit Lohagarh Fort (Iron Fort), one of the strongest un-breached forts in Indian history.",
              "Tour Ganga Mandir and Laxman Temple in the historic town center."
            ]
          }
        ]
      },
      {
        id: "fatehpur_shekhawati",
        name: "Fatehpur Shekhawati",
        tagline: "Open-air art gallery of fresco painted merchant havelis & stepwells",
        coverImage: "/pictures/fatehpur_shekhawati.jpg",
        markets: [
          {
            name: "Shekhawati Art Emporium",
            specialty: "Antique carved wooden doors, miniature wall paintings, and brassware"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Fresco Painted Havelis & Cultural Centre",
            details: [
              "Visit Nadine Le Prince Cultural Centre housed in Haveli Le Prince featuring restored 19th-century frescoes.",
              "Tour Singhania Haveli and Devra Haveli showcasing rare oil paintings and vintage mirrors.",
              "Explore ancient stepwells and grand merchant courtyards."
            ]
          }
        ]
      },
      {
        id: "nawalgarh",
        name: "Nawalgarh",
        tagline: "Golden City of Shekhawati with Poddar Haveli Museum & grand frescoes",
        coverImage: "/pictures/nawalgarh_poddar_haveli.jpg",
        markets: [
          {
            name: "Nawalgarh Heritage Bazar",
            specialty: "Handcrafted wooden puppets, vintage chests, and bandhani textiles"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Poddar Haveli Museum & Palace Architecture",
            details: [
              "Tour the Anandilal Poddar Haveli Museum, showcasing 753 pristine restored wall paintings.",
              "Visit Morarka Haveli, Koolwal Kothi, and the grand Roop Niwas Palace.",
              "Stroll through vibrant bazaar lanes surrounded by painted facades."
            ]
          }
        ]
      },
      {
        id: "salasar",
        name: "Salasar",
        tagline: "Sacred Salasar Balaji Hanuman Temple pilgrimage center",
        coverImage: "/pictures/osian.jpg",
        markets: [
          {
            name: "Salasar Temple Bazaar",
            specialty: "Salasar Balaji photo frames, brass gadas, coconuts, red chunri, and Churma"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Holy Darshan & Hanuman Chalisa Prayer",
            details: [
              "VIP Darshan at the sacred Salasar Balaji Temple, worshipping Lord Hanuman with a moustache and beard.",
              "Participate in the traditional Sawaamani prasad offering and community feast.",
              "Attend evening prayer chanting and devotional Aarti inside the temple sanctum."
            ]
          }
        ]
      },
      {
        id: "khatu_shyam",
        name: "Khatu Shyam",
        tagline: "Sacred Khatu Shyam Ji Temple (Barbareek - Shyam Baba) in Sikar",
        coverImage: "/pictures/khatu_shyam_salasar_temple.jpg",
        markets: [
          {
            name: "Khatu Dham Bazaar",
            specialty: "Shyam Baba flags (Nishan), peacock feathers, silver rings, and Peda sweets"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Holy Khatu Shyam Darshan & Shyam Kund",
            details: [
              "VIP Darshan of Lord Khatu Shyam Ji (Barbareek - Sheesh Ke Dani) in Sikar district.",
              "Holy dip in the sacred Shyam Kund water reservoir.",
              "Witness colorful Nishan Yatra devotional flag processions."
            ]
          }
        ]
      },
      {
        id: "mehandipur_balaji",
        name: "Mehandipur Balaji",
        tagline: "World-famous divine healing temple of Shri Hanuman Ji in Dausa",
        coverImage: "/pictures/osian.jpg",
        markets: [
          {
            name: "Balaji Temple Bazaar",
            specialty: "Special Darkah prasad, sacred mustard oil lamps, and black pepper offerings"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Divine Healing & Temple Darshan",
            details: [
              "Darshan of Shri Mehandipur Balaji Maharaj in Dausa district, world-famous for spiritual healing.",
              "Visit Shri Pretraj Sarkar and Kotwal Shri Bhairav Baba shrines within the temple complex.",
              "Experience the powerful spiritual vibrations and morning/evening Maha Aarti."
            ]
          }
        ]
      },
      {
        id: "six_senses_fort_barwara",
        name: "Six Senses Fort Barwara (Sawai Madhopur)",
        tagline: "14th-century royal fort resort in Chauth Ka Barwara (Katrina Kaif Marriage Venue)",
        coverImage: "/pictures/six-senses-fort.png",
        markets: [
          {
            name: "Chauth Ka Barwara Craft Market",
            specialty: "Mehandi henna art, organic spices, and traditional Sawai Madhopur crafts"
          }
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "14th-Century Fort Luxury & Chauth Mata Temple",
            details: [
              "Tour Six Senses Fort Barwara, a grand 14th-century royal palace fort restored into a 5-star sanctuary (famous celebrity wedding venue).",
              "Ascend the hilltop Chauth Mata Temple offering views of Sawai Madhopur valley.",
              "Enjoy fine dining and heritage walks inside the fort ramparts."
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
  },
  {
    id: "jaipur-diwali-lights-guide",
    title: "Diwali in Jaipur & Rajasthan: Fairs, Lights & Royal Celebrations",
    excerpt: "Discover why Jaipur's Pink City bazaars, Nahargarh Fort, and illuminated heritage palaces offer India's grandest Diwali festival experience.",
    category: "Festival Special",
    date: "October 12, 2026",
    readTime: "6 min read",
    coverImage: "/pictures/diwali_festival_jaipur.jpg",
    images: [
      "/pictures/diwali_festival_jaipur.jpg",
      "/pictures/main-section/jaipur-albert-hall-museum.jpg",
      "/pictures/main-section/jaipur-jal-mahal-water-palace.jpg"
    ],
    content: [
      {
        heading: "The Legendary Pink City Bazaars Diwali Lighting",
        text: "Jaipur takes Diwali celebrations to a royal level! Every year during Diwali, the Vyapar Mandals (traders associations) of Johari Bazaar, Bapu Bazaar, MI Road, and Tripolia Bazaar spend months installing millions of fairy lights, thematic arches, and glittering LED gates. Walking through the illuminated Pink City streets feels like stepping into a fairy tale kingdom."
      },
      {
        heading: "Diya Lighting & Royal Palace Traditions",
        text: "Experience traditional Lakshmi Puja at historic temples like Govind Dev Ji Temple and Moti Dungri Ganesh Temple. Thousands of brass earthen lamps (diyas) light up palace courtyards, while Nahargarh Fort offers a breathtaking panoramic night view of the glowing Pink City below."
      },
      {
        heading: "Authentic Rajasthani Diwali Sweets & Shopping",
        text: "Taste freshly made Mawa Kachori, Ghewar, and Kaju Katli from Jaipur's iconic sweet shops like Laxmi Misthan Bhandar (LMB) and Rawat Sweets. Pair your festival tour with private AC cab transfers for a seamless experience."
      }
    ]
  },
  {
    id: "pushkar-camel-fair-guide",
    title: "Pushkar Camel Fair: Dates, Highlights & Culture Guide",
    excerpt: "Everything you need to know about Pushkar Mela: camel trading, turban competitions, holy lake ghat Aarti, and desert photography tips.",
    category: "Fairs & Culture",
    date: "November 05, 2026",
    readTime: "7 min read",
    coverImage: "/pictures/pushkar_lake.jpg",
    images: [
      "/pictures/pushkar_lake.jpg",
      "/pictures/bikaner.jpg",
      "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg"
    ],
    content: [
      {
        heading: "The Spirit of Pushkar Camel Fair (Pushkar Mela)",
        text: "Held annually in the sacred town of Pushkar, Rajasthan, the Pushkar Camel Fair is one of the world's largest livestock fairs. Over 50,000 camels, horses, and cattle are brought by nomadic traders across the Thar Desert for trade, dressed in colorful pom-poms, silver anklets, and embroidered saddles."
      },
      {
        heading: "Cultural Competitions & Desert Festivities",
        text: "The fair grounds host hilarious and thrilling events including the 'Longest Mustache Competition', 'Bridal Dress Competition', 'Rajasthani Turban Tying Contest', and spirited Matka Race. Folk dancers and musicians perform Kalbelia and Ghoomar under the evening sky."
      },
      {
        heading: "Sacred Lake Pushkar Ghats & Brahma Temple",
        text: "Pushkar is home to the world's only Lord Brahma Temple. Take a holy dip at the 52 ghats surrounding Pushkar Lake during Kartik Purnima, followed by participating in the divine Maha Aarti with lamps floating across the water."
      }
    ]
  },
  {
    id: "holi-festival-rajasthan-guide",
    title: "Holi Festival in Jaipur & Mathura: Organic Colors & Royal Traditions",
    excerpt: "Experience the vibrant Festival of Colors in Jaipur royal court style and Mathura-Vrindavan's sacred Krishna temples.",
    category: "Festival Special",
    date: "March 15, 2027",
    readTime: "5 min read",
    coverImage: "/pictures/holi_festival_jaipur.jpg",
    images: [
      "/pictures/holi_festival_jaipur.jpg",
      "/pictures/khatu_shyam_salasar_temple.jpg",
      "/pictures/main-section/jaipur-patrika-gate-monument.jpg"
    ],
    content: [
      {
        heading: "Royal Holi Celebrations in Jaipur",
        text: "Celebrate Holi like Rajasthani royalty! Jaipur's heritage hotels and City Palace host private Holi gatherings featuring organic herbal Gulal colors, live Chang & Dhol drum beats, Ghoomar folk dancers, and refreshing saffron Thandai drinks."
      },
      {
        heading: "Mathura & Vrindavan Sacred Holi",
        text: "Just a short drive from Agra on the Golden Triangle circuit lies Mathura & Vrindavan, birthplace of Lord Krishna. Experience Phoolon ki Holi (Holi played with flower petals) at Banke Bihari Temple and Lathmar Holi traditions."
      },
      {
        heading: "Travel Tips for International Tourists on Holi",
        text: "Wear white cotton clothes, use natural herbal colors (Gulal), protect your camera with dry bags, and book a dedicated private AC driver with Meharoli Tours for hassle-free festive travel."
      }
    ]
  },
  {
    id: "jaipur-kite-festival-guide",
    title: "Jaipur International Kite Festival (Makar Sankranti) Guide",
    excerpt: "Join the sky-high energy of Jaipur's Kite Flying Festival on Jan 14 with rooftop DJ parties, Til-Laddoo treats, and evening fireworks.",
    category: "Festivals & Events",
    date: "January 10, 2027",
    readTime: "4 min read",
    coverImage: "/pictures/kite_festival_jaipur.jpg",
    images: [
      "/pictures/kite_festival_jaipur.jpg",
      "/pictures/main-section/jaipur-jal-mahal-water-palace.jpg",
      "/pictures/main-section/jaipur-albert-hall-museum.jpg"
    ],
    content: [
      {
        heading: "Jaipur's Sky of Kites on Makar Sankranti",
        text: "On January 14 every year, the entire city of Jaipur moves to its rooftops! Millions of colorful paper kites fill the sky as locals battle each other with shouts of 'Woh Katae!' echoing across Pink City neighborhoods."
      },
      {
        heading: "International Kite Festival at Jal Mahal Ground",
        text: "Jaipur Tourism organizes the International Kite Festival at Polo Ground and Jal Mahal lakefront, featuring giant stunt kites flown by master kite flyers from Japan, USA, UK, and Europe."
      },
      {
        heading: "Night Sky Lanterns & Festive Gastronomy",
        text: "As darkness falls, the sky lights up with thousands of glowing paper sky lanterns (Tukkal) and fireworks. Savor traditional seasonal delicacies like Til-Gud Laddoo, Pakoras, and Gazak."
      }
    ]
  },
  {
    id: "gangaur-festival-jaipur-guide",
    title: "Gangaur Festival Jaipur: Royal Palanquin Procession & Heritage Guide",
    excerpt: "Experience the magnificent Gangaur festival in Jaipur: Goddess Gauri royal palanquin procession, decorated elephants, brass kalash dance, and heritage court traditions.",
    category: "Festival Special",
    date: "April 02, 2027",
    readTime: "5 min read",
    coverImage: "/pictures/gangaur_festival_jaipur.jpg",
    images: [
      "/pictures/gangaur_festival_jaipur.jpg",
      "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
      "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg"
    ],
    content: [
      {
        heading: "The Majesty of Gangaur Procession at Tripolia Gate",
        text: "Gangaur is one of Rajasthan's most sacred and colorful festivals. Celebrating Goddess Gauri (Parvati), married and unmarried women wear traditional bright Rajasthani attire, carry brass kalash and decorated wooden idols on their heads, and process through Tripolia Gate from City Palace."
      },
      {
        heading: "Royal Elephants, Camels & Folk Troupes",
        text: "The Jaipur royal family sends out caparisoned elephants, decorated horses, vintage palanquins, and royal guards alongside traditional Kalbelia dancers, Shekhawati Dhol performers, and local musicians."
      },
      {
        heading: "Festive Delicacies & Photography Locations",
        text: "Tasting seasonal Ghewar sweets and observing intricate Henna (Mehendi) designs are central to Gangaur. The best photo spots include City Palace Tripolia Gate balcony and Chhoti Chaupar."
      }
    ]
  },
  {
    id: "luxury-india-travel-guide-heritage-palaces",
    title: "Luxury Travel in India: Royal Heritage Palaces, Private Drivers & Curated Escapes",
    excerpt: "An insider guide for international luxury travelers exploring India in style — from Oberoi and Taj palace stays to private chauffeured cars and curated VIP experiences.",
    category: "Luxury Travel",
    date: "May 10, 2027",
    readTime: "8 min read",
    coverImage: "/pictures/bikaner.jpg",
    images: [
      "/pictures/bikaner.jpg",
      "/pictures/udaipur.jpg",
      "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg"
    ],
    content: [
      {
        heading: "Staying in Royal Heritage Palaces & Oberoi Retreats",
        text: "India offers one of the world's most unique luxury hospitality experiences. Former royal residences, such as Taj Lake Palace in Udaipur, Umaid Bhawan Palace in Jodhpur, and Rambagh Palace in Jaipur, allow guests to live like Maharajas with personal butler services, private vintage car transfers, and moonlit dining overlooking sacred lakes."
      },
      {
        heading: "The Importance of a Private Car with Chauffeur",
        text: "Navigating India's bustling highways and historic city corridors is effortless when accompanied by a professional English-speaking private driver. Experienced chauffeurs act as local route experts, ensuring safe, air-conditioned transfers between monuments, luxury hotels, and authentic food halts."
      },
      {
        heading: "Curated VIP Experiences Across North & South India",
        text: "From private sunrise access at the Taj Mahal to luxury desert glamping in Jaisalmer's Sam Sand Dunes and private backwater houseboats in Kerala, bespoke itineraries cater to discerning travelers seeking privacy, comfort, and authentic cultural connection."
      }
    ]
  },
  {
    id: "rajasthan-car-rental-with-driver-tips",
    title: "Hiring a Private Car & Driver in Rajasthan: Essential Guide for Foreign Tourists",
    excerpt: "Why hiring a private AC sedan or luxury SUV with an experienced English-speaking driver is the safest, most flexible, and comfortable way to explore India's royal state.",
    category: "Travel Tips",
    date: "May 02, 2027",
    readTime: "6 min read",
    coverImage: "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
    images: [
      "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
      "/pictures/jodhpur.jpg",
      "/pictures/delhi.jpg"
    ],
    content: [
      {
        heading: "Why Renting a Car with Driver Beats Driving or Trains",
        text: "Navigating Rajasthan's highways requires local expertise. Renting a private car with a dedicated driver gives you 100% door-to-door flexibility. You can stop at roadside stepwells, chai stalls, and village craft centers at your own pace without stress."
      },
      {
        heading: "Choosing the Right Vehicle for Your Group",
        text: "For couples and solo travelers, comfortable sedans like Suzuki Dzire provide smooth transport. For families and small groups, Toyota Innova Crysta luxury SUVs offer superior legroom and suspension for long desert drives between Jaipur, Jodhpur, and Udaipur."
      },
      {
        heading: "Transparent All-Inclusive Pricing",
        text: "Always ensure your rental includes all highway toll taxes, interstate permits, parking fees, fuel, and driver allowances with zero hidden costs, allowing you to enjoy your holiday without unexpected expenses."
      }
    ]
  },
  {
    id: "golden-triangle-luxury-itinerary-first-time-tourists",
    title: "The Ultimate Luxury Golden Triangle Tour: Delhi, Taj Mahal Agra & Jaipur",
    excerpt: "Discover how to experience India's classic Golden Triangle circuit with 5-star heritage hotels, private sunrise Taj access, and stress-free luxury transfers.",
    category: "Golden Triangle",
    date: "April 20, 2027",
    readTime: "7 min read",
    coverImage: "/pictures/agra_tajmahal.jpg",
    images: [
      "/pictures/agra_tajmahal.jpg",
      "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg",
      "/pictures/delhi.jpg"
    ],
    content: [
      {
        heading: "Classic Circuit with 5-Star Comfort",
        text: "The Golden Triangle linking Delhi, Agra, and Jaipur is India's most celebrated travel corridor. Staying at world-famous luxury retreats like Oberoi Amarvilas in Agra (where every room faces the Taj Mahal) elevates this classic route into an extraordinary journey."
      },
      {
        heading: "Private Sunrise Taj Mahal Excursion",
        text: "Skip midday heat and crowds by entering the Taj Mahal complex at first light. Accompanied by a private historian guide, witness the marble change from cool blue to warm gold as morning sun breaks over the Yamuna River."
      },
      {
        heading: "Private Forts & Bazaars in Jaipur",
        text: "In Jaipur, ascend hilltop Amer Fort by private Jeep, explore the royal court chambers of City Palace, and enjoy curated shopping in Johari Bazaar for emerald jewelry and hand-printed silk textiles."
      }
    ]
  },
  {
    id: "varanasi-ganges-aarti-spiritual-tour-guide",
    title: "Varanasi Ganga Aarti & Sacred Ghats: Spiritual Escapes for Overseas Visitors",
    excerpt: "Experience the eternal soul of India in Varanasi — private sunrise boat rides along the Ganges, evening Harishchandra Ghat Aarti, and ancient temple walks.",
    category: "Spiritual Travel",
    date: "April 10, 2027",
    readTime: "6 min read",
    coverImage: "/pictures/pushkar_lake.jpg",
    images: [
      "/pictures/pushkar_lake.jpg",
      "/pictures/khatu_shyam_salasar_temple.jpg",
      "/pictures/delhi.jpg"
    ],
    content: [
      {
        heading: "Sunrise Boat Cruise on the Sacred Ganges",
        text: "Varanasi is one of the world's oldest continuously inhabited cities. At dawn, board a private wooden boat along the River Ganges to watch pilgrims perform morning prayers, yoga, and ritual dips across 84 historic ghats."
      },
      {
        heading: "Grand Evening Ganga Aarti at Dashashwamedh Ghat",
        text: "As darkness falls, priest scholars in gilded robes perform the grand Ganga Aarti with brass oil lamps, incense, chank shells, and rhythmic Vedic chants. Watching the ritual from a private boat on the water is an unforgettable spiritual memory."
      },
      {
        heading: "Sarnath Buddhist Heritage & Old City Walking Tour",
        text: "Visit nearby Sarnath, where Lord Buddha gave his first sermon after enlightenment. Walk through Varanasi's ancient narrow alleys (Galisa) tasting hot Malaiyyo cream sweets and visiting Banarasi silk weaving workshops."
      }
    ]
  },
  {
    id: "kerala-backwaters-houseboat-luxury-wellness-escape",
    title: "Kerala Backwaters & Houseboats: Luxury Wellness & Nature Retreat Guide",
    excerpt: "Unwind in South India's palm-fringed backwaters with private luxury houseboats, Ayurvedic spa treatments, and tea plantation walks in Munnar.",
    category: "South India Luxury",
    date: "March 28, 2027",
    readTime: "6 min read",
    coverImage: "/pictures/pushkar_lake.jpg",
    images: [
      "/pictures/pushkar_lake.jpg",
      "/pictures/bikaner.jpg",
      "/pictures/main-section/jaipur-jal-mahal-water-palace.jpg"
    ],
    content: [
      {
        heading: "Cruising the Palm-Fringed Backwaters of Alleppey",
        text: "Board a private luxury Kettuvallam (traditional thatched houseboat) in Alleppey. Cruise past serene coconut groves, paddy fields, and quiet canal villages while your private onboard chef prepares fresh coastal seafood and traditional Kerala thali."
      },
      {
        heading: "Misty Tea Gardens of Munnar & Wildlife Safaris",
        text: "Ascend into the Western Ghats to Munnar, famous for rolling green tea estates, cardamom hills, and cool mountain air. Visit Periyar Tiger Reserve in Thekkady for bamboo rafting and spice plantation walks."
      },
      {
        heading: "Authentic Ayurvedic Spa & Beachfront Luxury",
        text: "Rejuvenate with traditional Abhyanga oil massages and herbal wellness therapies at beachfront spa resorts in Mararikulam and Kovalam."
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
const taxiCategories = [
  { id: "all", label: " All Routes" },
  { id: "devotional", label: " Devotional & Yatra" },
  { id: "outstation", label: " Outstation & Intercity" },
  { id: "local", label: " Local & Airport Transfer" },
];

const taxiRoutes = [
  { label: "Jaipur Taxi Tour", category: "local", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur City Taxi Tour." },
  { label: "Jaipur Airport Taxi", category: "local", msg: "Hi Meharoli Tours, I need Jaipur Airport Transfer Pickup/Drop Cab." },
  { label: "Jaipur to Delhi Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Delhi Taxi." },
  { label: "Jaipur to Agra Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Agra Taj Mahal Taxi." },
  { label: "Jaipur to Ajmer Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Ajmer Sharif Taxi." },
  { label: "Jaipur to Pushkar Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Pushkar Brahma Temple Taxi." },
  { label: "Jaipur to Khatu Shyam Ji Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Khatu Shyam Ji Temple Taxi." },
  { label: "Jaipur to Salasar Balaji Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Salasar Balaji Temple Taxi." },
  { label: "Jaipur to Ranthambore Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Ranthambore Tiger Safari Taxi." },
  { label: "Jaipur to Jodhpur Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Jodhpur Blue City Taxi." },
  { label: "Jaipur to Udaipur Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Udaipur Lake City Taxi." },
  { label: "Jaipur to Jaisalmer Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Jaisalmer Desert Safari Taxi." },
  { label: "Jaipur to Bikaner Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Bikaner Fort Taxi." },
  { label: "Jaipur to Mount Abu Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mount Abu Hill Station Taxi." },
  { label: "Jaipur to Haridwar Rishikesh Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Haridwar Rishikesh Taxi." },
  { label: "Jaipur to Mathura Vrindavan Taxi", category: "devotional", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mathura Vrindavan Taxi." },
  { label: "Jaipur to Chokhi Dhani Taxi", category: "local", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Chokhi Dhani Ethnic Village Taxi." },
  { label: "Jaipur to Banasthali Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Banasthali Vidyapith Taxi." },
  { label: "Jaipur to Bharatpur Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Bharatpur Bird Sanctuary Taxi." },
  { label: "Jaipur to Sariska Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Sariska Tiger Reserve Taxi." },
  { label: "Jaipur to Mandawa Taxi", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Jaipur to Mandawa Haveli Heritage Taxi." },
  { label: "Taxi for Golden Triangle Tour", category: "outstation", msg: "Hi Meharoli Tours, I need a cab fare quote for Golden Triangle Tour (Delhi-Agra-Jaipur)." },
];

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
  const [activeTaxiCategory, setActiveTaxiCategory] = useState("all");
  const [showAllTaxis, setShowAllTaxis] = useState(false);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [pkgSearchQuery, setPkgSearchQuery] = useState("");
  const [taxiSearchQuery, setTaxiSearchQuery] = useState("");

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

  // Handle URL Hash & Path Deep-linking & SEO Title Sync for Crawlers & Visitors
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");

      if (path === "/admin" || hash === "#admin") {
        setIsAdminOpen(true);
      } else if (path === "/delhi" || hash === "#destination-delhi") {
        setActiveDestination("delhi");
        setActiveBlogKey(null);
        window.scrollTo(0, 0);
      } else if (path === "/agra" || hash === "#destination-agra") {
        setActiveDestination("agra");
        setActiveBlogKey(null);
        window.scrollTo(0, 0);
      } else if (path === "/rajasthan" || hash === "#destination-rajasthan") {
        setActiveDestination("rajasthan");
        setActiveRajasthanCity(null);
        setActiveBlogKey(null);
        window.scrollTo(0, 0);
      } else if (path === "/blogs" || hash === "#blogs") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("blogs");
      } else if (path === "/packages" || hash === "#packages") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("packages");
      } else if (path === "/cars" || hash === "#cars") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("cars");
      } else if (path === "/popular-taxi-routes" || hash === "#popular-taxi-routes") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("popular-taxi-routes");
      } else if (path === "/about" || hash === "#about") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("about");
      } else if (path === "/contact" || hash === "#enquiry-form-section") {
        setActiveDestination(null);
        setActiveBlogKey(null);
        scrollToTarget("enquiry-form-section");
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

    handleUrlChange();
    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
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
      document.title = "Best Travel Agency in Jaipur | Jaipur Sightseeing & Tours | Meharoli Tours";
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

  const handleTaxiRouteClick = (route) => {
    openWhatsApp(route.msg);
  };

  const [selectedPackage, setSelectedPackage] = useState("");
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const packageDropdownRef = useRef(null);
  const categoryScrollRef = useRef(null);

  const scrollCategoryPills = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [activePkgCategory, setActivePkgCategory] = useState("all");
  const [selectedModalPackage, setSelectedModalPackage] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("itinerary");

  const pkgCategories = [
    { id: "all", label: "🌟 All Packages (35)" },
    { id: "luxury-tours", label: "👑 Royal Luxury & Palace Tours" },
    { id: "festivals", label: "🪔 Fairs & Festival Tours" },
    { id: "golden-triangle", label: "📐 Golden Triangle Circuits" },
    { id: "rajasthan-heritage", label: "🏰 Rajasthan Royal Heritage" },
    { id: "luxury-wildlife", label: "🐅 Wildlife & Tiger Safaris" },
    { id: "offbeat-rural", label: "🌾 Offbeat & Castle Stays" },
    { id: "spiritual", label: "🌺 Spiritual & Pilgrimage" },
    { id: "day-tours", label: "🚗 Same Day Tours" },
  ];

  const packageOptions = [
    { value: "Luxury India Honeymoon: Taj Mahal to Thar Desert", label: "Luxury India Honeymoon: Taj Mahal to Thar Desert" },
    { value: "Luxury Rajasthan & Kerala Heritage Grand Tour", label: "Luxury Rajasthan & Kerala Heritage Grand Tour" },
    { value: "Luxury Jodhpur & Udaipur Royal Forts Escape", label: "Luxury Jodhpur & Udaipur Royal Forts Escape" },
    { value: "Delhi Full-Day Capital Heritage Excursion", label: "Delhi Full-Day Capital Heritage Excursion" },
    { value: "Same Day Taj Mahal & Agra Fort Tour from Delhi", label: "Same Day Taj Mahal & Agra Fort Tour from Delhi" },
    { value: "Golden Triangle Tour with Diwali Festival", label: "Golden Triangle Tour with Diwali Festival" },
    { value: "Golden Triangle Tour with Pushkar Fair", label: "Golden Triangle Tour with Pushkar Fair" },
    { value: "Golden Triangle Tour with Holi Festival", label: "Golden Triangle Tour with Holi Festival" },
    { value: "Golden Triangle with Kite Festival Jaipur", label: "Golden Triangle with Kite Festival Jaipur" },
    { value: "Golden Triangle with Bikaner Camel Festival", label: "Golden Triangle with Bikaner Camel Festival" },
    { value: "Golden Triangle Tour with Gangaur Festival", label: "Golden Triangle Tour with Gangaur Festival" },
    { value: "Golden Triangle Tour with Teej Festival", label: "Golden Triangle Tour with Teej Festival" },
    { value: "3 Days Golden Triangle Express Tour", label: "3 Days Golden Triangle Express Tour" },
    { value: "4 Days Golden Triangle Classic Tour", label: "4 Days Golden Triangle Classic Tour" },
    { value: "5 Days Golden Triangle Heritage & Culture Tour", label: "5 Days Golden Triangle Heritage Tour" },
    { value: "6 Days Golden Triangle with Ranthambore Tiger Safari", label: "6 Days Golden Triangle with Tiger Safari" },
    { value: "Golden Triangle with Udaipur & Jaisalmer Desert Tour", label: "Golden Triangle with Udaipur & Jaisalmer" },
    { value: "Golden Triangle with Rishikesh & Haridwar Ganga Tour", label: "Golden Triangle with Rishikesh & Ganga Aarti" },
    { value: "Jaipur Royal Forts & Heritage Sightseeing", label: "Jaipur Royal Forts & Heritage Sightseeing" },
    { value: "Khatu Shyam Ji & Salasar Balaji Divine Circuit", label: "Khatu Shyam Ji & Salasar Balaji Divine Circuit" },
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
      category: "golden-triangle",
      name: "3 Days Golden Triangle Express Tour",
      tag: "Express Special",
      duration: "3 Days / 2 Nights",
      kms: "480 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi (Qutub & Red Fort)", "Agra (Taj Mahal Sunset)", "Jaipur (Pink City Forts)"],
      image: "/pictures/delhi.jpg",
      tip: "⚡ Express Tip: Perfect for weekend travelers! Experience Delhi, Taj Mahal sunrise & Amber Fort in 3 days.",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 3-Day Circuit",
        "All Highways Tolls, Parking & Driver Taxes Included",
        "Sunrise Taj Mahal Visit with Local Guide Assistance",
        "Doorstep Hotel / Airport Pickup in Delhi & Drop in Jaipur/Delhi"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Pickup, Capital Heritage Sightseeing & Drive to Agra",
          activities: [
            "After your arrival at Delhi Airport or Railway Station, you will be warmly greeted by your private AC chauffeur and escorted to your comfortable vehicle. Begin your capital sightseeing with a visit to the 12th-century Qutub Minar, a UNESCO World Heritage site standing 73 meters high, surrounded by ancient iron pillars and intricate carved Afghan ruins. Continue past Lotus Temple, the magnificent red sandstone Red Fort built by Emperor Shah Jahan, and drive past the regal Parliament House, India Gate, and Rashtrapati Bhavan. Later, embark on a smooth drive to Agra via the 6-lane Yamuna Expressway (approx. 3.5 hours). Upon arrival in Agra, check into your pre-booked hotel. In the evening, enjoy a peaceful sunset view of the Taj Mahal from Mehtab Bagh across the Yamuna River. Overnight stay in Agra."
          ]
        },
        {
          day: "Day 2",
          title: "Taj Mahal Sunrise ➔ Agra Fort ➔ Fatehpur Sikri ➔ Jaipur Arrival",
          activities: [
            "Early in the morning at sunrise, witness the sublime beauty of the Taj Mahal as the first rays of sunlight illuminate its ivory-white marble domes. Your local expert guide will share fascinating romantic stories of Shah Jahan and Mumtaz Mahal. Return to the hotel for a sumptuous breakfast and check out. Next, visit the formidable 16th-century Agra Fort, exploring its grand audience halls (Diwan-i-Aam and Diwan-i-Khas) and Jahangir Mahal. Drive onwards to the Pink City of Jaipur. En route, stop at the ghost city of Fatehpur Sikri, built by Emperor Akbar, and marvel at Buland Darwaza and the 1,000-year-old Chand Baori Stepwell at Abhaneri. Arrive in Jaipur by evening, check into your hotel, and relax."
          ]
        },
        {
          day: "Day 3",
          title: "Jaipur Royal Forts Sightseeing & Departure Transfer",
          activities: [
            "After breakfast, embark on a full-day heritage excursion of Jaipur. Ascend to the majestic hilltop Amer Fort via open Jeep or elephant ride, marveling at the dazzling mirror work inside Sheesh Mahal. Stop for photos at the enchanting Jal Mahal (Water Palace) floating in Man Sagar Lake and the intricate 953-window façade of Hawa Mahal (Palace of Winds). Tour the royal City Palace Museum, housing royal costumes and weaponry, followed by Jantar Mantar astronomical observatory. Conclude your tour with a scenic return transfer to Delhi or drop at Jaipur International Airport."
          ]
        }
      ]
    },
    {
      id: 2,
      category: "golden-triangle",
      name: "4 Days Golden Triangle Classic Tour",
      tag: "Most Popular",
      duration: "4 Days / 3 Nights",
      kms: "720 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal & Agra Fort)", "Fatehpur Sikri", "Jaipur"],
      image: "/pictures/agra_tajmahal.jpg",
      tip: "📸 Includes leisurely 2 nights in Jaipur for royal fort shopping & sunset photo points!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 4 Days (~720 KMs)",
        "All Inter-state Tolls, Parking & Driver Charges Included",
        "Guided Taj Mahal & Jaipur Forts Sightseeing",
        "Doorstep Hotel / Airport Pickup & Drop"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival Sightseeing & Drive to Agra",
          activities: [
            "Upon arrival at Delhi Airport or Railway Station, meet your dedicated AC chauffeur and proceed on an introductory tour of Delhi. Explore Old Delhi's historic Jama Masjid, one of the largest mosques in Asia, followed by an exhilarating rickshaw ride through the bustling spice lanes of Chandni Chowk. Visit Raj Ghat, the peaceful memorial of Mahatma Gandhi, and drive past Rashtrapati Bhavan and India Gate. Afterwards, enjoy a smooth highway drive to Agra via Yamuna Expressway. Check into your hotel upon arrival and unwind for the evening."
          ]
        },
        {
          day: "Day 2",
          title: "Taj Mahal Sunrise ➔ Agra Fort ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Experience an unforgettably romantic sunrise view at the Taj Mahal, catching the changing hues of the marble as dawn breaks. Return to your hotel for breakfast before exploring Agra Fort, a massive red sandstone fortress containing Jahangiri Mahal, Khas Mahal, and the octagonal Musamman Burj tower. Next, head towards Jaipur, making a stop at Akbar's deserted capital Fatehpur Sikri to admire Buland Darwaza and the Tomb of Sheikh Salim Chishti. Arrive in Pink City Jaipur in the evening. Check into your hotel and enjoy free time strolling through local bazaars."
          ]
        },
        {
          day: "Day 3",
          title: "Jaipur Full Day Heritage & Royal Forts Sightseeing",
          activities: [
            "Immerse yourself in Jaipur's royal heritage. Start at hilltop Amer Fort, exploring its courtyards, Maota Lake views, and Sheesh Mahal. Visit nearby Panna Meena Stepwell and Jaigarh Fort, home to Jaivana — the world's largest cannon on wheels. Stop at Jal Mahal for photos before touring the iconic City Palace and UNESCO-listed Jantar Mantar. In the late afternoon, drive up to Nahargarh Fort to savor a panoramic sunset view over the glowing Pink City skyline."
          ]
        },
        {
          day: "Day 4",
          title: "Patrika Gate ➔ Souvenir Shopping ➔ Departure Transfer",
          activities: [
            "Post breakfast, visit the colorful Patrika Gate, celebrated for its vibrant hand-painted arches depicting Rajasthani folklore, and admire the Indo-Saracenic architecture of Albert Hall Museum. Spend time shopping for traditional Mojri leather footwear, blue pottery, and Sanganeri print textiles at Bapu Bazaar and Johari Bazaar. Afterwards, board your private vehicle for a comfortable return drive to Delhi or transfer to Jaipur Airport."
          ]
        }
      ]
    },
    {
      id: 3,
      category: "golden-triangle",
      name: "5 Days Golden Triangle Heritage & Culture Tour",
      tag: "Best Seller",
      duration: "5 Days / 4 Nights",
      kms: "720 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi (Qutub & Red Fort)", "Agra (Taj Mahal & Fatehpur)", "Abhaneri", "Jaipur (Pink City)"],
      image: "/pictures/jaisalmer_desert.jpg",
      tip: "📸 Sunrise Taj Mahal visit included with professional local tour guide!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for Entire 5-Day Tour (~720 KMs)",
        "All Inter-state Tolls, Parking & Driver Taxes Included",
        "Taj Mahal Sunrise & Guided Local Sightseeing",
        "3★ / 4★ Hotel Booking Available on Request"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Monuments Tour",
          activities: [
            "Arrive in Delhi where your private AC chauffeur will greet you at the airport or railway station. Begin your capital sightseeing with Humayun's Tomb, the architectural masterpiece that inspired the Taj Mahal, followed by the soaring 12th-century Qutub Minar. Drive through New Delhi's grand avenues past India Gate, Rashtrapati Bhavan, and Lotus Temple. Check into your Delhi hotel and relax for the evening."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra Drive, Agra Fort & Sunset Taj View",
          activities: [
            "After a leisurely breakfast, embark on a smooth drive to Agra via the Yamuna Expressway (approx. 3.5 hours). Upon arrival in Agra, check into your hotel and proceed to explore the historic 16th-century Agra Fort, visiting Jahangiri Mahal, Diwan-i-Khas, and Musamman Burj. In the late afternoon, head to Mehtab Bagh to catch a romantic sunset view of the Taj Mahal across the Yamuna River. Overnight stay in Agra."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal ➔ Fatehpur Sikri ➔ Abhaneri ➔ Jaipur",
          activities: [
            "Experience an unforgettable early morning sunrise tour at the Taj Mahal, guided by a local historian. Return to your hotel for breakfast, then checkout and drive towards Jaipur. En route, explore Akbar's deserted Mughal capital at Fatehpur Sikri (Buland Darwaza & Salim Chishti Dargah) and marvel at the 1,000-year-old geometric Chand Baori Stepwell at Abhaneri. Arrive in Jaipur by evening and check into your hotel."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Royal Forts, Palaces & Pink City Sightseeing",
          activities: [
            "Spend the entire day exploring the royal treasures of Jaipur. Ascend hilltop Amer Fort via Jeep or elephant ride to marvel at the glistening Sheesh Mahal (Mirror Palace). Halt for photos at Jal Mahal floating in Man Sagar Lake and the 953-window façade of Hawa Mahal. Tour the City Palace Museum and UNESCO-listed Jantar Mantar observatory before driving up to Nahargarh Fort for a breathtaking sunset over the Pink City skyline."
          ]
        },
        {
          day: "Day 5",
          title: "Patrika Gate, Albert Hall & Return Departure Transfer",
          activities: [
            "After breakfast, visit the vibrant Patrika Gate, famous for its hand-painted architectural archways, and admire the Indo-Saracenic design of Albert Hall Museum. Enjoy souvenir shopping at Bapu Bazaar for Rajasthani textiles and leather Mojris before your private vehicle provides a comfortable return drive to Delhi or drop at Jaipur International Airport."
          ]
        }
      ]
    },
    {
      id: 4,
      category: "luxury-wildlife",
      name: "6 Days Golden Triangle with Ranthambore Tiger Safari",
      tag: "🐅 Wildlife Special",
      duration: "6 Days / 5 Nights",
      kms: "950 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Ranthambore Tiger Reserve", "Jaipur"],
      image: "/pictures/ranthambore_tiger_safari.jpg",
      tip: "🐅 Jungle Safari in Open 4x4 Gypsy or Canter included in Ranthambore National Park!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for 6 Days (~950 KMs)",
        "Jungle Safari Booking Assistance in Ranthambore",
        "All Highways Tolls, Parking & Driver Taxes Included",
        "Taj Mahal & Jaipur Sightseeing Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Pickup & Drive to Agra",
          activities: [
            "Morning pickup from Delhi Airport / Hotel by private AC vehicle. Tour Qutub Minar and drive past India Gate before driving along the Yamuna Expressway to Agra. Check in at Agra hotel and relax."
          ]
        },
        {
          day: "Day 2",
          title: "Taj Mahal Sunrise ➔ Drive to Ranthambore National Park",
          activities: [
            "Witness sunrise over the Taj Mahal with an expert guide. Return for breakfast and visit Agra Fort before driving towards Ranthambore National Park. Check into your jungle resort near the tiger reserve by evening."
          ]
        },
        {
          day: "Day 3",
          title: "Morning & Afternoon Jungle Safaris in Ranthambore",
          activities: [
            "Embark on thrilling Morning & Afternoon 4x4 Jeep / Canter Safaris deep inside Ranthambore National Park. Track Royal Bengal Tigers, leopards, sambar deer, and mugger crocodiles with experienced forest naturalists. Visit the historic 10th-century Ranthambore Fort within the park."
          ]
        },
        {
          day: "Day 4",
          title: "Ranthambore to Jaipur Pink City & Ethnic Evening",
          activities: [
            "After breakfast, drive to Pink City Jaipur (approx. 3.5 hours). Check into your hotel. In the evening, visit Chokhi Dhani ethnic resort for traditional Rajasthani folk dance, puppet shows, camel rides, and an authentic Thali feast."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur Royal Forts & Heritage Sightseeing",
          activities: [
            "Explore Amer Fort (Sheesh Mahal), Jal Mahal, Hawa Mahal, City Palace Museum, and UNESCO Jantar Mantar. Savor a sunset view at Nahargarh Fort overlooking Jaipur."
          ]
        },
        {
          day: "Day 6",
          title: "Patrika Gate & Return Departure Transfer",
          activities: [
            "Photo session at Patrika Gate and local bazaar shopping before a smooth return transfer to Delhi or drop at Jaipur International Airport."
          ]
        }
      ]
    },
    {
      id: 5,
      category: "rajasthan-heritage",
      name: "Golden Triangle with Udaipur & Jaisalmer Desert Tour",
      tag: "Grand Heritage",
      duration: "11 Days / 10 Nights",
      kms: "1,800 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra", "Jaipur", "Jodhpur (Blue City)", "Jaisalmer (Desert Dunes)", "Udaipur (Lake Pichola)"],
      image: "/pictures/beautiful-shot-udaipur-from-window-city-palace.png",
      tip: "🐪 Includes Thar Desert Sand Dune Camping, Camel Safari & Lake Pichola Sunset Cruise!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 11 Days (~1,800 KMs)",
        "Desert Camp & Camel Safari Assistance in Sam Dunes",
        "All Tolls, Parking, State Permits & Driver Allowances Included",
        "Complete Rajasthan Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Monuments Sightseeing",
          activities: [
            "Pickup at Delhi Airport and explore Qutub Minar, Humayun's Tomb, and India Gate. Overnight stay in Delhi."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Taj Mahal Sunset",
          activities: [
            "Drive to Agra via Yamuna Expressway. Tour Agra Fort and enjoy sunset Taj Mahal views from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal to Jaipur via Fatehpur Sikri",
          activities: [
            "Early sunrise visit to Taj Mahal. Drive to Jaipur visiting Fatehpur Sikri and Abhaneri Stepwell. Overnight in Jaipur."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Pink City Heritage & Royal Forts",
          activities: [
            "Visit Amer Fort, Sheesh Mahal, Jal Mahal, City Palace Museum, and Hawa Mahal. Sunset at Nahargarh Fort."
          ]
        },
        {
          day: "Day 5-6",
          title: "Jaipur to Jodhpur Blue City Sightseeing",
          activities: [
            "Drive to Jodhpur. Explore Mehrangarh Fort towering over blue-painted houses, Jaswant Thada marble cenotaph, and Umaid Bhawan Palace."
          ]
        },
        {
          day: "Day 7-8",
          title: "Jodhpur to Jaisalmer Golden Fort & Thar Desert Camping",
          activities: [
            "Drive to Jaisalmer Golden City. Explore Jaisalmer Fort (Sonar Qella), Patwon ki Haveli, and Gadisar Lake. Proceed to Sam Sand Dunes for sunset camel safari, Rajasthani Kalbelia dance, and luxury desert tent stay under the stars."
          ]
        },
        {
          day: "Day 9-10",
          title: "Jaisalmer to Udaipur City of Lakes",
          activities: [
            "Drive to romantic Udaipur via Ranakpur Jain Temple. Tour Udaipur City Palace complex, Saheliyon-ki-Bari gardens, and enjoy a sunset boat cruise on Lake Pichola past Jag Mandir."
          ]
        },
        {
          day: "Day 11",
          title: "Udaipur Departure / Return Transfer",
          activities: [
            "After breakfast, drop at Udaipur Maharana Pratap Airport or return transfer."
          ]
        }
      ]
    },
    {
      id: 6,
      category: "devotional",
      name: "Golden Triangle with Rishikesh & Haridwar Ganga Tour",
      tag: "🕉️ Spiritual & Heritage",
      duration: "8 Days / 7 Nights",
      kms: "1,100 KMs Total Circuit",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Haridwar (Ganga Aarti)", "Rishikesh (Lakshman Jhula)", "Agra (Taj Mahal)", "Jaipur"],
      image: "/pictures/pushkar_lake.jpg",
      tip: "🕉️ Attend evening Ganga Aarti at Har Ki Pauri in Haridwar & Taj Mahal sunrise tour!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 8 Days (~1,100 KMs)",
        "Haridwar & Rishikesh Ashram Visits & Ganga Aarti",
        "All Highways Tolls, Parking & Driver Taxes Included",
        "Doorstep Hotel Pickup & Drop"
      ],
      itineraryDays: [
        {
          day: "Day 1-2",
          title: "Delhi to Haridwar Ganga Aarti & Rishikesh Ashrams",
          activities: [
            "Morning drive from Delhi to sacred Haridwar. Attend the world-famous evening Ganga Aarti at Har Ki Pauri ghat with thousands of glowing lamps. Next day explore Rishikesh, walking across Ram Jhula and Lakshman Jhula suspension bridges and visiting holy ashrams."
          ]
        },
        {
          day: "Day 3-4",
          title: "Rishikesh to Delhi & Agra Taj Mahal",
          activities: [
            "Return drive towards Delhi, touring Qutub Minar before continuing on Yamuna Expressway to Agra. Visit Agra Fort and enjoy sunset views of the Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 5-6",
          title: "Agra to Jaipur via Fatehpur Sikri & Abhaneri",
          activities: [
            "Sunrise tour of Taj Mahal. Drive to Jaipur visiting Fatehpur Sikri and Abhaneri Stepwell. Arrive in Jaipur and explore Amer Fort, Jal Mahal, and City Palace."
          ]
        },
        {
          day: "Day 7-8",
          title: "Jaipur Pink City & Return Departure Transfer",
          activities: [
            "Visit Hawa Mahal, Patrika Gate, and local bazaars before return transfer to Delhi or drop at Jaipur Airport."
          ]
        }
      ]
    },
    {
      id: 7,
      category: "devotional",
      name: "Khatu Shyam Ji & Salasar Balaji Divine Circuit",
      tag: "Spiritual Special",
      duration: "Full Day (Same Day Return)",
      kms: "360 KMs Roundtrip",
      startingRate: "Best Rate on Request",
      destinations: ["Jaipur Pickup", "Khatu Shyam Ji (Reengus)", "Salasar Balaji Temple", "Return Jaipur Drop"],
      image: "/pictures/khatu_shyam_salasar_temple.jpg",
      tip: "🕉️ Priority Darshan guidance & comfortable highway AC transfers for families & senior citizens!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Same Day Round-trip Private AC Cab",
        "Highways Toll Tax & State Taxes Included",
        "Experienced Highway Chauffeur",
        "Doorstep Pickup & Drop (Hotel / Residence)"
      ],
      itineraryDays: [
        {
          day: "Same Day",
          title: "Jaipur ➔ Khatu Shyam Ji ➔ Salasar Balaji ➔ Jaipur",
          activities: [
            "Departure at 6:00 AM from Jaipur in a private AC cab. Drive via Sikar highway to the holy town of Khatu Shyam Ji (Reengus). Participate in morning Darshan of Barbarik / Shyam Baba and offer flower garlands & prasad. Afterwards, proceed towards Salasar Hanuman Temple in Churu district (approx. 2 hours drive). Seek divine blessings of Lord Hanuman, offer Churma prasad, and relax at hygienic highway food halts during evening return transfer to Jaipur."
          ]
        }
      ]
    },
    {
      id: 8,
      category: "rajasthan-heritage",
      name: "Jaipur Royal Forts & Heritage Sightseeing",
      tag: "Most Popular",
      duration: "Full Day (8–10 Hours)",
      kms: "80 KMs Total",
      startingRate: "Best Rate on Request",
      destinations: ["Amer Fort", "Jaigarh (Jaivana Cannon)", "Nahargarh Sunset Point", "Jal Mahal", "Hawa Mahal", "City Palace", "Jantar Mantar", "Panna Meena Stepwell"],
      image: "/pictures/main-section/jaipur-amber-fort-amer-palace.jpg",
      tip: "🌅 Sunset Tip: Nahargarh Padao offers the best panoramic sunset view over Pink City!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab Hire (Fuel Included)",
        "Dedicated Professional Chauffeur",
        "All Tolls, Parking & Driver Taxes Included (No Hidden Charges)",
        "Doorstep Hotel / Railway Station Pickup & Drop"
      ],
      itineraryDays: [
        {
          day: "Full Day",
          title: "Complete Jaipur Royal Heritage Tour",
          activities: [
            "Start 9:00 AM with doorstep pickup. Drive to hilltop Amer Fort for a guided tour of Sheesh Mahal, Diwan-i-Aam, and Maota Lake views. Visit neighboring Panna Meena Stepwell and Jaigarh Fort, home to the world's largest cannon on wheels Jaivana. Stop at Jal Mahal floating palace for photos before exploring City Palace Museum, Hawa Mahal, and UNESCO Jantar Mantar. Conclude with a romantic sunset at Nahargarh Fort overlooking Jaipur city lights."
          ]
        }
      ]
    },
    {
      id: 9,
      category: "festivals",
      name: "Golden Triangle Tour With Diwali Festival",
      tag: "🪔 Diwali Special",
      duration: "6 Days / 5 Nights",
      kms: "720 KMs Total Circuit",
      festivalDates: "📅 Festival Date: November 8, 2026 (Grand Lights Festival)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur (Pink City Diwali Lighting)", "Pushkar Lake"],
      image: "/pictures/diwali_festival_jaipur.jpg",
      tip: "🪔 Diwali Special: Jaipur Pink City bazaars are world-renowned for millions of fairy lights & grand festive decorations!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 6 Days (~720 KMs)",
        "Pink City Night Lighting & Bazaar Tour in Jaipur",
        "Traditional Lakshmi Puja & Diya Lighting Experience",
        "All Highways Tolls, State Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Heritage Sightseeing",
          activities: [
            "Pickup from Delhi Airport or Railway Station by private AC cab. Explore Qutub Minar, Humayun's Tomb, and drive past India Gate and President's Estate. Check into your hotel for overnight stay."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Sunset Taj Mahal View",
          activities: [
            "Morning drive to Agra via Yamuna Expressway. Check in at Agra hotel and explore massive 16th-century Agra Fort and Jahangir Mahal. Catch a mesmerizing sunset view of the Taj Mahal from Mehtab Bagh across the Yamuna River."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Abhaneri Stepwell ➔ Jaipur Arrival",
          activities: [
            "Early morning sunrise tour of Taj Mahal with expert local guide. Drive to Jaipur, en-route visiting UNESCO Fatehpur Sikri and Chand Baori Stepwell at Abhaneri. Arrive in Jaipur as grand festival preparations illuminate the city."
          ]
        },
        {
          day: "Day 4",
          title: "Grand Diwali Celebrations & Pink City Illuminations",
          activities: [
            "Celebrate Diwali in royal Jaipur! Morning visits to Govind Dev Ji Temple and Moti Dungri Ganesh Temple for festive Darshan. In the evening, enjoy a private tour through Johari Bazaar and Bapu Bazaar, marveling at millions of twinkling fairy lights and illuminated arches. Taste authentic Diwali sweets (Mawa Kachori & Ghewar) and watch fireworks from Nahargarh Fort."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur Royal Forts & Palace Sightseeing",
          activities: [
            "Explore Amer Fort Sheesh Mahal, Jal Mahal, City Palace Museum, Hawa Mahal, and Panna Meena Stepwell."
          ]
        },
        {
          day: "Day 6",
          title: "Jaipur to Delhi Return Transfer / Airport Drop",
          activities: [
            "Relaxed breakfast and return transfer to Delhi or drop at Jaipur International Airport."
          ]
        }
      ]
    },
    {
      id: 10,
      category: "festivals",
      name: "Golden Triangle Tour with Pushkar Fair",
      tag: "🐪 World Famous Fair",
      duration: "7 Days / 6 Nights",
      kms: "850 KMs Total Circuit",
      festivalDates: "📅 Festival Dates: November 15 – November 23, 2026",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur", "Pushkar Fair Ground & Brahma Temple"],
      image: "/pictures/pushkar_lake.jpg",
      tip: "🐪 Pushkar Fair Tip: Experience live camel trade, turban competitions, folk music & evening sacred lake Aarti!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 7 Days (~850 KMs)",
        "Pushkar Mela Fair Ground & Cultural Festival Entry",
        "Sacred Pushkar Lake Ghat Aarti & Brahma Temple Visit",
        "Taj Mahal Sunrise & Jaipur Forts Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Monuments Sightseeing",
          activities: [
            "Delhi pickup, visit Qutub Minar, Lotus Temple, and drive past India Gate and Parliament House. Overnight in Delhi."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Agra Fort Sunset",
          activities: [
            "Yamuna Expressway drive to Agra. Tour Agra Fort and enjoy sunset Taj Mahal views from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal to Jaipur via Fatehpur Sikri",
          activities: [
            "Early sunrise Taj Mahal tour. Drive to Jaipur visiting Fatehpur Sikri and Abhaneri Stepwell. Overnight in Jaipur."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur to Pushkar Camel Fair Grounds",
          activities: [
            "Drive from Jaipur to Pushkar (approx. 2.5 hours). Reach the famous Mela grounds where thousands of nomadic camel traders gather across desert sand dunes with decorated livestock."
          ]
        },
        {
          day: "Day 5",
          title: "Pushkar Mela Festivities & Sacred Lake Aarti",
          activities: [
            "Immerse yourself in Pushkar Fair celebrations! Watch traditional turban-tying contests, longest mustache competitions, Matka races, and folk dances. Visit the world's only Lord Brahma Temple and participate in the sacred Kartik Purnima Maha Aarti at Pushkar Lake Ghats."
          ]
        },
        {
          day: "Day 6",
          title: "Pushkar to Jaipur Royal Forts",
          activities: [
            "Return drive to Jaipur. Explore Amer Fort, Jal Mahal, and sunset at Nahargarh Fort."
          ]
        },
        {
          day: "Day 7",
          title: "Jaipur / Delhi Departure Drop",
          activities: [
            "Patrika Gate photo shoot and departure drop at Airport or Railway Station."
          ]
        }
      ]
    },
    {
      id: 11,
      category: "festivals",
      name: "Golden Triangle Tour with Holi Festival",
      tag: "🎨 Holi Special",
      duration: "7 Days / 6 Nights",
      kms: "720 KMs Total Circuit",
      festivalDates: "📅 Festival Dates: March 14 & 15, 2027 (Festival of Colors)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Mathura-Vrindavan", "Jaipur Royal Holi"],
      image: "/pictures/holi_festival_jaipur.jpg",
      tip: "🎨 Holi Tip: Celebrate organic Gulal color festival in Jaipur royal court style with traditional Dhol & Thandai!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for 7 Days (~720 KMs)",
        "Organic Herbal Gulal Colors & Festive White Kurta Included",
        "Royal Heritage Holi Celebration with Live Dhol & Dancers",
        "Taj Mahal Sunrise & Jaipur Pink City Forts Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Old Delhi Heritage Walk",
          activities: [
            "Delhi pickup, Qutub Minar tour, and Old Delhi Jama Masjid rickshaw ride."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Agra Fort Sunset",
          activities: [
            "Drive to Agra via Yamuna Expressway, explore Agra Fort, and Mehtab Bagh sunset."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal ➔ Mathura-Vrindavan ➔ Jaipur",
          activities: [
            "Sunrise Taj Mahal visit. Drive towards Jaipur, making a sacred stop at Mathura (Lord Krishna's birthplace) and Vrindavan Banke Bihari temple."
          ]
        },
        {
          day: "Day 4",
          title: "Grand Royal Holi Celebration in Jaipur",
          activities: [
            "Grand Holi celebration in Jaipur! Participate in a private royal courtyard Holi gathering with organic herbal Gulal colors, live Chang and Dhol drums, Ghoomar dancers, and refreshing saffron Thandai."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur Royal Forts Sightseeing",
          activities: [
            "Amer Fort, Sheesh Mahal, Jal Mahal, and Panna Meena Stepwell tour."
          ]
        },
        {
          day: "Day 6",
          title: "City Palace & Pink City Bazaars",
          activities: [
            "City Palace Museum, Hawa Mahal, Jantar Mantar, and sunset at Nahargarh Fort."
          ]
        },
        {
          day: "Day 7",
          title: "Departure Transfer",
          activities: [
            "Departure transfer to Delhi or Jaipur International Airport."
          ]
        }
      ]
    },
    {
      id: 12,
      category: "festivals",
      name: "Golden Triangle with Kite Festival Jaipur",
      tag: "🪁 Kite Flying Special",
      duration: "7 Days / 6 Nights",
      kms: "720 KMs Total Circuit",
      festivalDates: "📅 Fixed Date: January 14 Every Year (Makar Sankranti)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur Rooftop Kite Battle", "Albert Hall"],
      image: "/pictures/kite_festival_jaipur.jpg",
      tip: "🪁 Kite Festival Tip: Fly colorful kites from Jaipur royal heritage rooftops on Jan 14 with DJ music, Til-Laddoo & evening sky lanterns!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 7 Days (~720 KMs)",
        "Rooftop Access & Professional Kites (Manjha) Provided",
        "International Kite Festival Entry at Jal Mahal Ground",
        "Taj Mahal Sunrise & Jaipur Heritage Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Monuments Sightseeing",
          activities: [
            "Pickup from Delhi, Qutub Minar, Lotus Temple, and India Gate tour."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Agra Fort Sunset",
          activities: [
            "Drive to Agra, visit Agra Fort, and enjoy sunset Taj Mahal views."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal to Jaipur via Fatehpur Sikri",
          activities: [
            "Early Taj Mahal tour and drive to Jaipur via Akbar's Fatehpur Sikri."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur International Kite Festival (Makar Sankranti)",
          activities: [
            "Experience Jaipur International Kite Festival on Jan 14! Join rooftop kite flying battles with professional kites, DJ music, Til-Laddoo sweets, and evening paper sky lanterns (Tukkal) floating over Jal Mahal."
          ]
        },
        {
          day: "Day 5",
          title: "Amer Fort & Jal Mahal Tour",
          activities: [
            "Amer Fort elephant/jeep ride, Jal Mahal photos, and Nahargarh sunset."
          ]
        },
        {
          day: "Day 6",
          title: "City Palace & Albert Hall Museum",
          activities: [
            "City Palace Museum, Hawa Mahal, and local bazaar souvenir shopping."
          ]
        },
        {
          day: "Day 7",
          title: "Departure Transfer",
          activities: [
            "Departure drop at Jaipur or Delhi International Airport."
          ]
        }
      ]
    },
    {
      id: 13,
      category: "festivals",
      name: "Golden Triangle with Bikaner Camel Festival",
      tag: "🐪 Desert Fair",
      duration: "8 Days / 7 Nights",
      kms: "1,250 KMs Total Circuit",
      festivalDates: "📅 Festival Dates: January 10 & 11, 2027",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur", "Bikaner Camel Festival & Junagarh Fort"],
      image: "/pictures/bikaner.jpg",
      tip: "🐪 Bikaner Tip: Witness camel fur carving competitions, camel dance & energetic Solanki Fire Dancers!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for 8 Days (~1,250 KMs)",
        "Bikaner Camel Festival Parade & Camel Dance Entry",
        "Junagarh Fort & Karni Mata Temple Sightseeing",
        "Taj Mahal & Jaipur Heritage Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1-2",
          title: "Delhi & Taj Mahal Agra Sightseeing",
          activities: [
            "Delhi pickup, Qutub Minar tour, Yamuna Expressway drive to Agra, Agra Fort, and sunrise Taj Mahal visit."
          ]
        },
        {
          day: "Day 3-4",
          title: "Agra to Jaipur Pink City Forts",
          activities: [
            "Drive to Jaipur via Fatehpur Sikri. Visit Amer Fort, Jal Mahal, City Palace, and Hawa Mahal."
          ]
        },
        {
          day: "Day 5-6",
          title: "Jaipur to Bikaner Camel Festival & Desert Festivities",
          activities: [
            "Drive from Jaipur to Bikaner. Attend the colourful Camel Festival parade, camel hair art competition, camel dance, and night performance of energetic Solanki Fire Dancers."
          ]
        },
        {
          day: "Day 7-8",
          title: "Junagarh Fort & Return Departure Drop",
          activities: [
            "Visit unbreached Junagarh Fort and Deshnoke Karni Mata Temple before return departure transfer."
          ]
        }
      ]
    },
    {
      id: 14,
      category: "festivals",
      name: "Golden Triangle Tour with Gangaur Festival",
      tag: "🌸 Royal Procession",
      duration: "6 Days / 5 Nights",
      kms: "720 KMs Total Circuit",
      festivalDates: "📅 Festival Dates: April 2 & 3, 2027",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur Gangaur Procession", "City Palace"],
      image: "/pictures/gangaur_festival_jaipur.jpg",
      tip: "🌸 Gangaur Tip: Witness royal palanquin procession of Goddess Gauri carrying decorated idols through Tripolia Gate with caparisoned elephants!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 6 Days (~720 KMs)",
        "Gangaur Royal Procession VIP Viewing Spot in Jaipur",
        "Taj Mahal Sunrise & Jaipur Forts Sightseeing",
        "All Highways Tolls, Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Monuments",
          activities: [
            "Delhi pickup, Qutub Minar, Humayun's Tomb, and India Gate sightseeing."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Agra Fort Sunset",
          activities: [
            "Drive to Agra, tour 16th-century Agra Fort, and Mehtab Bagh sunset Taj view."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal to Jaipur via Abhaneri",
          activities: [
            "Early morning sunrise Taj Mahal tour. Drive to Jaipur visiting Fatehpur Sikri and Abhaneri Stepwell."
          ]
        },
        {
          day: "Day 4",
          title: "Gangaur Royal Procession in Jaipur",
          activities: [
            "Witness the magnificent Gangaur royal procession in Jaipur! Watch Goddess Gauri's royal palanquin emerge from City Palace through Tripolia Gate accompanied by caparisoned elephants, decorated horses, brass kalash dancers, and folk troupes."
          ]
        },
        {
          day: "Day 5",
          title: "Amer Fort & Nahargarh Fort Sunset",
          activities: [
            "Amer Fort, Sheesh Mahal, Jal Mahal, and sunset at Nahargarh Fort."
          ]
        },
        {
          day: "Day 6",
          title: "Departure Transfer",
          activities: [
            "Patrika Gate photos and departure drop at Jaipur or Delhi Airport."
          ]
        }
      ]
    },
    {
      id: 15,
      category: "festivals",
      name: "Golden Triangle Tour with Teej Festival",
      tag: "🌿 Monsoon Heritage",
      duration: "6 Days / 5 Nights",
      kms: "720 KMs Total Circuit",
      festivalDates: "📅 Festival Dates: August 4 & 5, 2026",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur Teej Procession & Bazaars"],
      image: "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
      tip: "🌿 Teej Tip: Experience Jaipur monsoon Teej procession with traditional Ghewar sweet tasting, henna artists & folk performers!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for 6 Days (~720 KMs)",
        "Teej Festival Royal Procession Viewing in Jaipur",
        "Ghewar Sweet Tasting & Chokhi Dhani Ethnic Night",
        "Taj Mahal Sunrise & Complete Jaipur Forts Tour"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival Sightseeing",
          activities: [
            "Delhi pickup, Qutub Minar, and India Gate capital tour."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Agra Fort",
          activities: [
            "Yamuna Expressway drive, Agra Fort, and Taj Mahal sunset."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal to Jaipur",
          activities: [
            "Sunrise Taj Mahal visit and drive to Jaipur via Abhaneri Stepwell."
          ]
        },
        {
          day: "Day 4",
          title: "Teej Royal Procession & Monsoon Festivities",
          activities: [
            "Experience Jaipur monsoon Teej festival! Watch Goddess Parvati's royal palanquin procession, enjoy traditional Ghewar sweet tasting, henna tattoo art, and Chokhi Dhani ethnic night."
          ]
        },
        {
          day: "Day 5",
          title: "Amer Fort & Pink City Bazaars",
          activities: [
            "Amer Fort, Sheesh Mahal, Jal Mahal, Hawa Mahal, and local bazaar shopping."
          ]
        },
        {
          day: "Day 6",
          title: "Departure Transfer",
          activities: [
            "Departure transfer to Jaipur or Delhi International Airport."
          ]
        }
      ]
    },
    {
      id: 16,
      category: "luxury-tours",
      name: "Luxury India Honeymoon: Taj Mahal to Thar Desert",
      tag: "👑 Royal Honeymoon",
      duration: "21 Days / 20 Nights",
      kms: "2,400 KMs Total Circuit",
      festivalDates: "👑 Luxury Season: October to April (Heritage Palace Stays)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Ranthambore Tiger Reserve", "Jaipur", "Jaisalmer (Thar Desert)", "Jodhpur (Blue City)", "Jawai Leopard Safari", "Udaipur (Lake Pichola)"],
      image: "/pictures/main-section/jaipur-hawa-mahal-palace-of-winds.jpg",
      tip: "👑 Honeymoon Tip: Stay in authentic royal Maharajah palaces (Oberoi Amarvilas, Rambagh Palace & Taj Lake Palace) with private butler service!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Luxury Chauffeur Vehicle for 21 Days",
        "5-Star Heritage Palace Accommodation Booking Assistance",
        "Private Taj Mahal Sunrise Access & Historian Guide",
        "All Highways Tolls, Interstate Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Imperial Capital Sightseeing",
          activities: [
            "VIP greeting at Delhi International Airport by private AC chauffeur cab.",
            "Transfer to luxury hotel for check-in and welcome refresh.",
            "Explore UNESCO Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Drive through Imperial New Delhi past India Gate and President's Estate."
          ]
        },
        {
          day: "Day 2",
          title: "Old Delhi Heritage Walk & Yamuna Expressway to Agra",
          activities: [
            "Rickshaw ride through Chandni Chowk spice markets and Jama Masjid.",
            "Scenic drive to Agra along the Yamuna Expressway.",
            "Tour 16th-century Agra Fort and Jahangir Palace.",
            "Sunset view of Taj Mahal from Mehtab Bagh across Yamuna River."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Fatehpur Sikri ➔ Ranthambore",
          activities: [
            "Private early morning sunrise entry into the Taj Mahal with expert historian guide.",
            "En-route visit UNESCO Fatehpur Sikri Akbar's abandoned red sandstone capital.",
            "Drive to Ranthambore Tiger Reserve and check into luxury jungle lodge."
          ]
        },
        {
          day: "Day 4",
          title: "Ranthambore Tiger Reserve Open 4x4 Jeep Safari",
          activities: [
            "Early morning open 4x4 Gypsy safari tracking Royal Bengal Tigers.",
            "Visit 10th-century Ranthambore Fort overlooking the jungle lakes.",
            "Afternoon jungle safari for wildlife photography (leopards, deer, crocodiles)."
          ]
        },
        {
          day: "Day 5",
          title: "Ranthambore to Jaipur Pink City & Rambagh Palace High Tea",
          activities: [
            "Morning drive to Pink City Jaipur.",
            "Check into 5-star heritage hotel.",
            "Visit Albert Hall Museum and evening high tea at historic Rambagh Palace."
          ]
        },
        {
          day: "Day 6",
          title: "Jaipur Amer Fort Elephant Ride & Palace Tour",
          activities: [
            "Ascend hilltop Amer Fort on elephant back / private Jeep.",
            "Explore Sheesh Mahal (Mirror Palace), Jal Mahal, and City Palace courtyard.",
            "Photo stop at Hawa Mahal and shopping in Johari Bazaar."
          ]
        },
        {
          day: "Day 7",
          title: "Jaipur to Jaisalmer Golden Desert Gateway",
          activities: [
            "Drive west into the Thar Desert towards Jaisalmer.",
            "En-route stop at Pokhran Fort museum.",
            "Arrive in Jaisalmer as setting sun turns yellow sandstone to gold."
          ]
        },
        {
          day: "Day 8",
          title: "Jaisalmer Sonar Qila (Living Fort) & Patwon Haveli",
          activities: [
            "Explore living UNESCO Jaisalmer Fort with ancient Jain temples inside.",
            "Visit carved yellow sandstone mansions: Patwon ki Haveli and Nathmal Haveli.",
            "Sunset boat ride on historic Gadisar Lake."
          ]
        },
        {
          day: "Day 9",
          title: "Jaisalmer Sam Sand Dunes Luxury Camping & Camel Safari",
          activities: [
            "Drive to Sam Sand Dunes deep in the Thar Desert.",
            "Sunset camel safari ride across golden sand dunes.",
            "Private candlelit dinner, Kalbelia folk dance performance, and stargazing."
          ]
        },
        {
          day: "Day 10",
          title: "Sam Sand Dunes to Jodhpur Blue City",
          activities: [
            "Morning desert sunrise walk and breakfast.",
            "Drive to Blue City Jodhpur.",
            "Visit Jaswant Thada marble memorial and Clock Tower bazaar."
          ]
        },
        {
          day: "Day 11",
          title: "Jodhpur Mehrangarh Fort Tour & Umaid Bhawan Palace",
          activities: [
            "Guided tour of colossal Mehrangarh Fort 400 feet above the city.",
            "Explore Phool Mahal, Moti Mahal, and royal palanquin museum.",
            "Visit Umaid Bhawan Palace museum."
          ]
        },
        {
          day: "Day 12",
          title: "Jodhpur to Jawai Wilderness Leopard Reserve",
          activities: [
            "Drive to Jawai Bandh, famous for wild leopards coexisting with Rabari tribes.",
            "Check into luxury wilderness safari camp.",
            "Evening 4x4 Jeep safari tracking wild leopards on granite rocks."
          ]
        },
        {
          day: "Day 13",
          title: "Jawai Wilderness Wildlife Safari & Rabari Tribal Walk",
          activities: [
            "Early morning open Jeep safari for leopard and migratory bird watching.",
            "Cultural walk through Rabari shepherd villages.",
            "Private bush dinner under the desert sky."
          ]
        },
        {
          day: "Day 14",
          title: "Jawai to Ranakpur Marble Temple ➔ Udaipur",
          activities: [
            "Drive towards Udaipur through Aravali mountains.",
            "Explore 15th-century Ranakpur Jain Temple with 1,444 uniquely carved marble pillars.",
            "Arrive in romantic lake city Udaipur."
          ]
        },
        {
          day: "Day 15",
          title: "Udaipur City Palace Museum & Lake Pichola Cruise",
          activities: [
            "Guided tour of massive Udaipur City Palace complex.",
            "Visit Jagdish Temple and Crystal Gallery.",
            "Sunset private boat cruise on Lake Pichola past Jag Mandir Island."
          ]
        },
        {
          day: "Day 16",
          title: "Udaipur Saheliyon-ki-Bari & Vintage Car Museum",
          activities: [
            "Stroll through Saheliyon-ki-Bari fountain gardens.",
            "Visit Maharajah's Vintage & Classic Car Collection.",
            "Rooftop dinner overlooking glowing Lake Palace."
          ]
        },
        {
          day: "Day 17",
          title: "Udaipur Day Excursion to Eklingji & Nagda Temples",
          activities: [
            "Visit 8th-century Eklingji Shiva Temple complex.",
            "Explore ancient Sahasra Bahu (Sas-Bahu) twin temples in Nagda.",
            "Lakeside leisure and artisan craft shopping."
          ]
        },
        {
          day: "Day 18",
          title: "Udaipur Day Excursion to Chittorgarh Fort",
          activities: [
            "Full day excursion to UNESCO Chittorgarh Fort.",
            "Visit Vijay Stambha (Victory Tower), Kirti Stambha, and Padmini Palace.",
            "Return drive to Udaipur for overnight stay."
          ]
        },
        {
          day: "Day 19",
          title: "Udaipur Monsoon Palace (Sajjangarh) Sunset",
          activities: [
            "Relaxed morning at lakefront resort with spa treatment.",
            "Ascend hilltop Sajjangarh (Monsoon Palace) for panoramic sunset views over Aravali hills.",
            "Farewell royal dinner."
          ]
        },
        {
          day: "Day 20",
          title: "Udaipur Cultural Folk Show at Bagore Ki Haveli",
          activities: [
            "Morning craft shopping in Hathi Pol market.",
            "Attend Dharohar puppet and Ghoomar folk dance show at Bagore Ki Haveli."
          ]
        },
        {
          day: "Day 21",
          title: "Udaipur Departure / Airport Transfer",
          activities: [
            "Relaxed breakfast.",
            "Private chauffeur drop at Udaipur Maharana Pratap Airport or Railway Station."
          ]
        }
      ]
    },
    {
      id: 17,
      category: "luxury-tours",
      name: "Luxury Rajasthan & Kerala Heritage Grand Tour",
      tag: "🌴 North & South Luxury",
      duration: "18 Days / 17 Nights",
      kms: "North & South India Luxury Circuit",
      festivalDates: "🌴 Best Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Ranthambore", "Jaipur", "Udaipur", "Cochin", "Munnar Tea Hills", "Alleppey Houseboat", "Marari Beach"],
      image: "/pictures/udaipur.jpg",
      tip: "🌴 Heritage Tip: Combines North India's royal fort palaces with South India's palm-fringed backwater houseboats & Ayurvedic wellness!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle & Airport Transfers",
        "Private Luxury Backwater Houseboat with Onboard Chef",
        "Taj Mahal Sunrise & Heritage Fort Guided Sightseeing",
        "All Interstate Tolls, Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & New Delhi Imperial Sightseeing",
          activities: [
            "Airport arrival greeting by private AC chauffeur cab.",
            "Hotel check-in and refresh.",
            "Visit Qutub Minar, Humayun's Tomb, and drive past India Gate and President's Estate."
          ]
        },
        {
          day: "Day 2",
          title: "Old Delhi Heritage Tour & Yamuna Expressway to Agra",
          activities: [
            "Rickshaw ride through Old Delhi Chandni Chowk and Jama Masjid.",
            "Drive along Yamuna Expressway to Agra.",
            "Explore 16th-century Agra Fort and Jahangir Mahal.",
            "Sunset view of Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Fatehpur Sikri ➔ Ranthambore",
          activities: [
            "Early morning private sunrise tour of Taj Mahal.",
            "Visit UNESCO Fatehpur Sikri Akbar's abandoned red sandstone city.",
            "Drive to Ranthambore Tiger Reserve and check into luxury jungle lodge."
          ]
        },
        {
          day: "Day 4",
          title: "Ranthambore Tiger Safari & Fort Tour",
          activities: [
            "Morning open 4x4 Jeep jungle safari tracking Royal Bengal Tigers.",
            "Visit historic Ranthambore Fort and Ganesh Temple inside the jungle.",
            "Afternoon jungle safari for leopard and sloth bear sightings."
          ]
        },
        {
          day: "Day 5",
          title: "Ranthambore to Jaipur Pink City",
          activities: [
            "Morning drive to Pink City Jaipur.",
            "Visit Albert Hall Museum and Patrika Gate.",
            "Evening high tea at heritage palace hotel."
          ]
        },
        {
          day: "Day 6",
          title: "Jaipur Amer Fort Elephant Ride & Palace Sightseeing",
          activities: [
            "Elephant ride / 4x4 Jeep ascent at Amer Fort.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace museum.",
            "Photo stop at Hawa Mahal and Johari Bazaar shopping."
          ]
        },
        {
          day: "Day 7",
          title: "Jaipur to Udaipur via Ranakpur Marble Temple",
          activities: [
            "Drive towards Udaipur through the Aravali mountain pass.",
            "Tour 15th-century Ranakpur Jain Temple with 1,444 carved marble pillars.",
            "Arrive in lake city Udaipur and check into lakefront hotel."
          ]
        },
        {
          day: "Day 8",
          title: "Udaipur City Palace & Lake Pichola Private Cruise",
          activities: [
            "Guided tour of massive Udaipur City Palace museum complex.",
            "Visit Jagdish Temple and Saheliyon-ki-Bari fountain gardens.",
            "Private romantic sunset boat cruise on Lake Pichola past Jag Mandir."
          ]
        },
        {
          day: "Day 9",
          title: "Udaipur Day Excursion to Chittorgarh Victory Fort",
          activities: [
            "Day trip to UNESCO Chittorgarh Fort.",
            "Explore Vijay Stambha (Victory Tower), Kirti Stambha, and Padmini Palace.",
            "Return to Udaipur for lakeside dining."
          ]
        },
        {
          day: "Day 10",
          title: "Udaipur to Cochin Flight / Travel Day to South India",
          activities: [
            "Morning transfer to Udaipur Airport for flight connection to Cochin, Kerala.",
            "Arrival greeting in Cochin (God's Own Country).",
            "Check into heritage hotel in Fort Kochi."
          ]
        },
        {
          day: "Day 11",
          title: "Cochin Colonial Heritage Tour & Kathakali Dance Show",
          activities: [
            "Explore famous Chinese Fishing Nets along the Arabian Sea.",
            "Visit St. Francis Church, Mattancherry Palace, and Jew Town.",
            "Attend evening traditional Kathakali classical dance and makeup demonstration."
          ]
        },
        {
          day: "Day 12",
          title: "Cochin to Misty Tea Estates of Munnar",
          activities: [
            "Scenic mountain drive through waterfalls (Cheeyappara & Valara) to Munnar hill station.",
            "Visit tea plantation estate and Tata Tea Museum.",
            "Check into luxury mountain resort surrounded by misty green hills."
          ]
        },
        {
          day: "Day 13",
          title: "Munnar Eravikulam National Park & Spice Gardens",
          activities: [
            "Morning safari in Eravikulam National Park to spot rare Nilgiri Tahr mountain goats.",
            "Visit Mattupetty Dam, Echo Point, and Kundala Lake.",
            "Guided spice plantation walk learning about cardamom, pepper, and cinnamon cultivation."
          ]
        },
        {
          day: "Day 14",
          title: "Munnar to Thekkady Periyar Wildlife Sanctuary",
          activities: [
            "Drive to Thekkady (Periyar Tiger Reserve).",
            "Boat safari on Periyar Lake to watch wild elephants and otters bathing.",
            "Evening Kalaripayattu traditional martial arts show."
          ]
        },
        {
          day: "Day 15",
          title: "Thekkady to Alleppey Private Luxury Houseboat Cruise",
          activities: [
            "Drive down to Alleppey backwater jetty.",
            "Board your private luxury thatched houseboat (Kettuvallam) with private chef and captain.",
            "Cruise serene backwater canals, coconut groves, and paddy fields.",
            "Candlelit fresh coastal seafood dinner and overnight stay onboard houseboat."
          ]
        },
        {
          day: "Day 16",
          title: "Alleppey Houseboat to Marari Beach Wellness Resort",
          activities: [
            "Morning backwater sunrise cruise and traditional Kerala breakfast on board.",
            "Disembark and transfer to Marari Beach luxury beachfront resort.",
            "Relax on white sand beaches under palm trees."
          ]
        },
        {
          day: "Day 17",
          title: "Marari Beach Authentic Ayurvedic Spa & Relaxation",
          activities: [
            "Full day for authentic Abhyanga Ayurvedic herbal oil spa massages.",
            "Beachfront yoga and meditation sessions.",
            "Sunset beach walk and seafood dinner."
          ]
        },
        {
          day: "Day 18",
          title: "Cochin Airport Departure Transfer",
          activities: [
            "Relaxed morning breakfast at beach resort.",
            "Private chauffeur transfer to Cochin International Airport for return flight."
          ]
        }
      ]
    },
    {
      id: 18,
      category: "luxury-tours",
      name: "Luxury Jodhpur & Udaipur Royal Forts Escape",
      tag: "🏰 Royal Lakes & Forts",
      duration: "5 Days / 4 Nights",
      kms: "320 KMs Circuit",
      festivalDates: "🏰 Best Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Jodhpur (Mehrangarh Fort)", "Bishnoi Village Safari", "Ranakpur Jain Temple", "Udaipur (Lake Pichola)"],
      image: "/pictures/jodhpur.jpg",
      tip: "🏰 Royal Tip: Compact high-end itinerary showcasing Mehrangarh Fort, Bishnoi eco-village, 1444-pillar Ranakpur temple & Lake Pichola!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Sedan / SUV for 5 Days",
        "4x4 Bishnoi Village Cultural Jeep Safari",
        "Guided Mehrangarh & Udaipur City Palace Tours",
        "All Highways Tolls, Parking & Driver Taxes Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Jodhpur Blue City Arrival & Mehrangarh Fort",
          activities: [
            "Pickup from Jodhpur Airport/Station by private AC cab. Tour Mehrangarh Fort, Jaswant Thada marble memorial, and vibrant Clock Tower Spice Market."
          ]
        },
        {
          day: "Day 2",
          title: "Bishnoi Village Cultural Jeep Safari",
          activities: [
            "Morning open 4x4 Jeep safari into rural Bishnoi villages to spot blackbuck antelopes, witness opium tea ceremonies, and meet local potters and weavers."
          ]
        },
        {
          day: "Day 3",
          title: "Jodhpur to Udaipur via Ranakpur Marble Temple",
          activities: [
            "Scenic drive through the Aravali mountains. En route, explore 15th-century Ranakpur Jain Temple, famous for its 1,444 uniquely carved marble pillars. Arrive in Udaipur by evening."
          ]
        },
        {
          day: "Day 4",
          title: "Udaipur City Palace & Lake Pichola Boat Cruise",
          activities: [
            "Full day tour of Udaipur City Palace museum complex, Jagdish Temple, Saheliyon-ki-Bari fountain gardens, and a sunset boat cruise on Lake Pichola past Jag Mandir."
          ]
        },
        {
          day: "Day 5",
          title: "Udaipur Departure Drop",
          activities: [
            "Patrika Gate/Monuments photo stop and transfer to Udaipur Airport."
          ]
        }
      ]
    },
    {
      id: 19,
      category: "day-tours",
      name: "Delhi Full-Day Capital Heritage Excursion",
      tag: "🚗 Same Day Delhi",
      duration: "Full Day (8 Hours)",
      kms: "60 KMs Total",
      festivalDates: "🚗 Tour Availability: Daily 365 Days",
      startingRate: "Best Rate on Request",
      destinations: ["Qutub Minar", "Humayun's Tomb", "Lotus Temple", "India Gate", "Red Fort", "Chandni Chowk"],
      image: "/pictures/delhi.jpg",
      tip: "🚗 City Tip: Includes private AC vehicle, expert local guide assistance, and Chandni Chowk rickshaw ride!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab (Fuel & Parking Included)",
        "Old Delhi Chandni Chowk Rickshaw Ride Ticket",
        "Doorstep Airport / Hotel Pickup & Drop",
        "No Hidden Taxes"
      ],
      itineraryDays: [
        {
          day: "Full Day",
          title: "Comprehensive Old & New Delhi Tour",
          activities: [
            "9:00 AM Hotel/Airport pickup. Visit UNESCO Qutub Minar, Humayun's Tomb, and Lotus Temple. Drive through Imperial New Delhi past India Gate, Rashtrapati Bhavan, and Parliament House. Explore Old Delhi's historic Red Fort, Jama Masjid, and take a traditional rickshaw ride through Chandni Chowk spice markets before evening drop-off."
          ]
        }
      ]
    },
    {
      id: 20,
      category: "day-tours",
      name: "Same Day Taj Mahal & Agra Fort Tour from Delhi",
      tag: "⚡ Express Taj Mahal",
      duration: "Full Day (12 Hours)",
      kms: "440 KMs Roundtrip",
      festivalDates: "⚡ Availability: Daily Except Friday (Taj Mahal Closed Friday)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi Pickup", "Yamuna Expressway", "Taj Mahal", "Agra Fort", "Mehtab Bagh", "Return Delhi Drop"],
      image: "/pictures/agra_fort.jpg",
      tip: "⚡ Express Tip: Smooth 3.5-hour drive via Yamuna Expressway in private AC Sedan/SUV with skip-the-line Taj Mahal entry!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Cab for Roundtrip Delhi-Agra-Delhi Circuit",
        "Yamuna Expressway Toll Taxes, Parking & Fuel Included",
        "Skip-the-Line Taj Mahal & Agra Fort Guide Assistance",
        "Doorstep Hotel / Airport Pickup & Drop in Delhi NCR"
      ],
      itineraryDays: [
        {
          day: "Same Day",
          title: "Delhi ➔ Taj Mahal ➔ Agra Fort ➔ Delhi Return",
          activities: [
            "6:00 AM Pickup from Delhi Hotel/Airport in private AC vehicle. Drive via Yamuna Expressway to Agra (approx. 3.5 hours). Meet expert local guide for a guided tour of the iconic Taj Mahal. Visit 16th-century Agra Fort and enjoy sunset photo halts at Mehtab Bagh across the river. Evening return drive to Delhi with doorstep drop-off by 8:30 PM."
          ]
        }
      ]
    },
    {
      id: 21,
      category: "rajasthan-heritage",
      name: "Rajasthan Culinary & Authentic Cultural Tour",
      tag: "🍲 Food & Culture",
      duration: "7 Days / 6 Nights",
      kms: "750 KMs Total Circuit",
      festivalDates: "🍲 Best Season: October to April (Food Walks Included)",
      startingRate: "Best Rate on Request",
      destinations: ["Jaipur", "Jodhpur", "Ranakpur", "Udaipur"],
      image: "/pictures/main-section/jaipur-albert-hall-museum.jpg",
      tip: "🍲 Foodie Tip: Includes authentic Rajasthani cooking masterclasses, street food walks in Jaipur, Laal Maas tasting & organic royal dinners!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 7 Days (~750 KMs)",
        "Guided Street Food Walks in Pink City & Jodhpur Spice Market",
        "Chef-Guided Culinary Masterclass & Royal Thali Dinners",
        "All Highways Tolls, Fuel, Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1-2",
          title: "Jaipur Pink City Sightseeing & Food Walk",
          activities: [
            "Pickup in Jaipur, tour Amer Fort, Hawa Mahal, and City Palace. Enjoy an evening street food tasting walk through Johari Bazaar trying Pyaaz Kachori, Mawa Kachori, and Ghewar sweets."
          ]
        },
        {
          day: "Day 3-4",
          title: "Jaipur to Jodhpur Blue City & Royal Culinary Dinner",
          activities: [
            "Drive to Blue City Jodhpur. Visit Mehrangarh Fort and Clock Tower spice markets. Attend an authentic royal cooking masterclass learning secret spice blends and savoring traditional Laal Maas."
          ]
        },
        {
          day: "Day 5-7",
          title: "Ranakpur Marble Temple & Lake Pichola Udaipur",
          activities: [
            "Drive to Udaipur via Ranakpur 1,444 carved pillar temple. Enjoy a private sunset boat ride on Lake Pichola, tour City Palace museum, and enjoy rooftop lakeside dining before departure transfer."
          ]
        }
      ]
    },
    {
      id: 22,
      category: "rajasthan-heritage",
      name: "Rajasthan & Wildlife with Extended Golden Triangle",
      tag: "🐅 Grand Rajasthan",
      duration: "19 Days / 18 Nights",
      kms: "2,200 KMs Total Circuit",
      festivalDates: "🐅 Best Season: October to April (Tiger Safaris Included)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Jaipur", "Alsisar", "Khimsar", "Jaisalmer", "Jodhpur", "Udaipur", "Devgarh", "Bundi", "Ranthambore", "Agra"],
      image: "/pictures/delhi_red_fort.jpg",
      tip: "🐅 Expedition Tip: Grand 19-day royal circuit covering Shekhawati havelis, Thar desert dunes, tiger safaris & Taj Mahal!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Sedan / SUV for 19 Days",
        "Ranthambore Open 4x4 Tiger Safari Permit Booking",
        "Thar Desert Sam Sand Dunes Camel & Cultural Night",
        "All Highways Tolls, Interstate Tax & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Heritage Sightseeing",
          activities: [
            "Airport arrival greeting by private AC chauffeur cab.",
            "Hotel check-in and refresh.",
            "Visit Qutub Minar, Humayun's Tomb, and Lotus Temple."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Shekhawati Open-Air Art Gallery (Mandawa)",
          activities: [
            "Morning drive to Mandawa in Shekhawati region.",
            "Guided walk through painted Havelis (Sewaram Saraf Haveli & Goenka Haveli).",
            "Overnight stay at Castle Mandawa heritage hotel."
          ]
        },
        {
          day: "Day 3",
          title: "Mandawa to Alsisar Heritage Palace",
          activities: [
            "Drive to historic Alsisar village.",
            "Explore Alsisar Mahal fort, ancient frescoes, and village craft market.",
            "Overnight stay at Alsisar Mahal."
          ]
        },
        {
          day: "Day 4",
          title: "Alsisar to Bikaner Junagarh Fort",
          activities: [
            "Drive to desert city Bikaner.",
            "Tour unbreached Junagarh Fort, Anup Mahal gold hall, and Badal Mahal.",
            "Visit National Research Centre on Camel."
          ]
        },
        {
          day: "Day 5",
          title: "Bikaner to Khimsar Sand Dunes Village",
          activities: [
            "Visit Karni Mata Rat Temple in Deshnoke.",
            "Drive to Khimsar Fort & Sand Dunes Village.",
            "Sunset camel safari on Khimsar sand dunes."
          ]
        },
        {
          day: "Day 6",
          title: "Khimsar to Golden City Jaisalmer",
          activities: [
            "Drive deep into the Thar Desert to Jaisalmer.",
            "En-route stop at Pokhran Fort museum.",
            "Arrive in Jaisalmer and check into yellow sandstone hotel."
          ]
        },
        {
          day: "Day 7",
          title: "Jaisalmer Sonar Qila & Havelis",
          activities: [
            "Explore living UNESCO Jaisalmer Fort.",
            "Visit Patwon ki Haveli, Nathmal Haveli, and Salim Singh ki Haveli.",
            "Sunset photo stop at Gadisar Lake."
          ]
        },
        {
          day: "Day 8",
          title: "Jaisalmer Sam Sand Dunes Luxury Camping & Camel Ride",
          activities: [
            "Drive to Sam Sand Dunes.",
            "Sunset camel safari across golden desert dunes.",
            "Campfire dinner with Kalbelia folk dance performance."
          ]
        },
        {
          day: "Day 9",
          title: "Sam Dunes to Blue City Jodhpur",
          activities: [
            "Desert sunrise walk and breakfast.",
            "Drive to Jodhpur Blue City.",
            "Visit Jaswant Thada marble memorial and Clock Tower."
          ]
        },
        {
          day: "Day 10",
          title: "Jodhpur Mehrangarh Fort & Bishnoi Safari",
          activities: [
            "Guided tour of colossal Mehrangarh Fort 400 feet above the city.",
            "4x4 open Jeep safari to Bishnoi eco-villages.",
            "Overnight stay in Jodhpur."
          ]
        },
        {
          day: "Day 11",
          title: "Jodhpur to Ranakpur Marble Temple ➔ Udaipur",
          activities: [
            "Drive towards Udaipur.",
            "Tour 15th-century Ranakpur Jain Temple with 1,444 uniquely carved marble pillars.",
            "Arrive in romantic lake city Udaipur."
          ]
        },
        {
          day: "Day 12",
          title: "Udaipur City Palace & Lake Pichola Sunset Cruise",
          activities: [
            "Tour massive Udaipur City Palace museum complex.",
            "Visit Jagdish Temple and Saheliyon-ki-Bari gardens.",
            "Private romantic sunset boat cruise on Lake Pichola past Jag Mandir."
          ]
        },
        {
          day: "Day 13",
          title: "Udaipur to Deogarh Mahal Castle Stay",
          activities: [
            "Drive to Deogarh hill estate.",
            "Check into 17th-century Deogarh Mahal heritage fort.",
            "Explore Deogarh village on vintage rural train ride."
          ]
        },
        {
          day: "Day 14",
          title: "Deogarh to Bundi Painted Stepwell City",
          activities: [
            "Drive to Bundi, famous for blue houses, stepwells, and murals.",
            "Explore Garh Palace and Taragarh Fort.",
            "Visit Raniji ki Baori (Queen's Stepwell)."
          ]
        },
        {
          day: "Day 15",
          title: "Bundi to Ranthambore Tiger Reserve",
          activities: [
            "Drive to Ranthambore National Park.",
            "Check into luxury safari lodge.",
            "Evening nature walk and wildlife briefing."
          ]
        },
        {
          day: "Day 16",
          title: "Ranthambore Open 4x4 Tiger Jungle Safari",
          activities: [
            "Early morning 4x4 Jeep jungle safari tracking Royal Bengal Tigers.",
            "Visit 10th-century Ranthambore Fort.",
            "Afternoon jungle safari for wildlife photography."
          ]
        },
        {
          day: "Day 17",
          title: "Ranthambore to Jaipur Pink City Forts",
          activities: [
            "Drive to Pink City Jaipur.",
            "Tour Amer Fort, Sheesh Mahal, and Jal Mahal.",
            "Shopping in Johari Bazaar."
          ]
        },
        {
          day: "Day 18",
          title: "Jaipur to Agra via Fatehpur Sikri & Taj Mahal Sunset",
          activities: [
            "Drive to Agra visiting UNESCO Fatehpur Sikri en route.",
            "Explore 16th-century Agra Fort.",
            "Sunset view of Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 19",
          title: "Taj Mahal Sunrise & Delhi Airport Departure",
          activities: [
            "Early morning private sunrise tour of the Taj Mahal.",
            "Breakfast and return drive to Delhi along Yamuna Expressway.",
            "Chauffeur drop at Delhi International Airport for return flight."
          ]
        }
      ]
    },
    {
      id: 23,
      category: "luxury-wildlife",
      name: "Rajasthan & Central India Tiger Safari with Mumbai",
      tag: "🐅 Tiger & Mumbai",
      duration: "19 Days / 18 Nights",
      kms: "North to West India Circuit",
      festivalDates: "🐅 Tiger Season: October to June",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Mandawa", "Bikaner", "Jaisalmer", "Jodhpur", "Udaipur", "Jaipur", "Ranthambore", "Agra", "Bandhavgarh", "Kanha", "Mumbai"],
      image: "/pictures/bikaner.jpg",
      tip: "🐅 Wildlife Tip: Ultimate tiger safari expedition combining Rajasthan's forts with Bandhavgarh & Kanha tiger reserves plus Mumbai city!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle & Airport Transfers",
        "Multiple Open 4x4 Jeep Jungle Safaris in Bandhavgarh & Kanha",
        "Taj Mahal Sunrise & Rajasthan Heritage Guided Sightseeing",
        "All Highways Tolls, Permits & Driver Allowances Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Sightseeing",
          activities: [
            "VIP pickup from Delhi Airport by private AC cab.",
            "Hotel check-in.",
            "Visit Qutub Minar, Humayun's Tomb, and Lotus Temple."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Mandawa Shekhawati Frescoes",
          activities: [
            "Drive to Mandawa.",
            "Explore painted merchant Havelis (Goenka & Saraf Havelis).",
            "Overnight stay at Castle Mandawa."
          ]
        },
        {
          day: "Day 3",
          title: "Mandawa to Bikaner Junagarh Fort",
          activities: [
            "Drive to Bikaner.",
            "Explore Junagarh Fort, Badal Mahal, and Karan Mahal.",
            "Visit Camel Breeding Farm."
          ]
        },
        {
          day: "Day 4",
          title: "Bikaner to Golden City Jaisalmer",
          activities: [
            "Visit Deshnoke Karni Mata Rat Temple.",
            "Drive west across Thar desert to Jaisalmer.",
            "Check into yellow sandstone hotel."
          ]
        },
        {
          day: "Day 5",
          title: "Jaisalmer Fort & Sam Sand Dunes Camel Safari",
          activities: [
            "Explore UNESCO Jaisalmer Golden Fort & Patwon ki Haveli.",
            "Drive to Sam Sand Dunes for sunset camel safari.",
            "Campfire buffet dinner & Kalbelia dance night."
          ]
        },
        {
          day: "Day 6",
          title: "Sam Dunes to Blue City Jodhpur",
          activities: [
            "Desert sunrise walk and breakfast.",
            "Drive to Jodhpur.",
            "Visit Jaswant Thada marble memorial and Clock Tower."
          ]
        },
        {
          day: "Day 7",
          title: "Jodhpur Mehrangarh Fort & Bishnoi Safari",
          activities: [
            "Guided tour of colossal Mehrangarh Fort.",
            "4x4 open Jeep safari to Bishnoi eco-villages.",
            "Overnight stay in Jodhpur."
          ]
        },
        {
          day: "Day 8",
          title: "Jodhpur to Ranakpur Temple ➔ Udaipur",
          activities: [
            "Drive to Udaipur via Ranakpur 1,444 marble pillar Jain Temple.",
            "Arrive in Udaipur lake city."
          ]
        },
        {
          day: "Day 9",
          title: "Udaipur City Palace & Lake Pichola Cruise",
          activities: [
            "Explore Udaipur City Palace museum.",
            "Stroll through Saheliyon-ki-Bari gardens.",
            "Private sunset boat cruise on Lake Pichola."
          ]
        },
        {
          day: "Day 10",
          title: "Udaipur to Jaipur Pink City",
          activities: [
            "Drive to Jaipur.",
            "Visit Albert Hall Museum & Patrika Gate.",
            "Overnight stay in Jaipur."
          ]
        },
        {
          day: "Day 11",
          title: "Jaipur Amer Fort Elephant Ride & Palace Tour",
          activities: [
            "Amer Fort elephant ride / private Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and Hawa Mahal.",
            "Johari Bazaar craft shopping."
          ]
        },
        {
          day: "Day 12",
          title: "Jaipur to Ranthambore Tiger Reserve",
          activities: [
            "Drive to Ranthambore Tiger Park.",
            "Check into luxury jungle resort.",
            "Evening nature briefing."
          ]
        },
        {
          day: "Day 13",
          title: "Ranthambore Open 4x4 Tiger Safari",
          activities: [
            "Early morning 4x4 Jeep safari tracking tigers.",
            "Visit Ranthambore Fort.",
            "Afternoon jungle safari."
          ]
        },
        {
          day: "Day 14",
          title: "Ranthambore to Agra & Sunset Taj Mahal",
          activities: [
            "Drive to Agra via Fatehpur Sikri.",
            "Tour Agra Fort.",
            "Sunset view of Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 15",
          title: "Agra Taj Mahal Sunrise & Train to Umaria (Bandhavgarh)",
          activities: [
            "Early morning sunrise Taj Mahal tour.",
            "Transfer to train station / flight to Umaria for Bandhavgarh Tiger Reserve.",
            "Check into jungle safari lodge."
          ]
        },
        {
          day: "Day 16",
          title: "Bandhavgarh National Park Morning & Afternoon Safaris",
          activities: [
            "Morning 4x4 Jeep jungle safari in Tala/Magdhi zone.",
            "High tiger density tracking & bird watching.",
            "Afternoon jungle safari."
          ]
        },
        {
          day: "Day 17",
          title: "Bandhavgarh to Kanha Tiger Reserve (Rudyard Kipling Land)",
          activities: [
            "Drive through Sal forests to Kanha Tiger Reserve.",
            "Check into luxury jungle safari camp.",
            "Evening tribal Baiga dance performance."
          ]
        },
        {
          day: "Day 18",
          title: "Kanha National Park Safari & Flight to Mumbai",
          activities: [
            "Morning 4x4 Jeep safari tracking tigers & hard-ground Barasingha deer.",
            "Transfer to Jabalpur/Nagpur Airport for evening flight to Mumbai.",
            "Check into Mumbai hotel."
          ]
        },
        {
          day: "Day 19",
          title: "Mumbai Gateway of India & Airport Departure",
          activities: [
            "Visit Gateway of India, Taj Mahal Palace Hotel, and Marine Drive (Queen's Necklace).",
            "Explore Dhobi Ghat and Chhatrapati Shivaji Terminus.",
            "Chauffeur drop at Mumbai Airport for return flight."
          ]
        }
      ]
    },
    {
      id: 24,
      category: "spiritual",
      name: "Rajasthan with Golden Triangle & Rishikesh Sacred Tour",
      tag: "🧘 Heritage & Yoga",
      duration: "15 Days / 14 Nights",
      kms: "1,850 KMs Total Circuit",
      festivalDates: "🧘 Best Season: Year Round (Ganga Aarti Experience)",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur", "Pushkar Lake", "Udaipur", "Rishikesh (Ganga Aarti)", "Haridwar"],
      image: "/pictures/pushkar_lake.jpg",
      tip: "🧘 Spiritual Tip: Combines Taj Mahal & Rajasthan royal forts with holy Pushkar Brahma temple & evening Ganga Aarti in Rishikesh!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 15 Days (~1,850 KMs)",
        "Rishikesh Triveni Ghat Ganga Aarti VIP Boat Viewing",
        "Pushkar Lake Holy Ghat Aarti & Brahma Temple Visit",
        "Taj Mahal Sunrise & Jaipur Forts Sightseeing"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Monument Sightseeing",
          activities: [
            "VIP greeting at Delhi International Airport / Railway Station by private AC chauffeur.",
            "Transfer to hotel for check-in and fresh up.",
            "Guided tour of UNESCO Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Drive past India Gate, Rashtrapati Bhavan, and Parliament House."
          ]
        },
        {
          day: "Day 2",
          title: "Old Delhi Heritage Tour & Drive to Agra",
          activities: [
            "Rickshaw ride through Chandni Chowk spice markets and Jama Masjid.",
            "Photo stop at historic Red Fort.",
            "Drive to Agra along Yamuna Expressway in private AC car.",
            "Sunset view of Taj Mahal from Mehtab Bagh across the Yamuna River."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Early morning private sunrise entry into the Taj Mahal with expert guide.",
            "Explore 16th-century Agra Fort and Jahangiri Mahal.",
            "En-route visit UNESCO Fatehpur Sikri (Akbar's abandoned capital) & Abhaneri Stepwell.",
            "Check into Jaipur Pink City hotel."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Amer Fort Elephant Ride & Palace Sightseeing",
          activities: [
            "Ascend hilltop Amer Fort on elephant back / private 4x4 Jeep.",
            "Explore Sheesh Mahal (Mirror Palace), Jal Mahal photo halt, and City Palace courtyard.",
            "Photo stop at iconic Hawa Mahal (Palace of Winds).",
            "Evening handicraft shopping in Johari Bazaar."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur to Sacred Pushkar Holy Lake",
          activities: [
            "Drive to holy pilgrimage town Pushkar.",
            "Check into heritage hotel near Pushkar Lake.",
            "Visit the world's only 14th-century Lord Brahma Temple.",
            "Attend evening sacred Ganga & Lake Aarti ceremony at 52 holy ghats."
          ]
        },
        {
          day: "Day 6",
          title: "Pushkar Savitri Temple Sunset & Drive to Ajmer",
          activities: [
            "Early morning cable car ride up Ratnagiri Hill to Savitri Mata Temple for sunrise vistas.",
            "Excursion to Ajmer Sharif Dargah in Ajmer.",
            "Drive south towards Chittorgarh.",
            "Overnight stay in Chittorgarh."
          ]
        },
        {
          day: "Day 7",
          title: "Chittorgarh Victory Fort to Udaipur City of Lakes",
          activities: [
            "Explore UNESCO Chittorgarh Fort, Vijay Stambha (Victory Tower), and Padmini Palace.",
            "Scenic drive through Aravali mountains to Udaipur (Venice of the East).",
            "Check into lakefront hotel.",
            "Evening stroll along Ambrai Ghat."
          ]
        },
        {
          day: "Day 8",
          title: "Udaipur City Palace & Lake Pichola Private Boat Cruise",
          activities: [
            "Guided tour of massive Udaipur City Palace complex and Crystal Gallery.",
            "Visit 17th-century Jagdish Temple.",
            "Stroll through Saheliyon-ki-Bari fountain gardens.",
            "Private romantic sunset boat cruise on Lake Pichola past Jag Mandir Palace."
          ]
        },
        {
          day: "Day 9",
          title: "Udaipur Day Excursion to Ranakpur Marble Temple",
          activities: [
            "Day trip to 15th-century Ranakpur Jain Temple featuring 1,444 uniquely carved marble pillars.",
            "Visit Eklingji Shiva Temple complex.",
            "Return to Udaipur for lakeside dining."
          ]
        },
        {
          day: "Day 10",
          title: "Udaipur to Delhi Flight / Train Connection",
          activities: [
            "Morning breakfast overlooking Lake Pichola.",
            "Chauffeur transfer to Udaipur Airport for flight connection to Delhi.",
            "Arrive in Delhi and check into hotel.",
            "Relaxed evening."
          ]
        },
        {
          day: "Day 11",
          title: "Delhi to Holy City Haridwar & Har Ki Pauri Aarti",
          activities: [
            "Morning drive north towards holy Haridwar along the River Ganges.",
            "Visit Mansa Devi Temple via cable car ride.",
            "Attend world-famous evening Ganga Aarti at Har Ki Pauri ghat with floating lamps."
          ]
        },
        {
          day: "Day 12",
          title: "Haridwar to Rishikesh Yoga Capital & Suspension Bridges",
          activities: [
            "Short drive to Rishikesh (Yoga Capital of the World).",
            "Walk across iconic Ram Jhula and Lakshman Jhula suspension bridges.",
            "Explore Gita Bhawan and Parmarth Niketan Ashram.",
            "Attend evening spiritual Vedic chanting along the Ganges."
          ]
        },
        {
          day: "Day 13",
          title: "Rishikesh Beatles Ashram & River Rafting Experience",
          activities: [
            "Guided walk through Beatles Ashram (Chaurasi Kutia) adorned with graffiti art.",
            "Optional morning White Water River Rafting on the Holy Ganges.",
            "Meditation session at Vashishta Gufa cave."
          ]
        },
        {
          day: "Day 14",
          title: "Rishikesh Triveni Ghat Night Aarti & Spiritual Retreat",
          activities: [
            "Morning yoga session along the Ganges riverbank.",
            "Explore local Ayurvedic herb markets and organic cafes.",
            "VIP boat viewing of Triveni Ghat evening Maha Aarti."
          ]
        },
        {
          day: "Day 15",
          title: "Rishikesh to Delhi Airport Return Transfer",
          activities: [
            "Relaxed morning breakfast in Rishikesh.",
            "Private chauffeur drive back to Delhi (approx. 5 hours).",
            "Drop-off at Delhi International Airport or Railway Station for onward journey."
          ]
        }
      ]
    },
    {
      id: 25,
      category: "offbeat-rural",
      name: "Rajasthan Tribal & Royal Heritage Tour (Dungarpur & Banswara)",
      tag: "🌾 Tribal Heritage",
      duration: "14 Days / 13 Nights",
      kms: "1,450 KMs Circuit",
      festivalDates: "🌾 Best Season: October to March",
      startingRate: "Best Rate on Request",
      destinations: ["Udaipur", "Dungarpur Palace", "Banswara", "Chittorgarh Fort", "Bundi Fort", "Jaipur"],
      image: "/pictures/udaipur.jpg",
      tip: "🌾 Offbeat Tip: Explore Southern Rajasthan's tribal heartlands, eco-waterfalls, 100 islands of Banswara & Dungarpur Juna Mahal!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 14 Days",
        "Guided Juna Mahal Dungarpur & Banswara Tribal Village Walks",
        "Chittorgarh Victory Tower Fort Guided Tour",
        "All Highways Tolls, Fuel & Driver Allowances Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Udaipur Arrival & Lake Pichola Stroll",
          activities: [
            "Airport/Railway station pickup by private AC cab.",
            "Check into lakefront hotel.",
            "Evening stroll along Ambrai Ghat overlooking City Palace."
          ]
        },
        {
          day: "Day 2",
          title: "Udaipur City Palace & Saheliyon-ki-Bari",
          activities: [
            "Explore Udaipur City Palace museum complex.",
            "Visit Jagdish Temple and Crystal Gallery.",
            "Stroll through Saheliyon-ki-Bari fountain gardens."
          ]
        },
        {
          day: "Day 3",
          title: "Udaipur to Dungarpur Juna Mahal Palace",
          activities: [
            "Drive south into tribal belt of Dungarpur.",
            "Explore 7-story wooden Juna Mahal palace with rare frescoes.",
            "Sunset walk along Gaib Sagar Lake."
          ]
        },
        {
          day: "Day 4",
          title: "Dungarpur Udai Bilas Palace & Tribal Heritage Walk",
          activities: [
            "Guided tour of Udai Bilas Palace on lake shore.",
            "Visit Vijay Rajrajeshwar Temple.",
            "Walk through Bhil tribal craft artisan villages."
          ]
        },
        {
          day: "Day 5",
          title: "Dungarpur to Banswara 100 Islands Region",
          activities: [
            "Drive to Banswara, known as the City of Hundred Islands.",
            "Visit Mahi Bajaj Sagar Dam and island views.",
            "Explore Anand Sagar Lake."
          ]
        },
        {
          day: "Day 6",
          title: "Banswara Tribal Culture & Paraheada Temples",
          activities: [
            "Visit Paraheada ancient Shiva temples.",
            "Explore Tripura Sundari Temple in Talwara.",
            "Experience tribal archers & handicraft workshops."
          ]
        },
        {
          day: "Day 7",
          title: "Banswara to Chittorgarh Victory Fort",
          activities: [
            "Drive north to Chittorgarh.",
            "Ascend UNESCO Chittorgarh Fort complex.",
            "Explore Vijay Stambha (Victory Tower) and Kirti Stambha."
          ]
        },
        {
          day: "Day 8",
          title: "Chittorgarh Padmini Palace & Fort History",
          activities: [
            "Visit Rani Padmini Palace surrounded by water lotus ponds.",
            "Explore Kumbha Palace and Meera Temple.",
            "Overnight stay in Chittorgarh."
          ]
        },
        {
          day: "Day 9",
          title: "Chittorgarh to Bundi Blue Stepwell Town",
          activities: [
            "Drive to historic Bundi.",
            "Visit Garh Palace, famous for Bundi miniature paintings.",
            "Explore Taragarh Fort overlooking the old town."
          ]
        },
        {
          day: "Day 10",
          title: "Bundi Raniji ki Baori & Nawal Sagar Lake",
          activities: [
            "Explore 17th-century Raniji ki Baori (Queen's Stepwell).",
            "Visit Dabhai Kund stepwell and Nawal Sagar lake.",
            "Overnight stay in Bundi."
          ]
        },
        {
          day: "Day 11",
          title: "Bundi to Jaipur Pink City",
          activities: [
            "Drive to Pink City Jaipur.",
            "Visit Albert Hall Museum and Patrika Gate.",
            "Check into Jaipur hotel."
          ]
        },
        {
          day: "Day 12",
          title: "Jaipur Amer Fort Elephant Ride & Palace Tour",
          activities: [
            "Ascend Amer Fort on elephant back / private 4x4 Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace museum.",
            "Photo stop at Hawa Mahal."
          ]
        },
        {
          day: "Day 13",
          title: "Jaipur Bazaars & Nahargarh Sunset",
          activities: [
            "Craft shopping in Johari Bazaar and Bapu Bazaar.",
            "Sunset views over Jaipur from hilltop Nahargarh Fort.",
            "Farewell royal Rajasthani Thali dinner."
          ]
        },
        {
          day: "Day 14",
          title: "Jaipur Airport / Railway Station Drop",
          activities: [
            "Relaxed morning breakfast.",
            "Private chauffeur transfer to Jaipur Airport or Railway Station."
          ]
        }
      ]
    },
    {
      id: 26,
      category: "rajasthan-heritage",
      name: "14 Days Grand Cultural & Heritage Tour of Rajasthan",
      tag: "🏰 Complete Heritage",
      duration: "14 Days / 13 Nights",
      kms: "1,650 KMs Circuit",
      festivalDates: "🏰 Best Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Mandawa Havelis", "Bikaner", "Jaisalmer Fort", "Jodhpur", "Kumbhalgarh", "Udaipur", "Chittorgarh", "Jaipur", "Agra"],
      image: "/pictures/mandawa.jpg",
      tip: "🏰 Classic Tip: Comprehensive 14-day itinerary connecting all famous royal cities, desert sand dunes & Taj Mahal!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 14 Days (~1,650 KMs)",
        "Sam Sand Dunes Camel Safari & Rajasthani Folk Night",
        "Taj Mahal Sunrise & Heritage Fort Guided Sightseeing",
        "All Highways Tolls, Interstate Taxes & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Imperial Monument Tour",
          activities: [
            "Airport arrival greeting by private AC cab.",
            "Visit Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Drive past India Gate and President's Estate."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Mandawa Shekhawati Painted Havelis",
          activities: [
            "Drive to Mandawa in Shekhawati region.",
            "Explore painted merchant havelis with intricate wall frescoes.",
            "Overnight stay at Castle Mandawa."
          ]
        },
        {
          day: "Day 3",
          title: "Mandawa to Bikaner Junagarh Fort",
          activities: [
            "Drive to desert city Bikaner.",
            "Tour unbreached Junagarh Fort, Anup Mahal, and Badal Mahal.",
            "Visit National Research Centre on Camel."
          ]
        },
        {
          day: "Day 4",
          title: "Bikaner to Golden City Jaisalmer",
          activities: [
            "Visit Karni Mata Rat Temple in Deshnoke.",
            "Drive to Jaisalmer across Thar desert.",
            "Check into yellow sandstone hotel."
          ]
        },
        {
          day: "Day 5",
          title: "Jaisalmer Sonar Qila & Haveli Tour",
          activities: [
            "Explore living UNESCO Jaisalmer Fort.",
            "Visit Patwon ki Haveli and Nathmal ki Haveli.",
            "Sunset boat ride on Gadisar Lake."
          ]
        },
        {
          day: "Day 6",
          title: "Jaisalmer Sam Sand Dunes Camping & Camel Safari",
          activities: [
            "Drive to Sam Sand Dunes.",
            "Sunset camel ride over golden sand dunes.",
            "Campfire dinner & Kalbelia dance night."
          ]
        },
        {
          day: "Day 7",
          title: "Sam Dunes to Blue City Jodhpur",
          activities: [
            "Desert sunrise walk & breakfast.",
            "Drive to Jodhpur Blue City.",
            "Visit Jaswant Thada marble memorial & Clock Tower."
          ]
        },
        {
          day: "Day 8",
          title: "Jodhpur Mehrangarh Fort & Bishnoi Village Safari",
          activities: [
            "Guided tour of colossal Mehrangarh Fort.",
            "4x4 open Jeep safari to Bishnoi eco-villages.",
            "Overnight stay in Jodhpur."
          ]
        },
        {
          day: "Day 9",
          title: "Jodhpur to Kumbhalgarh Fort Wall ➔ Udaipur",
          activities: [
            "Drive towards Udaipur.",
            "Tour UNESCO Kumbhalgarh Fort with 36km wall.",
            "Arrive in lake city Udaipur."
          ]
        },
        {
          day: "Day 10",
          title: "Udaipur City Palace & Lake Pichola Boat Cruise",
          activities: [
            "Explore Udaipur City Palace museum complex.",
            "Stroll through Saheliyon-ki-Bari fountain gardens.",
            "Private sunset boat cruise on Lake Pichola past Jag Mandir."
          ]
        },
        {
          day: "Day 11",
          title: "Udaipur to Jaipur Pink City",
          activities: [
            "Drive to Pink City Jaipur.",
            "Visit Albert Hall Museum and Patrika Gate.",
            "Check into Jaipur hotel."
          ]
        },
        {
          day: "Day 12",
          title: "Jaipur Amer Fort & Palace Sightseeing",
          activities: [
            "Ascend Amer Fort on elephant back / private Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace.",
            "Photo stop at Hawa Mahal."
          ]
        },
        {
          day: "Day 13",
          title: "Jaipur to Agra via Fatehpur Sikri & Taj Mahal Sunset",
          activities: [
            "Drive to Agra visiting UNESCO Fatehpur Sikri en route.",
            "Explore 16th-century Agra Fort.",
            "Sunset view of Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 14",
          title: "Taj Mahal Sunrise & Delhi Airport Drop",
          activities: [
            "Early morning private sunrise tour of the Taj Mahal.",
            "Drive back to Delhi via Yamuna Expressway.",
            "Chauffeur drop at Delhi International Airport."
          ]
        }
      ]
    },
    {
      id: 27,
      category: "spiritual",
      name: "Rajasthan Sacred Temples & Spiritual Pilgrimage Circuit",
      tag: "🌺 Divine Pilgrimage",
      duration: "13 Days / 12 Nights",
      kms: "1,350 KMs Circuit",
      festivalDates: "🌺 Best Season: Year Round Darshan",
      startingRate: "Best Rate on Request",
      destinations: ["Jaipur", "Pushkar Lake", "Nathdwara Shrinathji", "Mount Abu Dilwara", "Ranakpur Jain", "Osian Sun Temple"],
      image: "/pictures/khatu_shyam_salasar_temple.jpg",
      tip: "🌺 Pilgrimage Tip: Deeply spiritual tour covering Shrinathji Temple Nathdwara, Dilwara Marble Temple, Pushkar Lake & Osian!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Cab for 13 Days (~1,350 KMs)",
        "VIP Temple Darshan Passes & Sacred Ghat Aarti Arrangements",
        "Dedicated Driver with High Knowledge of Temple Timings",
        "All Tolls, Parking Fees & State Tax Permits Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Jaipur Arrival & Govind Dev Ji Temple Darshan",
          activities: [
            "Greeting at Jaipur Airport/Railway Station.",
            "Hotel check-in.",
            "Attend evening Aarti at Govind Dev Ji Temple inside City Palace complex."
          ]
        },
        {
          day: "Day 2",
          title: "Jaipur Heritage Temples & Moti Dungri Ganesh",
          activities: [
            "Morning Darshan at Moti Dungri Ganesh Temple and Birla Temple.",
            "Visit historic Galta Ji (Monkey Temple) in Aravali pass.",
            "Explore Galtaji sun temple and holy kunds."
          ]
        },
        {
          day: "Day 3",
          title: "Jaipur to Khatu Shyam Ji & Salasar Balaji",
          activities: [
            "Early morning drive to Khatu Shyam Ji Temple for special Darshan.",
            "Proceed to Salasar Balaji Temple for Hanuman Ji prayers.",
            "Return to Jaipur for overnight stay."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur to Sacred Pushkar Holy Lake",
          activities: [
            "Drive to holy town Pushkar.",
            "Perform holy dip and Puja at 52 bathing ghats on Pushkar Lake.",
            "Visit rare 14th-century Lord Brahma Temple."
          ]
        },
        {
          day: "Day 5",
          title: "Pushkar Savitri Temple Sunset & Drive to Ajmer",
          activities: [
            "Cable car ride up Ratnagiri hill to Savitri Mata Temple for sunrise views.",
            "Visit Ajmer Sharif Dargah in Ajmer.",
            "Drive towards Nathdwara."
          ]
        },
        {
          day: "Day 6",
          title: "Nathdwara Shrinathji Temple Darshan & Kankroli",
          activities: [
            "Attend morning Rajbhog Darshan at Shrinathji Temple Nathdwara.",
            "Visit Dwarkadheesh Temple in nearby Kankroli on Rajsamand Lake.",
            "Overnight stay in Nathdwara."
          ]
        },
        {
          day: "Day 7",
          title: "Nathdwara to Eklingji Shiva Temple ➔ Mount Abu",
          activities: [
            "Visit 8th-century Eklingji Shiva Temple complex.",
            "Drive up Aravali hills to Mount Abu.",
            "Check into mountain hotel."
          ]
        },
        {
          day: "Day 8",
          title: "Mount Abu Dilwara Marble Temples & Nakki Lake",
          activities: [
            "Tour 11th-century Dilwara Marble Jain Temples.",
            "Visit Adhar Devi Temple carved out of solid rock.",
            "Row boat ride on Nakki Lake."
          ]
        },
        {
          day: "Day 9",
          title: "Mount Abu to Ranakpur Jain Temple ➔ Jodhpur",
          activities: [
            "Drive down to Ranakpur Jain Temple.",
            "Admire 1,444 uniquely carved marble pillars and Adinath idol.",
            "Drive to Blue City Jodhpur."
          ]
        },
        {
          day: "Day 10",
          title: "Jodhpur Sacred Osian Sun & Jain Temples",
          activities: [
            "Excursion to ancient desert town Osian (Khajuraho of Rajasthan).",
            "Visit 8th-century Sun Temple and Sachiya Mata Temple.",
            "Explore Mahavira Jain Temple."
          ]
        },
        {
          day: "Day 11",
          title: "Jodhpur Mehrangarh & Chamunda Mata Temple",
          activities: [
            "Guided tour of Mehrangarh Fort and Chamunda Devi Temple inside fort.",
            "Visit Jaswant Thada royal cenotaphs.",
            "Evening market walk."
          ]
        },
        {
          day: "Day 12",
          title: "Jodhpur to Jaipur Return Drive",
          activities: [
            "Relaxed morning drive back to Jaipur.",
            "Free time for buying pure brass & marble idols in Jaipur.",
            "Farewell dinner."
          ]
        },
        {
          day: "Day 13",
          title: "Jaipur Airport / Railway Station Drop",
          activities: [
            "Morning breakfast.",
            "Chauffeur drop at Jaipur Airport or Railway Station."
          ]
        }
      ]
    },
    {
      id: 28,
      category: "offbeat-rural",
      name: "Rajasthan with White Desert Rann of Kutch (Gujarat Extension)",
      tag: "🏜️ Desert & Salt Flats",
      duration: "13 Days / 12 Nights",
      kms: "1,550 KMs Circuit",
      festivalDates: "🏜️ Best Season: November to February (Rann Utsav)",
      startingRate: "Best Rate on Request",
      destinations: ["Udaipur", "Mount Abu", "Patan Stepwell", "Bhuj", "Great Rann of Kutch", "Ahmedabad"],
      image: "/pictures/bikaner.jpg",
      tip: "🏜️ Rann Utsav Tip: Witness the white salt desert of Rann of Kutch under full moon light, Patan Queen's Stepwell & Sabarmati Ashram!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 13 Days (~1,550 KMs)",
        "Rann of Kutch White Desert Entry Permit Assistance",
        "UNESCO Rani ki Vav Stepwell & Modhera Sun Temple Tour",
        "All Highways Tolls, Interstate Taxes & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Udaipur Arrival & Lake Pichola Stroll",
          activities: [
            "Airport arrival greeting by private AC cab.",
            "Hotel check-in.",
            "Evening sunset boat cruise on Lake Pichola."
          ]
        },
        {
          day: "Day 2",
          title: "Udaipur City Palace & Saheliyon-ki-Bari",
          activities: [
            "Tour Udaipur City Palace museum complex.",
            "Visit Jagdish Temple and Crystal Gallery.",
            "Stroll through Saheliyon-ki-Bari fountain gardens."
          ]
        },
        {
          day: "Day 3",
          title: "Udaipur to Mount Abu Hill Station",
          activities: [
            "Scenic drive through Aravali hills to Mount Abu.",
            "Visit Dilwara Marble Jain Temples.",
            "Sunset views over valley from Sunset Point."
          ]
        },
        {
          day: "Day 4",
          title: "Mount Abu to Palanpur Gateway to Gujarat",
          activities: [
            "Row boat cruise on sacred Nakki Lake.",
            "Visit Toad Rock and Guru Shikhar peak.",
            "Cross into Gujarat state to Palanpur."
          ]
        },
        {
          day: "Day 5",
          title: "Palanpur to Patan UNESCO Stepwell & Sun Temple Modhera",
          activities: [
            "Visit UNESCO Rani ki Vav 11th-century stepwell in Patan.",
            "Explore famous Patola silk handloom weavers.",
            "Tour 11th-century Modhera Sun Temple on Pushpavati River."
          ]
        },
        {
          day: "Day 6",
          title: "Modhera to Bhuj (Kutch Capital)",
          activities: [
            "Drive to Bhuj in Kutch region.",
            "Explore Aina Mahal (Palace of Mirrors) and Prag Mahal clock tower.",
            "Visit Kutch Museum."
          ]
        },
        {
          day: "Day 7",
          title: "Bhuj to Great Rann of Kutch White Salt Desert",
          activities: [
            "Drive to Dhordo for Great Rann of Kutch entry permits.",
            "Walk on the glowing white salt desert flats.",
            "Watch spectacular sunset over white salt horizons."
          ]
        },
        {
          day: "Day 8",
          title: "Rann of Kutch Sunrise & Kalo Dungar (Black Hill)",
          activities: [
            "Early morning white desert sunrise view.",
            "Drive to Kalo Dungar (highest point in Kutch) for panoramic views of Indo-Pak border.",
            "Visit 400-year-old Dattatreya Temple."
          ]
        },
        {
          day: "Day 9",
          title: "Bhuj Artisans Village Circuit (Hodka & Nirona)",
          activities: [
            "Tour Nirona village learning rare Rogan oil painting art.",
            "Visit copper bell makers and lacquer wood craft artisans.",
            "Explore Hodka Bhunga mud-house villages."
          ]
        },
        {
          day: "Day 10",
          title: "Bhuj to Mandvi Beach & Vijay Vilas Palace",
          activities: [
            "Day trip to coastal town Mandvi.",
            "Tour royal beachfront Vijay Vilas Palace.",
            "Visit 400-year-old shipbuilding yard along Rukmavati River."
          ]
        },
        {
          day: "Day 11",
          title: "Bhuj to Little Rann of Kutch Wild Ass Sanctuary",
          activities: [
            "Drive to Little Rann of Kutch (Dasada).",
            "Open 4x4 Jeep safari tracking endangered Indian Wild Ass (Khur).",
            "Spot migratory flamingos and pelicans."
          ]
        },
        {
          day: "Day 12",
          title: "Little Rann to Ahmedabad (Sabarmati Ashram)",
          activities: [
            "Drive to Ahmedabad.",
            "Visit Mahatma Gandhi's Sabarmati Ashram.",
            "Explore Adalaj Stepwell and Sidi Saiyyed Mosque stone lattice."
          ]
        },
        {
          day: "Day 13",
          title: "Ahmedabad Airport Departure Drop",
          activities: [
            "Breakfast and local sweet shopping.",
            "Private transfer to Ahmedabad Sardar Vallabhbhai Patel Airport."
          ]
        }
      ]
    },
    {
      id: 29,
      category: "luxury-tours",
      name: "Romantic Rajasthan Lake & Hill Station Honeymoon",
      tag: "💖 Romantic Escape",
      duration: "8 Days / 7 Nights",
      kms: "650 KMs Circuit",
      festivalDates: "💖 Best Season: Year Round",
      startingRate: "Best Rate on Request",
      destinations: ["Udaipur (Lake Pichola)", "Mount Abu (Nakki Lake)", "Kumbhalgarh Fort", "Saheliyon Ki Bari"],
      image: "/pictures/udaipur.jpg",
      tip: "💖 Honeymoon Tip: Romantic lakefront luxury stays in Udaipur & Mount Abu hill station with private candlelight boat cruises!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Sedan / SUV for 8 Days",
        "Private Sunset Candlelight Boat Cruise on Lake Pichola",
        "Kumbhalgarh Fort Sound & Light Show Tickets",
        "All Highways Tolls, Fuel & Driver Allowances Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Udaipur Lake Pichola Arrival & Sunset Ghats",
          activities: [
            "VIP pickup at Udaipur Airport/Railway Station by private AC chauffeur cab.",
            "Check into luxury lakefront palace hotel with complimentary welcome drinks.",
            "Stroll along Ambrai Ghat and Gangaur Ghat overlooking glowing City Palace."
          ]
        },
        {
          day: "Day 2",
          title: "Udaipur City Palace Museum & Jagdish Temple",
          activities: [
            "Explore the massive City Palace museum, Mor Chowk, and Crystal Gallery.",
            "Visit 17th-century Jagdish Temple.",
            "Rooftop lake view lunch."
          ]
        },
        {
          day: "Day 3",
          title: "Udaipur Saheliyon-ki-Bari & Sunset Boat Cruise",
          activities: [
            "Stroll through Saheliyon-ki-Bari fountain gardens and Sukhadia Circle.",
            "Visit Maharajah's Vintage Car Museum.",
            "Private romantic sunset boat cruise on Lake Pichola past Jag Mandir Island Palace."
          ]
        },
        {
          day: "Day 4",
          title: "Udaipur to Mount Abu Hill Station Drive",
          activities: [
            "Scenic drive through the Aravali mountain hills to Mount Abu, Rajasthan's only hill station.",
            "Check into heritage mountain resort.",
            "Evening stroll around Nakki Lake."
          ]
        },
        {
          day: "Day 5",
          title: "Mount Abu Dilwara Temples & Nakki Lake Boating",
          activities: [
            "Visit 11th-century Dilwara Marble Jain Temple, world-famous for intricate stone carvings.",
            "Row boat cruise on sacred Nakki Lake surrounded by green hills.",
            "Hike up to Toad Rock rock formation and watch sunset at Sunset Point."
          ]
        },
        {
          day: "Day 6",
          title: "Mount Abu to Kumbhalgarh Fort Great Wall",
          activities: [
            "Drive to UNESCO Kumbhalgarh Fort.",
            "Walk along the world's 2nd longest continuous wall (36 KMs).",
            "Explore Badal Mahal (Palace of Clouds)."
          ]
        },
        {
          day: "Day 7",
          title: "Kumbhalgarh Sound & Light Show & Leisure Spa",
          activities: [
            "Morning jungle walk around Kumbhalgarh Wildlife Sanctuary.",
            "Relaxing spa massage at resort.",
            "Evening Light & Sound show narrating Maharana Pratap's heroism."
          ]
        },
        {
          day: "Day 8",
          title: "Kumbhalgarh to Udaipur Airport Return Drop",
          activities: [
            "Relaxed morning breakfast.",
            "Private chauffeur transfer to Udaipur Airport or Railway Station for onward journey."
          ]
        }
      ]
    },
    {
      id: 30,
      category: "offbeat-rural",
      name: "Rural Rajasthan Castle Stays & Village Heritage Experience",
      tag: "🏰 Heritage Castle Stays",
      duration: "9 Days / 8 Nights",
      kms: "850 KMs Circuit",
      festivalDates: "🏰 Best Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Jodhpur", "Rohetgarh Castle", "Narlai Heritage Resort", "Kumbhalgarh Fort", "Deogarh Mahal", "Jaipur"],
      image: "/pictures/bikaner.jpg",
      tip: "🏰 Castle Tip: Stay inside authentic 16th-century heritage castles, enjoy rural bullock-cart safaris & dine with local royal families!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 9 Days (~850 KMs)",
        "Accommodations in Fort Castles (Rohetgarh, Rawla Narlai, Deogarh)",
        "Rural Village Bullock Cart & 4x4 Bishnoi Safari",
        "All Highways Tolls, Taxes & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Jodhpur Blue City Arrival & Clock Tower",
          activities: [
            "Pickup in Jodhpur by private AC cab.",
            "Check into heritage hotel.",
            "Evening stroll through Sardar Market and Clock Tower spice bazaars."
          ]
        },
        {
          day: "Day 2",
          title: "Jodhpur Mehrangarh Fort & Jaswant Thada",
          activities: [
            "Guided tour of Mehrangarh Fort 400 feet above Blue City.",
            "Explore Phool Mahal and Moti Mahal.",
            "Visit marble Jaswant Thada cenotaph."
          ]
        },
        {
          day: "Day 3",
          title: "Jodhpur to Rohetgarh Fort Castle Estate Stay",
          activities: [
            "Drive to Rohetgarh Fort estate.",
            "Check into 16th-century heritage fort castle.",
            "Evening poolside leisure and royal dinner."
          ]
        },
        {
          day: "Day 4",
          title: "Rohetgarh Bishnoi Village Safari & Bullock Cart Ride",
          activities: [
            "4x4 Bishnoi village safari observing blackbuck antelopes and opium ceremonies.",
            "Traditional village walk & bullock cart ride.",
            "Overnight stay at Rohetgarh Castle."
          ]
        },
        {
          day: "Day 5",
          title: "Rohetgarh to Rawla Narlai Heritage Resort",
          activities: [
            "Drive to Rawla Narlai, a 17th-century royal hunting lodge.",
            "Climb 350 steps of Elephant Rock for sunset views.",
            "Overnight stay at Rawla Narlai."
          ]
        },
        {
          day: "Day 6",
          title: "Rawla Narlai Leopard Safari & Stepwell Dinner",
          activities: [
            "Early morning 4x4 open Jeep safari for wild leopard tracking.",
            "Private candlelit dinner inside an ancient 110-step stepwell (Baori)."
          ]
        },
        {
          day: "Day 7",
          title: "Rawla Narlai to Deogarh Mahal Castle",
          activities: [
            "Drive to Deogarh hill kingdom.",
            "Check into 16th-century Deogarh Mahal fort.",
            "Explore local Aravali village market."
          ]
        },
        {
          day: "Day 8",
          title: "Deogarh Rural Train Ride to Kumbhalgarh Fort",
          activities: [
            "Experience vintage Meter Gauge rural train ride through mountain tunnels.",
            "Explore UNESCO Kumbhalgarh Fort with 36km wall.",
            "Overnight stay near Kumbhalgarh."
          ]
        },
        {
          day: "Day 9",
          title: "Kumbhalgarh to Udaipur Airport Drop",
          activities: [
            "Relaxed morning breakfast.",
            "Private chauffeur transfer to Udaipur Airport or Railway Station."
          ]
        }
      ]
    },
    {
      id: 31,
      category: "luxury-tours",
      name: "Royal Rajasthan Oberoi Palace Grand Luxury Tour",
      tag: "👑 Oberoi Palace Special",
      duration: "15 Days / 14 Nights",
      kms: "1,500 KMs Total Circuit",
      festivalDates: "👑 Luxury Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi (The Oberoi)", "Agra (Oberoi Amarvilas)", "Jaipur (Oberoi Rajvilas)", "Ranthambore (Oberoi Vanyavilas)", "Udaipur (Oberoi Udaivilas)"],
      image: "/pictures/bikaner.jpg",
      tip: "👑 Ultimate Luxury Tip: Exclusively featuring Oberoi Amarvilas (Taj Mahal view from all rooms), Oberoi Rajvilas & Oberoi Udaivilas stays!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Luxury Chauffeur SUV / Coach for 15 Days",
        "Private Historian Guide at Taj Mahal, Amer Fort & City Palace",
        "Private 4x4 Luxury Jungle Safaris in Ranthambore",
        "All Highway Tolls, Fuel, Permits & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "The Oberoi New Delhi VIP Arrival & Check-In",
          activities: [
            "VIP greeting at Delhi Airport with luxury SUV chauffeur transfer.",
            "Check into The Oberoi New Delhi.",
            "Private evening monument walk."
          ]
        },
        {
          day: "Day 2",
          title: "Old & New Delhi Historian-Guided Tour",
          activities: [
            "Private historian-guided tour of Qutub Minar and Humayun's Tomb.",
            "Rickshaw ride through Chandni Chowk spice markets.",
            "High tea at hotel."
          ]
        },
        {
          day: "Day 3",
          title: "Delhi to Oberoi Amarvilas Agra (Unobstructed Taj View)",
          activities: [
            "Drive along Yamuna Expressway in private luxury SUV to Agra.",
            "Check into Oberoi Amarvilas — every room features unobstructed Taj Mahal views.",
            "Tour Agra Fort and Jahangir Palace."
          ]
        },
        {
          day: "Day 4",
          title: "Oberoi Amarvilas Taj Mahal VIP Sunrise Tour",
          activities: [
            "Private golf cart ride to Taj Mahal for VIP sunrise access.",
            "Historian guide explaining Mughal marble inlay art.",
            "Sunset high tea watching Taj Mahal from your room balcony."
          ]
        },
        {
          day: "Day 5",
          title: "Agra to Oberoi Rajvilas Jaipur (Royal Villa & Spa)",
          activities: [
            "Drive to Pink City Jaipur via Fatehpur Sikri.",
            "Check into Oberoi Rajvilas set in 32 acres of royal gardens.",
            "Evening Rajasthani folk music performance."
          ]
        },
        {
          day: "Day 6",
          title: "Jaipur Amer Fort Private Access & City Palace",
          activities: [
            "Private morning access to Amer Fort and Sheesh Mahal mirror room.",
            "Guided tour of City Palace private quarters and Hawa Mahal.",
            "Johari Bazaar gemstone shopping with private shopper."
          ]
        },
        {
          day: "Day 7",
          title: "Oberoi Rajvilas Ayurvedic Spa & Cooking Session",
          activities: [
            "Morning yoga and Ayurvedic spa massage at Oberoi Spa.",
            "Masterclass with Oberoi Executive Chef learning royal Mughlai recipes.",
            "Private candlelit dinner at Rajwada restaurant."
          ]
        },
        {
          day: "Day 8",
          title: "Jaipur to Oberoi Vanyavilas Ranthambore (Luxury Safari Tents)",
          activities: [
            "Drive to Ranthambore Tiger Reserve.",
            "Check into Oberoi Vanyavilas luxury air-conditioned jungle tents.",
            "Observation tower sunset drinks."
          ]
        },
        {
          day: "Day 9",
          title: "Ranthambore Oberoi 4x4 Luxury Tiger Safaris",
          activities: [
            "Exclusive morning 4x4 open Gypsy safari with senior naturalist tracker.",
            "Visit 10th-century Ranthambore Fort.",
            "Afternoon tiger safari."
          ]
        },
        {
          day: "Day 10",
          title: "Ranthambore to Oberoi Udaivilas Udaipur (Lake Pichola Palace)",
          activities: [
            "Morning flight/drive connection to romantic Udaipur.",
            "Check into world-famous Oberoi Udaivilas on the banks of Lake Pichola.",
            "Welcome floral shower and royal greeting."
          ]
        },
        {
          day: "Day 11",
          title: "Oberoi Udaivilas Private Solar Boat Cruise on Lake Pichola",
          activities: [
            "Guided tour of Udaipur City Palace museum complex.",
            "Visit Jagdish Temple and Crystal Gallery.",
            "Private solar boat cruise on Lake Pichola past Jag Mandir Island."
          ]
        },
        {
          day: "Day 12",
          title: "Udaipur Saheliyon-ki-Bari & Oberoi Spa Therapy",
          activities: [
            "Stroll through Saheliyon-ki-Bari fountain gardens.",
            "Signature couples Ayurvedic spa treatment at Oberoi Spa.",
            "Lakeside fine dining dinner."
          ]
        },
        {
          day: "Day 13",
          title: "Oberoi Udaivilas Excursion to Ranakpur Jain Temple",
          activities: [
            "Day trip to Ranakpur 1,444 marble pillar temple.",
            "Return to Oberoi Udaivilas for sunset champagne toast.",
            "Overnight luxury stay."
          ]
        },
        {
          day: "Day 14",
          title: "Oberoi Udaivilas Cultural Dance & Farewell Gala",
          activities: [
            "Morning cooking demonstration with Oberoi Master Chef.",
            "Private puppet show and Ghoomar dance performance in resort courtyard.",
            "Farewell royal banquet."
          ]
        },
        {
          day: "Day 15",
          title: "Udaipur Maharana Pratap Airport VIP Transfer",
          activities: [
            "Relaxed morning breakfast in suite.",
            "Private luxury chauffeur transfer to Udaipur Airport for return flight."
          ]
        }
      ]
    },
    {
      id: 32,
      category: "golden-triangle",
      name: "Golden Triangle with Jodhpur & Jaisalmer Desert Special",
      tag: "🏜️ Triangle & Desert",
      duration: "10 Days / 9 Nights",
      kms: "1,450 KMs Total Circuit",
      festivalDates: "🏜️ Best Season: October to April",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra (Taj Mahal)", "Jaipur", "Jodhpur (Mehrangarh)", "Jaisalmer (Sam Dunes)"],
      image: "/pictures/jaisalmer_desert.jpg",
      tip: "🏜️ Desert Tip: Combines Golden Triangle heritage with Jodhpur Blue City & Jaisalmer Sam Sand Dunes desert camping!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 10 Days (~1,450 KMs)",
        "Overnight Luxury Air-Conditioned Tent Stay in Sam Sand Dunes",
        "Private Camel Safari & Rajasthani Kalbelia Folk Dance Night",
        "Taj Mahal Sunrise & All Major Fort Sightseeing Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Monument Tour",
          activities: [
            "Pickup from Delhi Airport/Hotel by private AC cab.",
            "Explore UNESCO Qutub Minar and Humayun's Tomb.",
            "Drive past India Gate and President's Estate."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Taj Mahal Sunset View",
          activities: [
            "Morning drive to Agra via Yamuna Expressway.",
            "Explore 16th-century Agra Fort.",
            "Watch sunset over Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Early morning private sunrise tour of the Taj Mahal.",
            "En-route visit UNESCO Fatehpur Sikri Akbar's red sandstone palace.",
            "Arrive in Jaipur Pink City."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Amer Fort Elephant Ascent & City Palace",
          activities: [
            "Ascend Amer Fort on elephant back / private Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace.",
            "Photo stop at Hawa Mahal."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur to Blue City Jodhpur Drive",
          activities: [
            "Morning drive to Jodhpur.",
            "Visit Jaswant Thada marble royal cenotaphs.",
            "Evening market walk through Clock Tower bazaar."
          ]
        },
        {
          day: "Day 6",
          title: "Jodhpur Mehrangarh Fort & Drive to Jaisalmer",
          activities: [
            "Guided tour of Mehrangarh Fort 400 feet above Blue City.",
            "Drive west into Thar desert towards Jaisalmer.",
            "Check into yellow sandstone hotel."
          ]
        },
        {
          day: "Day 7",
          title: "Jaisalmer Sonar Qila (Golden Fort) & Havelis",
          activities: [
            "Explore living UNESCO Jaisalmer Fort.",
            "Visit Patwon ki Haveli and Nathmal ki Haveli.",
            "Sunset boat ride on Gadisar Lake."
          ]
        },
        {
          day: "Day 8",
          title: "Jaisalmer Sam Sand Dunes Luxury Camping & Camel Safari",
          activities: [
            "Drive to Sam Sand Dunes deep in the desert.",
            "Sunset camel ride over golden sand dunes.",
            "Campfire dinner & Kalbelia folk dance show."
          ]
        },
        {
          day: "Day 9",
          title: "Sam Dunes Desert Sunrise & Jaisalmer Sightseeing",
          activities: [
            "Morning desert sunrise walk and breakfast.",
            "Visit Kuldhara abandoned ghost village.",
            "Visit Bada Bagh royal cenotaphs at sunset."
          ]
        },
        {
          day: "Day 10",
          title: "Jaisalmer / Jodhpur Airport Return Transfer",
          activities: [
            "Relaxed morning breakfast.",
            "Private chauffeur transfer to Jaisalmer or Jodhpur Airport."
          ]
        }
      ]
    },
    {
      id: 33,
      category: "golden-triangle",
      name: "Golden Triangle with Heritage India & Nepal (Kathmandu & Pokhara)",
      tag: "🇳🇵 India & Nepal Grand",
      duration: "17 Days / 16 Nights",
      kms: "International Heritage Circuit",
      festivalDates: "🇳🇵 Best Season: October to May",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Jaipur", "Agra", "Orchha", "Khajuraho", "Varanasi", "Kathmandu", "Pokhara", "Chitwan"],
      image: "/pictures/agra_tajmahal.jpg",
      tip: "🇳🇵 Cross-Border Tip: Grand cross-border circuit bridging Golden Triangle, Khajuraho erotic temples, Varanasi Ganges Aarti & Nepal Himalayas!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle in India & Nepal Transfers",
        "Varanasi Sacred Ganges Sunrise Boat Cruise & Evening Aarti",
        "Kathmandu Durbar Square & Pokhara Phewa Lake Boat Cruise",
        "All Highways Tolls, Interstate Tax & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & New Delhi Monuments",
          activities: [
            "Airport arrival greeting by private AC cab.",
            "Visit Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Overnight stay in Delhi."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Taj Mahal Sunset",
          activities: [
            "Drive along Yamuna Expressway to Agra.",
            "Tour Agra Fort and Jahangir Palace.",
            "Sunset view of Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Private early morning sunrise tour of Taj Mahal.",
            "En-route visit Fatehpur Sikri.",
            "Arrive in Pink City Jaipur."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Amer Fort & Pink City Palaces",
          activities: [
            "Ascend Amer Fort on elephant back / Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace.",
            "Photo stop at Hawa Mahal."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur to Gwalior Fort ➔ Orchha Palace",
          activities: [
            "Drive to historic Gwalior Fort.",
            "Proceed to Orchha palace fort town on Betwa River.",
            "Check into riverfront resort."
          ]
        },
        {
          day: "Day 6",
          title: "Orchha Fort Complex & Betwa River Aarti",
          activities: [
            "Tour Jahangir Mahal, Raj Mahal, and Rai Praveen Mahal.",
            "Visit Chaturbhuj Temple.",
            "Evening Aarti along Betwa River."
          ]
        },
        {
          day: "Day 7",
          title: "Orchha to UNESCO Khajuraho Temples",
          activities: [
            "Drive to Khajuraho.",
            "Guided tour of UNESCO Western Group of Temples (Kandariya Mahadev & Lakshmana Temple).",
            "Evening Light & Sound show."
          ]
        },
        {
          day: "Day 8",
          title: "Khajuraho Eastern Temples & Drive/Train to Varanasi",
          activities: [
            "Tour Eastern Group of Temples (Parsvanatha & Adinatha Temples).",
            "Transfer connection to holy city Varanasi (Kashi).",
            "Check into Ganges riverside hotel."
          ]
        },
        {
          day: "Day 9",
          title: "Varanasi Sacred Ganges Sunrise Cruise & Night Ganga Aarti",
          activities: [
            "Dawn sunrise boat cruise on River Ganges witnessing morning rituals at Dashashwamedh Ghat.",
            "Excursion to Sarnath where Lord Buddha gave his first sermon.",
            "VIP boat viewing of world-famous evening Ganga Aarti."
          ]
        },
        {
          day: "Day 10",
          title: "Varanasi Temple Walk & Flight to Kathmandu Nepal",
          activities: [
            "Morning walk through narrow heritage alleys visiting Kashi Vishwanath Temple.",
            "Transfer to Varanasi Airport for flight to Kathmandu, Nepal.",
            "VIP welcome greeting at Kathmandu Airport."
          ]
        },
        {
          day: "Day 11",
          title: "Kathmandu Durbar Square & Swayambhunath Stupa",
          activities: [
            "Guided tour of UNESCO Kathmandu Durbar Square and Kumari Ghar.",
            "Visit ancient Swayambhunath (Monkey Temple) perched on hilltop.",
            "Explore Bouddhanath Stupa."
          ]
        },
        {
          day: "Day 12",
          title: "Kathmandu Pashupatinath Temple & Flight to Pokhara",
          activities: [
            "Visit sacred Pashupatinath Hindu Temple on Bagmati River.",
            "Scenic flight/drive to Pokhara nestled beneath Annapurna range.",
            "Relax along Phewa Lake."
          ]
        },
        {
          day: "Day 13",
          title: "Pokhara Sarangkot Himalayan Sunrise & Phewa Lake Boat",
          activities: [
            "Early morning sunrise drive to Sarangkot for views of Annapurna & Machhapuchhre (Fishtail) peaks.",
            "Row boat cruise on Phewa Lake to Tal Barahi Island Temple.",
            "Visit Devi's Fall and Gupteshwor Mahadev Cave."
          ]
        },
        {
          day: "Day 14",
          title: "Pokhara to Chitwan National Park Jungle Reserve",
          activities: [
            "Drive down to Chitwan National Park.",
            "Check into luxury jungle lodge.",
            "Evening Tharu tribal cultural dance show."
          ]
        },
        {
          day: "Day 15",
          title: "Chitwan Jungle Safari & One-Horned Rhino Tracking",
          activities: [
            "Canoe ride on Rapti River watching gharial crocodiles and birds.",
            "Jungle jeep safari tracking One-Horned Rhinoceros & wild Asian elephants.",
            "Visit Elephant Breeding Center."
          ]
        },
        {
          day: "Day 16",
          title: "Chitwan to Kathmandu Return Flight",
          activities: [
            "Morning bird watching walk.",
            "Fly/drive back to Kathmandu.",
            "Thamel bazaar handicraft shopping & farewell Nepali dinner."
          ]
        },
        {
          day: "Day 17",
          title: "Kathmandu Tribhuvan Airport Departure Transfer",
          activities: [
            "Relaxed breakfast.",
            "Private transfer to Kathmandu Tribhuvan International Airport."
          ]
        }
      ]
    },
    {
      id: 34,
      category: "luxury-wildlife",
      name: "Golden Triangle with Haridwar, Rishikesh & Jim Corbett Wildlife",
      tag: "🐅 Ganges & Wildlife",
      duration: "11 Days / 10 Nights",
      kms: "1,250 KMs Circuit",
      festivalDates: "🐅 Best Season: November to June",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Jaipur", "Agra", "Unchagaon Fort", "Haridwar", "Rishikesh", "Jim Corbett Park"],
      image: "/pictures/delhi.jpg",
      tip: "🐅 Nature Tip: Perfect blend of Golden Triangle heritage, Ganges River spirituality in Rishikesh & wild tiger tracking in Jim Corbett!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle for 11 Days (~1,250 KMs)",
        "Jim Corbett Open 4x4 Jeep Jungle Safari Booking",
        "Rishikesh Triveni Ghat Ganga Aarti VIP Viewing",
        "Taj Mahal Sunrise & All Tolls/Permits Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & Capital Heritage Sightseeing",
          activities: [
            "Airport/Railway station pickup in private AC cab.",
            "Explore UNESCO Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Drive past India Gate, Rashtrapati Bhavan, and Parliament House.",
            "Overnight stay at Delhi hotel."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Sunset View of Taj Mahal",
          activities: [
            "Morning drive to Agra via Yamuna Expressway.",
            "Tour 16th-century Agra Fort and Jahangiri Mahal.",
            "Watch sunset over the Taj Mahal from Mehtab Bagh across Yamuna River.",
            "Overnight stay at Agra hotel."
          ]
        },
        {
          day: "Day 3",
          title: "Sunrise Taj Mahal ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Early morning sunrise tour of Taj Mahal with expert local guide.",
            "Drive to Jaipur, en-route visiting UNESCO Fatehpur Sikri and Abhaneri Stepwell.",
            "Arrive in Jaipur and check into Pink City hotel."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Amer Fort Elephant Ride & Palace Tour",
          activities: [
            "Ascend hilltop Amer Fort on elephant back / 4x4 Jeep.",
            "Explore Sheesh Mahal mirror courtyard, Jal Mahal photo halt, and City Palace museum.",
            "Photo stop at Hawa Mahal (Palace of Winds) and local bazaar shopping."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur to Fort Unchagaon Rural Heritage Stay",
          activities: [
            "Drive to Fort Unchagaon, an authentic 19th-century heritage estate.",
            "Enjoy village bullock cart ride, horse riding, and organic farm walks.",
            "Traditional royal dinner and overnight stay at Fort Unchagaon."
          ]
        },
        {
          day: "Day 6",
          title: "Unchagaon to Sacred Haridwar & Evening Ganga Aarti",
          activities: [
            "Drive to holy city of Haridwar along the River Ganges.",
            "Visit Mansa Devi Temple via cable car ride.",
            "Participate in the world-famous evening Ganga Aarti at Har Ki Pauri ghat."
          ]
        },
        {
          day: "Day 7",
          title: "Haridwar to Rishikesh Yoga Capital & Beatles Ashram",
          activities: [
            "Short scenic drive to Rishikesh, the Yoga Capital of the World.",
            "Walk across Ram Jhula and Lakshman Jhula suspension bridges.",
            "Explore Beatles Ashram (Chaurasi Kutia) and attend meditation sessions."
          ]
        },
        {
          day: "Day 8",
          title: "Rishikesh Triveni Ghat Aarti & Adventure Sports",
          activities: [
            "Optional morning White Water River Rafting on the Ganges.",
            "Visit Vashishta Gufa cave for peaceful meditation.",
            "Experience evening spiritual Aarti ceremony at Triveni Ghat."
          ]
        },
        {
          day: "Day 9",
          title: "Rishikesh to Jim Corbett National Park",
          activities: [
            "Drive through foothills of Himalayas to Jim Corbett National Park, India's oldest tiger reserve.",
            "Check into luxury jungle resort surrounded by Sal forests.",
            "Evening nature walk along the Kosi River bank."
          ]
        },
        {
          day: "Day 10",
          title: "Jim Corbett Open 4x4 Jeep Safari for Tiger Tracking",
          activities: [
            "Early morning 4x4 open Jeep jungle safari in Bijrani/Dhikala zone.",
            "Track Royal Bengal Tigers, wild Asian elephants, leopards, and spotted deer.",
            "Visit Corbett Waterfalls and Garjiya Devi Temple."
          ]
        },
        {
          day: "Day 11",
          title: "Jim Corbett to Delhi Return Transfer",
          activities: [
            "Relaxed morning breakfast at jungle resort.",
            "Scenic drive back to Delhi (approx. 5 hours).",
            "Drop-off at Delhi Airport or Railway Station for onward journey."
          ]
        }
      ]
    },
    {
      id: 35,
      category: "spiritual",
      name: "Golden Triangle & South India Spiritual Circuit (Mahabalipuram & Madurai)",
      tag: "🛕 North & South Spiritual",
      duration: "11 Days / 10 Nights",
      kms: "North & South India Pilgrimage",
      festivalDates: "🛕 Best Season: Year Round",
      startingRate: "Best Rate on Request",
      destinations: ["Delhi", "Agra", "Jaipur", "Chennai", "Mahabalipuram", "Pondicherry", "Madurai Temple"],
      image: "/pictures/main-section/jaipur-patrika-gate-monument.jpg",
      tip: "🛕 Grand Circuit Tip: Connect North India's Mughal heritage with South India's rock-cut shore temples & Dravidian Meenakshi Temple!",
      carRates: [
        { car: "Swift Dzire (4-Seater Sedan)", fare: "Best Rate on Request" },
        { car: "Maruti Ertiga (6-Seater MPV)", fare: "Best Rate on Request" },
        { car: "Toyota Innova Crysta (7-Seater Luxury SUV)", fare: "Best Rate on Request" },
        { car: "Tempo Traveller (12-Seater Coach)", fare: "Best Rate on Request" }
      ],
      includes: [
        "Private AC Chauffeur Vehicle in North & South India",
        "Guided Shore Temple Mahabalipuram & Madurai Meenakshi Temple Tours",
        "Taj Mahal Sunrise & Heritage Fort Guided Sightseeing",
        "All Highways Tolls, Fuel & Driver Allowance Included"
      ],
      itineraryDays: [
        {
          day: "Day 1",
          title: "Delhi Arrival & New Delhi Imperial Sightseeing",
          activities: [
            "Airport greeting by private AC chauffeur cab.",
            "Visit UNESCO Qutub Minar, Humayun's Tomb, and Lotus Temple.",
            "Drive past India Gate and President's Estate."
          ]
        },
        {
          day: "Day 2",
          title: "Delhi to Agra & Sunset Taj Mahal View",
          activities: [
            "Drive via Yamuna Expressway to Agra.",
            "Explore 16th-century Agra Fort.",
            "Watch sunset over Taj Mahal from Mehtab Bagh."
          ]
        },
        {
          day: "Day 3",
          title: "Taj Mahal Sunrise ➔ Fatehpur Sikri ➔ Jaipur",
          activities: [
            "Private early morning sunrise tour of Taj Mahal.",
            "Visit UNESCO Fatehpur Sikri.",
            "Arrive in Pink City Jaipur."
          ]
        },
        {
          day: "Day 4",
          title: "Jaipur Amer Fort & Palace Sightseeing",
          activities: [
            "Ascend Amer Fort on elephant back / Jeep.",
            "Explore Sheesh Mahal, Jal Mahal, and City Palace.",
            "Photo stop at Hawa Mahal."
          ]
        },
        {
          day: "Day 5",
          title: "Jaipur to Delhi Flight to Chennai (South India Gateway)",
          activities: [
            "Morning drive to Delhi Airport for flight to Chennai, Tamil Nadu.",
            "Greeting at Chennai Airport.",
            "Visit Kapaleeshwarar Temple and Marina Beach."
          ]
        },
        {
          day: "Day 6",
          title: "Chennai to Mahabalipuram UNESCO Shore Temple",
          activities: [
            "Drive to coastal Mahabalipuram.",
            "Explore UNESCO 7th-century rock-cut Shore Temple and Pancha Rathas.",
            "See Krishna's Butterball giant granite boulder."
          ]
        },
        {
          day: "Day 7",
          title: "Mahabalipuram to French Quarter Pondicherry",
          activities: [
            "Drive to seaside town Pondicherry.",
            "Stroll through White Town French Quarter cobblestone streets.",
            "Visit Sri Aurobindo Ashram and Promanade Beach."
          ]
        },
        {
          day: "Day 8",
          title: "Pondicherry Matrimandir & Drive to Tanjore (Thanjavur)",
          activities: [
            "Visit Auroville & Matrimandir viewing point.",
            "Drive to Tanjore.",
            "Explore UNESCO Brihadeeswarar Great Living Chola Temple."
          ]
        },
        {
          day: "Day 9",
          title: "Tanjore to Madurai Meenakshi Amman Temple",
          activities: [
            "Drive to ancient temple city Madurai.",
            "Visit 14-tower Meenakshi Amman Temple complex.",
            "Explore Thirumalai Nayakkar Palace."
          ]
        },
        {
          day: "Day 10",
          title: "Madurai Meenakshi Night Ceremony & Temple Bazaars",
          activities: [
            "Morning temple Darshan and silk saree market walk.",
            "Attend evening bedchamber ceremony of Lord Shiva at Meenakshi Temple.",
            "Overnight stay in Madurai."
          ]
        },
        {
          day: "Day 11",
          title: "Madurai Airport Departure Transfer",
          activities: [
            "Relaxed morning breakfast.",
            "Private chauffeur transfer to Madurai Airport for return flight."
          ]
        }
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
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === "#admin") {
              window.history.replaceState(null, "", window.location.pathname);
            } else if (window.location.pathname.toLowerCase().replace(/\/$/, "") === "/admin") {
              window.history.replaceState(null, "", "/");
            }
          }}
        />
      )}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      {/* ── PACKAGE DETAIL MODAL ── */}
      {selectedModalPackage && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-slate-100 relative text-slate-900">
            {/* Header image banner */}
            <div className="relative h-48 sm:h-64 bg-slate-900 shrink-0">
              <img
                src={selectedModalPackage.image}
                alt={selectedModalPackage.name}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedModalPackage(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-transform hover:scale-105 z-10 cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-orange-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                    {selectedModalPackage.tag}
                  </span>
                  <span className="bg-slate-800/80 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    ⏱️ {selectedModalPackage.duration}
                  </span>
                  <span className="bg-emerald-700/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    📏 {selectedModalPackage.kms}
                  </span>
                  {selectedModalPackage.festivalDates && (
                    <span className="bg-amber-400 text-slate-950 text-xs px-3 py-0.5 rounded-full font-black shadow-md border border-amber-300">
                      {selectedModalPackage.festivalDates}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-playfair tracking-tight text-white drop-shadow-md">
                  {selectedModalPackage.name}
                </h2>
              </div>
            </div>

            {/* Interactive Route Map & Distance Indicator */}
            <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-none py-1">
                <span className="text-orange-400 font-bold shrink-0">📍 Route:</span>
                {(selectedModalPackage.destinations || []).map((dest, idx) => (
                  <Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-500 font-bold shrink-0">➔</span>}
                    <span className="bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-200 shrink-0">
                      {dest}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveModalTab("itinerary")}
                className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeModalTab === "itinerary"
                    ? "border-orange-600 text-orange-600 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                📅 Day-by-Day Itinerary
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("fares")}
                className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeModalTab === "fares"
                    ? "border-orange-600 text-orange-600 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                🚘 Cab Fares &amp; Vehicles
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("inclusions")}
                className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeModalTab === "inclusions"
                    ? "border-orange-600 text-orange-600 bg-white"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                🛡️ Inclusions &amp; Safety
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
              {activeModalTab === "itinerary" && (
                <div className="space-y-4">
                  {selectedModalPackage.tip && (
                    <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs sm:text-sm text-orange-900 flex items-start gap-2.5">
                      <span className="text-lg">💡</span>
                      <div>
                        <strong className="font-bold">Expert Tour Tip:</strong> {selectedModalPackage.tip}
                      </div>
                    </div>
                  )}

                  <div className="relative border-l-2 border-orange-200 ml-3.5 pl-5 space-y-6">
                    {selectedModalPackage.itineraryDays ? (
                      selectedModalPackage.itineraryDays.map((item, dIdx) => (
                        <div key={dIdx} className="relative group">
                          <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow">
                            {dIdx + 1}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                            {item.day}: {item.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {item.activities.map((act, aIdx) => (
                              <li key={aIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                                <span className="text-orange-500 font-bold shrink-0">›</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      selectedModalPackage.destinations.map((destName, dIdx) => (
                        <div key={dIdx} className="relative group">
                          <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-white shadow">
                            {dIdx + 1}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                            Stop {dIdx + 1}: {destName}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600">
                            Guided sightseeing of major landmarks, historical monuments, photo spots, and local market shopping with dedicated private AC vehicle.
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ── CONNECTED TOUR ROUTE MAP SECTION ── */}
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 font-serif flex items-center gap-2">
                          🗺️ Connected Tour Route Map
                        </h4>
                        <p className="text-xs text-slate-500">
                          Complete driving circuit connected live on Google Maps
                        </p>
                      </div>
                      {(() => {
                        const cleanDests = (selectedModalPackage.destinations || []).map((d) =>
                          d.replace(/\s*\([^)]*\)/g, "").trim()
                        );
                        const dirLink = `https://www.google.com/maps/dir/${cleanDests.map(encodeURIComponent).join("/")}`;
                        return (
                          <a
                            href={dirLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-600 font-extrabold bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors flex items-center gap-1 shrink-0"
                          >
                            <span>🗺️ Open Driving Directions ➔</span>
                          </a>
                        );
                      })()}
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-72 sm:h-96 w-full relative bg-slate-100">
                      {(() => {
                        const cleanDests = (selectedModalPackage.destinations || []).map((d) =>
                          d.replace(/\s*\([^)]*\)/g, "").trim()
                        );
                        const start = cleanDests[0] || "Delhi";
                        const destinationsParam = cleanDests.slice(1).map((d) => encodeURIComponent(d + ", India")).join("+to:");
                        const iframeUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(start + ", India")}&daddr=${destinationsParam}&output=embed`;
                        return (
                          <iframe
                            title={`Connected Route Map for ${selectedModalPackage.name}`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={iframeUrl}
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === "fares" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-900 text-white px-4 py-3 flex justify-between font-bold text-xs sm:text-sm">
                      <span>🚘 Vehicle Type</span>
                      <span>🏷️ Rate Quote Status</span>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {selectedModalPackage.carRates.map((rate, rIdx) => (
                        <div key={rIdx} className="px-4 py-3 flex justify-between items-center text-xs sm:text-sm">
                          <span className="font-semibold text-slate-800">{rate.car}</span>
                          <span className="font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                            {rate.fare}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <span>
                      <strong>100% Transparent Price:</strong> Highway Tolls, Parking, Fuel &amp; Driver Allowance are 100% included in all rates with ZERO hidden costs!
                    </span>
                  </div>
                </div>
              )}

              {activeModalTab === "inclusions" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      <span>✅ Included in Package</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950">
                      {selectedModalPackage.includes.map((inc, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>ℹ️ Package Guidelines</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold shrink-0">•</span>
                        <span>Personal expenses, monument entry tickets &amp; camera fees not included unless specified.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold shrink-0">•</span>
                        <span>Driver acts as your local route assistant and knows best photo points &amp; hygienic food halts.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold shrink-0">•</span>
                        <span>Free itinerary customization available on WhatsApp request.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                Need a custom itinerary or hotel stay added?
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    handlePackageEnquiry(selectedModalPackage.name);
                    setSelectedModalPackage(null);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
                >
                  📝 Send Enquiry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openWhatsApp(
                      `Hi Meharoli Tours & Travels, I would like to book/enquire about the ${selectedModalPackage.name} (${selectedModalPackage.duration}). Please share full details!`
                    );
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span>💬 Book on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
              href="#popular-taxi-routes"
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("popular-taxi-routes");
              }}
            >
              Cabs &amp; Taxi
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
            <title>Rajasthan Tour Packages &amp; Private Chauffeur Car Rental | Meharoli Tours</title>
            <meta name="description" content="Explore 26 Iconic Rajasthan Cities, Golden Triangle &amp; Sacred Yatra Circuits in Ultimate Comfort. Book Custom Tour Packages, Wildlife Safaris &amp; Private AC Cars with Professional Chauffeurs at Best Guaranteed Rates." />
            <link rel="canonical" href="https://www.meharolitourstravels.com/" />
            <meta property="og:title" content="Rajasthan Tour Packages &amp; Private Chauffeur Car Rental | Meharoli Tours" />
            <meta property="og:description" content="Explore 26 Iconic Rajasthan Cities, Golden Triangle &amp; Sacred Yatra Circuits in Ultimate Comfort. Book Custom Tour Packages, Wildlife Safaris &amp; Private AC Cars with Professional Chauffeurs at Best Guaranteed Rates." />
            <meta property="og:image" content="https://www.meharolitourstravels.com/pictures/main-section/jaipur-jal-mahal-water-palace.jpg" />
            <meta property="og:url" content="https://www.meharolitourstravels.com/" />
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
              className="btn primary hero-cta-btn"
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
              className="nav-pay-btn hero-cta-btn"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              💳 Pay Online
            </button>
            <a href="#packages" className="btn primary hero-cta-btn">
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

        {/* Popular Taxi Services & Intercity Cab Routes Section */}
        <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="popular-taxi-routes">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-sm">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base sm:text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                
                <span>Popular Taxi Services &amp; Intercity Cab Routes from Jaipur</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select a category below to explore routes and get instant fare quotes
              </p>
            </div>

            {/* Instant Taxi Search Bar */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={taxiSearchQuery}
                onChange={(e) => {
                  setTaxiSearchQuery(e.target.value);
                  setShowAllTaxis(true);
                }}
                placeholder="Search taxi route (e.g. Khatu Shyam, Mount Abu, Agra, Delhi, Udaipur)..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-inner"
              />
              {taxiSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTaxiSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Category Filter Tab Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-4 scrollbar-none -mx-1 px-1">
              {taxiCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveTaxiCategory(cat.id);
                    setShowAllTaxis(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    activeTaxiCategory === cat.id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Taxi Routes Cards Grid with 10-item limit & View More / Hide Toggle */}
            {(() => {
              const filteredRoutes = taxiRoutes.filter((r) => {
                const matchesCategory = activeTaxiCategory === "all" || r.category === activeTaxiCategory;
                const matchesQuery = !taxiSearchQuery || r.label.toLowerCase().includes(taxiSearchQuery.toLowerCase());
                return matchesCategory && matchesQuery;
              });
              const visibleRoutes = showAllTaxis ? filteredRoutes : filteredRoutes.slice(0, 10);

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {visibleRoutes.map((route, idx) => (
                      <a
                        key={idx}
                        href="#enquiry-form-section"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTaxiRouteClick(route);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 hover:text-orange-600 hover:bg-orange-50/60 hover:border-orange-200 transition-all text-xs sm:text-sm font-medium group cursor-pointer"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="text-orange-500 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">›</span>
                          <span className="truncate">{route.label}</span>
                        </span>
                        <span className="text-[11px] text-orange-600 font-medium bg-orange-100/70 px-2 py-0.5 rounded-full shrink-0 ml-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          Book 💬
                        </span>
                      </a>
                    ))}
                  </div>

                  {filteredRoutes.length > 10 && (
                    <div className="mt-5 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAllTaxis(!showAllTaxis)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {showAllTaxis ? (
                          <>
                            <span>Show Less Taxi Routes</span>
                            <span className="text-sm">▲</span>
                          </>
                        ) : (
                          <>
                            <span>View All ({filteredRoutes.length - 10} More Taxi Routes)</span>
                            <span className="text-sm">▼</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
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
                Best Group &amp; Individual Fares <strong>Available on Request</strong>
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

          {/* Instant Packages Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 px-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 text-base">
              🔍
            </span>
            <input
              type="text"
              value={pkgSearchQuery}
              onChange={(e) => {
                setPkgSearchQuery(e.target.value);
                setShowAllPackages(true);
              }}
              placeholder="Search 35 tour packages (e.g. Tiger Safari, 10 Days, Desert, Ranakpur, Haridwar)..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
            />
            {pkgSearchQuery && (
              <button
                type="button"
                onClick={() => setPkgSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Package Category Filter Pills with Responsive Left & Right Scroll Arrow Buttons */}
          <div className="relative flex items-center max-w-6xl mx-auto mb-6 px-1">
            <button
              type="button"
              onClick={() => scrollCategoryPills("left")}
              className="bg-white hover:bg-orange-600 text-slate-800 hover:text-white border border-slate-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center font-black text-lg sm:text-xl shrink-0 z-10 mr-1 sm:mr-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Scroll Left"
            >
              ‹
            </button>

            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth grow"
            >
              {pkgCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePkgCategory(cat.id);
                    setShowAllPackages(false);
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                    activePkgCategory === cat.id
                      ? "bg-orange-600 text-white shadow-md shadow-orange-500/20 scale-105"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-orange-50 hover:text-orange-600 shadow-sm"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCategoryPills("right")}
              className="bg-white hover:bg-orange-600 text-slate-800 hover:text-white border border-slate-300 w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md flex items-center justify-center font-black text-lg sm:text-xl shrink-0 z-10 ml-1 sm:ml-2 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="Scroll Right"
            >
              ›
            </button>
          </div>

          <div className="packages-carousel-wrap">
            {(() => {
              const filteredPackages = packages.filter((pkg) => {
                const matchesCategory = activePkgCategory === "all" || pkg.category === activePkgCategory;
                const q = pkgSearchQuery.toLowerCase().trim();
                const matchesQuery =
                  !q ||
                  pkg.name.toLowerCase().includes(q) ||
                  pkg.duration.toLowerCase().includes(q) ||
                  pkg.destinations.some((d) => d.toLowerCase().includes(q)) ||
                  pkg.kms.toLowerCase().includes(q) ||
                  (pkg.tag && pkg.tag.toLowerCase().includes(q));

                return matchesCategory && matchesQuery;
              });
              const visiblePackages = showAllPackages
                ? filteredPackages
                : filteredPackages.slice(0, 10);

              return (
                <>
                  <div className="packages-grid">
                    {visiblePackages.map((pkg) => (
                      <article key={pkg.id} className="package-card flex flex-col justify-between">
                        <div>
                          <div
                            className="package-image cursor-pointer relative group overflow-hidden"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedModalPackage(pkg);
                              setActiveModalTab("itinerary");
                            }}
                            style={{ backgroundImage: `url(${pkg.image})` }}
                          >
                            <div className="package-badge">{pkg.tag}</div>
                            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="bg-white/95 text-slate-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                👁️ View Detailed Itinerary ➔
                              </span>
                            </div>
                          </div>
                          <div className="package-body">
                            <div className="package-title-row">
                              <h3
                                className="cursor-pointer hover:text-orange-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedModalPackage(pkg);
                                  setActiveModalTab("itinerary");
                                }}
                              >
                                {pkg.name}
                              </h3>
                              {pkg.duration && (
                                <span className="package-duration-badge">⏱ {pkg.duration}</span>
                              )}
                            </div>

                            {/* Distance & Festival Date Badges */}
                            <div className="flex flex-wrap items-center gap-2 my-2">
                              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                                📏 {pkg.kms}
                              </span>
                              {pkg.festivalDates && (
                                <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-md border border-amber-300">
                                  {pkg.festivalDates}
                                </span>
                              )}
                            </div>

                            <p className="package-destinations">
                              <strong>Route:</strong> {pkg.destinations.join(" → ")}
                            </p>

                            {pkg.tip && (
                              <div className="package-tip-box">
                                <span className="tip-icon">💡</span>
                                <span>{pkg.tip}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="package-body pt-0">
                          <div className="no-hidden-badge">
                            🛡️ <strong>No Hidden Charges:</strong> Toll, Parking, Fuel &amp; Driver Allowance Included!
                          </div>

                          <div className="package-actions grid grid-cols-2 gap-2 mt-3">
                            <button
                              type="button"
                              className="px-3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedModalPackage(pkg);
                                setActiveModalTab("itinerary");
                              }}
                            >
                              <span>👁️ View Detail</span>
                            </button>
                            <button
                              type="button"
                              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                openWhatsApp(
                                  `Hi Meharoli Tours, I am interested in ${pkg.name} (${pkg.duration}). Please share full itinerary & best fare.`
                                );
                              }}
                            >
                              <span>💬 WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {filteredPackages.length > 10 && (
                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAllPackages(!showAllPackages)}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {showAllPackages ? (
                          <>
                            <span>Show Less Tour Packages</span>
                            <span className="text-base">▲</span>
                          </>
                        ) : (
                          <>
                            <span>View All ({filteredPackages.length - 10} More Tour Packages)</span>
                            <span className="text-base">▼</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
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
