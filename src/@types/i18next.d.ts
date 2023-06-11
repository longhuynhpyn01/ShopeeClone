import "i18next";
import { defaultNS, resources } from "src/i18n/i18n";

declare module "i18next" {
  // Kế thừa (thêm vào type)
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    // Ngôn ngữ mặc định mà ta dùng là tiếng Việt nên dùng vi
    resources: (typeof resources)["vi"];
  }
}
