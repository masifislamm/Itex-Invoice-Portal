import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Analytics() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const analytics = useQuery(api.analytics.getDashboardData);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const collectionRate = analytics?.summary.totalRevenue 
    ? (analytics.summary.paidRevenue / analytics.summary.totalRevenue) * 100 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Insights into your invoice performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.summary.totalRevenue || 0)}
                </div>
                <p className="text-xs opacity-80">
                  From {analytics?.summary.totalInvoices || 0} invoices
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
                <p className="text-xs opacity-80">
                  {formatCurrency(analytics?.summary.paidRevenue || 0)} collected
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <Calendar className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.summary.pendingRevenue || 0)}
                </div>
                <p className="text-xs opacity-80">
                  {analytics?.summary.pendingInvoices || 0} invoices pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <TrendingDown className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.summary.overdueRevenue || 0)}
                </div>
                <p className="text-xs opacity-80">
                  {analytics?.summary.overdueInvoices || 0} invoices overdue
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Monthly Revenue Trend
                </CardTitle>
                <CardDescription>Revenue breakdown over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.monthlyRevenue && analytics.monthlyRevenue.length > 0 ? (
                    analytics.monthlyRevenue.map((month, index) => {
                      const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.total));
                      const widthPercentage = maxRevenue > 0 ? (month.total / maxRevenue) * 100 : 0;
                      
                      return (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{formatMonth(month.month)}</span>
                            <span className="font-medium">{formatCurrency(month.total)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${widthPercentage}%` }}
                              transition={{ delay: 0.1 * index, duration: 0.5 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Paid: {formatCurrency(month.paid)}</span>
                            <span>Pending: {formatCurrency(month.pending)}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No revenue data available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Invoice Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Invoice Status Breakdown
                </CardTitle>
                <CardDescription>Distribution of invoices by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analytics?.invoicesByStatus && (
                    <>
                      {Object.entries(analytics.invoicesByStatus).map(([status, count], index) => {
                        const total = Object.values(analytics.invoicesByStatus).reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        const statusColors = {
                          draft: "bg-yellow-500",
                          sent: "bg-blue-500",
                          paid: "bg-green-500",
                          overdue: "bg-red-500",
                          cancelled: "bg-gray-500",
                        };

                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${statusColors[status as keyof typeof statusColors]}`} />
                                <span className="capitalize text-sm font-medium">{status}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium">{count}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key metrics and recommendations for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-semibold mb-1">Average Invoice Value</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics?.summary.totalInvoices 
                      ? formatCurrency(analytics.summary.totalRevenue / analytics.summary.totalInvoices)
                      : formatCurrency(0)
                    }
                  </p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-semibold mb-1">Payment Success Rate</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {collectionRate.toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-semibold mb-1">Total Invoices</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {analytics?.summary.totalInvoices || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
