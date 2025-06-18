import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Type,
  Layout,
  Space,
  Shadows,
  Circle,
  Eye,
  RotateCcw,
  Save,
  Copy,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { SiteElement } from "./context/SiteBuilderContext";

interface StyleEditorProps {
  selectedElement: SiteElement | null;
  onUpdate: (styles: Record<string, unknown>) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({
  selectedElement,
  onUpdate,
}) => {
  const [localStyles, setLocalStyles] = useState<Record<string, unknown>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [activeDevice, setActiveDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  // تحديث التنسيقات المحلية عند تغيير العنصر المحدد
  React.useEffect(() => {
    if (selectedElement) {
      setLocalStyles({ ...selectedElement.styles });
      setHasChanges(false);
    }
  }, [selectedElement]);

  // تحديث التنسيقات المحلية
  const updateLocalStyles = useCallback((key: string, value: unknown) => {
    setLocalStyles((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  }, []);

  // حفظ التغييرات
  const saveChanges = useCallback(() => {
    onUpdate(localStyles);
    setHasChanges(false);
  }, [localStyles, onUpdate]);

  // إعادة تعيين التغييرات
  const resetChanges = useCallback(() => {
    if (selectedElement) {
      setLocalStyles({ ...selectedElement.styles });
      setHasChanges(false);
    }
  }, [selectedElement]);

  // نسخ التنسيقات
  const copyStyles = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(localStyles, null, 2));
  }, [localStyles]);

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>اختر عنصراً لتخصيص تنسيقه</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* رأس المحرر */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              محرر التنسيقات
            </CardTitle>
            <Badge variant={hasChanges ? "destructive" : "secondary"}>
              {selectedElement.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* أزرار الأجهزة */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={activeDevice === "desktop" ? "default" : "outline"}
              onClick={() => setActiveDevice("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={activeDevice === "tablet" ? "default" : "outline"}
              onClick={() => setActiveDevice("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={activeDevice === "mobile" ? "default" : "outline"}
              onClick={() => setActiveDevice("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={saveChanges}
              disabled={!hasChanges}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              حفظ التنسيقات
            </Button>
            <Button
              variant="outline"
              onClick={resetChanges}
              disabled={!hasChanges}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={copyStyles}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {hasChanges && (
            <p className="text-sm text-amber-600 mt-2">
              يوجد تغييرات غير محفوظة
            </p>
          )}
        </CardContent>
      </Card>

      {/* تبويبات التنسيق */}
      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">
            <Palette className="w-4 h-4 mr-1" />
            ألوان
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="w-4 h-4 mr-1" />
            خطوط
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="w-4 h-4 mr-1" />
            تخطيط
          </TabsTrigger>
          <TabsTrigger value="effects">
            <Shadow className="w-4 h-4 mr-1" />
            تأثيرات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <ColorsPanel styles={localStyles} onUpdate={updateLocalStyles} />
        </TabsContent>

        <TabsContent value="typography">
          <TypographyPanel styles={localStyles} onUpdate={updateLocalStyles} />
        </TabsContent>

        <TabsContent value="layout">
          <LayoutPanel styles={localStyles} onUpdate={updateLocalStyles} />
        </TabsContent>

        <TabsContent value="effects">
          <EffectsPanel styles={localStyles} onUpdate={updateLocalStyles} />
        </TabsContent>
      </Tabs>

      {/* معاينة التنسيقات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            معاينة التنسيقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-4 border border-gray-200 rounded-lg min-h-[100px] bg-white"
            style={localStyles as React.CSSProperties}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">عنوان تجريبي</h3>
              <p className="text-gray-600">
                هذا نص تجريبي لمعاينة التنسيقات المطبقة على العنصر.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                زر تجريبي
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// لوحة الألوان
const ColorsPanel: React.FC<{
  styles: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ styles, onUpdate }) => {
  const colorPresets = [
    { name: "أزرق", primary: "#3b82f6", secondary: "#64748b" },
    { name: "أخضر", primary: "#10b981", secondary: "#6b7280" },
    { name: "أرجواني", primary: "#8b5cf6", secondary: "#6b7280" },
    { name: "أحمر", primary: "#ef4444", secondary: "#6b7280" },
    { name: "برتقالي", primary: "#f59e0b", secondary: "#6b7280" },
    { name: "وردي", primary: "#ec4899", secondary: "#6b7280" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الألوان</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الألوان المختارة مسبقاً */}
        <div>
          <Label className="mb-3 block">الألوان المُعدة مسبقاً</Label>
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 p-2"
                onClick={() => {
                  onUpdate("backgroundColor", preset.primary);
                  onUpdate("borderColor", preset.secondary);
                }}
              >
                <div className="flex space-x-1 w-full">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: preset.secondary }}
                  />
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* ألوان مخصصة */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bg-color">لون الخلفية</Label>
            <div className="flex space-x-2">
              <Input
                id="bg-color"
                type="color"
                value={(styles.backgroundColor as string) || "#ffffff"}
                onChange={(e) => onUpdate("backgroundColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={(styles.backgroundColor as string) || "#ffffff"}
                onChange={(e) => onUpdate("backgroundColor", e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="text-color">لون النص</Label>
            <div className="flex space-x-2">
              <Input
                id="text-color"
                type="color"
                value={(styles.color as string) || "#000000"}
                onChange={(e) => onUpdate("color", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={(styles.color as string) || "#000000"}
                onChange={(e) => onUpdate("color", e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="border-color">لون الحدود</Label>
            <div className="flex space-x-2">
              <Input
                id="border-color"
                type="color"
                value={(styles.borderColor as string) || "#e5e7eb"}
                onChange={(e) => onUpdate("borderColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={(styles.borderColor as string) || "#e5e7eb"}
                onChange={(e) => onUpdate("borderColor", e.target.value)}
                placeholder="#e5e7eb"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accent-color">لون مميز</Label>
            <div className="flex space-x-2">
              <Input
                id="accent-color"
                type="color"
                value={(styles.accentColor as string) || "#3b82f6"}
                onChange={(e) => onUpdate("accentColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={(styles.accentColor as string) || "#3b82f6"}
                onChange={(e) => onUpdate("accentColor", e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* شفافية الخلفية */}
        <div>
          <Label>شفافية الخلفية</Label>
          <div className="mt-2">
            <Slider
              value={[(parseFloat(styles.opacity as string) || 1) * 100]}
              onValueChange={([value]) => onUpdate("opacity", value / 100)}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>شفاف</span>
              <span>
                {Math.round((parseFloat(styles.opacity as string) || 1) * 100)}%
              </span>
              <span>معتم</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// لوحة الخطوط
const TypographyPanel: React.FC<{
  styles: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ styles, onUpdate }) => {
  const arabicFonts = [
    "Cairo",
    "Tajawal",
    "Amiri",
    "Noto Sans Arabic",
    "IBM Plex Sans Arabic",
    "Almarai",
    "Markazi Text",
  ];

  const fontSizes = [
    { label: "صغير جداً", value: "12px" },
    { label: "صغير", value: "14px" },
    { label: "عادي", value: "16px" },
    { label: "متوسط", value: "18px" },
    { label: "كبير", value: "24px" },
    { label: "كبير جداً", value: "32px" },
    { label: "عنوان", value: "48px" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات الخطوط</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="font-family">نوع الخط</Label>
          <select
            id="font-family"
            value={(styles.fontFamily as string) || "Cairo"}
            onChange={(e) => onUpdate("fontFamily", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {arabicFonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="font-size">حجم الخط</Label>
            <select
              id="font-size"
              value={(styles.fontSize as string) || "16px"}
              onChange={(e) => onUpdate("fontSize", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="font-weight">سُمك الخط</Label>
            <select
              id="font-weight"
              value={(styles.fontWeight as string) || "normal"}
              onChange={(e) => onUpdate("fontWeight", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="300">رفيع</option>
              <option value="400">عادي</option>
              <option value="500">متوسط</option>
              <option value="600">سميك</option>
              <option value="700">سميك جداً</option>
              <option value="800">سميك للغاية</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="text-align">محاذاة النص</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {["right", "center", "left", "justify"].map((align) => (
              <Button
                key={align}
                size="sm"
                variant={styles.textAlign === align ? "default" : "outline"}
                onClick={() => onUpdate("textAlign", align)}
              >
                {align === "right" && "يمين"}
                {align === "center" && "وسط"}
                {align === "left" && "يسار"}
                {align === "justify" && "ضبط"}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>تباعد الأسطر</Label>
          <div className="mt-2">
            <Slider
              value={[parseFloat(styles.lineHeight as string) || 1.5]}
              onValueChange={([value]) =>
                onUpdate("lineHeight", value.toString())
              }
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>ضيق</span>
              <span>
                {(parseFloat(styles.lineHeight as string) || 1.5).toFixed(1)}
              </span>
              <span>واسع</span>
            </div>
          </div>
        </div>

        <div>
          <Label>تباعد الحروف</Label>
          <div className="mt-2">
            <Slider
              value={[parseFloat(styles.letterSpacing as string) || 0]}
              onValueChange={([value]) =>
                onUpdate("letterSpacing", `${value}px`)
              }
              min={-2}
              max={5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>ضيق</span>
              <span>{parseFloat(styles.letterSpacing as string) || 0}px</span>
              <span>واسع</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// لوحة التخطيط
const LayoutPanel: React.FC<{
  styles: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ styles, onUpdate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات التخطيط</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الحشو (Padding) */}
        <div>
          <Label className="mb-3 block">الحشو الداخلي</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="padding-top" className="text-sm">
                أعلى
              </Label>
              <Input
                id="padding-top"
                value={(styles.paddingTop as string) || "0"}
                onChange={(e) => onUpdate("paddingTop", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="padding-bottom" className="text-sm">
                أسفل
              </Label>
              <Input
                id="padding-bottom"
                value={(styles.paddingBottom as string) || "0"}
                onChange={(e) => onUpdate("paddingBottom", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="padding-right" className="text-sm">
                يمين
              </Label>
              <Input
                id="padding-right"
                value={(styles.paddingRight as string) || "0"}
                onChange={(e) => onUpdate("paddingRight", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="padding-left" className="text-sm">
                يسار
              </Label>
              <Input
                id="padding-left"
                value={(styles.paddingLeft as string) || "0"}
                onChange={(e) => onUpdate("paddingLeft", e.target.value)}
                placeholder="0px"
              />
            </div>
          </div>
        </div>

        {/* الهوامش (Margin) */}
        <div>
          <Label className="mb-3 block">الهوامش الخارجية</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="margin-top" className="text-sm">
                أعلى
              </Label>
              <Input
                id="margin-top"
                value={(styles.marginTop as string) || "0"}
                onChange={(e) => onUpdate("marginTop", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="margin-bottom" className="text-sm">
                أسفل
              </Label>
              <Input
                id="margin-bottom"
                value={(styles.marginBottom as string) || "0"}
                onChange={(e) => onUpdate("marginBottom", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="margin-right" className="text-sm">
                يمين
              </Label>
              <Input
                id="margin-right"
                value={(styles.marginRight as string) || "0"}
                onChange={(e) => onUpdate("marginRight", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="margin-left" className="text-sm">
                يسار
              </Label>
              <Input
                id="margin-left"
                value={(styles.marginLeft as string) || "0"}
                onChange={(e) => onUpdate("marginLeft", e.target.value)}
                placeholder="0px"
              />
            </div>
          </div>
        </div>

        {/* الحدود */}
        <div>
          <Label className="mb-3 block">الحدود</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="border-width" className="text-sm">
                العرض
              </Label>
              <Input
                id="border-width"
                value={(styles.borderWidth as string) || "0"}
                onChange={(e) => onUpdate("borderWidth", e.target.value)}
                placeholder="0px"
              />
            </div>
            <div>
              <Label htmlFor="border-style" className="text-sm">
                النوع
              </Label>
              <select
                id="border-style"
                value={(styles.borderStyle as string) || "solid"}
                onChange={(e) => onUpdate("borderStyle", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="solid">صلب</option>
                <option value="dashed">متقطع</option>
                <option value="dotted">منقط</option>
                <option value="double">مزدوج</option>
              </select>
            </div>
            <div>
              <Label htmlFor="border-radius" className="text-sm">
                التقويس
              </Label>
              <Input
                id="border-radius"
                value={(styles.borderRadius as string) || "0"}
                onChange={(e) => onUpdate("borderRadius", e.target.value)}
                placeholder="0px"
              />
            </div>
          </div>
        </div>

        {/* العرض والارتفاع */}
        <div>
          <Label className="mb-3 block">الأبعاد</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-sm">
                العرض
              </Label>
              <Input
                id="width"
                value={(styles.width as string) || "auto"}
                onChange={(e) => onUpdate("width", e.target.value)}
                placeholder="auto"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-sm">
                الارتفاع
              </Label>
              <Input
                id="height"
                value={(styles.height as string) || "auto"}
                onChange={(e) => onUpdate("height", e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
        </div>

        {/* الموضع */}
        <div>
          <Label htmlFor="position">الموضع</Label>
          <select
            id="position"
            value={(styles.position as string) || "relative"}
            onChange={(e) => onUpdate("position", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="static">ثابت</option>
            <option value="relative">نسبي</option>
            <option value="absolute">مطلق</option>
            <option value="fixed">ثابت في الشاشة</option>
            <option value="sticky">لاصق</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

// لوحة التأثيرات
const EffectsPanel: React.FC<{
  styles: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
}> = ({ styles, onUpdate }) => {
  const shadowPresets = [
    { name: "بلا ظل", value: "none" },
    { name: "ظل خفيف", value: "0 1px 3px rgba(0, 0, 0, 0.1)" },
    { name: "ظل متوسط", value: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    { name: "ظل كبير", value: "0 10px 15px rgba(0, 0, 0, 0.1)" },
    { name: "ظل ضخم", value: "0 25px 50px rgba(0, 0, 0, 0.25)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>التأثيرات البصرية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* الظلال */}
        <div>
          <Label className="mb-3 block">الظلال</Label>
          <div className="grid grid-cols-1 gap-2">
            {shadowPresets.map((preset, index) => (
              <Button
                key={index}
                variant={
                  styles.boxShadow === preset.value ? "default" : "outline"
                }
                className="justify-start"
                onClick={() => onUpdate("boxShadow", preset.value)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* ظل مخصص */}
        <div>
          <Label htmlFor="custom-shadow">ظل مخصص</Label>
          <Input
            id="custom-shadow"
            value={(styles.boxShadow as string) || ""}
            onChange={(e) => onUpdate("boxShadow", e.target.value)}
            placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
          />
        </div>

        {/* التحويلات */}
        <div>
          <Label className="mb-3 block">التحويلات</Label>

          <div className="space-y-3">
            <div>
              <Label>التدوير (درجة)</Label>
              <Slider
                value={[parseFloat(styles.rotateZ as string) || 0]}
                onValueChange={([value]) => onUpdate("rotateZ", `${value}deg`)}
                min={-180}
                max={180}
                step={1}
                className="w-full mt-2"
              />
              <div className="text-center text-sm text-gray-500 mt-1">
                {parseFloat(styles.rotateZ as string) || 0}°
              </div>
            </div>

            <div>
              <Label>التكبير</Label>
              <Slider
                value={[parseFloat(styles.scale as string) || 1]}
                onValueChange={([value]) => onUpdate("scale", value.toString())}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full mt-2"
              />
              <div className="text-center text-sm text-gray-500 mt-1">
                {(parseFloat(styles.scale as string) || 1).toFixed(1)}x
              </div>
            </div>
          </div>
        </div>

        {/* التدرجات */}
        <div>
          <Label htmlFor="gradient">تدرج الخلفية</Label>
          <select
            id="gradient"
            value={(styles.backgroundImage as string) || "none"}
            onChange={(e) => onUpdate("backgroundImage", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="none">بلا تدرج</option>
            <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              أزرق إلى بنفسجي
            </option>
            <option value="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              وردي إلى أحمر
            </option>
            <option value="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              أزرق فاتح
            </option>
            <option value="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              أخضر إلى سماوي
            </option>
          </select>
        </div>

        {/* الانتقالات */}
        <div>
          <Label htmlFor="transition">مدة الانتقال</Label>
          <select
            id="transition"
            value={(styles.transition as string) || "none"}
            onChange={(e) => onUpdate("transition", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="none">بلا انتقال</option>
            <option value="all 0.2s ease">سريع (0.2 ثانية)</option>
            <option value="all 0.3s ease">عادي (0.3 ثانية)</option>
            <option value="all 0.5s ease">بطيء (0.5 ثانية)</option>
            <option value="all 1s ease">بطيء جداً (1 ثانية)</option>
          </select>
        </div>

        {/* الفلاتر */}
        <div>
          <Label className="mb-3 block">المرشحات</Label>

          <div className="space-y-3">
            <div>
              <Label>الضبابية</Label>
              <Slider
                value={[parseFloat(styles.blur as string) || 0]}
                onValueChange={([value]) => onUpdate("blur", `${value}px`)}
                min={0}
                max={10}
                step={0.5}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label>السطوع</Label>
              <Slider
                value={[parseFloat(styles.brightness as string) || 100]}
                onValueChange={([value]) => onUpdate("brightness", `${value}%`)}
                min={0}
                max={200}
                step={10}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label>التشبع</Label>
              <Slider
                value={[parseFloat(styles.saturate as string) || 100]}
                onValueChange={([value]) => onUpdate("saturate", `${value}%`)}
                min={0}
                max={200}
                step={10}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleEditor;
