import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  classNameInput?: string;
  classNameError?: string;
}

// Xây dựng InputNumber kiểu khác vì có hàm onChange xử lí khác
// Dùng ref để có được behavior shoundFocusOnError
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = "p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm",
    classNameError = "mt-1 text-red-600 min-h-[1.25rem] text-sm",
    onChange,
    value = "",
    ...rest
  },
  ref
) {
  // cho trường hợp người dùng không truyền value, onChange vào thì vẫn hoạt động đúng
  const [localValue, setLocalValue] = useState<string>(value as string);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Check kiểm tra là 1 số
    if (/^\d+$/.test(value) || value === "") {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event);
      // Cập nhật localValue state
      setLocalValue(value);
    }
  };

  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} value={value || localValue} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  );
});

export default InputNumber;
