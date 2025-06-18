import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";

// تعريف أنواع البيانات
export interface SiteElement {
  id: string;
  type:
    | "hero"
    | "services"
    | "about"
    | "contact"
    | "gallery"
    | "testimonials"
    | "footer"
    | "header";
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
  position: number;
  visible: boolean;
  responsive: {
    desktop: Record<string, unknown>;
    tablet: Record<string, unknown>;
    mobile: Record<string, unknown>;
  };
}

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  elements: SiteElement[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface SiteData {
  metadata: {
    title: string;
    description: string;
    logo: string;
    favicon: string;
    author: string;
    language: string;
  };
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    spacing: {
      container: string;
      section: string;
    };
  };
  pages: SitePage[];
  activePage: string;
  settings: {
    responsive: boolean;
    animations: boolean;
    darkMode: boolean;
    rtl: boolean;
  };
}

export interface HistoryState {
  past: SiteData[];
  present: SiteData;
  future: SiteData[];
}

// Actions
export type SiteBuilderAction =
  | { type: "UPDATE_METADATA"; data: Partial<SiteData["metadata"]> }
  | { type: "UPDATE_THEME"; data: Partial<SiteData["theme"]> }
  | { type: "UPDATE_SETTINGS"; data: Partial<SiteData["settings"]> }
  | { type: "ADD_ELEMENT"; pageId: string; element: SiteElement }
  | { type: "UPDATE_ELEMENT"; elementId: string; data: Partial<SiteElement> }
  | { type: "DELETE_ELEMENT"; elementId: string }
  | { type: "REORDER_ELEMENTS"; pageId: string; elementIds: string[] }
  | { type: "ADD_PAGE"; page: SitePage }
  | { type: "UPDATE_PAGE"; pageId: string; data: Partial<SitePage> }
  | { type: "DELETE_PAGE"; pageId: string }
  | { type: "SET_ACTIVE_PAGE"; pageId: string }
  | { type: "LOAD_PROJECT"; data: SiteData }
  | { type: "LOAD_TEMPLATE"; template: SiteData }
  | { type: "APPLY_SUGGESTION"; suggestion: unknown }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR_HISTORY" };

// Initial state
const initialSiteData: SiteData = {
  metadata: {
    title: "موقعي الجديد",
    description: "موقع إلكتروني رائع تم إنشاؤه بواسطة منشئ المواقع المتقدم",
    logo: "",
    favicon: "",
    author: "محمد سليم",
    language: "ar",
  },
  theme: {
    colors: {
      primary: "#3b82f6",
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
      elements: [],
      meta: {
        title: "الصفحة الرئيسية",
        description: "الصفحة الرئيسية لموقعنا",
        keywords: ["موقع", "رئيسية", "خدمات"],
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
};

const initialHistoryState: HistoryState = {
  past: [],
  present: initialSiteData,
  future: [],
};

// Reducer
const siteBuilderReducer = (
  state: HistoryState,
  action: SiteBuilderAction,
): HistoryState => {
  const { past, present, future } = state;

  switch (action.type) {
    case "UNDO":
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };

    case "REDO":
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };

    case "CLEAR_HISTORY":
      return {
        past: [],
        present: present,
        future: [],
      };

    default:
      // لجميع الإجراءات الأخرى، نقوم بتحديث البيانات وإضافة الحالة السابقة للتاريخ
      const newPresent = updateSiteData(present, action);
      if (newPresent === present) return state; // لا تغيير

      return {
        past: [...past, present],
        present: newPresent,
        future: [], // مسح المستقبل عند إجراء تغيير جديد
      };
  }
};

// دالة تحديث البيانات
const updateSiteData = (
  state: SiteData,
  action: SiteBuilderAction,
): SiteData => {
  switch (action.type) {
    case "UPDATE_METADATA":
      return {
        ...state,
        metadata: { ...state.metadata, ...action.data },
      };

    case "UPDATE_THEME":
      return {
        ...state,
        theme: { ...state.theme, ...action.data },
      };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.data },
      };

    case "ADD_ELEMENT":
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.pageId
            ? { ...page, elements: [...page.elements, action.element] }
            : page,
        ),
      };

    case "UPDATE_ELEMENT":
      return {
        ...state,
        pages: state.pages.map((page) => ({
          ...page,
          elements: page.elements.map((element) =>
            element.id === action.elementId
              ? { ...element, ...action.data }
              : element,
          ),
        })),
      };

    case "DELETE_ELEMENT":
      return {
        ...state,
        pages: state.pages.map((page) => ({
          ...page,
          elements: page.elements.filter(
            (element) => element.id !== action.elementId,
          ),
        })),
      };

    case "REORDER_ELEMENTS":
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.pageId
            ? {
                ...page,
                elements: action.elementIds
                  .map((id, index) => {
                    const element = page.elements.find((el) => el.id === id);
                    return element ? { ...element, position: index } : null;
                  })
                  .filter(Boolean) as SiteElement[],
              }
            : page,
        ),
      };

    case "ADD_PAGE":
      return {
        ...state,
        pages: [...state.pages, action.page],
      };

    case "UPDATE_PAGE":
      return {
        ...state,
        pages: state.pages.map((page) =>
          page.id === action.pageId ? { ...page, ...action.data } : page,
        ),
      };

    case "DELETE_PAGE":
      const remainingPages = state.pages.filter(
        (page) => page.id !== action.pageId,
      );
      return {
        ...state,
        pages: remainingPages,
        activePage:
          state.activePage === action.pageId
            ? remainingPages[0]?.id || ""
            : state.activePage,
      };

    case "SET_ACTIVE_PAGE":
      return {
        ...state,
        activePage: action.pageId,
      };

    case "LOAD_PROJECT":
      return action.data;

    case "LOAD_TEMPLATE":
      return {
        ...action.template,
        metadata: {
          ...action.template.metadata,
          author: state.metadata.author, // الحفاظ على المؤلف الحالي
        },
      };

    case "APPLY_SUGGESTION":
      // يمكن توسيع هذا حسب نوع الاقتراح
      return state;

    default:
      return state;
  }
};

// Context
interface SiteBuilderContextType {
  siteData: SiteData;
  selectedElement: SiteElement | null;
  setSelectedElement: (element: SiteElement | null) => void;
  updateSiteData: (action: SiteBuilderAction) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveProject: () => Promise<void>;
  loadProject: (data: SiteData) => void;
  exportProject: () => Promise<SiteData>;
  importProject: (data: SiteData) => Promise<void>;
  getActivePage: () => SitePage | undefined;
  getElementById: (id: string) => SiteElement | undefined;
}

const SiteBuilderContext = createContext<SiteBuilderContextType | undefined>(
  undefined,
);

// Provider
interface SiteBuilderProviderProps {
  children: ReactNode;
}

export const SiteBuilderProvider: React.FC<SiteBuilderProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(siteBuilderReducer, initialHistoryState);
  const [selectedElement, setSelectedElement] =
    React.useState<SiteElement | null>(null);

  const updateSiteData = useCallback((action: SiteBuilderAction) => {
    dispatch(action);
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const saveProject = useCallback(async () => {
    try {
      // حفظ في LocalStorage
      localStorage.setItem(
        "siteBuilder_project",
        JSON.stringify(state.present),
      );

      // يمكن إضافة حفظ في قاعدة البيانات هنا
      console.log("تم حفظ المشروع بنجاح");
    } catch (error) {
      console.error("خطأ في حفظ المشروع:", error);
      throw error;
    }
  }, [state.present]);

  const loadProject = useCallback((data: SiteData) => {
    dispatch({ type: "LOAD_PROJECT", data });
    setSelectedElement(null);
  }, []);

  const exportProject = useCallback(async (): Promise<SiteData> => {
    return {
      ...state.present,
      metadata: {
        ...state.present.metadata,
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
      },
    };
  }, [state.present]);

  const importProject = useCallback(async (data: SiteData) => {
    // التحقق من صحة البيانات
    if (!data.metadata || !data.pages || !Array.isArray(data.pages)) {
      throw new Error("ملف المشروع غير صحيح");
    }

    dispatch({ type: "LOAD_PROJECT", data });
    setSelectedElement(null);
  }, []);

  const getActivePage = useCallback((): SitePage | undefined => {
    return state.present.pages.find(
      (page) => page.id === state.present.activePage,
    );
  }, [state.present.pages, state.present.activePage]);

  const getElementById = useCallback(
    (id: string): SiteElement | undefined => {
      for (const page of state.present.pages) {
        const element = page.elements.find((el) => el.id === id);
        if (element) return element;
      }
      return undefined;
    },
    [state.present.pages],
  );

  // تحميل المشروع المحفوظ عند بدء التشغيل
  React.useEffect(() => {
    try {
      const savedProject = localStorage.getItem("siteBuilder_project");
      if (savedProject) {
        const data = JSON.parse(savedProject);
        loadProject(data);
      }
    } catch (error) {
      console.error("خطأ في تحميل المشروع المحفوظ:", error);
    }
  }, [loadProject]);

  const value: SiteBuilderContextType = {
    siteData: state.present,
    selectedElement,
    setSelectedElement,
    updateSiteData,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    saveProject,
    loadProject,
    exportProject,
    importProject,
    getActivePage,
    getElementById,
  };

  return (
    <SiteBuilderContext.Provider value={value}>
      {children}
    </SiteBuilderContext.Provider>
  );
};

// Hook
export const useSiteBuilder = (): SiteBuilderContextType => {
  const context = useContext(SiteBuilderContext);
  if (!context) {
    throw new Error("useSiteBuilder must be used within a SiteBuilderProvider");
  }
  return context;
};

export default SiteBuilderContext;
