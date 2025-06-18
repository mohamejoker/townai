import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Common/Logo";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Heart,
  Shield,
  Award,
  Clock,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "الصفحة الرئيسية", href: "/" },
    { name: "الخدمات", href: "/services" },
    { name: "المساعد الذكي", href: "/ai-chat" },
    { name: "الأسعار", href: "/pricing" },
    { name: "تسجيل الدخول", href: "/login" },
    { name: "إنشاء حساب", href: "/register" },
  ];

  const services = [
    {
      name: "متابعين إنستغرام",
      href: "/services?platform=instagram&category=followers",
    },
    {
      name: "مشاهدات تيك توك",
      href: "/services?platform=tiktok&category=views",
    },
    {
      name: "مشتركين يوتيوب",
      href: "/services?platform=youtube&category=followers",
    },
    {
      name: "إعجابات فيسبوك",
      href: "/services?platform=facebook&category=engagement",
    },
    { name: "تحليل بالذكاء الاصطناعي", href: "/ai-chat" },
    { name: "جميع الخدمات", href: "/services" },
  ];

  const support = [
    { name: "مركز المساعدة", href: "/help" },
    { name: "الأسئلة الشائعة", href: "/faq" },
    { name: "اتصل بنا", href: "/contact" },
    { name: "تذكرة دعم", href: "/support" },
    { name: "حالة الخدمة", href: "/status" },
    { name: "واتساب", href: "https://wa.me/1234567890" },
  ];

  const socialLinks = [
    {
      name: "تيليجرام",
      icon: Send,
      href: "https://t.me/townmedia",
      color: "text-blue-400",
    },
    {
      name: "واتساب",
      icon: MessageCircle,
      href: "https://wa.me/1234567890",
      color: "text-green-400",
    },
    {
      name: "إنستغرام",
      icon: Instagram,
      href: "https://instagram.com/townmedia",
      color: "text-pink-400",
    },
    {
      name: "يوتيوب",
      icon: Youtube,
      href: "https://youtube.com/townmedia",
      color: "text-red-400",
    },
    {
      name: "تويتر",
      icon: Twitter,
      href: "https://twitter.com/townmedia",
      color: "text-blue-400",
    },
    {
      name: "فيسبوك",
      icon: Facebook,
      href: "https://facebook.com/townmedia",
      color: "text-blue-600",
    },
  ];

  const trustIndicators = [
    { icon: Shield, text: "آمن 100%", color: "text-green-400" },
    { icon: Award, text: "جودة مضمونة", color: "text-yellow-400" },
    { icon: Clock, text: "دعم 24/7", color: "text-blue-400" },
    { icon: Heart, text: "+50K عميل راضي", color: "text-red-400" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Logo variant="white" size="md" />
                <Badge className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  منصة التسويق الرقمي #1
                </Badge>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                نقدم أفضل خدمات التسويق الرقمي مدعومة بأحدث تقنيات الذكاء
                الاصطناعي لضمان نموك الرقمي بأمان وجودة عالية.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-3">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center">
                    <indicator.icon
                      className={`h-4 w-4 ml-2 ${indicator.color}`}
                    />
                    <span className="text-sm">{indicator.text}</span>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 ml-2 text-blue-400" />
                  <span className="text-sm">support@townmedia.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 ml-2 text-green-400" />
                  <span className="text-sm">+966 50 123 4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 ml-2 text-red-400" />
                  <span className="text-sm">
                    الرياض، المملكة العربية السعودية
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">روابط سريعة</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full ml-3 group-hover:w-2 transition-all duration-200"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">خدماتنا</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link
                      to={service.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full ml-3 group-hover:w-2 transition-all duration-200"></span>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Social */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">
                الدعم والمتابعة
              </h3>

              {/* Support Links */}
              <ul className="space-y-3 mb-6">
                {support.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-green-400 rounded-full ml-3 group-hover:w-2 transition-all duration-200"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-3 text-white">تابعنا على:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all duration-200 flex items-center justify-center group"
                      title={social.name}
                    >
                      <social.icon
                        className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform`}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Town Media. جميع الحقوق محفوظة.
              </div>

              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  سياسة الخصوصية
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  شروط الاستخدام
                </Link>
                <Link
                  to="/refund"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  سياسة الاسترداد
                </Link>
                <Button
                  onClick={scrollToTop}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-2"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
