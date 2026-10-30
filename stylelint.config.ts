import type { Config } from "stylelint";

export default {
  extends: [
    "stylelint-config-recommended",     
    "stylelint-prettier/recommended"],
  rules: {
    "block-no-empty": true
  }
} satisfies Config;