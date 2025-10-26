import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  Plus, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router";
import { FileUploadSection } from "@/components/FileUploadSection";
import { LogoDropdown } from "@/components/LogoDropdown";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const analytics = useQuery(api.analytics.getDashboardData);
  const invoices = useQuery(api.invoices.list);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const recentInvoices = invoices?.slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <LogoDropdown />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name || user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invoice Types Section - Enhanced with gradient cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Create New Invoice
            </h2>
            <p className="text-gray-600 mt-1">Choose the type of invoice you want to create</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                onClick={() => navigate("/invoice/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32 gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">International Invoice</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50"
                onClick={() => navigate("/proforma/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32 gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">Proforma Invoice</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50"
                onClick={() => navigate("/local-bill/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32 gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">Local Bill</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-orange-50 to-amber-50"
                onClick={() => navigate("/local-proforma/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32 gap-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">Local Proforma</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-cyan-50 to-teal-50"
                onClick={() => navigate("/local-chalan/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32 gap-3">
                  <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-cyan-600" />
                  </div>
                  <span className="text-base font-semibold text-gray-900">Local Chalan</span>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards - Enhanced with gradients and better visual hierarchy */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Financial Overview
          </h2>
          <p className="text-gray-600 mt-1">Track your revenue and invoice status at a glance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ${analytics?.summary.totalRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  From {analytics?.summary.totalInvoices || 0} invoices
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Paid Invoices</CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ${analytics?.summary.paidRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.summary.paidInvoices || 0} invoices paid
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-l-4 border-l-yellow-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ${analytics?.summary.pendingRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.summary.pendingInvoices || 0} invoices pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-l-4 border-l-red-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  ${analytics?.summary.overdueRevenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {analytics?.summary.overdueInvoices || 0} invoices overdue
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest invoice activity</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate("/invoices")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.length > 0 ? (
                    recentInvoices.map((invoice) => (
                      <div
                        key={invoice._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/invoice/${invoice._id}`)}
                      >
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${invoice.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              invoice.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : invoice.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No invoices yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/invoice/new")}
                      >
                        Create your first invoice
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Invoice Status Overview
                </CardTitle>
                <CardDescription>Breakdown of your invoices by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.invoicesByStatus && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Draft</span>
                        <span className="font-medium">{analytics.invoicesByStatus.draft}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sent</span>
                        <span className="font-medium">{analytics.invoicesByStatus.sent}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Paid</span>
                        <span className="font-medium text-green-600">{analytics.invoicesByStatus.paid}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overdue</span>
                        <span className="font-medium text-red-600">{analytics.invoicesByStatus.overdue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cancelled</span>
                        <span className="font-medium text-gray-600">{analytics.invoicesByStatus.cancelled}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* File Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <FileUploadSection />
        </motion.div>

        {/* Quick Actions - Redesigned with gradient backgrounds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600 mt-1">Common tasks to help you get started</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50"
                onClick={() => navigate("/invoice/new")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-28 gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-gray-900">Create Invoice</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-purple-50 to-pink-50"
                onClick={() => navigate("/invoices")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-28 gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-900">View All Invoices</span>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card 
                className="cursor-pointer border-2 hover:border-primary hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50"
                onClick={() => navigate("/analytics")}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-28 gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">View Analytics</span>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}