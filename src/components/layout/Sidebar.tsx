'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  RefreshCw,
  Activity,
  X,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/restock', label: 'Restock Queue', icon: RefreshCw },
  { href: '/activity', label: 'Activity Log', icon: Activity },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 flex flex-col z-30 transition-transform duration-200',
          'bg-slate-900',
          'lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 rounded-lg p-1.5 shadow-lg shadow-indigo-900/40">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">SmartInventory</span>
              <p className="text-slate-500 text-[10px] font-medium">Management Suite</p>
            </div>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-700/60 transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">
            Main Menu
          </p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-100'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700/60">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/60">
            <div className="bg-indigo-500/20 rounded-md p-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-300 text-xs font-medium">SmartInventory</p>
              <p className="text-slate-500 text-[10px]">v1.0 · EAP 3.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
