import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Type,
  Image,
  Link,
  Star,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Upload,
  Globe,
  Users,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { SiteElement } from "./context/SiteBuilderContext";

interface ContentEditorProps {
  selectedElement: SiteElement | null;
  onUpdate: (content: Record<string, unknown>) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  selectedElement,
  onUpdate,
}) => {
  const [localContent, setLocalContent] = useState<Record<string, unknown>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // تحديث المحتوى المحلي عند تغيير العنصر المحدد
  React.useEffect(() => {
    if (selectedElement) {
      setLocalContent({ ...selectedElement.content });
      setHasChanges(false);
    }
  }, [selectedElement]);

  // تحديث المحتوى المحلي
  const updateLocalContent = useCallback((key: string, value: unknown) => {
    setLocalContent((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  }, []);

  // حفظ التغييرات
  const saveChanges = useCallback(() => {
    onUpdate(localContent);
    setHasChanges(false);
  }, [localContent, onUpdate]);

  // إعادة تعيين التغييرات
  const resetChanges = useCallback(() => {
    if (selectedElement) {
      setLocalContent({ ...selectedElement.content });
      setHasChanges(false);
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>اختر عنصراً لتحرير محتواه</p>
      </div>
    );
  }

  // تحديد نوع المحرر حسب نوع العنصر
  const renderEditor = () => {
    switch (selectedElement.type) {
      case "hero":
        return (
          <HeroEditor content={localContent} onUpdate={updateLocalContent} />
        );
      case "services":
        return (
          <ServicesEditor
            content={localContent}
            onUpdate={updateLocalContent}
          />
        );
      case "about":
        return (
          <AboutEditor content={localContent} onUpdate={updateLocalContent} />
        );
      case "gallery":
        return (
          <GalleryEditor content={localContent} onUpdate={updateLocalContent} />
        );
      case "testimonials":
        return (
          <TestimonialsEditor
            content={localContent}
            onUpdate={updateLocalContent}
          />
        );
      case "contact":
        return (
          <ContactEditor content={localContent} onUpdate={updateLocalContent} />
        );
      default:
        return (
          <GenericEditor content={localContent} onUpdate={updateLocalContent} />
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* رأس المحرر */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Edit3 className="w-5 h-5 mr-2" />
              تحرير المحتوى
            </CardTitle>
            <Badge variant={hasChanges ? "destructive" : "secondary"}>
              {selectedElement.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              disabled={!hasChanges}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ التغييرات
            </Button>
            <Button
              variant="outline"
              onClick={resetChanges}
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          {hasChanges && (
            <p className="text-sm text-amber-600 mt-2">
              يوجد تغييرات غير محفوظة
            </p>
          )}
        </CardContent>
      </Card>

      {/* محرر المحتوى */}
      {renderEditor()}
    </div>
  );
};

// محرر قسم البطل
const HeroEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>محتوى قسم البطل</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor="hero-title">العنوان الرئيسي</Label>
        <Input
          id="hero-title"
          value={(content.title as string) || ""}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="العنوان الرئيسي الجذاب"
        />
      </div>

      <div>
        <Label htmlFor="hero-subtitle">العنوان الفرعي</Label>
        <Input
          id="hero-subtitle"
          value={(content.subtitle as string) || ""}
          onChange={(e) => onUpdate("subtitle", e.target.value)}
          placeholder="عنوان فرعي مكمل"
        />
      </div>

      <div>
        <Label htmlFor="hero-description">الوصف</Label>
        <Textarea
          id="hero-description"
          value={(content.description as string) || ""}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="وصف تفصيلي عن الخدمة أو المنتج"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hero-button-text">نص الزر</Label>
          <Input
            id="hero-button-text"
            value={(content.buttonText as string) || ""}
            onChange={(e) => onUpdate("buttonText", e.target.value)}
            placeholder="ابدأ الآن"
          />
        </div>
        <div>
          <Label htmlFor="hero-button-link">رابط الزر</Label>
          <Input
            id="hero-button-link"
            value={(content.buttonLink as string) || ""}
            onChange={(e) => onUpdate("buttonLink", e.target.value)}
            placeholder="#"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="hero-bg-image">صورة الخلفية</Label>
        <Input
          id="hero-bg-image"
          value={(content.backgroundImage as string) || ""}
          onChange={(e) => onUpdate("backgroundImage", e.target.value)}
          placeholder="رابط صورة الخلفية"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hero-show-video"
          checked={(content.showVideo as boolean) || false}
          onCheckedChange={(checked) => onUpdate("showVideo", checked)}
        />
        <Label htmlFor="hero-show-video">إظهار فيديو</Label>
      </div>

      {content.showVideo && (
        <div>
          <Label htmlFor="hero-video-url">رابط الفيديو</Label>
          <Input
            id="hero-video-url"
            value={(content.videoUrl as string) || ""}
            onChange={(e) => onUpdate("videoUrl", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}
    </CardContent>
  </Card>
);

// محرر قسم الخدمات
const ServicesEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => {
  const services = (content.services as Array<Record<string, unknown>>) || [];

  const updateService = (index: number, field: string, value: unknown) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    onUpdate("services", updatedServices);
  };

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: "خدمة جديدة",
      description: "وصف الخدمة",
      icon: "star",
      image: "",
      price: "",
      features: [],
    };
    onUpdate("services", [...services, newService]);
  };

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    onUpdate("services", updatedServices);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى قسم الخدمات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="services-title">عنوان القسم</Label>
          <Input
            id="services-title"
            value={(content.title as string) || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="خدماتنا"
          />
        </div>

        <div>
          <Label htmlFor="services-subtitle">العنوان الفرعي</Label>
          <Input
            id="services-subtitle"
            value={(content.subtitle as string) || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="نقدم مجموعة متنوعة من الخدمات"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>الخدمات</Label>
            <Button onClick={addService} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              إضافة خدمة
            </Button>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <Card key={service.id || index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>خدمة {index + 1}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={(service.title as string) || ""}
                      onChange={(e) =>
                        updateService(index, "title", e.target.value)
                      }
                      placeholder="عنوان الخدمة"
                    />
                    <Input
                      value={(service.price as string) || ""}
                      onChange={(e) =>
                        updateService(index, "price", e.target.value)
                      }
                      placeholder="السعر (اختياري)"
                    />
                  </div>

                  <Textarea
                    value={(service.description as string) || ""}
                    onChange={(e) =>
                      updateService(index, "description", e.target.value)
                    }
                    placeholder="وصف الخدمة"
                    rows={3}
                  />

                  <Input
                    value={(service.image as string) || ""}
                    onChange={(e) =>
                      updateService(index, "image", e.target.value)
                    }
                    placeholder="رابط صورة الخدمة"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// محرر قسم نبذة عنا
const AboutEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => {
  const stats = (content.stats as Array<Record<string, unknown>>) || [];

  const updateStat = (index: number, field: string, value: unknown) => {
    const updatedStats = [...stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    onUpdate("stats", updatedStats);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى قسم نبذة عنا</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about-title">العنوان</Label>
          <Input
            id="about-title"
            value={(content.title as string) || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="نبذة عنا"
          />
        </div>

        <div>
          <Label htmlFor="about-subtitle">العنوان الفرعي</Label>
          <Input
            id="about-subtitle"
            value={(content.subtitle as string) || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="تعرف على قصتنا"
          />
        </div>

        <div>
          <Label htmlFor="about-description">الوصف</Label>
          <Textarea
            id="about-description"
            value={(content.description as string) || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="نص تفصيلي عن الشركة..."
            rows={5}
          />
        </div>

        <div>
          <Label htmlFor="about-image">صورة القسم</Label>
          <Input
            id="about-image"
            value={(content.image as string) || ""}
            onChange={(e) => onUpdate("image", e.target.value)}
            placeholder="رابط صورة القسم"
          />
        </div>

        <div>
          <Label className="mb-3 block">الإحصائيات</Label>
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <Input
                  value={(stat.number as string) || ""}
                  onChange={(e) => updateStat(index, "number", e.target.value)}
                  placeholder="100+"
                />
                <Input
                  value={(stat.label as string) || ""}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="عميل راضٍ"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// محرر معرض الصور
const GalleryEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => {
  const images = (content.images as Array<Record<string, unknown>>) || [];

  const updateImage = (index: number, field: string, value: unknown) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    onUpdate("images", updatedImages);
  };

  const addImage = () => {
    const newImage = {
      id: Date.now().toString(),
      url: "",
      alt: "",
      caption: "",
    };
    onUpdate("images", [...images, newImage]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onUpdate("images", updatedImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى معرض الصور</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="gallery-title">عنوان المعرض</Label>
          <Input
            id="gallery-title"
            value={(content.title as string) || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="معرض الصور"
          />
        </div>

        <div>
          <Label htmlFor="gallery-subtitle">العنوان الفرعي</Label>
          <Input
            id="gallery-subtitle"
            value={(content.subtitle as string) || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="شاهد أعمالنا المميزة"
          />
        </div>

        <div>
          <Label htmlFor="gallery-columns">عدد الأعمدة</Label>
          <select
            id="gallery-columns"
            value={(content.columns as number) || 3}
            onChange={(e) => onUpdate("columns", parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value={2}>عمودان</option>
            <option value={3}>ثلاثة أعمدة</option>
            <option value={4}>أربعة أعمدة</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>الصور</Label>
            <Button onClick={addImage} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              إضافة صورة
            </Button>
          </div>

          <div className="space-y-3">
            {images.map((image, index) => (
              <Card key={image.id || index} className="p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>صورة {index + 1}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Input
                    value={(image.url as string) || ""}
                    onChange={(e) => updateImage(index, "url", e.target.value)}
                    placeholder="رابط الصورة"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={(image.alt as string) || ""}
                      onChange={(e) =>
                        updateImage(index, "alt", e.target.value)
                      }
                      placeholder="وصف الصورة"
                    />
                    <Input
                      value={(image.caption as string) || ""}
                      onChange={(e) =>
                        updateImage(index, "caption", e.target.value)
                      }
                      placeholder="تعليق (اختياري)"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// محرر آراء العملاء
const TestimonialsEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => {
  const testimonials =
    (content.testimonials as Array<Record<string, unknown>>) || [];

  const updateTestimonial = (index: number, field: string, value: unknown) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    onUpdate("testimonials", updatedTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      name: "",
      position: "",
      content: "",
      rating: 5,
      image: "",
    };
    onUpdate("testimonials", [...testimonials, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    onUpdate("testimonials", updatedTestimonials);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى آراء العملاء</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="testimonials-title">عنوان القسم</Label>
          <Input
            id="testimonials-title"
            value={(content.title as string) || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="آراء عملائنا"
          />
        </div>

        <div>
          <Label htmlFor="testimonials-subtitle">العنوان الفرعي</Label>
          <Input
            id="testimonials-subtitle"
            value={(content.subtitle as string) || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="ماذا يقول عملاؤنا عنا"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>التقييمات</Label>
            <Button onClick={addTestimonial} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              إضافة تقييم
            </Button>
          </div>

          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id || index} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>تقييم {index + 1}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTestimonial(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={(testimonial.name as string) || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "name", e.target.value)
                      }
                      placeholder="اسم العميل"
                    />
                    <Input
                      value={(testimonial.position as string) || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "position", e.target.value)
                      }
                      placeholder="المنصب"
                    />
                  </div>

                  <Textarea
                    value={(testimonial.content as string) || ""}
                    onChange={(e) =>
                      updateTestimonial(index, "content", e.target.value)
                    }
                    placeholder="نص التقييم"
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={(testimonial.image as string) || ""}
                      onChange={(e) =>
                        updateTestimonial(index, "image", e.target.value)
                      }
                      placeholder="صورة العميل"
                    />
                    <select
                      value={(testimonial.rating as number) || 5}
                      onChange={(e) =>
                        updateTestimonial(
                          index,
                          "rating",
                          parseInt(e.target.value),
                        )
                      }
                      className="p-2 border border-gray-300 rounded-md"
                    >
                      <option value={5}>5 نجوم</option>
                      <option value={4}>4 نجوم</option>
                      <option value={3}>3 نجوم</option>
                      <option value={2}>2 نجوم</option>
                      <option value={1}>1 نجمة</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// محرر قسم التواصل
const ContactEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => {
  const contactInfo = (content.contactInfo as Record<string, unknown>) || {};
  const formFields =
    (content.formFields as Array<Record<string, unknown>>) || [];

  const updateContactInfo = (field: string, value: unknown) => {
    onUpdate("contactInfo", { ...contactInfo, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>محتوى قسم التواصل</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="contact-title">عنوان القسم</Label>
          <Input
            id="contact-title"
            value={(content.title as string) || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="تواصل معنا"
          />
        </div>

        <div>
          <Label htmlFor="contact-subtitle">العنوان الفرعي</Label>
          <Input
            id="contact-subtitle"
            value={(content.subtitle as string) || ""}
            onChange={(e) => onUpdate("subtitle", e.target.value)}
            placeholder="نحن هنا للمساعدة"
          />
        </div>

        <div>
          <Label htmlFor="contact-description">الوصف</Label>
          <Textarea
            id="contact-description"
            value={(content.description as string) || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="لا تتردد في التواصل معنا..."
            rows={3}
          />
        </div>

        <div>
          <Label className="mb-3 block">معلومات الاتصال</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="contact-phone">الهاتف</Label>
              <Input
                id="contact-phone"
                value={(contactInfo.phone as string) || ""}
                onChange={(e) => updateContactInfo("phone", e.target.value)}
                placeholder="+966 50 123 4567"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">البريد الإلكتروني</Label>
              <Input
                id="contact-email"
                value={(contactInfo.email as string) || ""}
                onChange={(e) => updateContactInfo("email", e.target.value)}
                placeholder="info@example.com"
              />
            </div>
          </div>

          <div className="mt-3">
            <Label htmlFor="contact-address">العنوان</Label>
            <Input
              id="contact-address"
              value={(contactInfo.address as string) || ""}
              onChange={(e) => updateContactInfo("address", e.target.value)}
              placeholder="الرياض، المملكة العربية السعودية"
            />
          </div>

          <div className="mt-3">
            <Label htmlFor="contact-hours">ساعات العمل</Label>
            <Input
              id="contact-hours"
              value={(contactInfo.workingHours as string) || ""}
              onChange={(e) =>
                updateContactInfo("workingHours", e.target.value)
              }
              placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="contact-show-map"
            checked={(content.showMap as boolean) || false}
            onCheckedChange={(checked) => onUpdate("showMap", checked)}
          />
          <Label htmlFor="contact-show-map">إظهار الخريطة</Label>
        </div>

        {content.showMap && (
          <div>
            <Label htmlFor="contact-map-location">موقع الخريطة</Label>
            <Input
              id="contact-map-location"
              value={(content.mapLocation as string) || ""}
              onChange={(e) => onUpdate("mapLocation", e.target.value)}
              placeholder="رابط خرائط جوجل أو إحداثيات"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// محرر عام للعناصر الأخرى
const GenericEditor: React.FC<{
  content: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ content, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>محرر المحتوى العام</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <Label htmlFor={key}>{key}</Label>
            {typeof value === "string" ? (
              value.length > 100 ? (
                <Textarea
                  id={key}
                  value={value}
                  onChange={(e) => onUpdate(key, e.target.value)}
                  rows={3}
                />
              ) : (
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => onUpdate(key, e.target.value)}
                />
              )
            ) : typeof value === "boolean" ? (
              <Switch
                id={key}
                checked={value}
                onCheckedChange={(checked) => onUpdate(key, checked)}
              />
            ) : (
              <Input
                id={key}
                value={String(value)}
                onChange={(e) => onUpdate(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default ContentEditor;
