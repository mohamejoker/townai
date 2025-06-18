
export const siteConfig = {
  name: "Town Media",
  description: "أقوى منصة لزيادة المتابعين والتفاعل على مواقع التواصل الاجتماعي",
  url: "https://townmedia.sa",
  social: {
    whatsapp: "+966501234567",
    email: "info@townmedia.sa",
    instagram: "@townmedia_sa",
    twitter: "@townmedia_sa"
  }
};

export const heroData = {
  badge: "🔥 العرض الأقوى لفترة محدودة",
  title: "احصل على 100,000 متابع",
  subtitle: "حقيقي ونشط خلال 30 يوم",
  description: "منصة Town Media الثورية تستخدم الذكاء الاصطناعي لزيادة متابعينك بشكل طبيعي وآمن 100%",
  features: [
    "✅ متابعين حقيقيين ونشطين فقط",
    "✅ نمو طبيعي وآمن 100%", 
    "✅ ضمان النتائج أو استرداد المال",
    "✅ دعم فني 24/7"
  ],
  stats: [
    { number: "150,000+", label: "عميل راضٍ" },
    { number: "2.5M+", label: "متابع تم إضافته" },
    { number: "99.8%", label: "معدل النجاح" },
    { number: "24/7", label: "دعم فني" }
  ]
};

export const servicesData = [
  {
    id: 1,
    platform: "Instagram",
    icon: "📸",
    title: "زيادة متابعين انستقرام",
    description: "احصل على متابعين حقيقيين ونشطين من المنطقة العربية",
    features: [
      "متابعين من المنطقة العربية",
      "تفاعل حقيقي ونشط",
      "نمو تدريجي وآمن",
      "ضمان عدم النقصان"
    ],
    pricing: {
      original: 299,
      current: 99,
      currency: "ريال"
    },
    badge: "الأكثر طلباً",
    color: "from-pink-500 to-purple-600"
  },
  {
    id: 2,
    platform: "TikTok", 
    icon: "🎵",
    title: "زيادة متابعين تيك توك",
    description: "متابعين مهتمين بالمحتوى الإبداعي والترفيهي",
    features: [
      "متابعين شباب نشطين",
      "زيادة في المشاهدات",
      "تفاعل على الفيديوهات",
      "نمو سريع ومضمون"
    ],
    pricing: {
      original: 249,
      current: 79,
      currency: "ريال"
    },
    badge: "الأسرع نمواً",
    color: "from-black to-red-600"
  },
  {
    id: 3,
    platform: "Twitter",
    icon: "🐦",
    title: "زيادة متابعين تويتر",
    description: "متابعين مهتمين بالأخبار والآراء والنقاشات",
    features: [
      "متابعين مثقفين ومتفاعلين",
      "زيادة في الريتويت",
      "تفاعل على التغريدات",
      "بناء سمعة قوية"
    ],
    pricing: {
      original: 199,
      current: 69,
      currency: "ريال"
    },
    badge: "للمؤثرين",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: 4,
    platform: "YouTube",
    icon: "▶️",
    title: "زيادة مشتركين يوتيوب",
    description: "مشتركين مهتمين بمحتواك ومتابعين لقناتك",
    features: [
      "مشتركين حقيقيين ونشطين",
      "زيادة في المشاهدات",
      "تحسين ترتيب القناة",
      "نمو مستمر ومضمون"
    ],
    pricing: {
      original: 399,
      current: 129,
      currency: "ريال"
    },
    badge: "عائد استثمار عالي",
    color: "from-red-500 to-red-700"
  },
  {
    id: 5,
    platform: "Snapchat",
    icon: "👻",
    title: "زيادة متابعين سناب شات",
    description: "متابعين من الخليج مهتمين بالقصص اليومية",
    features: [
      "متابعين خليجيين نشطين",
      "مشاهدات عالية للقصص",
      "تفاعل مستمر",
      "نمو طبيعي وآمن"
    ],
    pricing: {
      original: 179,
      current: 59,
      currency: "ريال"
    },
    badge: "خليجي 100%",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: 6,
    platform: "LinkedIn",
    icon: "💼",
    title: "زيادة متابعين لينكد إن",
    description: "شبكة مهنية قوية لتطوير مسيرتك المهنية",
    features: [
      "متابعين في مجال عملك",
      "فرص عمل جديدة",
      "بناء شبكة مهنية",
      "تعزيز السمعة المهنية"
    ],
    pricing: {
      original: 299,
      current: 99,
      currency: "ريال"
    },
    badge: "للمهنيين",
    color: "from-blue-600 to-blue-800"
  }
];

export const pricingPlans = [
  {
    id: 1,
    name: "الباقة الأساسية",
    description: "مثالية للمبتدئين",
    price: {
      original: 299,
      current: 99,
      currency: "ريال",
      period: "شهرياً"
    },
    features: [
      "زيادة 5,000 متابع",
      "منصة واحدة",
      "تحليلات أساسية",
      "دعم فني عبر البريد",
      "ضمان 15 يوم"
    ],
    badge: "الأكثر شعبية",
    color: "from-blue-500 to-cyan-500",
    recommended: false
  },
  {
    id: 2,
    name: "الباقة المتقدمة",
    description: "الأنسب للمؤثرين",
    price: {
      original: 599,
      current: 199,
      currency: "ريال",
      period: "شهرياً"
    },
    features: [
      "زيادة 15,000 متابع",
      "3 منصات",
      "تحليلات متقدمة",
      "دعم فني مباشر",
      "ضمان 30 يوم",
      "استشارة مجانية",
      "تقارير أسبوعية"
    ],
    badge: "الأفضل قيمة",
    color: "from-purple-500 to-pink-500",
    recommended: true
  },
  {
    id: 3,
    name: "الباقة الاحترافية",
    description: "للشركات والماركات",
    price: {
      original: 999,
      current: 349,
      currency: "ريال",
      period: "شهرياً"
    },
    features: [
      "زيادة 50,000 متابع",
      "جميع المنصات",
      "تحليلات شاملة",
      "مدير حساب مخصص",
      "ضمان 60 يوم",
      "استراتيجية مخصصة",
      "تقارير يومية",
      "أولوية في الدعم"
    ],
    badge: "للمحترفين",
    color: "from-orange-500 to-red-500",
    recommended: false
  }
];
