'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, clientUpload } from '@/lib/client-swr'
import { notify } from '@/utils/notify'
import { Save, Upload, X, Link, Plus, Trash2 } from 'lucide-react'

// Types
type FormField = {
  name: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'features'
  value: string
  label: string
  error: boolean
  errorMessage: string
  required?: boolean
  options?: { value: string; label: string }[]
}

type Feature = { key: string; value: string }

// Constants
const CATEGORIES: Record<string, string[]> = {
  'ماهی': ['ماهی آب شیرین', 'ماهی آب شور', 'ماهی تزئینی'],
  'آکواریوم': ['آکواریوم آماده', 'تجهیزات', 'دکوراسیون'],
  'غذا': ['غذا ماهی', 'غذا میگو', 'غذا لاک‌پشت'],
  'لوازم جانبی': ['بک‌گراند', 'تصفیه', 'روشنایی', 'ترموستات'],
}

const CONDITION_OPTIONS = [
  { value: 'نو', label: 'نو' },
  { value: 'در حد نو', label: 'در حد نو' },
  { value: 'دسته دوم', label: 'دسته دوم' },
]

const STATE_OPTIONS = [
  { value: 'active', label: 'فعال' },
  { value: 'inactive', label: 'غیرفعال' },
  { value: 'outOfStock', label: 'ناموجود' },
  { value: 'comingSoon', label: 'به زودی' },
  { value: 'callForPrice', label: 'تماس بگیرید' },
]

const REQUIRED_FIELDS = ['title', 'desc', 'price', 'majorCat']
const NUMERIC_FIELDS = ['price', 'cost', 'discountPercent', 'count', 'showCount', 'weight']
const DRAFT_KEY = 'aquablue-product-draft'

export default function AddProductForm() {
  const router = useRouter()
  const createProduct = useMutation('/products')

  // Form state
  const [form, setForm] = useState<FormField[]>([
    { name: 'title', type: 'text', value: '', label: 'عنوان محصول', error: false, errorMessage: 'عنوان باید بین 3 تا 60 کاراکتر باشد', required: true },
    { name: 'desc', type: 'textarea', value: '', label: 'توضیحات', error: false, errorMessage: 'توضیحات باید بین 3 تا 600 کاراکتر باشد', required: true },
    { name: 'majorCat', type: 'select', value: '', label: 'دسته‌بندی اصلی', error: false, errorMessage: 'الزامی', required: true, options: Object.keys(CATEGORIES).map(c => ({ value: c, label: c })) },
    { name: 'minorCat', type: 'select', value: '', label: 'زیردسته', error: false, errorMessage: '', options: [] },
    { name: 'price', type: 'number', value: '', label: 'قیمت (تومان)', error: false, errorMessage: 'قیمت باید عدد باشد', required: true },
    { name: 'cost', type: 'number', value: '', label: 'قیمت خرید (تومان)', error: false, errorMessage: '' },
    { name: 'discountPercent', type: 'number', value: '0', label: 'درصد تخفیف (۰ تا ۱۰۰)', error: false, errorMessage: '' },
    { name: 'discountDays', type: 'number', value: '30', label: 'مدت تخفیف (روز)', error: false, errorMessage: '' },
    { name: 'count', type: 'number', value: '0', label: 'تعداد انبار', error: false, errorMessage: '' },
    { name: 'showCount', type: 'number', value: '0', label: 'تعداد نمایشی', error: false, errorMessage: '' },
    { name: 'condition', type: 'select', value: 'نو', label: 'وضعیت فیزیکی', error: false, errorMessage: '', options: CONDITION_OPTIONS },
    { name: 'size', type: 'text', value: '', label: 'سایز', error: false, errorMessage: '' },
    { name: 'weight', type: 'number', value: '0', label: 'وزن (گرم)', error: false, errorMessage: '' },
    { name: 'brand', type: 'text', value: '', label: 'برند', error: false, errorMessage: '' },
    { name: 'state', type: 'select', value: 'active', label: 'وضعیت نمایش', error: false, errorMessage: '', options: STATE_OPTIONS },
    { name: 'featureKey', type: 'text', value: '', label: 'عنوان ویژگی', error: false, errorMessage: '' },
    { name: 'featureValue', type: 'features', value: '', label: 'مقدار ویژگی', error: false, errorMessage: '' },
  ])

  const [features, setFeatures] = useState<Feature[]>([])
  const [cover, setCover] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Helpers
  const getField = (name: string) => form.find(f => f.name === name)!
  
  const updateField = useCallback((name: string, updates: Partial<FormField>) => {
    setForm(prev => prev.map(f => f.name === name ? { ...f, ...updates } : f))
  }, [])

  const getSubOptions = () => {
    const major = getField('majorCat').value
    return (major && CATEGORIES[major]) ? CATEGORIES[major].map(c => ({ value: c, label: c })) : []
  }

  // Auto-save draft
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) {
      try {
        const { form: savedForm, features: savedFeatures, coverName } = JSON.parse(saved)
        if (savedForm) setForm(savedForm)
        if (savedFeatures) setFeatures(savedFeatures)
      } catch {}
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, features, coverName: cover?.name }))
    }, 500)
    return () => clearTimeout(timer)
  }, [form, features, cover])

  // Update minorCat options when majorCat changes
  useEffect(() => {
    const subs = getSubOptions()
    updateField('minorCat', { options: subs, value: '' })
  }, [getField('majorCat').value])

  // Image handlers
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setCover(file)
    setCoverPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Submit
  const handleSubmit = async () => {
    // Validate
    const empty = REQUIRED_FIELDS.filter(name => !getField(name)?.value)
    if (empty.length > 0 || !cover) {
      form.forEach(f => {
        if (REQUIRED_FIELDS.includes(f.name) && !f.value) updateField(f.name, { error: true })
      })
      notify(!cover ? 'تصویر شاخص الزامی است' : 'فیلدهای الزامی را پر کنید', 'error')
      return
    }

    // Build body
    const body: Record<string, unknown> = { features: features.length > 0 ? features : undefined }
    form.forEach(f => {
      if (['featureKey', 'featureValue', 'discountDays'].includes(f.name)) return
      if (NUMERIC_FIELDS.includes(f.name)) {
        body[f.name] = f.value ? Number(f.value) : f.value === '0' ? 0 : undefined
      } else {
        body[f.name] = f.value || undefined
      }
    })

    // Discount expiry
    const discountDays = getField('discountDays')?.value
    if (Number(discountDays) > 0 && Number(getField('discountPercent')?.value) > 0) {
      body.discountExpireAt = Date.now() + Number(discountDays) * 86400000
    }

    // Upload
    setIsUploading(true)
    let uploadRes: any = { success: true, data: { cover: '', images: [] } }

    if (cover || images.length > 0) {
      const fd = new FormData()
      if (cover) fd.append('cover', cover)
      images.forEach(img => fd.append('images', img))
      uploadRes = await clientUpload(fd)
    }
    setIsUploading(false)

    if (!uploadRes?.success) {
      notify(uploadRes?.error || 'خطا در آپلود عکس', 'error')
      return
    }

    body.cover = uploadRes.data?.cover || ''

    // Create product
    const res = await createProduct.post(body)

    if (res?.success) {
      // Link additional images
      const productId = res.product?.id || res.data?.id || res.id
      if (productId && uploadRes.data?.images?.length > 0) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
        await fetch(`http://localhost:3815/api/products/${productId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify({ images: uploadRes.data.images }),
        })
      }

      // Reset
      setForm(prev => prev.map(f => ({ ...f, value: f.type === 'number' || f.name === 'state' || f.name === 'condition' ? f.value : '' })))
      setCover(null)
      setCoverPreview(null)
      setImages([])
      setImagePreviews([])
      setFeatures([])
      localStorage.removeItem(DRAFT_KEY)
      notify('محصول با موفقیت ایجاد شد', 'success')
      router.refresh()
    } else {
      notify(res?.message || 'خطا در ثبت محصول', 'error')
    }
  }

  // Render input
  const renderInput = (field: FormField) => {
    const common = {
      id: field.name,
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        updateField(field.name, { value: e.target.value, error: false })
      },
      className: `w-full bg-gray-800 text-white rounded-lg px-3 py-2.5 text-sm border ${field.error ? 'border-red-500' : 'dark:border-gray-700 border-blue-100'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition`,
      disabled: isUploading || createProduct.isLoading,
      placeholder: field.errorMessage || '',
    }

    if (field.type === 'textarea') {
      return <textarea {...common} rows={4} />
    }

    if (field.type === 'select') {
      return (
        <select {...common}>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )
    }

    return <input {...common} type={field.type === 'number' ? 'number' : 'text'} />
  }

  return (
    <div className="min-h-screen dark:bg-gray-950 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">🐠 افزودن محصول جدید</h1>

        <form onSubmit={e => { e.preventDefault(); handleSubmit() }} className="grid md:grid-cols-2 gap-6">
          {/* Right Column - Main Fields */}
          <div className="space-y-4">
            {/* Cover Image */}
            <div className="dark:bg-gray-900 p-4 rounded-xl border-2 dark:border-gray-800 border-blue-200">
              <label className="block text-sm font-medium mb-2">
                تصویر شاخص <span className="text-red-500">*</span>
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border-2 dark:bg-gray-800 rounded-lg dark:hover:bg-gray-700 hover:bg-blue-50 transition text-sm dark:border-gray-700 border-blue-200">
                <Upload size={16} /> {cover ? cover.name : 'انتخاب عکس'}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </label>
              {coverPreview && (
                <div className="relative mt-3 inline-block">
                  <img src={coverPreview} alt="cover" className="w-24 h-24 object-cover rounded-lg dark:border-gray-700 border-blue-200" />
                  <button type="button" onClick={() => { setCover(null); setCoverPreview(null) }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
                </div>
              )}
            </div>

            {/* Additional Images */}
            <div className="dark:bg-gray-900 p-4 rounded-xl border-2 dark:border-gray-800 border-blue-200">
              <label className="block text-sm font-medium mb-2">تصاویر بیشتر</label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border-2 dark:bg-gray-800 rounded-lg dark:hover:bg-gray-700 hover:bg-blue-50 transition text-sm dark:border-gray-700 border-blue-200">
                <Upload size={16} /> {images.length > 0 ? `${images.length} عکس` : 'افزودن عکس'}
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
              </label>
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded-lg dark:border-gray-700 border-blue-200" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Fields */}
            {form.filter(f => ['title', 'desc', 'majorCat', 'minorCat', 'brand'].includes(f.name)).map(field => (
              <div key={field.name} className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2">
                <label className="block text-sm font-medium mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {renderInput(field)}
              </div>
            ))}
          </div>

          {/* Left Column - Details */}
          <div className="space-y-4">
            {/* Price & Cost */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2">
              <label className="block text-sm font-medium mb-2">قیمت فروش (تومان) <span className="text-red-500">*</span></label>
              {renderInput(getField('price'))}
            </div>
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2">
              <label className="block text-sm font-medium mb-2">قیمت خرید (تومان)</label>
              {renderInput(getField('cost'))}
            </div>

            {/* Discount */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">درصد تخفیف</label>
                {renderInput(getField('discountPercent'))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">مدت (روز)</label>
                {renderInput(getField('discountDays'))}
              </div>
            </div>

            {/* Stock */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">تعداد انبار</label>
                {renderInput(getField('count'))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تعداد نمایشی</label>
                {renderInput(getField('showCount'))}
              </div>
            </div>

            {/* Weight & Size */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">وزن (گرم)</label>
                {renderInput(getField('weight'))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">سایز</label>
                {renderInput(getField('size'))}
              </div>
            </div>

            {/* Condition & State */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">وضعیت فیزیکی</label>
                {renderInput(getField('condition'))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">وضعیت نمایش</label>
                {renderInput(getField('state'))}
              </div>
            </div>

            {/* Features */}
            <div className="dark:bg-gray-900 p-4 rounded-xl dark:border-gray-800 border-blue-200 border-2">
              <label className="block text-sm font-medium mb-2">ویژگی‌های محصول</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="عنوان (مثال: رنگ)"
                  value={getField('featureKey').value}
                  onChange={e => updateField('featureKey', { value: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm dark:border-gray-700 border-blue-100 focus:border-blue-500 outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="مقدار (مثال: آبی)"
                    value={getField('featureValue').value}
                    onChange={e => updateField('featureValue', { value: e.target.value })}
                    className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm dark:border-gray-700 border-blue-100 focus:border-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const key = getField('featureKey').value.trim()
                      const val = getField('featureValue').value.trim()
                      if (key && val) {
                        setFeatures(prev => [...prev, { key, value: val }])
                        updateField('featureKey', { value: '' })
                        updateField('featureValue', { value: '' })
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-blue-900/50 text-blue-300 text-xs px-2.5 py-1 rounded-full">
                      {f.key}: {f.value}
                      <button type="button" onClick={() => setFeatures(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-300"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createProduct.isLoading || isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3.5 rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {isUploading ? <><Upload size={20} /> در حال آپلود...</> :
               createProduct.isLoading ? <><Save size={20} /> در حال ذخیره...</> :
               <><Save size={20} /> ذخیره محصول</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}