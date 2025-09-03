import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["src/__tests__/**"],
  },
  {
    files: ["src/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      complexity: ["error", 6],
      "max-lines-per-function": ["error", 50],
      "max-depth": ["error", 3],
      "max-lines": ["warn", 200],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-warning-comments": [
        "error",
        { terms: ["todo", "fixme", "hack", "xxx"], location: "anywhere" },
      ],
      "spaced-comment": ["error", "never"],
      "no-inline-comments": "error",
      "capitalized-comments": ["error", "always"],
      "no-trailing-spaces": "error",
      "no-magic-numbers": [
        "error",
        { ignore: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      ],
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];