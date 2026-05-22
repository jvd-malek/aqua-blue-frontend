'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@/lib/client-swr'
import { notify } from '@/utils/notify'
import { Input } from '../ui/Input'
import { formType } from '@/types'
import { Phone, KeyRound, LogIn, RefreshCw } from 'lucide-react'

const validatePhone = (phone: string) => /^(\+98|0098|98|0)?9\d{9}$/.test(phone)

const initialFields: formType[] = [
  { name: 'phone', type: 'tel', value: '', error: false, errorMessage: 'شماره همراه معتبر نیست', validateRule: null },
  { name: 'code', type: 'text', value: '', error: false, errorMessage: 'کد یکبارمصرف الزامی است', validateRule: null },
]

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bas = searchParams.get('bas') === 'true'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [formData, setFormData] = useState<formType[]>(initialFields)

  const sendCode = useMutation('/auth/send-code')
  const verify = useMutation('/auth/verify')

  useEffect(() => {
    if (remainingTime <= 0) return
    const timer = setTimeout(() => setRemainingTime((p) => p - 1), 1000)
    return () => clearTimeout(timer)
  }, [remainingTime])

  const handleSendCode = useCallback(async () => {
    const phone = formData[0].value
    if (!validatePhone(`${phone}`)) {
      setFormData((prev) => prev.map((f) => (f.name === 'phone' ? { ...f, error: true } : f)))
      notify('شماره همراه معتبر نیست', 'error')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await sendCode.post({ phone })
      if (res?.success) {
        setCodeSent(true)
        setRemainingTime(120)
        notify('کد تایید ارسال شد', 'success')
        notify(res.code, 'success')
      } else {
        notify(res?.message || 'خطا در ارسال کد', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, sendCode])

  const handleVerify = useCallback(async () => {
    const code = formData[1].value
    if (!code) {
      setFormData((prev) => prev.map((f) => (f.name === 'code' ? { ...f, error: true } : f)))
      return
    }
    setIsSubmitting(true)
    try {
      const res = await verify.post({ phone: formData[0].value, code })
      if (res?.success) {
        notify('ورود با موفقیت انجام شد', 'success')
        router.push(bas ? '/basket' : '/')
      } else {
        notify(res?.message || 'کد نامعتبر است', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, verify, bas, router])

  const handlePhoneChange = () => {
    setCodeSent(false)
    setFormData((prev) => prev.map((f) => (f.name === 'code' ? { ...f, value: '', error: false } : f)))
    setRemainingTime(0)
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between">
      <h1 className="sr-only">ورود به حساب کاربری Aqua Blue</h1>

      <div className="text-center mb-8">

        <h2 className="hero-title text-2xl font-bold" data-text={codeSent ? 'تایید کد' : 'خوش آمدید'}>
          {codeSent ? 'تایید کد یکبارمصرف' : 'ورود به حساب کاربری'}
        </h2>
        {!codeSent && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            برای ورود یا ثبت‌نام شماره همراه خود را وارد کنید
          </p>
        )}
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (codeSent) handleVerify()
          else handleSendCode()
        }}
      >
        {/* Phone */}
        <div className="relative">
          <Input
            id="phone"
            label="شماره همراه"
            placeholder="0912 123 4567"
            form={formData[0]}
            setForm={setFormData}
            disabled={isSubmitting || codeSent}
            required
          />
          {codeSent && (
            <button
              type="button"
              onClick={handlePhoneChange}
              className="absolute right-2 bottom-2 btn-secondary text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center gap-1"
              disabled={isSubmitting}
            >
              <RefreshCw size={12} />
              تغییر شماره
            </button>
          )}
        </div>

        {/* Code */}
        {codeSent && (
          <div className="relative">
            <Input
              id="code"
              label="کد یکبارمصرف"
              placeholder="کد ۵ رقمی"
              form={formData[1]}
              setForm={setFormData}
              disabled={isSubmitting}
              required
            />
            <div className="absolute left-2 bottom-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-xs px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-1"
              >
                <KeyRound size={12} />
                {isSubmitting ? '...' : 'تایید'}
              </button>
            </div>
          </div>
        )}

        {/* Submit / Resend */}
        {!codeSent && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            {isSubmitting ? 'در حال ارسال...' : 'ادامه'}
          </button>
        )}

        {codeSent && remainingTime === 0 && (
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isSubmitting}
            className="btn-secondary w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            ارسال مجدد کد
          </button>
        )}

        {remainingTime > 0 && (
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ارسال مجدد کد پس از{' '}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {remainingTime.toLocaleString('fa-IR')}
              </span>{' '}
              ثانیه
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(remainingTime / 120) * 100}%` }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  )
}