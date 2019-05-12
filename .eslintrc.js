// "extends": "airbnb-base",
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
	"parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2018,
		"sourceType": "module",
		"ecmaFeatures": {
			"legacyDecorators": true,
		},
  },
  "rules": {
    "indent": ["error", "tab", { "SwitchCase": 1 }],
    "no-console": 1,
    "no-unused-vars": 1,
		"react/prop-types": false,
  },
  "globals": {
		"require": "readonly",
		"process": "readonly",
	},
	"settings": {
    "react": {
			"version": "detect",
		},
	},
}