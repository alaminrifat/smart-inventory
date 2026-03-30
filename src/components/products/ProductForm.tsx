"use client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { productSchema } from "@/lib/validations/product.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { categories } = useCategories();
  const isEdit = !!product;

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      categoryId: product?.categoryId || "",
      price: product?.price ?? ("" as unknown as number),
      stockQuantity: product?.stockQuantity ?? ("" as unknown as number),
      minStockThreshold:
        product?.minStockThreshold ?? ("" as unknown as number),
      status: product?.status || ("active" as "active" | "out_of_stock"),
    },
    validationSchema: toFormikValidationSchema(productSchema),
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const url = isEdit ? `/api/products/${product.id}` : "/api/products";
        const method = isEdit ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            price: Number(values.price),
            stockQuantity: Number(values.stockQuantity),
            minStockThreshold: Number(values.minStockThreshold),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to save product");
          return;
        }
        toast.success(isEdit ? "Product updated" : "Product created");
        onSuccess();
      } catch {
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const err = formik.errors;
  const touched = formik.touched;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-sm font-semibold text-slate-700">
            Product Name
          </Label>
          <Input
            placeholder="e.g. iPhone 13"
            className="h-10"
            {...formik.getFieldProps("name")}
          />
          {touched.name && err.name && (
            <p className="text-xs text-red-600">{err.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-slate-700">
            Category
          </Label>
          <Select
            value={formik.values.categoryId}
            onValueChange={(v) => formik.setFieldValue("categoryId", v)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.categoryId && err.categoryId && (
            <p className="text-xs text-red-600">{err.categoryId}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-slate-700">
            Price ($)
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className="h-10"
            {...formik.getFieldProps("price")}
            onChange={(e) =>
              formik.setFieldValue(
                "price",
                e.target.value === "" ? "" : parseFloat(e.target.value),
              )
            }
          />
          {touched.price && err.price && (
            <p className="text-xs text-red-600">{err.price}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-slate-700">
            Stock Quantity
          </Label>
          <Input
            type="number"
            min="0"
            placeholder="0"
            className="h-10"
            {...formik.getFieldProps("stockQuantity")}
            onChange={(e) =>
              formik.setFieldValue(
                "stockQuantity",
                e.target.value === "" ? "" : parseInt(e.target.value),
              )
            }
          />
          {touched.stockQuantity && err.stockQuantity && (
            <p className="text-xs text-red-600">{err.stockQuantity}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-slate-700">
            Min Stock Threshold
          </Label>
          <Input
            type="number"
            min="1"
            placeholder="5"
            className="h-10"
            {...formik.getFieldProps("minStockThreshold")}
            onChange={(e) =>
              formik.setFieldValue(
                "minStockThreshold",
                e.target.value === "" ? "" : parseInt(e.target.value),
              )
            }
          />
          {touched.minStockThreshold && err.minStockThreshold && (
            <p className="text-xs text-red-600">{err.minStockThreshold}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-slate-700">Status</Label>
          <Select
            value={formik.values.status}
            onValueChange={(v) => formik.setFieldValue("status", v)}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row">
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="h-10 w-full bg-indigo-600 font-semibold text-white hover:bg-indigo-700 sm:flex-1"
        >
          {formik.isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Add Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-10 w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
