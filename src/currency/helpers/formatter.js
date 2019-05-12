import logger from 'logger'

export const currencies = {
	CZK: {
		label: 'Koruny české',
		code: 'CZK',
		short: 'Kč',
	},
	EUR: {
		label: 'Euro',
		code: 'EUR',
		short: '€',
	},
	USD: {
		label: 'US Dollars',
		code: 'USD',
		short: '$',
	},
}

const currenciesSuffixed = [
	currencies.CZK.code
]

export function isSuffixed(currencyCode) {
	return currenciesSuffixed.indexOf(currencyCode) > -1
}

export default function (amount, currencyCode, { skipCurrency, decimals } = {}) {
	let curr = ''
	if (!currencies[currencyCode]) {
		if (!skipCurrency) logger.log('Unknown currency code', currencyCode)
		curr = currencyCode
	} else {
		curr = currencies[currencyCode].short
	}

	const amountFormatted = (parseFloat(amount).toFixed(typeof decimals !== 'undefined' ? decimals : 2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')

	if (skipCurrency) return amountFormatted
	if (isSuffixed(currencyCode)) return `${amountFormatted}\u00A0${curr}`
	return `${curr}\u00A0${amountFormatted}`
}