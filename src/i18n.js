import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { DEFAULT_LANGUAGE } from 'consts'

const initConfig = {
	fallbackLng: {
		'cs': ['cs'],
		'cs_CZ': ['cs'],
		'en': ['en'],
		'en-GB': ['en'],
		'en-US': ['en'],
		'default': [DEFAULT_LANGUAGE]
	},
	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
	react: {
		wait: true,
		nsMode: 'default',
	},
}

let config
if (window.targetStatic) {
	config = require('../config/static')
	initConfig.debug = config.i18n.debug
	initConfig.resources = {
		en: { translation: require('./locales/en/translation.json') },
		cs: { translation: require('./locales/cs/translation.json') },
	}
} else {
	config = require('../config/dev')
	initConfig.debug = config.i18n.debug
	initConfig.backend = {
		loadPath: '/locales/{{lng}}/{{ns}}.json',
	}
	i18n
		// load translation using xhr -> see /public/locales
		// learn more: https://github.com/i18next/i18next-xhr-backend
		.use(Backend)
}

i18n
	// detect user language
	// learn more: https://github.com/i18next/i18next-browser-languageDetector
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next.
	.use(initReactI18next)
	// init i18next
	// for all options read: https://www.i18next.com/overview/configuration-options
	.init(initConfig)

export default i18n