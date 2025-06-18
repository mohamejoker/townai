import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RealAIChat from "@/components/AI/RealAIChat";
import EnhancedAIChat from "@/components/AI/EnhancedAIChat";
import ChatInterface from "@/components/AI/Chat/ChatInterface";
import ImageAnalyzer from "@/components/AI/ImageAnalyzer";
import DesignStudio from "@/components/AI/DesignStudio";
import {
  Brain,
  Sparkles,
  Image,
  Palette,
  BarChart3,
  Users,
  Zap,
  Crown,
} from "lucide-react";

const AIChatPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");

  const plans = [
    {
      id: "free",
      name: "مجاني",
      price: 0,
      features: ["10 رسائل يومياً", "تحليل أساسي", "دعم محدود"],
      icon: Users,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "pro",
      name: "احترافي",
      price: 29,
      features: ["رسائل غير محدودة", "تحليل متقدم", "تصميم ذكي", "دعم أولوية"],
      icon: Zap,
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "premium",
      name: "مميز",
      price: 79,
      features: [
        "كل ميزات الاحترافي",
        "AI مخصص",
        "تحليل المنافسين",
        "استشارة شخصية",
      ],
      icon: Crown,
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const aiTools = [
    {
      id: "chat",
      name: "المحادثة الذكية",
      description: "تحدث مع الذكاء الاصطناعي المتقدم",
      icon: Brain,
      component: <RealAIChat />,
    },
    {
      id: "enhanced",
      name: "المحادثة المحسنة",
      description: "واجهة محسنة مع ميزات إضافية",
      icon: Sparkles,
      component: <EnhancedAIChat />,
    },
    {
      id: "image",
      name: "تحليل الصور",
      description: "حلل صورك واحصل على نصائح",
      icon: Image,
      component: <ImageAnalyzer />,
    },
    {
      id: "design",
      name: "استوديو التصميم",
      description: "صمم محتوى رائع بالذكاء الاصطناعي",
      icon: Palette,
      component: <DesignStudio />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2">
              <Brain className="h-4 w-4 ml-2" />
              مدعوم بأحدث تقنيات الذكاء الاصطناعي
            </Badge>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              المساعد الذكي المتقدم
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              استخدم قوة الذكاء الاصطناعي لتحليل حساباتك، إنشاء محتوى إبداعي،
              وتطوير استراتيجيات تسويقية مخصصة
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Plans Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">اختر خطتك</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedPlan === plan.id
                    ? "border-blue-500 shadow-xl scale-105"
                    : "border-gray-200 hover:shadow-lg"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mx-auto mb-4 flex items-center justify-center`}
                  >
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? "مجاني" : `$${plan.price}/شهر`}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Sparkles className="h-4 w-4 text-green-500 ml-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Tools */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            أدوات الذكاء الاصطناعي
          </h2>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {aiTools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex items-center"
                >
                  <tool.icon className="h-4 w-4 ml-2" />
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {aiTools.map((tool) => (
              <TabsContent key={tool.id} value={tool.id}>
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <tool.icon className="h-8 w-8 ml-3 text-blue-600" />
                      {tool.name}
                    </CardTitle>
                    <p className="text-gray-600">{tool.description}</p>
                  </CardHeader>
                  <CardContent>{tool.component}</CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Features Showcase */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">ميزات متقدمة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "تحليل ذكي",
                description: "تحليل عميق لحساباتك ومحتواك",
                color: "from-purple-500 to-blue-500",
              },
              {
                icon: BarChart3,
                title: "إحصائيات شاملة",
                description: "تقارير مفصلة عن أدائك",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Palette,
                title: "تصميم تلقائي",
                description: "إنشاء تصاميم احترافية بالذكاء الاصطناعي",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: Zap,
                title: "استجابة فورية",
                description: "ردود سريعة ودقيقة على استفساراتك",
                color: "from-yellow-500 to-orange-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`bg-gradient-to-r ${feature.color} rounded-xl p-3 w-fit mx-auto mb-4`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-4">
                ابدأ رحلتك مع الذكاء الاصطناعي
              </h3>
              <p className="text-xl mb-6 opacity-90">
                اكتشف قوة الذكاء الاصطناعي في تطوير حضورك الرقمي
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  ابدأ مجاناً
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  اطلب عرض مخصص
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
