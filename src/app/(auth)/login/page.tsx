'use client';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { loginSchema } from '@/lib/validations/auth.schema';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/constants';
import { Package, BarChart3, ShoppingCart, RefreshCw, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || 'Login failed');
          return;
        }
        setUser(data.data);
        toast.success(`Welcome back, ${data.data.name}!`);
        router.push('/dashboard');
      } catch {
        toast.error('Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDemoLogin = () => {
    formik.setValues({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    setTimeout(() => formik.submitForm(), 100);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SmartInventory</span>
        </div>

        {/* Features */}
        <div className="relative space-y-6">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Manage inventory<br />with confidence
          </h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Track products, process orders, and keep your stock levels optimized — all in one place.
          </p>

          <div className="space-y-4 pt-2">
            {[
              { icon: BarChart3, text: 'Real-time stock analytics & insights' },
              { icon: ShoppingCart, text: 'Streamlined order management' },
              { icon: RefreshCw, text: 'Automated restock queue alerts' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white">
                <div className="bg-white/15 rounded-lg p-1.5">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-indigo-300 text-sm">
          © 2026 SmartInventory. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-indigo-600 rounded-xl p-2">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">SmartInventory</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
            </div>

            {/* Demo Login Banner */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mb-5 flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl px-4 py-3 transition-colors group"
            >
              <div className="bg-indigo-600 rounded-lg p-1.5 group-hover:bg-indigo-700 transition-colors">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-indigo-700">Try Demo Account</p>
                <p className="text-xs text-indigo-500">Pre-filled with sample data</p>
              </div>
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">or sign in manually</span>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                  {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm"
              >
                {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
