// @ts-check
import { defineFlatConfig } from "eslint-define-config";
import eslintConfigPrettier from "eslint-config-prettier";
import js from "@eslint/js";
import globals from "globals";

export default defineFlatConfig([
  eslintConfigPrettier,
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          implicitStrict: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    files: ["**/*.js"],
  },
]);
