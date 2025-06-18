# 🚀 Town Media Platform - منصة تاون ميديا

**منصة شاملة لخدمات وسائل التواصل الاجتماعي مع منشئ مواقع متقدم**

[![النسخة](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/townmedia/platform)
[![الترخيص](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-yellow.svg)](https://vitejs.dev/)

---

## 🌟 المميزات الرئيسية

### 📱 خدمات وسائل التواصل الاجتماعي

- **زيادة المتابعين** على جميع المنصات (Instagram, TikTok, YouTube, Facebook, Twitter, Snapchat)
- **تحليل الحسابات** بالذكاء الاصطناعي
- **حملات تسويقية** مخصصة
- **إحصائيات تفصيلية** لمراقبة النمو

### 🌐 منشئ المواقع المتقدم

- **سحب وإفلات سهل** لبناء المواقع
- **قوالب جاهزة** احترافية (شركات، متاجر، معارض أعمال)
- **مساعد ذكي** لاقتراحات التحسين
- **معاينة متجاوبة** لجميع الأجهزة
- **تصدير واستيراد** المشاريع

### 🤖 الذكاء الاصطناعي

- **مساعد محادثة ذكي** لخدمة العملاء
- **تحليل المحتوى** وتوليد اقتراحات
- **تحسين SEO** تلقائياً
- **تصميم ذكي** للواجهات

### 💳 أنظمة دفع متعددة

- **فودافون كاش** للدفع المحلي
- **العملات الرقمية** (Bitcoin, Ethereum, USDT)
- **الكروت البنكية** العالمية
- **محافظ إلكترونية** متنوعة

---

## 🛠️ التقنيات المستخدمة

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

---

## 🚀 البدء السريع

### متطلبات النظام

- **Node.js** 18.0.0 أو أحدث
- **npm** 8.0.0 أو أحدث (أو yarn/pnpm)

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/townmedia/platform.git
cd platform

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local

# تشغيل الخادم المحلي
npm run dev
```

### إعداد قاعدة البيانات

```bash
# إعداد Supabase
npx supabase init
npx supabase db reset
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

## 💻 الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل الخادم المحلي
npm run dev:host         # تشغيل مع إمكانية الوصول الخارجي

# البناء
npm run build            # بناء للإنتاج
npm run build:dev        # بناء للتطوير
npm run preview          # معاينة البناء

# الجودة
npm run lint             # فحص الكود
npm run lint:fix         # إصلاح مشاكل الكود
npm run typecheck        # فحص TypeScript

# أدوات إضافية
npm run update-browserslist  # تحديث قائمة المتصفحات
```

---

## 🌐 منشئ المواقع - دليل الاستخدام

### إنشاء موقع جديد

1. **الانتقال لمنشئ المواقع**

   ```
   http://localhost:8080/site-builder
   ```

2. **اختيار قالب**

   - شركة تجارية
   - متجر إلكتروني
   - معرض أعمال إبداعي

3. **تخصيص المحتوى**

   - تحرير النصوص والصور
   - تعديل الألوان والخطوط
   - إضافة وحذف العناصر

4. **المعاينة والنشر**
   - معاينة على الأجهزة المختلفة
   - تصدير الكود
   - حفظ المشروع

### العناصر المتاحة

| العنصر           | الوصف             | الاستخدام                      |
| ---------------- | ----------------- | ------------------------------ |
| **Hero**         | قسم البطل الرئيسي | العنوان الرئيسي والدعوة للعمل  |
| **Services**     | قسم الخدمات       | عرض الخدمات في شبكة منظمة      |
| **About**        | نبذة عنا          | معلومات الشركة والإحصائيات     |
| **Gallery**      | معرض الصور        | عرض الأعمال والمشاريع          |
| **Testimonials** | آراء العملاء      | تقييمات وشهادات العملاء        |
| **Contact**      | التواصل           | نموذج الاتصال ومعلومات التواصل |

---

## 🤖 المساعد الذكي - الإجراءات المتاحة

### الإجراءات السريعة

| الإجراء           | الوصف                        |
| ----------------- | ---------------------------- |
| **تحليل شامل**    | فحص الموقع وإعطاء تقرير مفصل |
| **تحسين الألوان** | اقتراحات لنظام ألوان أفضل    |
| **تحسين المحتوى** | اقتراحات لتحسين النصوص       |
| **تحسين التخطيط** | اقتراحات لتنسيق أفضل         |
| **تحسين SEO**     | اقتراحات لمحركات البحث       |

---

## 📊 الأداء والتحسين

### مقاييس الأداء المستهدفة

| المقياس                      | الهدف | الحالي  |
| ---------------------------- | ----- | ------- |
| **First Contentful Paint**   | < 2s  | 1.8s ✅ |
| **Largest Contentful Paint** | < 3s  | 2.5s ✅ |
| **Cumulative Layout Shift**  | < 0.1 | 0.08 ✅ |
| **Time to Interactive**      | < 4s  | 3.2s ✅ |

### تحسينات مطبقة

- ✅ **Code Splitting** - تقسيم الكود لتحميل أسرع
- ✅ **Image Optimization** - ضغط وتحسين الصور
- ✅ **Bundle Analysis** - تحليل حجم الملفات
- ✅ **Lazy Loading** - تحميل كسول للمكونات
- ✅ **Caching Strategy** - استراتيجية تخزين مؤقت

---

## 📞 الدعم والتواصل

### قنوات التواصل

- 📧 **البريد الإلكتروني:** support@townmedia.sa
- 💬 **واتساب:** [+966 50 123 4567](https://wa.me/966501234567)
- 🐦 **تويتر:** [@townmedia_sa](https://twitter.com/townmedia_sa)
- 💼 **لينكد إن:** [/company/townmedia](https://linkedin.com/company/townmedia)

### الوثائق

- 📚 [التوثيق الكامل](./PROJECT_DOCUMENTATION.md)
- 🚀 [دليل البدء السريع](./docs/quick-start.md)
- 🔌 [مرجع API](./docs/api-reference.md)
- ❓ [الأسئلة الشائعة](./docs/faq.md)

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

**صنع بـ ❤️ في المملكة العربية السعودية 🇸🇦**

**© 2024 Town Media Platform. جميع الحقوق محفوظة.**

**تطوير: محمد سليم**
