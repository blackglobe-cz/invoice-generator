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

export default function (amount, currencyCode) {
	let curr = ''
	if (!currencies[currencyCode]) {
		logger.log('Unknown currency code', currencyCode)
		curr = currencyCode
	} else {
		curr = currencies[currencyCode].short
	}

	const amountFormatted = (parseFloat(amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')

	if (isSuffixed(currencyCode)) return `${amountFormatted}\u00A0${curr}`
	return `${curr}\u00A0${amountFormatted}`
}