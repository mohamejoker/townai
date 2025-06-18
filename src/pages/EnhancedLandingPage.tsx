import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import sections
import AIFocusedHero from "@/components/Sections/AIFocusedHero";
import AIServicesSection from "@/components/Sections/AIServicesSection";
import AIChatPlansSection from "@/components/Sections/AIChatPlansSection";
import PricingSection from "@/components/Sections/PricingSection";
import TestimonialsSection from "@/components/Sections/TestimonialsSection";
import FAQSection from "@/components/Sections/FAQSection";
import HowItWorksSection from "@/components/Sections/HowItWorksSection";
import CTASection from "@/components/Sections/CTASection";

// Import components
import Logo from "@/components/Common/Logo";
import CompactAIChat from "@/components/Sections/CompactAIChat";
import RealAIChat from "@/components/AI/RealAIChat";
import Footer from "@/components/Frontend/Footer";
import Navbar from "@/components/Frontend/Navbar";

import {
  Star,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Clock,
  Target,
  MessageSquare,
  Brain,
  BarChart3,
  Sparkles,
  Eye,
  Settings,
  Rocket,
  Heart,
  Trophy,
  Headphones,
  Smartphone,
  Monitor,
  Palette,
  Crown,
  Gift,
} from "lucide-react";

const EnhancedLandingPage = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [showAIChat, setShowAIChat] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const platforms = [
    {
      name: "Instagram",
      icon: "📸",
      color: "from-pink-500 to-purple-600",
      users: "2B+",
    },
    {
      name: "TikTok",
      icon: "🎵",
      color: "from-black to-red-600",
      users: "1B+",
    },
    {
      name: "YouTube",
      icon: "📺",
      color: "from-red-500 to-red-700",
      users: "2.7B+",
    },
    {
      name: "Facebook",
      icon: "👥",
      color: "from-blue-500 to-blue-700",
      users: "3B+",
    },
    {
      name: "Twitter/X",
      icon: "🐦",
      color: "from-sky-400 to-sky-600",
      users: "500M+",
    },
    {
      name: "LinkedIn",
      icon: "💼",
      color: "from-blue-600 to-blue-800",
      users: "900M+",
    },
    {
      name: "Snapchat",
      icon: "👻",
      color: "from-yellow-400 to-yellow-600",
      users: "750M+",
    },
    {
      name: "Telegram",
      icon: "✈️",
      color: "from-sky-500 to-blue-600",
      users: "700M+",
    },
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "ذكاء اصطناعي متقدم",
      description: "تحليل ذكي للمحتوى وتوليد استراتيجيات مخصصة",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: BarChart3,
      title: "تحليلات شاملة",
      description: "إحصائيات دقيقة وتقارير تفصيلية لأدائك",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Target,
      title: "استهداف دقيق",
      description: "وصول للجمهور المناسب في الوقت المناسب",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Rocket,
      title: "نمو سريع",
      description: "زيادة متابعين وتفاعل بشكل طبيعي وآمن",
      color: "from-blue-500 to-purple-500",
    },
  ];

  const services = [
    {
      category: "خدمات المتابعين",
      icon: Users,
      services: [
        "متابعين إنستغرام",
        "متابعين تيك توك",
        "متابعين يوتيوب",
        "متابعين تويتر",
      ],
      startingPrice: "5$",
    },
    {
      category: "خدمات التفاعل",
      icon: Heart,
      services: ["إعجابات", "تعليقات", "مشاركات", "حفظ المنشورات"],
      startingPrice: "2$",
    },
    {
      category: "خدمات المشاهدات",
      icon: Eye,
      services: [
        "مشاهدات فيديو",
        "مشاهدات قصص",
        "مشاهدات لايف",
        "مشاهدات ريلز",
      ],
      startingPrice: "1$",
    },
    {
      category: "خدمات ذكية بالـ AI",
      icon: Brain,
      services: [
        "تحليل الحساب",
        "استراتيجية محتوى",
        "تحسين الوصول",
        "جدولة ذكية",
      ],
      startingPrice: "10$",
    },
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مؤثر رقمي",
      avatar: "👨‍💼",
      content: "زاد متابعيني من 5K إلى 100K في شهرين! خدمة رائعة وآمنة تماماً.",
      rating: 5,
      platform: "Instagram",
    },
    {
      name: "سارة أحمد",
      role: "صاحبة متجر إلكتروني",
      avatar: "👩‍💻",
      content:
        "الذكاء الاصطناعي ساعدني أفهم جمهوري أكثر وأزيد مبيعاتي بنسبة 300%.",
      rating: 5,
      platform: "TikTok",
    },
    {
      name: "محمد علي",
      role: "يوتيوبر",
      avatar: "🎬",
      content: "وصلت لمليون مشاهدة بفضل الاستراتيجيات الذكية التي قدموها لي.",
      rating: 5,
      platform: "YouTube",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Enhanced Navbar */}
      <Navbar />

      <div>
        {/* AI-Focused Hero Section */}
        <AIFocusedHero />

        {/* Platforms Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                جميع المنصات في مكان واحد
              </h2>
              <p className="text-xl text-gray-600">
                ندعم جميع منصات التواصل الاجتماعي الرئيسية
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {platforms.map((platform, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`text-4xl mb-3 p-4 rounded-2xl bg-gradient-to-r ${platform.color} text-white inline-block group-hover:scale-110 transition-transform`}
                    >
                      {platform.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {platform.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {platform.users} مستخدم
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2">
                <Brain className="h-4 w-4 ml-2" />
                مدعوم بالذكاء الاصطناعي
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                تقنيات ذكية لنمو حقيقي
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل حساباتك وتطوير
                استراتيجيات مخصصة تضمن نمواً طبيعياً وآمناً
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aiFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`bg-gradient-to-r ${feature.color} rounded-2xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <AIServicesSection />

        {/* Interactive Services Showcase */}
        <section
          id="services"
          className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">خدماتنا الشاملة</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                مجموعة متكاملة من الخدمات لتنمية حضورك الرقمي
              </p>
            </div>

            <Tabs defaultValue="followers" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="followers">المتابعين</TabsTrigger>
                <TabsTrigger value="engagement">التفاعل</TabsTrigger>
                <TabsTrigger value="views">المشاهدات</TabsTrigger>
                <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
              </TabsList>

              {services.map((service, index) => (
                <TabsContent
                  key={index}
                  value={["followers", "engagement", "views", "ai"][index]}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl">
                        <service.icon className="h-8 w-8 ml-3 text-blue-600" />
                        {service.category}
                        <Badge className="mr-auto bg-green-100 text-green-700">
                          من {service.startingPrice}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {service.services.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                              <span className="font-medium">{item}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* AI Chat Plans */}
        <AIChatPlansSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Enhanced Testimonials */}
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">قصص نجاح عملائنا</h2>
              <p className="text-xl text-gray-600">
                اكتشف كيف غيرت خدماتنا حياة آلاف المبدعين ورجال الأعمال
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="text-3xl ml-4">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold text-lg">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600">{testimonial.role}</p>
                        <Badge variant="outline" className="mt-1">
                          {testimonial.platform}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorksSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Advanced Payment System Preview */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">أنظمة دفع متطورة</h2>
              <p className="text-xl text-gray-600">
                ادفع بأمان وسهولة بالطرق التي تناسبك
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <AdvancedPaymentSystem />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating AI Chat */}
      {showAIChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50 shadow-2xl rounded-2xl overflow-hidden">
          <div className="relative w-full h-full">
            <Button
              onClick={() => setShowAIChat(false)}
              className="absolute top-2 left-2 z-10 w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
            >
              ×
            </Button>
            <RealAIChat />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setShowAIChat(!showAIChat)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl"
        >
          <Brain className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedLandingPage;
