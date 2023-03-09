module.exports = {
  extends: ["@operationmonkey/eslint-config-core"],
  parserOptions: {
    project: ["./tsconfig.json", "./apps/*/tsconfig.json"]
  },
  ignorePatterns: ["**/build/**/*"]
}

