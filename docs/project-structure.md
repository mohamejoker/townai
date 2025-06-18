
# هيكل المشروع التفصيلي - الإصدار 2.0

## البنية العامة

```
smart-marketing-platform/
├── src/                     # المجلد الرئيسي للكود
│   ├── components/         # مكونات واجهة المستخدم
│   ├── pages/              # صفحات التطبيق
│   ├── hooks/              # React Hooks مخصصة
│   ├── services/           # خدمات API والمنطق
│   ├── contexts/           # Context API للحالة العامة
│   ├── utils/              # وظائف مساعدة
│   ├── lib/                # مكتبات ومساعدات
│   └── integrations/       # تكاملات خارجية
├── public/                 # الملفات العامة
├── docs/                   # الوثائق التفصيلية
└── dist/                   # ملفات الإنتاج (بعد البناء)
```

## تفصيل مجلد src/

### components/ - المكونات (58 ملف)
```
components/
├── Admin/                  # مكونات الإدارة (24 ملف)
│   ├── AdminLayout.tsx            # تخطيط صفحات الإدارة
│   ├── AdminHeader.tsx            # رأس صفحات الإدارة
│   ├── AdminSidebar.tsx           # الشريط الجانبي
│   ├── AdminProvidersManager.tsx  # إدارة الموردين
│   ├── AdvancedAdminControls.tsx  # أدوات متقدمة
│   ├── AdvancedReportsManager.tsx # إدارة التقارير
│   ├── EgyptianPaymentManager.tsx # إدارة الدفع المصري
│   ├── PaymentsDashboard.tsx      # لوحة المدفوعات
│   ├── ThemeControlPanel.tsx     # تحكم الثيم
│   ├── UISettingsPanel.tsx       # إعدادات الواجهة
│   ├── Providers/                # مكونات الموردين
│   │   ├── ProviderForm.tsx
│   │   ├── ProvidersTable.tsx
│   │   └── ProviderStats.tsx
│   ├── Payments/                 # مكونات المدفوعات
│   │   ├── EgyptianPaymentCard.tsx
│   │   ├── PaymentMethodForm.tsx
│   │   └── PaymentMethodsOverview.tsx
│   └── NotificationSystem/       # نظام الإشعارات
├── Auth/                   # مكونات المصادقة (3 ملفات)
│   ├── AuthProvider.tsx           # موفر السياق للمصادقة
│   ├── ProtectedRoute.tsx         # حماية المسارات
│   └── LoginForm.tsx              # نموذج تسجيل الدخول
├── AI/                     # مكونات الذكاء الاصطناعي (2 ملف)
│   ├── FloatingAIButton.tsx       # زر الذكاء الاصطناعي العائم
│   └── EnhancedAIChat.tsx         # محادثة ذكية متقدمة
├── Common/                 # مكونات مشتركة (8 ملفات)
│   ├── Logo.tsx                   # شعار المنصة
│   ├── LoadingSpinner.tsx         # مؤشر التحميل
│   ├── LoadingStates.tsx          # حالات التحميل المختلفة
│   ├── ErrorBoundaryWrapper.tsx   # معالج الأخطاء
│   ├── DevLogger.tsx              # تسجيل رسائل التطوير
│   └── ...
├── Dashboard/              # مكونات لوحة التحكم (8 ملفات)
│   ├── AdvancedAdminDashboard.tsx
│   ├── EnhancedDashboard.tsx
│   ├── InteractiveCharts.tsx
│   └── EnhancedDashboardParts/
├── Notifications/          # نظام الإشعارات (3 ملفات)
│   ├── RealTimeNotifications.tsx
│   ├── NotificationsHub.tsx
│   └── NotificationSystem/
├── Services/               # مكونات الخدمات (2 ملف)
├── Orders/                 # مكونات الطلبات (2 ملف)
├── Analytics/              # مكونات التحليلات (1 ملف)
└── ui/                     # مكونات UI الأساسية (shadcn)
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── form.tsx
    ├── dialog.tsx
    ├── switch.tsx
    ├── badge.tsx
    ├── tabs.tsx
    ├── toaster.tsx
    ├── sonner.tsx
    ├── tooltip.tsx
    ├── scroll-area.tsx
    └── ...
```

### pages/ - الصفحات (15 ملف)
```
pages/
├── LandingPage.tsx         # الصفحة الرئيسية
├── LoginPage.tsx           # صفحة تسجيل الدخول
├── RegisterPage.tsx        # صفحة التسجيل
└── admin/                  # صفحات الإدارة (12 ملف)
    ├── DashboardPage.tsx           # لوحة التحكم
    ├── UsersPage.tsx               # إدارة المستخدمين
    ├── ServicesPage.tsx            # إدارة الخدمات
    ├── OrdersPage.tsx              # إدارة الطلبات
    ├── ProvidersPage.tsx           # إدارة الموردين
    ├── PaymentMethodsPage.tsx      # طرق الدفع
    ├── ReportsPage.tsx             # التقارير
    ├── ThemeControlPage.tsx        # تحكم الثيم
    ├── UIPage.tsx                  # إعدادات الواجهة
    ├── SettingsPage.tsx            # الإعدادات
    ├── SystemDiagnosticsPage.tsx   # تشخيص النظام
    ├── MonitoringPage.tsx          # المراقبة
    ├── MaintenancePage.tsx         # الصيانة
    ├── SystemHealthPage.tsx        # صحة النظام
    └── PerformancePage.tsx         # الأداء
```

### hooks/ - الخطافات المخصصة (8 ملفات)
```
hooks/
├── useAuth.ts                  # خطاف المصادقة الأساسي
├── useRoleAuth.tsx             # خطاف إدارة الأدوار والصلاحيات
├── useErrorHandler.tsx         # خطاف معالجة الأخطاء
├── useSupabaseAuth.tsx         # خطاف Supabase للمصادقة
├── useAdvancedReports.ts       # خطاف التقارير المتقدمة
├── use-mobile.tsx              # كشف الشاشات المحمولة
├── use-toast.ts                # نظام الإشعارات
└── useUIControl.tsx            # تحكم واجهة المستخدم
```

### services/ - الخدمات (8 ملفات)
```
services/
├── dashboard/                  # خدمات لوحة التحكم
│   └── realTimeDataService.ts     # خدمة البيانات الفورية
├── admin/                      # خدمات الإدارة
│   ├── realProvidersService.ts    # خدمة إدارة الموردين
│   └── providerServicesService.ts # خدمة خدمات الموردين
├── payment/                    # خدمات المدفوعات
│   └── egyptianPaymentConfigService.ts # تكوين الدفع المصري
├── ai/                         # خدمات الذكاء الاصطناعي
│   └── advancedAI.ts              # خدمة AI متقدمة
├── theme/                      # خدمات الثيم
│   ├── manager.ts                 # مدير الثيم
│   ├── types.ts                   # أنواع الثيم
│   ├── storage.ts                 # تخزين الثيم
│   └── applier.ts                 # تطبيق الثيم
└── state/                      # إدارة الحالة
    └── stateManager.ts            # مدير الحالة العام
```

### contexts/ - السياقات (2 ملف)
```
contexts/
├── AuthContext.tsx             # سياق المصادقة الرئيسي
└── UIControlContext.tsx        # سياق تحكم واجهة المستخدم
```

### utils/ - الأدوات المساعدة (2 ملف)
```
utils/
├── errorHandler.ts             # معالج الأخطاء المتقدم
└── formatters.ts               # أدوات التنسيق
```

### lib/ - المكتبات (2 ملف)
```
lib/
├── validators.ts               # مدققات البيانات (Zod schemas)
└── utils.ts                    # أدوات عامة
```

### integrations/ - التكاملات (2 ملف)
```
integrations/
└── supabase/
    ├── client.ts               # عميل Supabase
    └── types.ts                # أنواع قاعدة البيانات
```

## ملفات التكوين الرئيسية

### في المجلد الجذر
```
├── package.json                # تبعيات المشروع والسكريبتات
├── vite.config.ts             # تكوين Vite
├── tailwind.config.ts         # تكوين Tailwind CSS
├── tsconfig.json              # تكوين TypeScript
├── components.json            # تكوين Shadcn/UI
├── index.html                 # الملف الرئيسي HTML
├── .env.example               # مثال على متغيرات البيئة
└── README.md                  # وثائق المشروع
```

## قواعد التنظيم والتسمية

### تسمية الملفات
- **مكونات React**: `PascalCase.tsx` (مثل: `AdminLayout.tsx`)
- **خطافات**: `useCamelCase.ts` (مثل: `useRoleAuth.ts`)
- **خدمات**: `camelCase.ts` (مثل: `realTimeDataService.ts`)
- **صفحات**: `PascalCasePage.tsx` (مثل: `DashboardPage.tsx`)
- **أنواع**: `camelCase.ts` (مثل: `ui-types.ts`)

### بنية المكونات المعيارية
```typescript
// استيراد المكتبات الخارجية
import React from 'react';
import { QueryClient } from '@tanstack/react-query';

// استيراد المكونات المحلية
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// استيراد الأنواع والواجهات
interface ComponentProps {
  title: string;
  isLoading?: boolean;
}

// المكون الرئيسي
const ComponentName: React.FC<ComponentProps> = ({ title, isLoading }) => {
  // خطافات وحالة المكون
  const [state, setState] = useState();
  
  // وظائف المكون
  const handleAction = () => {
    // منطق المكون
  };

  // عرض المكون
  return (
    <div className="container">
      {/* محتوى المكون */}
    </div>
  );
};

export default ComponentName;
```

## إدارة الحالة

### مستويات إدارة الحالة
1. **React Context** - للحالة العامة (Auth, UI Settings)
2. **useState** - للحالة المحلية للمكونات
3. **React Query** - لإدارة البيانات الخارجية
4. **Local Storage** - للإعدادات المحلية

### أنماط الحالة
```typescript
// Context للحالة العامة
const AuthContext = createContext<AuthContextType>();

// React Query للبيانات
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers
});

// useState للحالة المحلية
const [isModalOpen, setIsModalOpen] = useState(false);
```

## معالجة الأخطاء

### مستويات معالجة الأخطاء
1. **Error Boundaries** - للأخطاء العامة في React
2. **Try-catch** - للعمليات الحساسة
3. **React Query Error Handling** - لأخطاء API
4. **نظام تسجيل متقدم** - لتتبع الأخطاء

### نمط معالجة الأخطاء
```typescript
// Error Boundary للمكونات
<ErrorBoundaryWrapper context="Component Name">
  <Component />
</ErrorBoundaryWrapper>

// معالجة أخطاء API
const { data, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  onError: (error) => {
    errorHandler.handleApiError(error);
  }
});
```

## الأمان والحماية

### طبقات الأمان
1. **Row Level Security** في Supabase
2. **Route Protection** للصفحات الحساسة
3. **Role-based Access Control** للصلاحيات
4. **Input Validation** بـ Zod schemas

### نمط حماية المسارات
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminComponent />
</ProtectedRoute>
```

## الأداء والتحسين

### استراتيجيات التحسين
1. **Lazy Loading** للمكونات الكبيرة
2. **React.memo** للمكونات الثابتة
3. **useMemo & useCallback** للعمليات المكلفة
4. **تجميع الطلبات** بـ React Query

### نمط التحسين
```typescript
// Lazy loading
const LazyComponent = lazy(() => import('./Component'));

// Memoization
const MemoizedComponent = React.memo(Component);

// Optimized hooks
const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);
```

## التوثيق والصيانة

### أنواع التوثيق
1. **README.md** - نظرة عامة ودليل سريع
2. **docs/project-structure.md** - هيكل مفصل
3. **docs/development-plan.md** - خطة التطوير
4. **Inline Comments** - شرح الكود المعقد

### أدوات الصيانة
- **TypeScript** - للكشف عن الأخطاء
- **ESLint** - لجودة الكود
- **Prettier** - لتنسيق الكود
- **DevLogger** - لرسائل التطوير

---

هذا الهيكل يوفر مرونة عالية للتطوير والصيانة، مع الحفاظ على تنظيم واضح وقابلية للتوسع.
