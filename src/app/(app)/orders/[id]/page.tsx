'use client';
import { use, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, Calendar, Package } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/utils/date';
import type { Order, OrderStatus } from '@/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const transitionConfig: Record<string, { className: string; label: string }> = {
  confirmed: { className: 'bg-blue-600 hover:bg-blue-700 text-white', label: 'Confirm' },
  shipped:   { className: 'bg-violet-600 hover:bg-violet-700 text-white', label: 'Ship' },
  delivered: { className: 'bg-emerald-600 hover:bg-emerald-700 text-white', label: 'Mark Delivered' },
  cancelled: { className: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200', label: 'Cancel Order' },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, mutate } = useSWR<{ data: Order }>(`/api/orders/${id}`, fetcher);
  const [updating, setUpdating] = useState(false);
  const order = data?.data;

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to update status'); return; }
      toast.success(`Order updated to ${newStatus}`);
      mutate();
    } catch { toast.error('Something went wrong'); }
    finally { setUpdating(false); }
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading order...</p>
        </div>
      </div>
    );
  }

  const allowedNext = STATUS_TRANSITIONS[order.status as OrderStatus] || [];

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title={`Order ${order.orderNumber}`} description="Order details and status management">
        <Link href="/orders">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </Link>
      </PageHeader>

      <div className="space-y-4">
        {/* Summary card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">Order Summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Customer</p>
                <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date</p>
                <p className="font-semibold text-slate-800 text-sm">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
              <OrderStatusBadge status={order.status as OrderStatus} />
            </div>
            {allowedNext.length > 0 && (
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-400 mr-1">Move to:</p>
                {allowedNext.map((s) => {
                  const cfg = transitionConfig[s] || { className: 'bg-slate-100 text-slate-700', label: s };
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={updating}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${cfg.className}`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
            <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Package className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Order Items</h2>
            <span className="ml-auto text-xs text-slate-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit Price</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.productId} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="font-semibold text-slate-800 text-sm">{item.productName}</TableCell>
                    <TableCell className="text-slate-500 text-sm">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{item.quantity}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-right">${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50/60">
            <span className="text-sm font-semibold text-slate-600">Order Total</span>
            <span className="text-xl font-bold text-slate-900">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
