import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Common/Logo";
import {
  Menu,
  X,
  Brain,
  Users,
  ShoppingCart,
  MessageSquare,
  Star,
  Zap,
  Crown,
  Gift,
  Heart,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    {
      title: "الخدمات",
      href: "/services",
      icon: ShoppingCart,
      dropdown: [
        {
          title: "متابعين إنستغرام",
          href: "/services?platform=instagram&category=followers",
          icon: "📸",
        },
        {
          title: "مشاهدات تيك توك",
          href: "/services?platform=tiktok&category=views",
          icon: "🎵",
        },
        {
          title: "مشتركين يوتيوب",
          href: "/services?platform=youtube&category=followers",
          icon: "📺",
        },
        {
          title: "خدمات فيسبوك",
          href: "/services?platform=facebook",
          icon: "👥",
        },
        { title: "جميع الخدمات", href: "/services", icon: "🌟" },
        {
          title: "الخدمات المميزة",
          href: "/services?category=premium",
          icon: "👑",
        },
      ],
    },
    {
      title: "المساعد الذكي",
      href: "/ai-chat",
      icon: Brain,
      badge: "جديد",
      dropdown: [
        { title: "محادثة ذكية", href: "/ai-chat", icon: "🤖" },
        { title: "تحليل الحساب", href: "/ai-chat?tool=analysis", icon: "📊" },
        { title: "تصميم ذكي", href: "/ai-chat?tool=design", icon: "🎨" },
        {
          title: "استشارة مجانية",
          href: "/ai-chat?tool=consultation",
          icon: "💡",
        },
      ],
    },
    {
      title: "منشئ المواقع",
      href: "/site-builder",
      icon: Crown,
      badge: "متطور",
      dropdown: [
        { title: "إنشاء موقع جديد", href: "/site-builder", icon: "🌟" },
        {
          title: "القوالب الجاهزة",
          href: "/site-builder?tab=templates",
          icon: "📋",
        },
        { title: "مواقعي", href: "/site-builder?tab=my-sites", icon: "💼" },
        {
          title: "المساعد الذكي",
          href: "/site-builder?tab=ai-assistant",
          icon: "🤖",
        },
      ],
    },
    {
      title: "الوظائف",
      href: "/jobs",
      icon: Users,
      dropdown: [
        { title: "تصفح الوظائف", href: "/jobs", icon: "💼" },
        {
          title: "وظائف التطوير",
          href: "/jobs?category=development",
          icon: "💻",
        },
        {
          title: "وظائف التسويق",
          href: "/jobs?category=marketing",
          icon: "📈",
        },
        { title: "وظائف التصميم", href: "/jobs?category=design", icon: "🎨" },
        { title: "العمل عن بُعد", href: "/jobs?type=remote", icon: "🌍" },
      ],
    },
    {
      title: "الأسعار",
      href: "/pricing",
      icon: Star,
    },
    {
      title: "المساعدة",
      href: "/help",
      icon: MessageSquare,
      dropdown: [
        { title: "مركز المساعدة", href: "/help", icon: "❓" },
        { title: "الأسئلة الشائعة", href: "/faq", icon: "📚" },
        { title: "اتصل بنا", href: "/contact", icon: "📞" },
        { title: "واتساب", href: "https://wa.me/1234567890", icon: "💬" },
        { title: "تيليجرام", href: "https://t.me/townmedia", icon: "✈️" },
      ],
    },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border-b"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <Logo size="sm" />
              <div className="hidden md:flex flex-col">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  <Sparkles className="h-3 w-3 ml-1" />
                  AI-Powered
                </Badge>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
              {navigationItems.map((item, index) => (
                <div
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActiveLink(item.href)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.dropdown && (
                      <ChevronDown className="h-3 w-3 ml-1 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.title && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 opacity-0 translate-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.href}
                          className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="text-lg">{dropdownItem.icon}</span>
                          <span>{dropdownItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                    <Crown className="h-4 w-4 ml-2" />
                    ابدأ الآن
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between pb-6 border-b">
                      <Logo size="sm" />
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        AI-Powered
                      </Badge>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 py-6">
                      <div className="space-y-2">
                        {navigationItems.map((item, index) => (
                          <div key={index}>
                            <Link
                              to={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                                isActiveLink(item.href)
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge className="bg-red-500 text-white text-xs mr-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>

                            {/* Mobile Dropdown */}
                            {item.dropdown && (
                              <div className="mr-8 mt-2 space-y-1">
                                {item.dropdown.map(
                                  (dropdownItem, dropdownIndex) => (
                                    <Link
                                      key={dropdownIndex}
                                      to={dropdownItem.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                      <span>{dropdownItem.icon}</span>
                                      <span>{dropdownItem.title}</span>
                                    </Link>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="border-t pt-6 space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          <Crown className="h-4 w-4 ml-2" />
                          ابدأ الآن
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-100">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 ml-1" />
                <span className="text-green-700 font-medium">آمن 100%</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-red-500 ml-1" />
                <span className="text-red-700 font-medium">+50K عميل راضي</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 ml-1" />
                <span className="text-yellow-700 font-medium">توصيل فوري</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-4 w-4 text-purple-500 ml-1" />
                <span className="text-purple-700 font-medium">
                  خصومات يومية
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;
