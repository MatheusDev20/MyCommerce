const js = require("@eslint/js");
const turboPlugin = require("eslint-plugin-turbo");
const tseslint = require("typescript-eslint");
const onlyWarn = require("eslint-plugin-only-warn");
const eslintConfigPrettier = require("eslint-config-prettier");
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');


/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "no-self-compare": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,

    },
  },
  {
    ignores: ["dist/**"],
  },
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
];

module.exports = { config };
