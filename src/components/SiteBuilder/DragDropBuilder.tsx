import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Grip,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Layout,
  Type,
  Image,
  Users,
  Mail,
  Star,
  Phone,
  Grid,
  Video,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useSiteBuilder } from "./hooks/useSiteBuilder";
import { SiteElement } from "./context/SiteBuilderContext";

// تعريف أنواع العناصر المتاحة
const availableElements = [
  {
    type: "hero",
    name: "قسم البطل",
    icon: Layout,
    description: "قسم رئيسي في أعلى الصفحة",
    category: "هيكل",
    defaultContent: {
      title: "مرحباً بك في موقعنا",
      subtitle: "نحن نقدم خدمات رائعة لعملائنا",
      description: "وصف تفصيلي عن خدماتنا والقيمة التي نقدمها",
      buttonText: "ابدأ الآن",
      buttonLink: "#",
      backgroundImage: "",
      showVideo: false,
      videoUrl: "",
    },
  },
  {
    type: "services",
    name: "قسم الخدمات",
    icon: Grid,
    description: "عرض الخدمات في شبكة منظمة",
    category: "محتوى",
    defaultContent: {
      title: "خدماتنا",
      subtitle: "نقدم مجموعة متنوعة من الخدمات المتميزة",
      services: [
        {
          id: "1",
          title: "خدمة أولى",
          description: "وصف الخدمة الأولى",
          icon: "star",
          image: "",
          price: "",
          features: [],
        },
        {
          id: "2",
          title: "خدمة ثانية",
          description: "وصف الخدمة الثانية",
          icon: "heart",
          image: "",
          price: "",
          features: [],
        },
        {
          id: "3",
          title: "خدمة ثالثة",
          description: "وصف الخدمة الثالثة",
          icon: "zap",
          image: "",
          price: "",
          features: [],
        },
      ],
    },
  },
  {
    type: "about",
    name: "قسم نبذة عنا",
    icon: Users,
    description: "معلومات عن الشركة أو المؤسسة",
    category: "محتوى",
    defaultContent: {
      title: "نبذة عنا",
      subtitle: "تعرف على قصتنا ورؤيتنا",
      description:
        "نحن شركة رائدة في مجالنا، نقدم خدمات عالية الجودة منذ سنوات عديدة.",
      image: "",
      stats: [
        { number: "100+", label: "عميل راضٍ" },
        { number: "5+", label: "سنوات خبرة" },
        { number: "24/7", label: "دعم فني" },
      ],
      team: [],
    },
  },
  {
    type: "gallery",
    name: "معرض الصور",
    icon: Image,
    description: "عرض الصور في تخطيط جميل",
    category: "وسائط",
    defaultContent: {
      title: "معرض الصور",
      subtitle: "شاهد أعمالنا المميزة",
      images: [
        { id: "1", url: "", alt: "صورة 1", caption: "" },
        { id: "2", url: "", alt: "صورة 2", caption: "" },
        { id: "3", url: "", alt: "صورة 3", caption: "" },
      ],
      layout: "grid", // grid, masonry, carousel
      columns: 3,
    },
  },
  {
    type: "testimonials",
    name: "آراء العملاء",
    icon: MessageSquare,
    description: "عرض تقييمات وآراء العملاء",
    category: "محتوى",
    defaultContent: {
      title: "آراء عملائنا",
      subtitle: "ماذا يقول عملاؤنا عنا",
      testimonials: [
        {
          id: "1",
          name: "أحمد محمد",
          position: "مدير شركة",
          content: "خدمة ممتازة وفريق محترف جداً",
          rating: 5,
          image: "",
        },
        {
          id: "2",
          name: "فاطمة أحمد",
          position: "مديرة تسويق",
          content: "تجربة رائعة وحلول مبتكرة",
          rating: 5,
          image: "",
        },
      ],
    },
  },
  {
    type: "contact",
    name: "قسم التواصل",
    icon: Mail,
    description: "نموذج التواصل ومعلومات الاتصال",
    category: "تفاعل",
    defaultContent: {
      title: "تواصل معنا",
      subtitle: "نحن هنا للمساعدة",
      description: "لا تتردد في التواصل معنا لأي استفسار أو طلب خدمة",
      contactInfo: {
        phone: "+966 50 123 4567",
        email: "info@example.com",
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
        { id: "phone", label: "رقم الهاتف", type: "tel", required: false },
        { id: "message", label: "الرسالة", type: "textarea", required: true },
      ],
      showMap: true,
      mapLocation: "",
    },
  },
];

const DragDropBuilder: React.FC = () => {
  const { siteData, updateSiteData, getActivePage, setSelectedElement } =
    useSiteBuilder();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

  const activePage = getActivePage();

  // فلترة العناصر حسب البحث والفئة
  const filteredElements = availableElements.filter((element) => {
    const matchesSearch =
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "الكل" || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // الحصول على الفئات الفريدة
  const categories = [
    "الكل",
    ...Array.from(new Set(availableElements.map((el) => el.category))),
  ];

  // إضافة عنصر جديد
  const handleAddElement = useCallback(
    (elementType: string) => {
      if (!activePage) return;

      const elementTemplate = availableElements.find(
        (el) => el.type === elementType,
      );
      if (!elementTemplate) return;

      const newElement: SiteElement = {
        id: `${elementType}_${Date.now()}`,
        type: elementType as SiteElement["type"],
        content: elementTemplate.defaultContent,
        styles: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          padding: "4rem 0",
          margin: "0",
          borderRadius: "0",
          boxShadow: "none",
        },
        position: activePage.elements.length,
        visible: true,
        responsive: {
          desktop: { display: "block" },
          tablet: { display: "block" },
          mobile: { display: "block" },
        },
      };

      updateSiteData({
        type: "ADD_ELEMENT",
        pageId: activePage.id,
        element: newElement,
      });
    },
    [activePage, updateSiteData],
  );

  // تكرار عنصر
  const handleDuplicateElement = useCallback(
    (element: SiteElement) => {
      if (!activePage) return;

      const duplicatedElement: SiteElement = {
        ...element,
        id: `${element.type}_${Date.now()}`,
        position: activePage.elements.length,
      };

      updateSiteData({
        type: "ADD_ELEMENT",
        pageId: activePage.id,
        element: duplicatedElement,
      });
    },
    [activePage, updateSiteData],
  );

  // حذف عنصر
  const handleDeleteElement = useCallback(
    (elementId: string) => {
      updateSiteData({
        type: "DELETE_ELEMENT",
        elementId,
      });
      setSelectedElement(null);
    },
    [updateSiteData, setSelectedElement],
  );

  // تبديل رؤية العنصر
  const handleToggleVisibility = useCallback(
    (elementId: string, currentVisibility: boolean) => {
      updateSiteData({
        type: "UPDATE_ELEMENT",
        elementId,
        data: { visible: !currentVisibility },
      });
    },
    [updateSiteData],
  );

  // ترتيب العناصر بالسحب والإفلات
  const handleDragStart = useCallback(
    (e: React.DragEvent, elementId: string) => {
      e.dataTransfer.setData("text/plain", elementId);
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      if (!activePage) return;

      const draggedElementId = e.dataTransfer.getData("text/plain");
      const elements = [...activePage.elements];
      const draggedIndex = elements.findIndex(
        (el) => el.id === draggedElementId,
      );

      if (draggedIndex === -1) return;

      // إعادة ترتيب العناصر
      const [draggedElement] = elements.splice(draggedIndex, 1);
      elements.splice(dropIndex, 0, draggedElement);

      // تحديث مواضع العناصر
      const reorderedIds = elements.map((el) => el.id);

      updateSiteData({
        type: "REORDER_ELEMENTS",
        pageId: activePage.id,
        elementIds: reorderedIds,
      });
    },
    [activePage, updateSiteData],
  );

  if (!activePage) {
    return (
      <div className="p-4 text-center text-gray-500">لا توجد صفحة نشطة</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إضافة عناصر جديدة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            إضافة عناصر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* البحث */}
          <Input
            placeholder="البحث عن عنصر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* الفئات */}
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

          {/* العناصر المتاحة */}
          <div className="grid grid-cols-1 gap-2">
            {filteredElements.map((element) => {
              const Icon = element.icon;
              return (
                <Button
                  key={element.type}
                  variant="outline"
                  className="justify-start h-auto p-3 text-right"
                  onClick={() => handleAddElement(element.type)}
                >
                  <Icon className="w-5 h-5 ml-3 flex-shrink-0" />
                  <div className="text-right">
                    <div className="font-medium">{element.name}</div>
                    <div className="text-sm text-gray-500">
                      {element.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* العناصر الحالية في الصفحة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Layout className="w-5 h-5 mr-2" />
              عناصر الصفحة
            </span>
            <Badge variant="secondary">{activePage.elements.length} عنصر</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activePage.elements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد عناصر في هذه الصفحة</p>
              <p className="text-sm">ابدأ بإضافة عناصر من الأعلى</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activePage.elements
                .sort((a, b) => a.position - b.position)
                .map((element, index) => {
                  const elementTemplate = availableElements.find(
                    (el) => el.type === element.type,
                  );
                  const Icon = elementTemplate?.icon || Layout;

                  return (
                    <div
                      key={element.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        element.visible ? "bg-white" : "bg-gray-50 opacity-60"
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => setSelectedElement(element)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Grip className="w-4 h-4 text-gray-400 cursor-move" />
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-sm">
                              {elementTemplate?.name || element.type}
                            </div>
                            <div className="text-xs text-gray-500">
                              موضع {element.position + 1}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(
                                element.id,
                                element.visible,
                              );
                            }}
                          >
                            {element.visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateElement(element);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(element.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DragDropBuilder;
