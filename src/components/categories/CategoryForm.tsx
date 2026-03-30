'use client';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { categorySchema } from '@/lib/validations/category.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: toFormikValidationSchema(categorySchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to create category'); return; }
        toast.success('Category created');
        resetForm();
        onSuccess();
      } catch { toast.error('Something went wrong'); }
      finally { setSubmitting(false); }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Category name (e.g. Electronics)"
          className="h-10"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-xs text-red-600 mt-1">{formik.errors.name}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-4"
      >
        {formik.isSubmitting ? 'Adding...' : 'Add Category'}
      </Button>
    </form>
  );
}
