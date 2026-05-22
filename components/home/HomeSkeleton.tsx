export function ProductsSliderSkeleton({ title }: { title?: string }) {
  return (
    <section className="container mx-auto px-3 relative z-10 mt-16">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <div className="skeleton h-7 w-24 rounded-lg" />
          <div className="skeleton h-5 w-16 rounded-lg" />
        </div>
      )}
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-40 sm:min-w-50">
            {/* عکس محصول */}
            <div className="skeleton rounded-2xl aspect-square" />
            
            {/* عنوان */}
            <div className="skeleton h-4 rounded-lg w-3/4 mt-2" />
            
            {/* قیمت */}
            <div className="skeleton h-5 rounded-lg w-1/2 mt-1" />
          </div>
        ))}
      </div>
    </section>
  );
}

// اضافه کردن اسکلتون برای کارت‌های مقالات (اختیاری)
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
      {/* تصویر */}
      <div className="skeleton h-48 w-full" />
      
      {/* محتوا */}
      <div className="p-4">
        <div className="skeleton h-6 rounded-lg w-3/4 mb-2" />
        <div className="skeleton h-4 rounded-lg w-full mb-1" />
        <div className="skeleton h-4 rounded-lg w-2/3 mb-3" />
        <div className="flex justify-between">
          <div className="skeleton h-3 rounded-lg w-16" />
          <div className="skeleton h-3 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}

// اسکلتون برای صفحه دسته‌بندی (اختیاری)
export function CategoryPageSkeleton() {
  return (
    <div className="container mx-auto px-3 py-8">
      {/* هدر */}
      <div className="skeleton h-10 rounded-lg w-48 mb-6" />
      
      {/* فیلترها */}
      <div className="flex gap-3 mb-8">
        <div className="skeleton h-10 rounded-lg w-32" />
        <div className="skeleton h-10 rounded-lg w-32" />
        <div className="skeleton h-10 rounded-lg w-32" />
      </div>
      
      {/* محصولات */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i}>
            <div className="skeleton rounded-2xl aspect-square" />
            <div className="skeleton h-4 rounded-lg w-3/4 mt-2" />
            <div className="skeleton h-5 rounded-lg w-1/2 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}