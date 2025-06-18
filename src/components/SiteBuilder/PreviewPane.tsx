import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Maximize,
  RotateCcw,
  Share,
  Code,
  Download,
} from "lucide-react";
import { SiteData, SiteElement } from "./context/SiteBuilderContext";

interface PreviewPaneProps {
  siteData: SiteData;
  previewMode: "desktop" | "tablet" | "mobile";
  selectedElement: SiteElement | null;
  onElementSelect: (element: SiteElement | null) => void;
  showPreview: boolean;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({
  siteData,
  previewMode,
  selectedElement,
  onElementSelect,
  showPreview,
}) => {
  const [showCode, setShowCode] = useState(false);
  const [showElementBorders, setShowElementBorders] = useState(true);

  const activePage = siteData.pages.find(
    (page) => page.id === siteData.activePage,
  );

  // تحديد أبعاد الجهاز
  const getDeviceDimensions = () => {
    switch (previewMode) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      case "desktop":
      default:
        return { width: "100%", height: "100%" };
    }
  };

  const dimensions = getDeviceDimensions();

  // تصدير المعاينة كصورة
  const exportAsImage = useCallback(() => {
    // سيتم تنفيذ تصدير الصورة هنا
    console.log("تصدير كصورة");
  }, []);

  // مشاركة المعاينة
  const sharePreview = useCallback(() => {
    // سيتم تنفيذ المشاركة هنا
    console.log("مشاركة المعاينة");
  }, []);

  if (!activePage) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا تو��د صفحة للمعاينة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* شريط أدوات المعاينة */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center">
            {previewMode === "desktop" && <Monitor className="w-4 h-4 mr-1" />}
            {previewMode === "tablet" && <Tablet className="w-4 h-4 mr-1" />}
            {previewMode === "mobile" && (
              <Smartphone className="w-4 h-4 mr-1" />
            )}
            {previewMode === "desktop"
              ? "سطح المكتب"
              : previewMode === "tablet"
                ? "تابلت"
                : "موبايل"}
          </Badge>

          <div className="text-sm text-gray-500">
            {activePage.elements.length} عنصر
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowElementBorders(!showElementBorders)}
          >
            {showElementBorders ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCode(!showCode)}
          >
            <Code className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={sharePreview}>
            <Share className="w-4 h-4" />
          </Button>

          <Button size="sm" variant="outline" onClick={exportAsImage}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* منطقة المعاينة */}
      <div className="flex-1 p-4 bg-gray-100">
        {showCode ? (
          <CodeView siteData={siteData} activePage={activePage} />
        ) : (
          <div
            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              width: dimensions.width,
              height: previewMode === "desktop" ? "auto" : dimensions.height,
              minHeight: previewMode === "desktop" ? "600px" : "auto",
            }}
          >
            <div className="relative">
              {activePage.elements
                .filter((element) => element.visible)
                .sort((a, b) => a.position - b.position)
                .map((element) => (
                  <ElementPreview
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    showBorders={showElementBorders}
                    previewMode={previewMode}
                    siteTheme={siteData.theme}
                    onClick={() => onElementSelect(element)}
                  />
                ))}

              {activePage.elements.length === 0 && (
                <div className="flex items-center justify-center h-96 text-gray-400">
                  <div className="text-center">
                    <Maximize className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">الصفحة فارغة</p>
                    <p className="text-sm">
                      ابدأ بإضافة عناصر من الشريط الجانبي
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// مكون معاينة العنصر
const ElementPreview: React.FC<{
  element: SiteElement;
  isSelected: boolean;
  showBorders: boolean;
  previewMode: "desktop" | "tablet" | "mobile";
  siteTheme: SiteData["theme"];
  onClick: () => void;
}> = ({
  element,
  isSelected,
  showBorders,
  previewMode,
  siteTheme,
  onClick,
}) => {
  // دمج التنسيقات
  const elementStyles = {
    ...element.styles,
    ...element.responsive[previewMode],
    cursor: "pointer",
    border: showBorders
      ? isSelected
        ? "2px solid #3b82f6"
        : "1px dashed #d1d5db"
      : "none",
    position: "relative" as const,
  };

  // عرض العنصر حسب نوعه
  const renderElement = () => {
    switch (element.type) {
      case "hero":
        return <HeroPreview content={element.content} theme={siteTheme} />;
      case "services":
        return <ServicesPreview content={element.content} theme={siteTheme} />;
      case "about":
        return <AboutPreview content={element.content} theme={siteTheme} />;
      case "gallery":
        return <GalleryPreview content={element.content} theme={siteTheme} />;
      case "testimonials":
        return (
          <TestimonialsPreview content={element.content} theme={siteTheme} />
        );
      case "contact":
        return <ContactPreview content={element.content} theme={siteTheme} />;
      default:
        return <GenericPreview content={element.content} theme={siteTheme} />;
    }
  };

  return (
    <div
      style={elementStyles}
      onClick={onClick}
      className="group hover:shadow-md transition-shadow duration-200"
    >
      {/* مؤشر العنصر المحدد */}
      {isSelected && showBorders && (
        <div className="absolute -top-6 left-0 px-2 py-1 bg-blue-500 text-white text-xs rounded z-10">
          {element.type} - محدد
        </div>
      )}

      {renderElement()}
    </div>
  );
};

// معاينة قسم البطل
const HeroPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => (
  <section
    className="relative py-20 px-6 text-center"
    style={{
      backgroundColor: content.backgroundImage
        ? "transparent"
        : theme.colors.primary,
      backgroundImage: content.backgroundImage
        ? `url(${content.backgroundImage})`
        : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: theme.colors.text,
    }}
  >
    <div className="max-w-4xl mx-auto">
      <h1
        className="text-4xl md:text-6xl font-bold mb-6"
        style={{ fontFamily: theme.fonts.heading }}
      >
        {(content.title as string) || "عنوان البطل"}
      </h1>
      <p
        className="text-xl mb-8 opacity-90"
        style={{ fontFamily: theme.fonts.body }}
      >
        {(content.subtitle as string) || "العنوان الفرعي"}
      </p>
      <p
        className="text-lg mb-8 opacity-80"
        style={{ fontFamily: theme.fonts.body }}
      >
        {(content.description as string) || "الوصف التفصيلي"}
      </p>
      <button
        className="px-8 py-3 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: theme.colors.accent,
          color: "#ffffff",
        }}
      >
        {(content.buttonText as string) || "ابدأ الآن"}
      </button>
    </div>
  </section>
);

// معاينة قسم الخدمات
const ServicesPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => {
  const services = (content.services as Array<Record<string, unknown>>) || [];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {(content.title as string) || "خدماتنا"}
          </h2>
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
          >
            {(content.subtitle as string) || "نقدم مجموعة متنوعة من الخد��ات"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: "#ffffff",
                  }}
                >
                  ⭐
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{
                    fontFamily: theme.fonts.heading,
                    color: theme.colors.text,
                  }}
                >
                  {(service.title as string) || "خدمة"}
                </h3>
                <p
                  className="text-gray-600 mb-4"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {(service.description as string) || "وصف الخدمة"}
                </p>
                {service.price && (
                  <div
                    className="text-lg font-bold"
                    style={{ color: theme.colors.accent }}
                  >
                    {service.price as string}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// معاينة قسم نبذة عنا
const AboutPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => {
  const stats = (content.stats as Array<Record<string, unknown>>) || [];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl font-bold mb-6"
              style={{
                fontFamily: theme.fonts.heading,
                color: theme.colors.text,
              }}
            >
              {(content.title as string) || "نبذة عنا"}
            </h2>
            <p
              className="text-lg text-gray-600 mb-8"
              style={{ fontFamily: theme.fonts.body }}
            >
              {(content.description as string) || "نص تفصيلي عن الشركة..."}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.primary }}
                  >
                    {stat.number as string}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label as string}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {content.image ? (
              <img
                src={content.image as string}
                alt="نبذة عنا"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">صورة نبذة عنا</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// معاينة معرض الصور
const GalleryPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => {
  const images = (content.images as Array<Record<string, unknown>>) || [];
  const columns = (content.columns as number) || 3;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {(content.title as string) || "معرض الصور"}
          </h2>
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
          >
            {(content.subtitle as string) || "شاهد أعمالنا المميزة"}
          </p>
        </div>

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {images.slice(0, 6).map((image, index) => (
            <div key={index} className="aspect-square">
              {image.url ? (
                <img
                  src={image.url as string}
                  alt={(image.alt as string) || `صورة ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">صورة {index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// معاينة آراء العملاء
const TestimonialsPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => {
  const testimonials =
    (content.testimonials as Array<Record<string, unknown>>) || [];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {(content.title as string) || "آراء العملاء"}
          </h2>
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
          >
            {(content.subtitle as string) || "ماذا يقول عملاؤنا عنا"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-gray-200"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image as string}
                      alt={testimonial.name as string}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-gray-500">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {testimonial.name as string}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.position as string}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {testimonial.content as string}
              </p>
              <div className="flex text-yellow-400">
                {Array.from({
                  length: (testimonial.rating as number) || 5,
                }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// معاينة قسم التواصل
const ContactPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => {
  const contactInfo = (content.contactInfo as Record<string, unknown>) || {};

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {(content.title as string) || "تواصل معنا"}
          </h2>
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: theme.fonts.body }}
          >
            {(content.subtitle as string) || "نحن هنا للمساعدة"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">معلومات الاتصال</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  📞
                </span>
                <span>{(contactInfo.phone as string) || "رقم الهاتف"}</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  ✉️
                </span>
                <span>
                  {(contactInfo.email as string) || "البريد الإلكتروني"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  📍
                </span>
                <span>{(contactInfo.address as string) || "العنوان"}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">نموذج التواصل</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="الاسم"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
                <textarea
                  placeholder="الرسالة"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
                <button
                  className="w-full py-3 rounded-lg font-semibold"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: "#ffffff",
                  }}
                  disabled
                >
                  إرسال الرسالة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// معاينة عامة للعناصر الأخرى
const GenericPreview: React.FC<{
  content: Record<string, unknown>;
  theme: SiteData["theme"];
}> = ({ content, theme }) => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2
        className="text-3xl font-bold mb-4"
        style={{
          fontFamily: theme.fonts.heading,
          color: theme.colors.text,
        }}
      >
        عنصر مخصص
      </h2>
      <p
        className="text-lg text-gray-600"
        style={{ fontFamily: theme.fonts.body }}
      >
        {JSON.stringify(content, null, 2)}
      </p>
    </div>
  </section>
);

// عرض الكود
const CodeView: React.FC<{
  siteData: SiteData;
  activePage: SiteData["pages"][0];
}> = ({ siteData, activePage }) => {
  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteData.metadata.title}</title>
    <meta name="description" content="${siteData.metadata.description}">
    <style>
        body {
            font-family: ${siteData.theme.fonts.body};
            color: ${siteData.theme.colors.text};
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        /* تنسيقات إضافية */
    </style>
</head>
<body>
    ${activePage.elements
      .filter((el) => el.visible)
      .sort((a, b) => a.position - b.position)
      .map((element) => `<!-- ${element.type} -->`)
      .join("\n    ")}
</body>
</html>`;
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
      <pre className="text-sm">
        <code>{generateHTML()}</code>
      </pre>
    </div>
  );
};

export default PreviewPane;
