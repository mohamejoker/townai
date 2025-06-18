import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Settings,
  Eye,
  Save,
  Upload,
  Download,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  Palette,
  Type,
  Image,
  Layout,
  Zap,
  Sparkles,
  Copy,
  Trash2,
  EyeOff,
  GripVertical,
  Plus,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

import DragDropBuilder from "./DragDropBuilder";
import TemplateManager from "./TemplateManager";
import ContentEditor from "./ContentEditor";
import StyleEditor from "./StyleEditor";
import PreviewPane from "./PreviewPane";
import AIAssistant from "./AIAssistant";
import { useSiteBuilder } from "./hooks/useSiteBuilder";
import { SiteBuilderProvider } from "./context/SiteBuilderContext";

const AdvancedSiteBuilder: React.FC = () => {
  const {
    siteData,
    updateSiteData,
    selectedElement,
    setSelectedElement,
    history,
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject,
    loadProject,
    exportProject,
    importProject,
  } = useSiteBuilder();

  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      await saveProject();
      // إظهار رسالة نجاح
    } catch (error) {
      console.error("Error saving project:", error);
      // إظهار رسالة خطأ
    }
  }, [saveProject]);

  const handleExport = useCallback(async () => {
    try {
      const exportData = await exportProject();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${siteData.metadata.title || "website"}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting project:", error);
    }
  }, [exportProject, siteData.metadata.title]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importData = JSON.parse(content);
          await importProject(importData);
          // إظهار رسالة نجاح
        } catch (error) {
          console.error("Error importing project:", error);
          // إظهار رسالة خطأ
        }
      };
      reader.readAsText(file);
    },
    [importProject],
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* الشريط الجانبي - أدوات التصميم */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* رأس الشريط الجانبي */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">منشئ المواقع</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              متطور
            </Badge>
          </div>

          {/* أزرار الأدوات الرئيسية */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" asChild>
              <label htmlFor="import-file">
                <Upload className="w-4 h-4" />
              </label>
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>

          {/* أزرار المعاينة */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={previewMode === "desktop" ? "default" : "outline"}
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "tablet" ? "default" : "outline"}
              onClick={() => setPreviewMode("tablet")}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={previewMode === "mobile" ? "default" : "outline"}
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <Button
            className="w-full"
            variant={showPreview ? "secondary" : "default"}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "إخفاء المعاينة" : "معاينة الموقع"}
          </Button>
        </div>

        {/* تبويبات الأدوات */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-4 p-2 m-2">
            <TabsTrigger value="design" className="text-xs">
              <Layout className="w-4 h-4 mr-1" />
              تصميم
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs">
              <Type className="w-4 h-4 mr-1" />
              محتوى
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              <Palette className="w-4 h-4 mr-1" />
              تنسيق
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              إعدادات
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="design" className="p-4 space-y-4">
              <DragDropBuilder />
            </TabsContent>

            <TabsContent value="content" className="p-4 space-y-4">
              <ContentEditor
                selectedElement={selectedElement}
                onUpdate={(content) => {
                  if (selectedElement) {
                    updateSiteData({
                      type: "UPDATE_ELEMENT",
                      elementId: selectedElement.id,
                      data: { content },
                    });
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="style" className="p-4 space-y-4">
              <StyleEditor
                selectedElement={selectedElement}
                onUpdate={(styles) => {
                  if (selectedElement) {
                    updateSiteData({
                      type: "UPDATE_ELEMENT",
                      elementId: selectedElement.id,
                      data: { styles },
                    });
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <SiteSettings />
            </TabsContent>
          </div>
        </Tabs>

        {/* مساعد الذكاء الاصطناعي */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAIHelper(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            مساعد ذكي
          </Button>
        </div>
      </div>

      {/* منطقة التصميم الرئيسية */}
      <div className="flex-1 flex flex-col">
        {/* شريط الأدوات العلوي */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                {siteData.metadata.title || "موقع جديد"}
              </h1>
              <Badge variant="outline">{siteData.pages.length} صفحة</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة تحميل
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIHelper(true)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                مساعدة
              </Button>
            </div>
          </div>
        </div>

        {/* منطقة المعاينة */}
        <div className="flex-1 p-4">
          <PreviewPane
            siteData={siteData}
            previewMode={previewMode}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            showPreview={showPreview}
          />
        </div>
      </div>

      {/* قوالب الموقع */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed top-4 left-4 z-50">
            <Layout className="w-4 h-4 mr-2" />
            القوالب
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-96">
          <SheetHeader>
            <SheetTitle>قوالب المواقع</SheetTitle>
          </SheetHeader>
          <TemplateManager
            onSelectTemplate={(template) => {
              updateSiteData({
                type: "LOAD_TEMPLATE",
                template,
              });
            }}
          />
        </SheetContent>
      </Sheet>

      {/* مساعد الذكاء الاصطناعي */}
      {showAIHelper && (
        <AIAssistant
          siteData={siteData}
          onSuggestion={(suggestion) => {
            updateSiteData({
              type: "APPLY_SUGGESTION",
              suggestion,
            });
          }}
          onClose={() => setShowAIHelper(false)}
        />
      )}
    </div>
  );
};

// مكون إعدادات الموقع
const SiteSettings: React.FC = () => {
  const { siteData, updateSiteData } = useSiteBuilder();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            إعدادات عامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site-title">عنوان الموقع</Label>
            <Input
              id="site-title"
              value={siteData.metadata.title}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_METADATA",
                  data: { title: e.target.value },
                })
              }
              placeholder="اسم موقعك"
            />
          </div>

          <div>
            <Label htmlFor="site-description">وصف الموقع</Label>
            <Textarea
              id="site-description"
              value={siteData.metadata.description}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_METADATA",
                  data: { description: e.target.value },
                })
              }
              placeholder="وصف مختصر عن موقعك"
            />
          </div>

          <div>
            <Label htmlFor="site-logo">رابط الشعار</Label>
            <Input
              id="site-logo"
              value={siteData.metadata.logo}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_METADATA",
                  data: { logo: e.target.value },
                })
              }
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <Label htmlFor="site-favicon">رابط الأيقونة</Label>
            <Input
              id="site-favicon"
              value={siteData.metadata.favicon}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_METADATA",
                  data: { favicon: e.target.value },
                })
              }
              placeholder="https://example.com/favicon.ico"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            ألوان الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">اللون الأساسي</Label>
              <div className="flex space-x-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={siteData.theme.colors.primary}
                  onChange={(e) =>
                    updateSiteData({
                      type: "UPDATE_THEME",
                      data: {
                        colors: {
                          ...siteData.theme.colors,
                          primary: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={siteData.theme.colors.primary}
                  onChange={(e) =>
                    updateSiteData({
                      type: "UPDATE_THEME",
                      data: {
                        colors: {
                          ...siteData.theme.colors,
                          primary: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary-color">اللون الثانوي</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={siteData.theme.colors.secondary}
                  onChange={(e) =>
                    updateSiteData({
                      type: "UPDATE_THEME",
                      data: {
                        colors: {
                          ...siteData.theme.colors,
                          secondary: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={siteData.theme.colors.secondary}
                  onChange={(e) =>
                    updateSiteData({
                      type: "UPDATE_THEME",
                      data: {
                        colors: {
                          ...siteData.theme.colors,
                          secondary: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="#666666"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Type className="w-5 h-5 mr-2" />
            خطوط الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heading-font">خط العناوين</Label>
            <select
              id="heading-font"
              value={siteData.theme.fonts.heading}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_THEME",
                  data: {
                    fonts: {
                      ...siteData.theme.fonts,
                      heading: e.target.value,
                    },
                  },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Cairo">Cairo</option>
              <option value="Tajawal">Tajawal</option>
              <option value="Amiri">Amiri</option>
              <option value="Noto Sans Arabic">Noto Sans Arabic</option>
            </select>
          </div>

          <div>
            <Label htmlFor="body-font">خط النص</Label>
            <select
              id="body-font"
              value={siteData.theme.fonts.body}
              onChange={(e) =>
                updateSiteData({
                  type: "UPDATE_THEME",
                  data: {
                    fonts: {
                      ...siteData.theme.fonts,
                      body: e.target.value,
                    },
                  },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Cairo">Cairo</option>
              <option value="Tajawal">Tajawal</option>
              <option value="Amiri">Amiri</option>
              <option value="Noto Sans Arabic">Noto Sans Arabic</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// المكون الرئيسي مع Provider
const AdvancedSiteBuilderWithProvider: React.FC = () => (
  <SiteBuilderProvider>
    <AdvancedSiteBuilder />
  </SiteBuilderProvider>
);

export default AdvancedSiteBuilderWithProvider;
