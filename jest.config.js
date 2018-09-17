module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "snapshotSerializers": [ "preact-render-spy/snapshot" ],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
    ],
    "moduleNameMapper": {
        "\\.(scss)$": "identity-obj-proxy"
    },
    "setupFiles": [
        "<rootDir>/src/tests/global-setup.ts"
    ],
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
        "src/app/**/*.{ts,tsx}",
        "!src/tests/**",
        "!**/node_modules/**",
        "!**/vendor/**"
      ]

  }