import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import HOME_EN from "src/locales/en/home.json";
import PRODUCT_EN from "src/locales/en/product.json";
import HOME_VI from "src/locales/vi/home.json";
import PRODUCT_VI from "src/locales/vi/product.json";

// Lưu biến để có thể chuyển ngôn ngữ
export const locales = {
  en: "English",
  vi: "Tiếng Việt"
} as const;

// Lưu tài nguyên để lưu tất cả những chỗ cần dùng bản dịch
// Trong en thì có 2 namespace là home và product tương ứng việc tạo 2 file json
// để có thể dùng ở từng trang khác nhau để dễ quản lí
export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI
  }
} as const;

// Default Namespace mặc định là product, được dùng cho những trường hợp không truyền namespace
// vào trong useTranslation thì sẽ mặc định sử dụng namespace product
export const defaultNS = "product";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // ngôn ngữ mặc định
  ns: ["home", "product"], // Liệt kê những namespace sử dụng trong dự án của chúng ta
  fallbackLng: "vi", // trong trường hợp không xác định ngôn ngữ thì dùng tiếng Việt
  defaultNS, // Default Namespace
  interpolation: {
    // Bởi vì React đã có khả năng chống xss khi ta render theo kiểu JSX
    escapeValue: false // react already safes from xss
  }
});
