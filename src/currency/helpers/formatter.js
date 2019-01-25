const currencies = {
	CZK: {
		code: 'CZK',
		short: 'Kč',
	},
	EUR: {
		code: 'EUR',
		short: '€',
	},
	USD: {
		code: 'USD',
		short: '$',
	},
}

const currenciesSuffixed = [
	currencies.CZK.code
]

export default function (amount, currencyCode) {
	let curr = ''
	if (!currencies[currencyCode]) {
		console.error('Unknown currency code', currencyCode)
		curr = 'munny'
	} else {
		curr = currencies[currencyCode].short
	}

	const amountFormatted = (parseFloat(amount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')

	if (currenciesSuffixed.indexOf(currencyCode) > -1) return `${amountFormatted}\u00A0${curr}`
	return `${curr}\u00A0${amountFormatted}`
}