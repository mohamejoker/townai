# 📚 التوثيق الشامل للمشروع - Town Media Platform

**المطور:** محمد سليم  
**الإصدار:** 2.0.0  
**تاريخ التحديث:** ديسمبر 2024

---

## 🎯 نظرة عامة على المشروع

منصة Town Media هي منصة متكاملة لزيادة المتابعين والتفاعل على مواقع التواصل الاجتماعي، مع نظام منشئ مواقع متقدم مدعوم بالذكاء الاصطناعي.

### المميزات الرئيسية:

- 🚀 **منصة خدمات SMM شاملة** - خدمات لجميع منصات التواصل
- 🤖 **ذكاء اصطناعي متقدم** - مساعد ذكي للمحادثة والتصميم
- 🌐 **منشئ مواقع بالسحب والإفلات** - أداة قوية لإنشاء المواقع
- 📱 **تصميم متجاوب بالكامل** - يعمل على جميع الأجهزة
- 🎨 **نظام تصميم موحد** - مكونات UI متسقة
- 💳 **أنظمة دفع متعددة** - فودافون كاش، عملات رقمية، كروت

---

## 🏗️ البنية التقنية

### التقنيات المستخدمة:

```json
{
  "Frontend": "React 18.3.1 + TypeScript",
  "Build Tool": "Vite 5.4.1",
  "UI Library": "Shadcn/ui + Radix UI",
  "Styling": "Tailwind CSS 3.4.11",
  "State Management": "React Context + useReducer",
  "Forms": "React Hook Form + Zod",
  "Icons": "Lucide React",
  "Charts": "Recharts",
  "Backend": "Supabase",
  "Animations": "Framer Motion"
}
```

### هيكل المجلدات:

```
src/
├── components/              # المكونات القابلة لإعادة الاستخدام
│   ├── SiteBuilder/        # نظام منشئ المواقع المتقدم
│   ├── Admin/              # مكونات لوحة الإدارة
│   ├── AI/                 # مكونات الذكاء الاصطناعي
│   ├── Payment/            # أنظمة الدفع
│   ├── Frontend/           # مكونات الواجهة الأمامية
│   └── ui/                 # مكونات UI الأساسية
├── pages/                  # صفحات التطبيق
├── services/               # خدمات API والمنطق التجاري
├── contexts/               # Context providers
├── hooks/                  # Custom React hooks
├── types/                  # تعريفات TypeScript
└── utils/                  # وظائف مساعدة
```

---

## 🌟 نظام منشئ المواقع المتقدم

### المكونات الأساسية:

#### 1. **AdvancedSiteBuilder.tsx** - المكون الرئيسي

```typescript
// المميزات:
- واجهة سحب وإفلات متقدمة
- معاينة في الوقت الفعلي
- نظام تراجع وإعادة (Undo/Redo)
- دعم للأجهزة المختلفة (Desktop/Tablet/Mobile)
- مساعد ذكي مدمج
```

#### 2. **SiteBuilderContext.tsx** - إدارة الحالة

```typescript
interface SiteData {
  metadata: SiteMetadata; // معلومات الموقع
  theme: SiteTheme; // نظام الألوان والخطوط
  pages: SitePage[]; // صفحات الموقع
  activePage: string; // الصفحة النشطة
  settings: SiteSettings; // إعدادات عامة
}
```

#### 3. **DragDropBuilder.tsx** - أداة السحب والإفلات

```typescript
// العناصر المتاحة:
- Hero Section (قسم البطل)
- Services (الخدمات)
- About (نبذة عنا)
- Gallery (معرض الصور)
- Testimonials (آراء العملاء)
- Contact (التواصل)
```

#### 4. **ContentEditor.tsx** - محرر المحتوى

```typescript
// مميزات المحرر:
- تحرير محتوى كل عنصر منفصلاً
- واجهات مخصصة لكل نوع عنصر
- معاينة فورية للتغييرات
- حفظ تلقائي
```

#### 5. **StyleEditor.tsx** - محرر التنسيقات

```typescript
// أقسام التنسيق:
- Colors (الألوان)
- Typography (الخطوط)
- Layout (التخطيط)
- Effects (التأثيرات البصرية)
```

#### 6. **TemplateManager.tsx** - إدارة القوالب

```typescript
// القوالب المتاحة:
- Business Corporate (شركة تجارية)
- E-commerce Store (متجر إلكتروني)
- Creative Portfolio (معرض إبداعي)
```

#### 7. **AIAssistant.tsx** - المساعد الذكي

```typescript
// الإجراءات السريعة:
- تحليل شامل للموقع
- اقتراحات تحسين الألوان
- تحسين المحتوى
- تحسين SEO
- تحليل التخطيط
```

---

## 🎨 نظام التصميم

### الألوان الأساسية:

```css
:root {
  --primary: #3b82f6; /* الأزرق الأساسي */
  --secondary: #64748b; /* الرمادي الثانوي */
  --accent: #f59e0b; /* الذهبي المميز */
  --background: #ffffff; /* خلفية بيضاء */
  --text: #1f2937; /* نص رمادي داكن */
}
```

### الخطوط:

```css
.font-arabic {
  font-family: "Cairo", "Tajawal", "Amiri", sans-serif;
}
```

### نقاط الاستجابة:

```css
/* Mobile First Approach */
.container {
  /* Mobile: < 640px */
  padding: 1rem;
}

@media (min-width: 640px) {
  /* sm */
  .container {
    padding: 1.5rem;
  }
}

@media (min-width: 768px) {
  /* md */
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  /* lg */
  .container {
    padding: 2.5rem;
  }
}

@media (min-width: 1280px) {
  /* xl */
  .container {
    padding: 3rem;
  }
}
```

---

## 🔧 دليل التطوير

### إعداد البيئة:

```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview
```

### إضافة مكون جديد:

```typescript
// 1. إنشاء ملف المكون
// src/components/MyComponent/MyComponent.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MyComponentProps {
  title: string;
  description?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description
}) => {
  return (
    <Card>
      <CardContent>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </CardContent>
    </Card>
  );
};

export default MyComponent;
```

### إضافة صفحة جديدة:

```typescript
// 1. إنشاء ملف الصفحة
// src/pages/MyPage.tsx

import React from 'react';

const MyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1>صفحتي الجديدة</h1>
    </div>
  );
};

export default MyPage;

// 2. إضافة المسار في App.tsx
<Route path="/my-page" element={<MyPage />} />
```

---

## 📊 إدارة الحالة

### استخدام SiteBuilder Context:

```typescript
import { useSiteBuilder } from '@/components/SiteBuilder/context/SiteBuilderContext';

const MyComponent: React.FC = () => {
  const {
    siteData,
    updateSiteData,
    selectedElement,
    setSelectedElement,
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject
  } = useSiteBuilder();

  const handleUpdateElement = () => {
    updateSiteData({
      type: 'UPDATE_ELEMENT',
      elementId: 'element-id',
      data: { title: 'عنوان جديد' }
    });
  };

  return (
    // JSX content
  );
};
```

### أنواع الإجراءات المتاحة:

```typescript
type SiteBuilderAction =
  | { type: "UPDATE_METADATA"; data: Partial<SiteMetadata> }
  | { type: "UPDATE_THEME"; data: Partial<SiteTheme> }
  | { type: "ADD_ELEMENT"; pageId: string; element: SiteElement }
  | { type: "UPDATE_ELEMENT"; elementId: string; data: Partial<SiteElement> }
  | { type: "DELETE_ELEMENT"; elementId: string }
  | { type: "REORDER_ELEMENTS"; pageId: string; elementIds: string[] }
  | { type: "UNDO" }
  | { type: "REDO" };
```

---

## 🔌 API والخدمات

### هيكل الخدمات:

```
src/services/
├── ai/                     # خدمات الذكاء الاصطناعي
│   ├── chatPlansService.ts
│   ├── conversationManager.ts
│   └── imageAnalyzer.ts
├── payment/               # خدمات الدفع
│   ├── paymentService.ts
│   ├── egyptianPaymentService.ts
│   └── enhancedPaymentService.ts
├── admin/                 # خدمات الإدارة
├── analytics/             # خدمات التحليلات
└── seo/                   # خدمات تحسين محركات البحث
```

### استخدام خدمة الدفع:

```typescript
import { paymentService } from "@/services/payment/paymentService";

const processPayment = async () => {
  try {
    const result = await paymentService.processPayment({
      amount: 100,
      method: "vodafone-cash",
      currency: "SAR",
    });
    console.log("تم الدفع بنجاح:", result);
  } catch (error) {
    console.error("خطأ في الدفع:", error);
  }
};
```

---

## 🚀 النشر والإنتاج

### متطلبات النشر:

1. **Node.js 18+**
2. **npm أو yarn**
3. **خادم ويب (Nginx/Apache)**
4. **قاعدة بيانات Supabase**

### خطوات النشر:

```bash
# 1. بناء المشروع
npm run build

# 2. رفع ملفات dist/ إلى الخادم
# 3. إعداد nginx.conf:

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://your-api-server;
    }
}
```

### متغيرات البيئة:

```env
# .env.production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://api.yoursite.com
VITE_ENVIRONMENT=production
```

---

## 🧪 الاختبارات والجودة

### أنوا�� الاختبارات:

1. **Unit Tests** - اختبار المكونات المفردة
2. **Integration Tests** - اختبار التكامل
3. **E2E Tests** - اختبار شامل للمستخدم

### أدوات الجودة:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## 📈 مقاييس الأداء

### أهداف الأداء:

- ⚡ **وقت التحميل الأولي:** < 3 ثواني
- 📱 **Core Web Vitals:** جميع المقاييس خضراء
- 🔍 **SEO Score:** 90+
- ♿ **Accessibility:** AA compliance
- 📊 **Bundle Size:** < 500KB (gzipped)

### أدوات المراقبة:

```typescript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 🔒 الأمان والحماية

### ممارسات الأمان:

1. **Input Validation** - فحص جميع المدخلات
2. **XSS Protection** - حماية من هجمات XSS
3. **CSRF Protection** - حماية من هجمات CSRF
4. **Content Security Policy** - سياسة أمان المحتوى

### تشفير البيانات:

```typescript
// مثال على تشفير البيانات الحساسة
import CryptoJS from "crypto-js";

const encryptData = (data: string, key: string) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

const decryptData = (encryptedData: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

---

## 🛠️ استكشاف الأخطاء وإصلاحها

### الأخطاء الشائعة:

#### 1. مشكلة Hydration في React

```typescript
// الحل: استخدام useEffect
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

#### 2. مشكلة CORS

```typescript
// إعداد Vite
export default defineConfig({
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
```

#### 3. مشكلة Bundle Size كبير

```typescript
// تقسيم الكود
const LazyComponent = lazy(() => import("./LazyComponent"));

// استخدام dynamic imports
const loadComponent = async () => {
  const { default: Component } = await import("./Component");
  return Component;
};
```

---

## 📞 الدعم والمساعدة

### قنوات التواصل:

- 📧 **البريد الإلكتروني:** mohammed.saleem@townmedia.sa
- 💬 **واتساب:** +966 50 123 4567
- 🐦 **تويتر:** @townmedia_sa
- 💼 **لينكد إن:** /company/townmedia

### الوثائق الإضافية:

- [دليل المطور السريع](./docs/quick-start.md)
- [API Reference](./docs/api-reference.md)
- [أمثلة التطبيق](./docs/examples.md)
- [الأسئلة الشائعة](./docs/faq.md)

---

## 📝 سجل التحديثات

### الإصدار 2.0.0 (ديسمبر 2024)

- ✨ إضافة نظام منشئ الموا��ع المتقدم
- 🤖 تحسين المساعد الذكي
- 🎨 نظام تصميم موحد جديد
- 📱 تحسينات الاستجابة
- 🔧 تحسينات الأداء

### الإصدار 1.5.0 (نوفمبر 2024)

- 💳 إضافة أنظمة دفع جديدة
- 📊 لوحة تحكم محسنة
- 🔒 تحسينات الأمان
- 🐛 إصلاح العديد من الأخطاء

---

## 🎯 الخطة المستقبلية

### المرحلة القادمة (Q1 2025):

- 🌍 **التوسع الدولي** - دعم لغات متعددة
- 📱 **تطبيق الموبايل** - iOS و Android
- 🤖 **ذكاء اصطناعي متقدم** - GPT-4 integration
- ⚡ **تحسينات الأداء** - SSR و ISR
- 🔄 **Real-time Collaboration** - تعاون في الوقت الفعلي

### المرحلة الثانية (Q2 2025):

- 🛒 **E-commerce Integration** - متجر إلكتروني متكامل
- 📊 **Advanced Analytics** - تحليلات معمقة
- 🎨 **Design System 2.0** - نظام تصميم متطور
- 🔐 **Enterprise Security** - أمان متقدم للشركات

---

**© 2024 Town Media Platform. جميع الحقوق محفوظة.**  
**تطوير: محمد سليم | مع الحب من المملكة العربية السعودية 🇸🇦**
