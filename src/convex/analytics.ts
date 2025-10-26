import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get analytics dashboard data
export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Calculate totals
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = invoices.filter(inv => inv.status === "paid");
    const paidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingInvoices = invoices.filter(inv => inv.status === "sent");
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const overdueInvoices = invoices.filter(inv => inv.status === "overdue");
    const overdueRevenue = overdueInvoices.reduce((sum, inv) => sum + inv.total, 0);

    // Monthly revenue data for chart
    const monthlyData: Record<string, { total: number; paid: number; pending: number }> = {};
    invoices.forEach(invoice => {
      const date = new Date(invoice.issueDate);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, paid: 0, pending: 0 };
      }
      
      monthlyData[monthKey].total += invoice.total;
      if (invoice.status === "paid") {
        monthlyData[monthKey].paid += invoice.total;
      } else if (invoice.status === "sent") {
        monthlyData[monthKey].pending += invoice.total;
      }
    });

    const monthlyRevenue = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, data]) => ({
        month,
        total: data.total,
        paid: data.paid,
        pending: data.pending,
      }));

    // Recent activity
    const recentActivity = analytics
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 10);

    return {
      summary: {
        totalInvoices,
        totalRevenue,
        paidInvoices: paidInvoices.length,
        paidRevenue,
        pendingInvoices: pendingInvoices.length,
        pendingRevenue,
        overdueInvoices: overdueInvoices.length,
        overdueRevenue,
      },
      monthlyRevenue,
      recentActivity,
      invoicesByStatus: {
        draft: invoices.filter(inv => inv.status === "draft").length,
        sent: invoices.filter(inv => inv.status === "sent").length,
        paid: invoices.filter(inv => inv.status === "paid").length,
        overdue: invoices.filter(inv => inv.status === "overdue").length,
        cancelled: invoices.filter(inv => inv.status === "cancelled").length,
      },
    };
  },
});
