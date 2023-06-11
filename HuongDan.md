# Dự án Shopee Clone

Figma: [Thuật toán zoom](https://www.figma.com/file/ksSZMCzR1i1aTPUZp95xAs/Thu%E1%BA%ADt-to%C3%A1n-zoom?node-id=0%3A1&t=sD6WslI7mJZeAN1z-1)

## Cài đặt package cho dự án Vite React TS

Chạy câu lệnh dưới đây để tạo project bằng vite

```bash
yarn create vite
```

Thay đổi port bằng cách thêm code sau vào file `Shopee/vite.config.ts`

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
```

Config tại file `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2015", // change target
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".", // change baseUrl

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Cài các depedency

### Bộ ESLint và Prettier trước

> Chúng ta sẽ cài hơi nhiều package 1 tí vì chúng ta setup từ đầu, còn Create React App setup sẵn 1 số thứ về ESLint rồi.

Dưới đây là những depedency mà chúng ta cần cài

- ESLint: linter (bộ kiểm tra lỗi) chính

- Prettier: code formatter chính

- @typescript-eslint/eslint-plugin: ESLint plugin cung cấp các rule cho Typescript

- @typescript-eslint/parser: Parser cho phép ESLint kiểm tra lỗi Typescript.

- eslint-config-prettier: Bộ config ESLint để vô hiệu hóa các rule của ESLint mà xung đột với Prettier.

- eslint-plugin-import: Để ESLint hiểu về cú pháp `import...` trong source code.

- eslint-plugin-jsx-a11y: Kiểm tra các vấn đề liên quan đến accessiblity (Tính thân thiện website, ví dụ cho thiết bị máy đọc sách).

- eslint-plugin-react: Các rule ESLint cho React

- eslint-plugin-prettier: Dùng thêm 1 số rule Prettier cho ESLint

- prettier-plugin-tailwindcss: Sắp xếp class tailwindcss

- eslint-plugin-react-hooks: ESLint cho React hook

Chạy câu lệnh dưới đây

```bash
yarn add eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-prettier prettier-plugin-tailwindcss eslint-plugin-react-hooks -D
```

Cấu hình ESLint

Tạo file `.eslintrc.cjs` tại thư mục root

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  extends: [
    // Chúng ta sẽ dùng các rule mặc định từ các plugin mà chúng ta đã cài.
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    // Disable các rule mà eslint xung đột với prettier.
    // Để cái này ở dưới để nó override các rule phía trên!.
    "eslint-config-prettier",
    "prettier"
  ],
  plugins: ["prettier"],
  settings: {
    react: {
      // Nói eslint-plugin-react tự động biết version của React.
      version: "detect"
    },
    // Nói ESLint cách xử lý các import
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname, "")],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  env: {
    node: true
  },
  rules: {
    // Tắt rule yêu cầu import React trong file jsx
    "react/react-in-jsx-scope": "off",
    // Cảnh báo khi thẻ <a target='_blank'> mà không có rel="noreferrer"
    "react/jsx-no-target-blank": "warn",
    // Tăng cường một số rule prettier (copy từ file .prettierrc qua)
    "prettier/prettier": [
      "warn",
      {
        arrowParens: "always",
        semi: false,
        trailingComma: "none",
        tabWidth: 2,
        endOfLine: "auto",
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ]
  }
};
```

Tạo file `.eslintignore`

```json
node_modules/
dist/
```

Tạo file `.prettierrc`

```json
{
  "arrowParens": "always",
  "semi": false,
  "trailingComma": "none",
  "tabWidth": 2,
  "endOfLine": "auto",
  "useTabs": false,
  "singleQuote": true,
  "printWidth": 120,
  "jsxSingleQuote": true
}
```

Tạo file `.prettierignore`

```json
node_modules/
dist/
```

Thêm script mới vào `package.json`

```json
  "scripts": {
    ...
    "lint": "eslint --ext ts,tsx src/",
    "lint:fix": "eslint --fix --ext ts,tsx src/",
    "prettier": "prettier --check \"src/**/(*.tsx|*.ts|*.css|*.scss)\"",
    "prettier:fix": "prettier --write \"src/**/(*.tsx|*.ts|*.css|*.scss)\""
  },
```

### Cài editorconfig

Tạo file `.editorconfig` ở thư mục root

```EditorConfig
[*]
indent_size = 2
indent_style = space
```

### Cấu hình tsconfig.json

Set `"target": "ES2015"` và `"baseUrl": "."` trong `compilerOptions`

### Cài tailwindcss

Cài các package dưới đây: Tham khảo [https://tailwindcss.com/docs/guides/vite](https://tailwindcss.com/docs/guides/vite)

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Cấu hình file config

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
```

Thêm vào file `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Cấu hình vite config

Cài package `@types/node` để sử dụng node js trong file ts không bị lỗi

```bash
yarn add -D @types/node
```

File `vite.config.ts`

```ts
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src")
    }
  }
});
```

### Cấu hình React Router

Cài package `react-router-dom` để sử dụng router

```bash
yarn add react-router-dom
```

### Sắp xếp code

Cài package `@trivago/prettier-plugin-sort-imports` để sắp xếp code

```bash
yarn add @trivago/prettier-plugin-sort-imports -D
```

Thay đổi code tại file `.prettierrc`

```json
{
  "arrowParens": "always",
  "semi": true,
  "trailingComma": "none",
  "tabWidth": 2,
  "endOfLine": "auto",
  "useTabs": false,
  "singleQuote": false,
  "printWidth": 120,
  "jsxSingleQuote": false,
  "htmlWhitespaceSensitivity": "css",
  "quoteProps": "as-needed",
  "overrides": [
    {
      "files": "*.css",
      "options": {
        "parser": "css"
      }
    },
    {
      "files": "*.scss",
      "options": {
        "parser": "scss"
      }
    }
  ],
  "importOrder": ["^react(.*)$", "<THIRD_PARTY_MODULES>", "^components/(.*)", "@/(.*)", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

Thay đổi tương tự tại file `.eslintrc.cjs`

Thêm file `src/useRouteElements.tsx`

```tsx
import { useRoutes } from "react-router-dom";

import RegisterLayout from "./layouts/RegisterLayout";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "/",
      element: <ProductList />
    },
    {
      path: "/login",
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: "/register",
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ]);

  return routeElements;
}
```

### Cài đặt React-hook-form để validate form

Cài package `react-hook-form` và `yup` để validate form

```bash
yarn add react-hook-form @hookform/resolvers yup
```

Tạo file `utils/rules.ts` để chứa các rule cần dùng cho form

```ts
import type { RegisterOptions, UseFormGetValues } from "react-hook-form";

import * as yup from "yup";
import type { AnyObject } from "yup";

type Rules = { [key in "email" | "password" | "confirm_password"]?: RegisterOptions }; // để hiện gợi ý khi nhấn

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Email là bắt buộc"
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Email không đúng định dạng"
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 5 - 160 ký tự"
    },
    minLength: {
      value: 5,
      message: "Độ dài từ 5 - 160 ký tự"
    }
  },
  password: {
    required: {
      value: true,
      message: "Password là bắt buộc"
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự"
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự"
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: "Nhập lại password là bắt buộc"
    },
    maxLength: {
      value: 160,
      message: "Độ dài từ 6 - 160 ký tự"
    },
    minLength: {
      value: 6,
      message: "Độ dài từ 6 - 160 ký tự"
    },
    validate:
      typeof getValues === "function"
        ? (value) => value === getValues("password") || "Nhập lại password không khớp"
        : undefined
  }
});

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string };
  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Nhập lại password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự")
    .oneOf([yup.ref(refString)], "Nhập lại password không khớp");
};

export const schema = yup.object({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .required("Password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
  confirm_password: handleConfirmPasswordYup("password"),
  price_min: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax
  }),
  name: yup.string().trim().required("Tên sản phẩm là bắt buộc")
});

export type Schema = yup.InferType<typeof schema>;
```

### Config lại trong tailwind để xoá

File `tailwind.config.js`

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    // disable class container trong tailwind
    container: false
  },
  theme: {
    extend: {
      // add colors
      colors: {
        orange: "#ee4d2d"
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      // add class container custom
      addComponents({
        ".container": {
          maxWidth: theme("columns.7xl"),
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: theme("spacing.4"),
          paddingRight: theme("spacing.4")
        }
      });
    })
    // require("@tailwindcss/line-clamp")
  ]
};
```

### Thêm axios, react-query

```bash
yarn add axios @tanstack/react-query @tanstack/react-query-devtools
```

Config axios tại file `utils/http.ts`

```ts
import axios, { AxiosError, type AxiosInstance } from "axios";
import config from "src/constants/config";

// Purchase: 1 - 3
// Me: 2 - 5
// Refresh Token cho purchase: 3 -  4
// Gọi lại Purchase: 4 - 6
// Refresh Token mới cho me: 5 - 6
// Gọi lại Me: 6

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 60 * 60 * 24, // 1 ngày
        "expire-refresh-token": 60 * 60 * 24 * 160 // 160 ngày
      }
    });
  }
}
const http = new Http().instance;

export default http;
```

Config react-query tại file `main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

Cài package `lodash` và `@types/lodash`

```bash
yarn add lodash
yarn add -D @types/lodash
```

### Cài thêm react-toastify

```bash
yarn add react-toastify
```

Config `react-toastify` trong file `App.tsx`

```tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useRouteElements from "./useRouteElements";

function App() {
  const routeElements = useRouteElements();

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  );
}

export default App;
```

### Tìm hiểu thêm 1 số thư viện

- Framer Motion ([www.framer.com/motion](https://www.framer.com/motion)) để dùng nhiều emotion đẹp
- Floating UI ([www.floating-ui.com](https://floating-ui.com)) để tính toán position các tooltip mà muốn hiển thị mà hỗ trợ bên Typescript tốt hơn React Popper
- React Popper ([www.popper.js.org/react-popper](https://popper.js.org/react-popper)) phiên bản cũ của Floating UI
- Heroicons ([www.heroicons.com](https://heroicons.com)): lấy những icon của tailwind css

````bash
yarn add @floating-ui/react-dom-interactions
yarn add framer-motion

Cài thêm thư viện `@tailwindcss/line-clamp` để có thể dùng multi-line truncation, dùng css line-clamp-2 => dài quá hiện ...

```bash
yarn add @tailwindcss/line-clamp
````

Cài thêm thư viện `dompurify` để loại bỏ JavaScript trong chuỗi string của chúng ta

```bash
yarn add dompurify
yarn add -D @types/dompurify
```

## Ghi chú code

Code xóa các ký tự đặc biệt trên bàn phím

```ts
export const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
```

Sữa lỗi Tailwindcss Extension không gợi ý class

Các bạn thêm đoạn code này vào `settings.json` của VS Code

```json
{
  //...
  "tailwindCSS.experimental.classRegex": ["[a-zA-Z]*class[a-zA-Z]*='([^']+)'"]
}
```

### Thư viện immer để đơn giản hóa việc change state

Redux Toolkit có sử dụng thư viện này
Cách nhanh nhất để change `extendedPurchases` mà không cần tìm hàm map để tìm index thì dùng `produce` của `immer` ở trong `Cart`

```bash
yarn add immer
```

### Sử dụng EventTarget

Khi token hết hạn thì ta phải clear local storage, tuy nhiên khi này state trong Context vẫn chưa được xóa đi. Ta có thể dùng window.reload() để load lại trang thì local storage lúc này rỗng thì state cũng sẽ reset lại. Tuy nhiên không mang tính single page cho trang web. Vì vậy nên ta dùng EventTarget.

Đầu tiên ở trong file `src/utils/auth.ts` khởi tạo biến `LocalStorageEventTarget` sau đó dùng biến này để dispatch 1 event mang tên là clearLS để cho `App.tsx` sẽ lắng nghe.

```tsx
// Tạo EventTarget để không phải dùng reload khi token hết hạn
export const LocalStorageEventTarget = new EventTarget();

...

export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("profile");
  const clearLSEvent = new Event("clearLS"); // Tạo event clearLS
  LocalStorageEventTarget.dispatchEvent(clearLSEvent); // Xuất ra 1 event để bên App lắng nghe
};

```

Tại file `App.tsx`

```tsx
...
function App() {
  const routeElements = useRouteElements();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    // Lắng nghe event clearLS từ src/utils/auth.ts để reset state localstorage khi access_token hết hạn
    LocalStorageEventTarget.addEventListener("clearLS", reset);

    return () => {
      LocalStorageEventTarget.removeEventListener("clearLS", reset);
    };
  }, [reset]);

  ....
```

### Sử dụng thư viện i18 để có app đa ngôn ngữ

Link: [react-i18next](https://react.i18next.com/getting-started)

```bash
yarn add react-i18next i18next
```

Tạo các file `home.json` và `product.json` trong folder `locales/en` và `locales/vi` để lưu trữ các thông tin cần đa ngôn ngữ.

```json
// en/home.json
{
  "aside filter": {
    "all categories": "All categories",
    "filter search": "Filter"
  }
}
```

```json
// vi/home.json
{
  "aside filter": {
    "all categories": "Tất cả danh mục",
    "filter search": "Bộ lọc tìm kiếm"
  }
}
```

Tạo file tại `src/i18n/i18n.ts`:

```ts
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
```

Tại file `src/main.tsx` import để ta sử dùng i18n

```ts
...

import "src/i18n/i18n"

...
```

Khi muốn dùng trong typescript thì tạo thêm file `src/@types/i18next.d.ts` để khai báo types và có thể gợi ý khi dùng useTranslate()

```ts
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
```

### Thư viện Rollup Plugin Visualizer

Vite được build dựa trên Rollup Plugin Visualizer
Rollup Plugin Visualizer dùng để phân tích file build để xem thư viện này chiếm nhiều trong file build như Lodash...
Ngoài ra cũng nên đọc thêm phần Build Options của Vite để tìm hiểu thêm nhiều config khi build
Nó tương tự như Webpack Analyzer

```bash
yarn add --dev rollup-plugin-visualizer
```

Thêm import tại file `vite.config.ts`

```ts
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()] as any,
  server: {
    // Để enabled source map css
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src")
    }
  }
});
```

Khi chạy lệnh build thì sẽ tạo ra thêm file `stats.html` nên ta cần đưa nó vào `.gitignore`

### Sử dụng React Helmet Async để cải thiện SEO cho trang web.

React Helmet Async là phiên bản cải tiến hơn so với React Helmet

```bash
yarn add react-helmet-async
```

Trước khi đó bạn nên cài đặt package `html-to-text` để convert description trong `productDetail` loại bỏ thẻ p qua kiểu string để thêm vào trong thẻ meta trong Helmet

```bash
yarn add html-to-text
yarn add -D @types/html-to-text
```

Bọc `HelmetProvider` lại `App` tại `src/main.tsx`

```ts
...
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```
