'use client';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { signupSchema } from '@/lib/validations/auth.schema';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { Package } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: toFormikValidationSchema(signupSchema),
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || 'Signup failed');
          return;
        }
        setUser(data.data);
        toast.success('Account created! Welcome aboard.');
        router.push('/dashboard');
      } catch {
        toast.error('Something went wrong');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-indigo-600 rounded-xl p-2">
            <Package className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">SmartInventory</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
            <p className="text-slate-500 text-sm">Get started in seconds — no credit card required</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="John Doe"
                className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500">{formik.errors.name}</p>
              )}
            </div>

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
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="h-10 bg-slate-50 border-slate-200 focus:bg-white"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm"
            >
              {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
