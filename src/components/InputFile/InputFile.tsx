import { Fragment, useRef } from "react";
import { toast } from "react-toastify";

import config from "src/constants/config";

interface Props {
  onChange?: (file?: File) => void;
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    fileInputRef.current?.setAttribute("value", "");

    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes("image"))) {
      toast.error(`Dung lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG`, {
        position: "top-center"
      });
    } else {
      onChange && onChange(fileFromLocal);
    }
  };

  // Xử lí khi nhấn vào button thì input sẽ click
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Fragment>
      <input
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // Trick cho trường hợp file giống nhau thì không chạy onChange bởi event.target.value chúng ta không dùng
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event.target as any).value = null;
        }}
      />
      <button
        className="flex items-center justify-end h-10 px-6 text-sm text-gray-600 bg-white border rounded-sm shadow-sm"
        type="button"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}
