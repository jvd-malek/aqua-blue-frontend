// components/product/ProductFeatures.tsx

type Feature = { key: string; value: string };

type Props = {
  features?: Feature[];
  size?: string;
  weight?: number;
  brand?: string;
  condition?: string;
  price?: number;
  finalPrice?: number;
  discountAmount?: number;
  discountPercent?: number;
  discountExpireAt?: string;
  desc?: string;
  title?: string;
};

export default function ProductFeatures({
  features,
  size,
  weight,
  brand,
  condition,
  price,
  finalPrice,
  discountAmount,
  discountPercent,
  discountExpireAt,
  desc,
  title
}: Props) {

  const torobFeatures: Feature[] = [];
  if (title) torobFeatures.push({ key: 'عنوان', value: title });
  if (desc) torobFeatures.push({ key: 'توضیحات', value: desc });
  if (price) torobFeatures.push({ key: 'قیمت', value: `${price.toLocaleString("Fa-IR")} تومان` });
  if (discountPercent) torobFeatures.push({ key: 'درصد تخفیف', value: `${discountPercent.toLocaleString("Fa-IR")}%` });
  if (discountAmount) torobFeatures.push({ key: 'میزان تخفیف', value: `${discountAmount.toLocaleString("Fa-IR")} تومان` });
  if (discountExpireAt) torobFeatures.push({ key: 'تاریخ انقضا تخفیف', value: discountExpireAt });
  if (finalPrice) torobFeatures.push({ key: 'قیمت نهایی', value: `${finalPrice.toLocaleString("Fa-IR")} تومان` });
  if (brand) torobFeatures.push({ key: 'برند', value: brand });
  if (size) torobFeatures.push({ key: 'سایز', value: size });
  if (weight) torobFeatures.push({ key: 'وزن', value: `${weight.toLocaleString("Fa-IR")} گرم` });
  if (condition) torobFeatures.push({ key: 'وضعیت', value: condition });
  if (features) torobFeatures.push(...(features || []));

  
  const allFeatures: Feature[] = [...(features || [])];
  if (brand) allFeatures.push({ key: 'برند', value: brand });
  if (size) allFeatures.push({ key: 'سایز', value: size });
  if (weight) allFeatures.push({ key: 'وزن', value: `${weight.toLocaleString("Fa-IR")} گرم` });
  if (condition) allFeatures.push({ key: 'وضعیت', value: condition });


  if (allFeatures.length === 0) {
    return <p className="text-gray-400 text-center py-6 text-sm">ویژگی‌ای برای این محصول ثبت نشده است</p>;
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {allFeatures.map((f, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'}>
              <td className="py-2.5 px-3 font-medium text-gray-700 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 w-1/3">
                {f.key}
              </td>
              <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="product-attributes shop_attributes hidden">
        <tbody>
          {torobFeatures.map((attr, i) => (
            <tr
              key={i}
              className="product-attributes-item product-attributes-item--attribute"
            >
              <th className="product-attributes-item__label">
                <span className="wd-attr-name">{attr.key}</span>
              </th>
              <td className="product-attributes-item__value">
                <p>{attr.value}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}