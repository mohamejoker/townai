import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  status: "active" | "closed" | "draft";
  applications: number;
  category: string;
}

const JobsAdminPage = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      title: "مطور واجهات أمامية",
      company: "شركة التقنية المتقدمة",
      location: "الرياض، السعودية",
      type: "full-time",
      salary: "8000 - 12000 ريال",
      description: "نبحث عن مطور واجهات أمامية ماهر للانضمام إلى فريقنا",
      requirements: ["React", "TypeScript", "Tailwind CSS"],
      postedDate: "2025-01-10",
      status: "active",
      applications: 15,
      category: "development",
    },
    {
      id: "2",
      title: "مصمم UX/UI",
      company: "استوديو الإبداع",
      location: "دبي، الإمارات",
      type: "remote",
      salary: "6000 - 10000 ريال",
      description: "مصمم UX/UI مبدع لتصميم تجارب رقمية مميزة",
      requirements: ["Figma", "Adobe XD", "Prototyping"],
      postedDate: "2025-01-08",
      status: "active",
      applications: 8,
      category: "design",
    },
    {
      id: "3",
      title: "أخصائي تسويق رقمي",
      company: "وكالة النجاح",
      location: "جدة، السعودية",
      type: "part-time",
      salary: "4000 - 7000 ريال",
      description: "أخصائي تسويق رقمي لإدارة الحملات الإعلانية",
      requirements: ["Google Ads", "Facebook Ads", "Analytics"],
      postedDate: "2025-01-05",
      status: "closed",
      applications: 22,
      category: "marketing",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-orange-100 text-orange-800";
      case "remote":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) {
      setJobs(jobs.filter((job) => job.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: job.status === "active" ? "closed" : ("active" as any),
            }
          : job,
      ),
    );
  };

  const totalApplications = jobs.reduce(
    (sum, job) => sum + job.applications,
    0,
  );
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الوظائف</h1>
          <p className="text-gray-600">نشر وإدارة الوظائف المتاحة في المنصة</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            تصدير البيانات
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة وظيفة جديدة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الوظائف
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  الوظائف النشطة
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeJobs}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  الوظائف المغلقة
                </p>
                <p className="text-2xl font-bold text-red-600">{closedJobs}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الطلبات
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalApplications}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث عن الوظائف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="closed">مغلقة</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="نوع الوظيفة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="full-time">دوام كامل</SelectItem>
                <SelectItem value="part-time">دوام جزئي</SelectItem>
                <SelectItem value="contract">عقد</SelectItem>
                <SelectItem value="remote">عن بُعد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status === "active"
                        ? "نشطة"
                        : job.status === "closed"
                          ? "مغلقة"
                          : "مسودة"}
                    </Badge>
                    <Badge className={getTypeColor(job.type)}>
                      {job.type === "full-time"
                        ? "دوام كامل"
                        : job.type === "part-time"
                          ? "دوام جزئي"
                          : job.type === "contract"
                            ? "عقد"
                            : "عن بُعد"}
                    </Badge>
                  </div>

                  <p className="text-lg font-medium text-blue-600 mb-2">
                    {job.company}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.postedDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applications} طلب
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedJob(job)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingJob(job)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    تحرير
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(job.id)}
                    className={`flex items-center gap-1 ${
                      job.status === "active"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {job.status === "active" ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {job.status === "active" ? "إغلاق" : "تنشيط"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد وظائف
            </h3>
            <p className="text-gray-600">
              لم يتم العثور على وظائف تطابق البحث الحالي
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobsAdminPage;
