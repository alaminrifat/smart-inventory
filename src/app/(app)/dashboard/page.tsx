'use client';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  Activity,
  Package,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils/date';
import type { ActivityAction } from '@/types';

const actionConfig: Record<ActivityAction, { label: string; dot: string }> = {
  order_created:         { label: 'Order Created',    dot: 'bg-blue-500' },
  order_status_updated:  { label: 'Status Updated',   dot: 'bg-purple-500' },
  order_cancelled:       { label: 'Order Cancelled',  dot: 'bg-red-500' },
  product_created:       { label: 'Product Added',    dot: 'bg-green-500' },
  product_updated:       { label: 'Product Updated',  dot: 'bg-yellow-500' },
  product_deleted:       { label: 'Product Deleted',  dot: 'bg-red-500' },
  stock_updated:         { label: 'Stock Updated',    dot: 'bg-teal-500' },
  product_restocked:     { label: 'Restocked',        dot: 'bg-emerald-500' },
  restock_queue_added:   { label: 'Low Stock Alert',  dot: 'bg-orange-500' },
  restock_queue_removed: { label: 'Queue Cleared',    dot: 'bg-slate-400' },
  category_created:      { label: 'Category Added',   dot: 'bg-indigo-500' },
  category_deleted:      { label: 'Category Deleted', dot: 'bg-red-500' },
};

export default function DashboardPage() {
  const { stats, isLoading } = useDashboard();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-1" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="lg:col-span-2 h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back — here&apos;s what&apos;s happening today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Orders Today"
          value={stats.totalOrdersToday}
          icon={ShoppingCart}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
          description="New orders placed"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          description="Awaiting processing"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
          description="Need restocking"
        />
        <StatCard
          title="Revenue Today"
          value={`$${stats.revenueToday.toFixed(2)}`}
          icon={DollarSign}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
          description={`${stats.completedOrders} orders delivered`}
        />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Revenue Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" />
              This week
            </div>
          </div>
          <RevenueChart data={stats.revenueChart} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <Link href="/activity" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No activity yet</p>
            ) : (
              stats.recentActivity.slice(0, 6).map((log) => {
                const cfg = actionConfig[log.action] || { label: log.action, dot: 'bg-slate-400' };
                return (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-700 leading-relaxed">{log.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(log.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Product Summary */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Product Stock Summary</h2>
          </div>
          <Link href="/products" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.productSummary.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No products yet</p>
          ) : (
            stats.productSummary.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{p.stockQuantity} units</span>
                  {p.status === 'out_of_stock' ? (
                    <Badge className="bg-red-50 text-red-600 border-red-200 text-[11px] font-semibold">Out of Stock</Badge>
                  ) : p.isLow ? (
                    <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[11px] font-semibold">Low Stock</Badge>
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> OK
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
