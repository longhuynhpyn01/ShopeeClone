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
    // Để set môi trường hiện tại thành Node
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
        semi: true,
        trailingComma: "none",
        tabWidth: 2,
        endOfLine: "auto",
        useTabs: false,
        // Để dùng dấu nháy kép trong code
        singleQuote: false,
        printWidth: 120,
        // Để dùng dấu nháy kép trong jsx
        jsxSingleQuote: false,
        htmlWhitespaceSensitivity: "css",
        quoteProps: "as-needed",
        overrides: [
          {
            files: "*.css",
            options: {
              parser: "css"
            }
          },
          {
            files: "*.scss",
            options: {
              parser: "scss"
            }
          }
        ],
        importOrder: ["^react(.*)$", "<THIRD_PARTY_MODULES>", "^components/(.*)", "@/(.*)", "^[./]"],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true
      }
    ]
  }
};
