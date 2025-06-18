import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Layout,
  Star,
  Eye,
  Download,
  Search,
  Filter,
  Sparkles,
  Globe,
  ShoppingBag,
  Briefcase,
  Heart,
  Camera,
  Music,
  GraduationCap,
  Stethoscope,
  Car,
  Home,
  Coffee,
} from "lucide-react";
import { SiteData } from "./context/SiteBuilderContext";

interface TemplateManagerProps {
  onSelectTemplate: (template: SiteData) => void;
}

// قوالب محددة مسبقاً
const predefinedTemplates: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  icon: React.ComponentType<{ className?: string }>;
  rating: number;
  template: SiteData;
}> = [
  {
    id: "business-corporate",
    name: "شركة تجارية",
    description: "قالب احترافي للشركات والمؤسسات التجارية",
    category: "أعمال",
    preview: "/templates/business-preview.jpg",
    icon: Briefcase,
    rating: 5,
    template: {
      metadata: {
        title: "شركة النجاح التجارية",
        description: "شركة رائدة في تقديم الحلول التجارية المتكاملة",
        logo: "",
        favicon: "",
        author: "محمد سليم",
        language: "ar",
      },
      theme: {
        colors: {
          primary: "#1e40af",
          secondary: "#64748b",
          accent: "#f59e0b",
          background: "#ffffff",
          text: "#1f2937",
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo",
        },
        spacing: {
          container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          section: "py-12 md:py-20",
        },
      },
      pages: [
        {
          id: "home",
          name: "الصفحة الرئيسية",
          slug: "/",
          elements: [
            {
              id: "hero_business",
              type: "hero",
              content: {
                title: "حلول تجارية متكاملة",
                subtitle: "نساعدك في تطوير أعمالك وتحقيق أهدافك",
                description:
                  "مع فريق من الخبراء المتخصصين نقدم لك استشارات وحلول تقنية متقدمة",
                buttonText: "ابدأ مشروعك",
                buttonLink: "#contact",
                backgroundImage: "",
                showVideo: false,
                videoUrl: "",
              },
              styles: {
                backgroundColor: "#1e40af",
                color: "#ffffff",
                padding: "6rem 0",
                textAlign: "center",
              },
              position: 0,
              visible: true,
              responsive: {
                desktop: { padding: "6rem 0" },
                tablet: { padding: "4rem 0" },
                mobile: { padding: "3rem 0" },
              },
            },
            {
              id: "services_business",
              type: "services",
              content: {
                title: "خدماتنا المميزة",
                subtitle: "نقدم مجموعة شاملة من الخدمات التجارية",
                services: [
                  {
                    id: "1",
                    title: "الاستشارات التجارية",
                    description: "نصائح خبراء لتطوير أعمالك",
                    icon: "briefcase",
                    price: "ابتداء من 500 ريال",
                    features: [],
                  },
                  {
                    id: "2",
                    title: "التسويق الرقمي",
                    description: "حملات تسويقية فعالة ومربحة",
                    icon: "trending-up",
                    price: "ابتداء من 1000 ريال",
                    features: [],
                  },
                  {
                    id: "3",
                    title: "تطوير الأنظمة",
                    description: "حلول تقنية مصممة خصيصاً لك",
                    icon: "code",
                    price: "حسب المشروع",
                    features: [],
                  },
                ],
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 1,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "about_business",
              type: "about",
              content: {
                title: "نبذة عن شركتنا",
                subtitle: "خبرة تمتد لأكثر من 10 سنوات",
                description:
                  "نحن فريق من المحترفين المتخصصين في تقديم الحلول التجارية المبتكرة. نساعد الشركات على النمو والتطور من خلال استراتيجيات مدروسة وحلول تقنية متقدمة.",
                image: "",
                stats: [
                  { number: "500+", label: "عميل راضٍ" },
                  { number: "10+", label: "سنوات خبرة" },
                  { number: "24/7", label: "دعم فني" },
                ],
                team: [],
              },
              styles: {
                backgroundColor: "#f8fafc",
                padding: "4rem 0",
              },
              position: 2,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "contact_business",
              type: "contact",
              content: {
                title: "تواصل معنا",
                subtitle: "نحن هنا لمساعدتك",
                description:
                  "لا تتردد في التواصل معنا للحصول على استشارة مجانية",
                contactInfo: {
                  phone: "+966 50 123 4567",
                  email: "info@company.com",
                  address: "الرياض، المملكة العربية السعودية",
                  workingHours: "الأحد - الخميس: 9:00 ص - 6:00 م",
                },
                formFields: [
                  { id: "name", label: "الاسم", type: "text", required: true },
                  {
                    id: "email",
                    label: "البريد الإلكتروني",
                    type: "email",
                    required: true,
                  },
                  {
                    id: "company",
                    label: "اسم الشركة",
                    type: "text",
                    required: false,
                  },
                  {
                    id: "message",
                    label: "الرسالة",
                    type: "textarea",
                    required: true,
                  },
                ],
                showMap: true,
                mapLocation: "",
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 3,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
          ],
          meta: {
            title: "شركة النجاح التجارية - الصفحة الرئيسية",
            description: "شركة رائدة في تقديم الحلول التجارية المتكاملة",
            keywords: ["شركة", "أعمال", "استشارات", "تسويق"],
          },
        },
      ],
      activePage: "home",
      settings: {
        responsive: true,
        animations: true,
        darkMode: false,
        rtl: true,
      },
    },
  },
  {
    id: "ecommerce-store",
    name: "متجر إلكتروني",
    description: "قالب متكامل للمتاجر الإلكترونية والتجارة الرقمية",
    category: "تجارة إلكترونية",
    preview: "/templates/ecommerce-preview.jpg",
    icon: ShoppingBag,
    rating: 5,
    template: {
      metadata: {
        title: "متجر الأناقة",
        description: "متجرك الأول للأزياء والموضة العصرية",
        logo: "",
        favicon: "",
        author: "محمد سليم",
        language: "ar",
      },
      theme: {
        colors: {
          primary: "#10b981",
          secondary: "#6b7280",
          accent: "#f59e0b",
          background: "#ffffff",
          text: "#1f2937",
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo",
        },
        spacing: {
          container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          section: "py-12 md:py-20",
        },
      },
      pages: [
        {
          id: "home",
          name: "الصفحة الرئيسية",
          slug: "/",
          elements: [
            {
              id: "hero_store",
              type: "hero",
              content: {
                title: "أحدث صيحات الموضة",
                subtitle: "اكتشف مجموعتنا الجديدة من الأزياء العصرية",
                description:
                  "تسوق من تشكيلة واسعة من الملابس والإكسسوارات بأفضل الأسعار",
                buttonText: "تسوق الآن",
                buttonLink: "#products",
                backgroundImage: "",
                showVideo: false,
                videoUrl: "",
              },
              styles: {
                backgroundColor: "#10b981",
                color: "#ffffff",
                padding: "6rem 0",
                textAlign: "center",
              },
              position: 0,
              visible: true,
              responsive: {
                desktop: { padding: "6rem 0" },
                tablet: { padding: "4rem 0" },
                mobile: { padding: "3rem 0" },
              },
            },
            {
              id: "services_store",
              type: "services",
              content: {
                title: "منتجاتنا المميزة",
                subtitle: "اختر من بين مجموعة واسعة من المنتجات عالية الجودة",
                services: [
                  {
                    id: "1",
                    title: "ملابس رجالية",
                    description: "تشكيلة متنوعة من الملابس الرجالية الأنيقة",
                    icon: "shirt",
                    price: "ابتداء من 50 ريال",
                    features: [],
                  },
                  {
                    id: "2",
                    title: "ملابس نسائية",
                    description: "أزياء نسائية عصرية ومريحة",
                    icon: "dress",
                    price: "ابتداء من 80 ريال",
                    features: [],
                  },
                  {
                    id: "3",
                    title: "إكسسوارات",
                    description: "مجموعة رائعة من الإكسسوارات والحقائب",
                    icon: "bag",
                    price: "ابتداء من 25 ريال",
                    features: [],
                  },
                ],
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 1,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "gallery_store",
              type: "gallery",
              content: {
                title: "معرض المنتجات",
                subtitle: "شاهد أحدث المنتجات في متجرنا",
                images: [
                  { id: "1", url: "", alt: "منتج 1", caption: "فستان أنيق" },
                  { id: "2", url: "", alt: "منتج 2", caption: "قميص رجالي" },
                  { id: "3", url: "", alt: "منتج 3", caption: "حقيبة يد" },
                  { id: "4", url: "", alt: "منتج 4", caption: "حذاء رياضي" },
                  { id: "5", url: "", alt: "منتج 5", caption: "ساعة يد" },
                  { id: "6", url: "", alt: "منتج 6", caption: "نظارة شمسية" },
                ],
                layout: "grid",
                columns: 3,
              },
              styles: {
                backgroundColor: "#f8fafc",
                padding: "4rem 0",
              },
              position: 2,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "testimonials_store",
              type: "testimonials",
              content: {
                title: "آراء عملائنا",
                subtitle: "ماذا يقول عملاؤنا عن تجربة التسوق معنا",
                testimonials: [
                  {
                    id: "1",
                    name: "سارة أحمد",
                    position: "عميلة",
                    content: "منتجات عالية الجودة وخدمة ممتازة، أنصح بالتجربة",
                    rating: 5,
                    image: "",
                  },
                  {
                    id: "2",
                    name: "خالد محمد",
                    position: "عميل",
                    content:
                      "تشكيلة رائعة وأسعار مناسبة، سأكرر الشراء بالتأكيد",
                    rating: 5,
                    image: "",
                  },
                ],
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 3,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
          ],
          meta: {
            title: "متجر الأناقة - الصفحة الرئيسية",
            description: "متجرك الأول للأزياء والموضة العصرية",
            keywords: ["متجر", "أزياء", "موضة", "ملابس", "تسوق"],
          },
        },
      ],
      activePage: "home",
      settings: {
        responsive: true,
        animations: true,
        darkMode: false,
        rtl: true,
      },
    },
  },
  {
    id: "portfolio-creative",
    name: "معرض أعمال إبداعي",
    description: "قالب مثالي للمصممين والمبدعين لعرض أعمالهم",
    category: "إبداعي",
    preview: "/templates/portfolio-preview.jpg",
    icon: Camera,
    rating: 4,
    template: {
      metadata: {
        title: "أحمد المصمم",
        description: "مصمم جرافيك ومطور مواقع إلكترونية",
        logo: "",
        favicon: "",
        author: "محمد سليم",
        language: "ar",
      },
      theme: {
        colors: {
          primary: "#8b5cf6",
          secondary: "#6b7280",
          accent: "#f59e0b",
          background: "#ffffff",
          text: "#1f2937",
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo",
        },
        spacing: {
          container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          section: "py-12 md:py-20",
        },
      },
      pages: [
        {
          id: "home",
          name: "الصفحة الرئيسية",
          slug: "/",
          elements: [
            {
              id: "hero_portfolio",
              type: "hero",
              content: {
                title: "مرحباً، أنا أحمد",
                subtitle: "مصمم جرافيك ومطور مواقع",
                description:
                  "أساعدك في تحويل أفكارك إلى تصاميم إبداعية ومواقع تفاعلية",
                buttonText: "شاهد أعمالي",
                buttonLink: "#portfolio",
                backgroundImage: "",
                showVideo: false,
                videoUrl: "",
              },
              styles: {
                backgroundColor: "#8b5cf6",
                color: "#ffffff",
                padding: "6rem 0",
                textAlign: "center",
              },
              position: 0,
              visible: true,
              responsive: {
                desktop: { padding: "6rem 0" },
                tablet: { padding: "4rem 0" },
                mobile: { padding: "3rem 0" },
              },
            },
            {
              id: "services_portfolio",
              type: "services",
              content: {
                title: "خدماتي الإبداعية",
                subtitle: "أقدم مجموعة متنوعة من الخدمات التصميمية",
                services: [
                  {
                    id: "1",
                    title: "تصميم الهوية البصرية",
                    description: "شعارات وهويات بصرية متكاملة",
                    icon: "palette",
                    price: "ابتداء من 800 ريال",
                    features: [],
                  },
                  {
                    id: "2",
                    title: "تطوير المواقع",
                    description: "مواقع إلكترونية حديثة ومتجاوبة",
                    icon: "code",
                    price: "ابتداء من 2000 ريال",
                    features: [],
                  },
                  {
                    id: "3",
                    title: "التصوير الفوتوغرافي",
                    description: "جلسات تصوير احترافية",
                    icon: "camera",
                    price: "ابتداء من 500 ريال",
                    features: [],
                  },
                ],
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 1,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "gallery_portfolio",
              type: "gallery",
              content: {
                title: "معرض أعمالي",
                subtitle: "مجموعة مختارة من أفضل أعمالي",
                images: [
                  {
                    id: "1",
                    url: "",
                    alt: "مشروع 1",
                    caption: "تص��يم هوية بصرية",
                  },
                  {
                    id: "2",
                    url: "",
                    alt: "مشروع 2",
                    caption: "موقع إلكتروني",
                  },
                  {
                    id: "3",
                    url: "",
                    alt: "مشروع 3",
                    caption: "تصوير فوتوغرافي",
                  },
                  { id: "4", url: "", alt: "مشروع 4", caption: "تصميم إعلان" },
                  { id: "5", url: "", alt: "مشروع 5", caption: "تطبيق موبايل" },
                  {
                    id: "6",
                    url: "",
                    alt: "مشروع 6",
                    caption: "كتالوج منتجات",
                  },
                ],
                layout: "grid",
                columns: 3,
              },
              styles: {
                backgroundColor: "#f8fafc",
                padding: "4rem 0",
              },
              position: 2,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
            {
              id: "contact_portfolio",
              type: "contact",
              content: {
                title: "تواصل معي",
                subtitle: "دعنا نحول فكرتك إلى واقع",
                description:
                  "أنا متاح للعمل على مشاريع جديدة، لا تتردد في التواصل",
                contactInfo: {
                  phone: "+966 55 987 6543",
                  email: "ahmed@designer.com",
                  address: "جدة، المملكة العربية السعودية",
                  workingHours: "متاح للعمل عن بُعد",
                },
                formFields: [
                  { id: "name", label: "الاسم", type: "text", required: true },
                  {
                    id: "email",
                    label: "البريد الإلكتروني",
                    type: "email",
                    required: true,
                  },
                  {
                    id: "project",
                    label: "نوع المشروع",
                    type: "text",
                    required: false,
                  },
                  {
                    id: "budget",
                    label: "الميزانية المتوقعة",
                    type: "text",
                    required: false,
                  },
                  {
                    id: "message",
                    label: "تفاصيل المشروع",
                    type: "textarea",
                    required: true,
                  },
                ],
                showMap: false,
                mapLocation: "",
              },
              styles: {
                backgroundColor: "#ffffff",
                padding: "4rem 0",
              },
              position: 3,
              visible: true,
              responsive: {
                desktop: { display: "block" },
                tablet: { display: "block" },
                mobile: { display: "block" },
              },
            },
          ],
          meta: {
            title: "أحمد المصمم - معرض الأعمال",
            description: "مصمم جرافيك ومطور مواقع إلكترونية",
            keywords: ["تصميم", "مواقع", "جرافيك", "إبداع", "portfolio"],
          },
        },
      ],
      activePage: "home",
      settings: {
        responsive: true,
        animations: true,
        darkMode: false,
        rtl: true,
      },
    },
  },
];

const TemplateManager: React.FC<TemplateManagerProps> = ({
  onSelectTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  // فلترة القوالب
  const filteredTemplates = predefinedTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "الكل" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // الحصول على الفئات الفريدة
  const categories = [
    "الكل",
    ...Array.from(new Set(predefinedTemplates.map((t) => t.category))),
  ];

  const handleSelectTemplate = useCallback(
    (template: SiteData) => {
      onSelectTemplate(template);
    },
    [onSelectTemplate],
  );

  return (
    <div className="space-y-6">
      {/* رأس إدارة القوالب */}
      <div>
        <h3 className="text-lg font-bold mb-4">قوالب جاهزة</h3>

        {/* البحث والفلترة */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="البحث عن قالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* عرض القوالب */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                {/* صورة معاينة القالب */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-gray-400" />
                </div>

                {/* شارة التقييم */}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </Badge>
                </div>

                {/* شارة الفئة */}
                <div className="absolute top-2 right-2">
                  <Badge variant="default">{template.category}</Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleSelectTemplate(template.template)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    استخدام القالب
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(template.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* معلومات إضافية */}
                <div className="mt-4 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>
                      العناصر:{" "}
                      {template.template.pages[0]?.elements.length || 0}
                    </span>
                    <span>الصفحات: {template.template.pages.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* رسالة عدم وجود قوالب */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد قوالب تطابق البحث</p>
          <p className="text-sm">جرب تغيير مصطلح البحث أو الفئة</p>
        </div>
      )}

      {/* قسم القوالب المخصصة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            قوالب مخصصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Coffee className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">قوالب حسب الطلب</p>
            <p className="text-sm mb-4">
              نحن نعمل على إضافة المزيد من القوالب المتخصصة
            </p>
            <Button variant="outline" size="sm">
              اطلب قالب مخصص
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* معاينة القالب */}
      {previewTemplate && (
        <TemplatePreview
          template={predefinedTemplates.find((t) => t.id === previewTemplate)}
          onClose={() => setPreviewTemplate(null)}
          onSelect={(template) => {
            handleSelectTemplate(template);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// مكون معاينة القالب
const TemplatePreview: React.FC<{
  template: (typeof predefinedTemplates)[0] | undefined;
  onClose: () => void;
  onSelect: (template: SiteData) => void;
}> = ({ template, onClose, onSelect }) => {
  if (!template) return null;

  const Icon = template.icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon className="w-6 h-6 mr-3 text-gray-600" />
              <div>
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              إغلاق
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* معاينة مبسطة للقالب */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>الفئة:</strong> {template.category}
              </div>
              <div>
                <strong>التقييم:</strong> {template.rating}/5
              </div>
              <div>
                <strong>عدد العناصر:</strong>{" "}
                {template.template.pages[0]?.elements.length || 0}
              </div>
              <div>
                <strong>عدد الصفحات:</strong> {template.template.pages.length}
              </div>
            </div>

            {/* عرض عناصر القالب */}
            <div>
              <h4 className="font-semibold mb-3">عناصر القالب:</h4>
              <div className="grid grid-cols-2 gap-2">
                {template.template.pages[0]?.elements.map((element, index) => (
                  <div
                    key={element.id}
                    className="p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="font-medium">{element.type}</div>
                    <div className="text-gray-500 text-xs">
                      موضع {element.position + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إعدادات الألوان */}
            <div>
              <h4 className="font-semibold mb-3">ألوان القالب:</h4>
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: template.template.theme.colors.primary,
                  }}
                  title="اللون الأساسي"
                />
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: template.template.theme.colors.secondary,
                  }}
                  title="اللون الثانوي"
                />
                <div
                  className="w-8 h-8 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: template.template.theme.colors.accent,
                  }}
                  title="لون مميز"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            className="flex-1"
            onClick={() => onSelect(template.template)}
          >
            <Download className="w-4 h-4 mr-2" />
            استخدام هذا القالب
          </Button>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
