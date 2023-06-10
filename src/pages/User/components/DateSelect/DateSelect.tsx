import { useEffect, useState } from "react";

import range from "lodash/range";

interface Props {
  onChange?: (value: Date) => void;
  value?: Date;
  errorMessage?: string;
}

export default function DateSelect({ value, onChange, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueFromSelect, name } = event.target;
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueFromSelect)
    };
    setDate(newDate);
    // Thực hiện thay đổi onChange ở React-hook-form
    // Phải truyền tham số kiểu Date tương ứng khi khai báo trong YUP
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date));
  };

  useEffect(() => {
    // để đồng book date khi value thay đổi
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      });
    }
  }, [value]);

  return (
    <div className="flex flex-col flex-wrap mt-2 sm:flex-row">
      <div className="truncate pt-3 capitalize sm:w-[20%] sm:text-right">Ngày sinh</div>
      <div className="sm:w-[80%] sm:pl-5">
        <div className="flex justify-between">
          <select
            onChange={handleChange}
            name="date"
            className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name="month"
            className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name="year"
            className="h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange"
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-1 min-h-[1.25rem] text-sm text-red-600">{errorMessage}</div>
      </div>
    </div>
  );
}
