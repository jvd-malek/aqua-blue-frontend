"use client"

// react
import { useEffect, memo } from "react"

// utils and types
import { Feature, formType } from "@/types"
import { notify } from "@/utils"

type InputProps = {
    label: string
    id: string
    form: formType
    setForm: React.Dispatch<React.SetStateAction<formType[]>>
    setFeatures?: React.Dispatch<React.SetStateAction<Feature[]>>
    disabled?: boolean
    required?: boolean
    autoFocus?: boolean
    box?: boolean
    type?: "input" | "select" | "textarea" | "radio" | "instagram-link" | "internal-link" | "features"
    placeholder?: string
    options?: { value: string; label: string; }[];
    descForm?: formType
    titleForm?: formType
}

const Input = memo(({ id, form, disabled, required, label, placeholder, setForm, setFeatures, type = "input", options, autoFocus, descForm, titleForm, box }: InputProps) => {

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, Element>) => {
        form.validateRule &&
            !form.validateRule(event.target.value) && setForm(prev => prev.map(pervForm =>
                pervForm.name === form.name ? { ...form, error: true } : pervForm
            ));
    }

    useEffect(() => {
        if (form?.error) {
            notify(form.errorMessage, "error")
        }
    }, [form?.error])

    return (
        <div className={`flex ${type == "radio" ? "flex-row justify-between" : "flex-col"} gap-2 ${box ? "w-30 sm:w-46" : "w-full"}`}>
            <label htmlFor={id} className="section-title text-xs sm:text-sm font-medium">
                {label}
                {required &&
                    <span className="text-red-500">*</span>
                }
            </label>

            {(type === "input" || type === "instagram-link" || type === "internal-link") &&
                <div className="relative">
                    <input
                        id={id}
                        name={id}
                        type={form.type}
                        value={form.value}
                        placeholder={placeholder}
                        onChange={(e) => handleChangeForm(setForm, e.target.value, form.name)}
                        onBlur={(e) => handleBlur(e)}
                        className={`rounded-xl p-2.5 placeholder:text-gray-400 border text-sm focus:outline-none w-full transition-all duration-300 ${
                            form.error 
                                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20' 
                                : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } ${disabled && 'opacity-50 cursor-not-allowed'}`}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        required={required}
                    />
                    {(type === "instagram-link" || type === "internal-link") &&
                        <button
                            type="button"
                            onClick={() => handleChangeLink(setForm, descForm, `${titleForm?.value ?? ""}`, form, type === "instagram-link")}
                            className={`${(disabled || !form.value || !titleForm?.value) ? "cursor-not-allowed opacity-50" : "cursor-pointer"} btn-primary text-xs px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 absolute top-1/2 -translate-y-1/2 left-2`}
                            disabled={disabled || !form.value}
                            aria-label="ثبت لینک"
                        >
                            ثبت
                        </button>
                    }
                </div>
            }

            {type === "select" &&
                <select
                    id={id}
                    name={id}
                    value={form.value}
                    onChange={(e) => handleChangeForm(setForm, e.target.value, form.name)}
                    onBlur={(e) => handleBlur(e)}
                    className={`rounded-xl p-2.5 border text-sm focus:outline-none w-full transition-all duration-300 ${
                        form.error 
                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } ${disabled && 'opacity-50 cursor-not-allowed'}`}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    required={required}
                >
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            }

            {type === "radio" &&
                <input
                    id={id}
                    type="radio"
                    name="delivery"
                    className="cursor-pointer text-blue-600 focus:ring-blue-500"
                    onChange={() => handleChangeForm(setForm, id, form.name)}
                />
            }

            {type === "textarea" &&
                <textarea
                    name={id}
                    id={id}
                    value={form.value}
                    placeholder={placeholder}
                    onChange={(e) => handleChangeForm(setForm, e.target.value, form.name)}
                    onBlur={(e) => handleBlur(e)}
                    rows={3}
                    className={`rounded-xl p-2.5 placeholder:text-gray-400 border text-sm focus:outline-none w-full transition-all duration-300 ${
                        form.error 
                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    } ${disabled && 'opacity-50 cursor-not-allowed'}`}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    required={required}
                />
            }

            {type === "features" &&
                <div className="relative">
                    <input
                        id={id}
                        name={id}
                        type={form.type}
                        value={form.value}
                        placeholder={placeholder}
                        onChange={(e) => handleChangeForm(setForm, e.target.value, form.name)}
                        onBlur={(e) => handleBlur(e)}
                        className={`rounded-xl p-2.5 placeholder:text-gray-400 border text-sm focus:outline-none w-full transition-all duration-300 ${
                            form.error 
                                ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20' 
                                : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        } ${disabled && 'opacity-50 cursor-not-allowed'}`}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        required={required}
                    />

                    <button
                        type="button"
                        onClick={() => handleChangeFeature(setForm, setFeatures, titleForm, form)}
                        className={`${(disabled || !form.value || !titleForm?.value) ? "cursor-not-allowed opacity-50" : "cursor-pointer"} btn-primary text-xs px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 absolute top-1/2 -translate-y-1/2 left-2`}
                        disabled={disabled || !form.value}
                        aria-label="ثبت لینک"
                    >
                        ثبت
                    </button>
                </div>
            }
        </div>
    );
});

const handleChangeForm = (setForm: React.Dispatch<React.SetStateAction<formType[]>>, value: string, name: string) => {
    setForm(prev => prev.map(pervForm =>
        pervForm.name === name ? { ...pervForm, error: false, value } : pervForm
    ));
};

const handleFormValidator = (formData: formType[]) => {
    const errors = formData.filter(form => form.error)
    if (errors.length > 0) {
        errors.forEach(error => notify(error.errorMessage, "error"))
        return false
    }
    return true
}

const handleClearForm = (setForm: React.Dispatch<React.SetStateAction<formType[]>>) => {
    setForm(prev => prev.map(form => { return { ...form, error: false, value: "" } }));
};

const handleClearInput = (setForm: React.Dispatch<React.SetStateAction<formType[]>>, name: string) => {
    setForm(prev => prev.map(pervForm =>
        pervForm.name === name ? { ...pervForm, error: false, value: "" } : pervForm
    ));
};

const placeholderForRequired = (label: string) => (`${label} الزامی است.`)

const handleChangeLink = (setForm: React.Dispatch<React.SetStateAction<formType[]>>, descForm: formType | undefined, title: string | undefined, form: formType, isInstagram: boolean) => {
    const Link = `[${title}](${form.value})`
    const value = isInstagram ?
        descForm?.value + '\n' + "مشاهده تصاویر این محصول در اینستاگرام" + '\n' + Link :
        descForm?.value + '\n' + Link

    handleChangeForm(setForm, value, descForm?.name || "")
    handleChangeForm(setForm, "", form.name)
}

const handleChangeFeature = (setForm: React.Dispatch<React.SetStateAction<formType[]>>, setFeatures: React.Dispatch<React.SetStateAction<Feature[]>> | undefined, title: formType | undefined, form: formType) => {
    const value = { key: `${title?.value}`.trim(), value: `${form.value}`.trim() }

    setFeatures && setFeatures(pervF => [...pervF, value])
    handleChangeForm(setForm, "", form.name)
    title && handleChangeForm(setForm, "", title.name);
}

export {
    Input,
    handleChangeForm,
    handleClearInput,
    handleFormValidator,
    placeholderForRequired,
    handleClearForm
}