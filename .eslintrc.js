// const { rules } = require("eslint-config-prettier");

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    "no-else-return": "error",
    "object-shorthand": "error",
    /**
     *  `no-return-await` disabled due to:
     * source(1): https://eslint.org/docs/latest/rules/no-return-await
     * source(2): https://v8.dev/blog/fast-async (near the end)
     */
    // "no-return-await": "error"
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
};
