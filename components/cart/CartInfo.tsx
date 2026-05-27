'use client';

import { useGet } from '@/lib/client-swr';
import UserAddressForm from '@/components/shared/UserAddressForm';

type Props = {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  hasFish: boolean
};

export default function CartInfo({ formData, setFormData, onNext, onBack, hasFish }: Props) {
  const { data: userData } = useGet<{ user: any }>('/user/me');
  const user = userData?.user;

  const handleSubmit = (data: any) => {
    setFormData(data);
    onNext();
  };

  return (
    <UserAddressForm
      initialData={formData}
      isLoggedIn={!!user}
      userPhone={user?.phone}
      userFullName={user?.name}
      showShippingMethod={true}
      onSubmit={handleSubmit}
      submitButtonText="ادامه و پرداخت"
      onBack={onBack}
      hasFish={hasFish}
    />
  );
}