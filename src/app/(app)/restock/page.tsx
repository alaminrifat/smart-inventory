'use client';
import { useState } from 'react';
import { useRestock } from '@/hooks/useRestock';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { PriorityBadge } from '@/components/restock/PriorityBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Trash2, Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import type { RestockEntry } from '@/types';

export default function RestockPage() {
  const { queue, mutate } = useRestock();
  const [restockTarget, setRestockTarget] = useState<RestockEntry | null>(null);
  const [restockQty, setRestockQty] = useState('');
  const [restocking, setRestocking] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RestockEntry | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleRestock = async () => {
    if (!restockTarget) return;
    const qty = parseInt(restockQty);
    if (isNaN(qty) || qty < 1) { toast.error('Enter a valid quantity'); return; }
    setRestocking(true);
    try {
      const res = await fetch(`/api/restock/${restockTarget.productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to restock'); return; }
      toast.success(`+${qty} units added to "${restockTarget.productName}"`);
      mutate();
      setRestockTarget(null);
      setRestockQty('');
    } catch { toast.error('Something went wrong'); }
    finally { setRestocking(false); }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      const res = await fetch(`/api/restock/${removeTarget.productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to remove'); return; }
      toast.success('Removed from queue');
      mutate();
      setRemoveTarget(null);
    } catch { toast.error('Something went wrong'); }
    finally { setRemoving(false); }
  };

  const highCount = queue.filter((q) => q.priority === 'high').length;

  return (
    <div>
      <PageHeader
        title="Restock Queue"
        description="Products below minimum stock — sorted by lowest stock first"
      >
        {highCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />
            {highCount} High Priority
          </span>
        )}
      </PageHeader>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {queue.length === 0 ? (
          <EmptyState
            icon={RefreshCw}
            title="All stocked up!"
            description="All products are above their minimum stock threshold."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 border-b border-slate-200">
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Min Threshold</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-orange-500" />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-bold ${item.currentStock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.currentStock}
                        {item.currentStock === 0 && (
                          <span className="ml-1.5 text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
                            Empty
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{item.minThreshold}</TableCell>
                    <TableCell><PriorityBadge priority={item.priority} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setRestockTarget(item); setRestockQty(''); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <TrendingUp className="h-3 w-3" />
                          Restock
                        </button>
                        <button
                          onClick={() => setRemoveTarget(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Restock Dialog */}
      <Dialog open={!!restockTarget} onOpenChange={(o) => { if (!o) setRestockTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Restock Product</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800">{restockTarget?.productName}</p>
              <div className="flex gap-4 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Current</p>
                  <p className="text-lg font-bold text-orange-600">{restockTarget?.currentStock}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Min Threshold</p>
                  <p className="text-lg font-bold text-slate-700">{restockTarget?.minThreshold}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-slate-700">Quantity to add</Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 50"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="h-10"
                autoFocus
              />
              {restockQty && parseInt(restockQty) > 0 && (
                <p className="text-xs text-emerald-600">
                  New total: <strong>{(restockTarget?.currentStock || 0) + parseInt(restockQty)} units</strong>
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRestockTarget(null)}>Cancel</Button>
            <Button
              onClick={handleRestock}
              disabled={restocking}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {restocking ? 'Restocking...' : 'Confirm Restock'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove from Queue"
        description={`Remove "${removeTarget?.productName}" from the restock queue? It will be added back automatically if stock drops below threshold.`}
        confirmText="Remove"
        loading={removing}
      />
    </div>
  );
}
