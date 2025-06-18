import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Heart,
  Eye,
  MessageSquare,
  Share,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Crown,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Smartphone,
  Globe,
  ArrowRight,
} from "lucide-react";

const EnhancedServicesPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "from-pink-500 to-purple-600",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎵",
      color: "from-black to-red-600",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "📺",
      color: "from-red-500 to-red-700",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: "🐦",
      color: "from-sky-400 to-sky-600",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "✈️",
      color: "from-sky-500 to-blue-600",
    },
    {
      id: "snapchat",
      name: "Snapchat",
      icon: "👻",
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  const categories = [
    { id: "all", name: "جميع الخدمات", icon: Globe },
    { id: "followers", name: "المتابعين", icon: Users },
    { id: "engagement", name: "التفاعل", icon: Heart },
    { id: "views", name: "المشاهدات", icon: Eye },
    { id: "ai", name: "الذكاء الاصطناعي", icon: Brain },
    { id: "premium", name: "الخدمات المميزة", icon: Crown },
  ];

  const services = {
    instagram: [
      {
        id: 1,
        name: "متابعين إنستغرام - جودة عالية",
        category: "followers",
        description: "متابعين حقيقيين مع صور شخصية ونشاط طبيعي",
        price: 5,
        originalPrice: 8,
        minOrder: 100,
        maxOrder: 50000,
        features: [
          "حقيقيين 100%",
          "لا يحتاج كلمة مرور",
          "ضمان مدى الحياة",
          "بداية خلال ساعة",
        ],
        rating: 4.9,
        orders: 15420,
        isPremium: false,
        deliveryTime: "0-1 ساعة",
        guarantee: "مدى الحياة",
      },
      {
        id: 2,
        name: "إعجابات إنستغرام - سريعة",
        category: "engagement",
        description: "إعجابات عالية الجودة من حسابات نشطة",
        price: 2,
        originalPrice: 3,
        minOrder: 100,
        maxOrder: 100000,
        features: ["توصيل فوري", "جودة عالية", "آمن 100%", "لا انخفاض"],
        rating: 4.8,
        orders: 28650,
        isPremium: false,
        deliveryTime: "0-10 دقائق",
        guarantee: "30 يوم",
      },
      {
        id: 3,
        name: "تحليل حساب بالذكاء الاصطناعي",
        category: "ai",
        description: "تحليل شامل لحسابك مع اقتراحات للتحسين",
        price: 15,
        originalPrice: 25,
        minOrder: 1,
        maxOrder: 1,
        features: [
          "تحليل شامل",
          "استراتيجية مخصصة",
          "تقرير مفصل",
          "استشارة مجانية",
        ],
        rating: 5.0,
        orders: 3240,
        isPremium: true,
        deliveryTime: "24 ساعة",
        guarantee: "ضمان الرضا",
      },
    ],
    tiktok: [
      {
        id: 4,
        name: "متابعين تيك توك - عالي الجودة",
        category: "followers",
        description: "متابعين نشطين يتفاعلون مع المحتوى",
        price: 4,
        originalPrice: 6,
        minOrder: 100,
        maxOrder: 100000,
        features: ["نشطين", "تفاعل طبيعي", "آمن", "سريع"],
        rating: 4.7,
        orders: 12350,
        isPremium: false,
        deliveryTime: "1-6 ساعات",
        guarantee: "60 يوم",
      },
      {
        id: 5,
        name: "مشاهدات فيديو تيك توك",
        category: "views",
        description: "مشاهدات عالية الجودة لفيديوهاتك",
        price: 1,
        originalPrice: 2,
        minOrder: 1000,
        maxOrder: 1000000,
        features: ["سريع جداً", "احتفاظ عالي", "آمن", "طبيعي"],
        rating: 4.9,
        orders: 45670,
        isPremium: false,
        deliveryTime: "0-30 دقيقة",
        guarantee: "30 يوم",
      },
    ],
    youtube: [
      {
        id: 6,
        name: "مشتركين يوتيوب حقيقيين",
        category: "followers",
        description: "مشتركين حقيقيين يشاهدون المحتوى",
        price: 8,
        originalPrice: 12,
        minOrder: 50,
        maxOrder: 10000,
        features: ["حقيقيين", "مشاهدة للمحتوى", "آمن", "ضمان"],
        rating: 4.8,
        orders: 8940,
        isPremium: true,
        deliveryTime: "24-72 ساعة",
        guarantee: "مدى الحياة",
      },
    ],
  };

  const filteredServices =
    services[selectedPlatform]?.filter((service) => {
      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPremium =
        selectedCategory !== "premium" || service.isPremium;

      return (
        matchesCategory &&
        matchesSearch &&
        (selectedCategory !== "premium" || matchesPremium)
      );
    }) || [];

  const addToCart = (service) => {
    console.log("Added to cart:", service);
    // Here you would implement cart functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              خدماتنا الشاملة
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختر من بين مئات الخدمات عالية الجودة لجميع منصات التواصل
              الاجتماعي
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="ابحث عن الخدمة التي تريدها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-lg"
                  />
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">اختر المنصة:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={
                        selectedPlatform === platform.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedPlatform(platform.id)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      <span className="text-2xl mb-1">{platform.icon}</span>
                      <span className="text-xs">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">فئة الخدمة:</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center"
                    >
                      <category.icon className="h-4 w-4 ml-2" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {service.name}
                      {service.isPremium && (
                        <Crown className="inline h-5 w-5 text-yellow-500 mr-2" />
                      )}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </div>
                  <Badge
                    variant={service.isPremium ? "default" : "secondary"}
                    className={
                      service.isPremium
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : ""
                    }
                  >
                    {service.isPremium ? "مميز" : "عادي"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${service.price}
                    </span>
                    {service.originalPrice > service.price && (
                      <span className="text-lg text-gray-400 line-through">
                        ${service.originalPrice}
                      </span>
                    )}
                    <Badge variant="destructive" className="text-xs">
                      خصم{" "}
                      {Math.round(
                        (1 - service.price / service.originalPrice) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    الحد الأدنى: {service.minOrder.toLocaleString()} | الأقصى:{" "}
                    {service.maxOrder.toLocaleString()}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                    <span>{service.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart className="h-4 w-4 ml-1" />
                    <span>{service.orders.toLocaleString()} طلب</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 ml-1" />
                    <span>{service.deliveryTime}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => addToCart(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <ShoppingCart className="h-4 w-4 ml-2" />
                  أضف للسلة
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">لم نجد خدمات مطابقة</h3>
            <p className="text-gray-600 mb-4">
              جرب تغيير المرشحات أو البحث بكلمات أخرى
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              مسح المرشحات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedServicesPage;
