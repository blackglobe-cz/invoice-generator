const INVOICE_STORAGE_KEY = 'bg-invoice-generator-invoices'
let invoiceStorage = { invoices: [] }
const SETTINGS_STORAGE_KEY = 'bg-invoice-generator-settings'
let settingsStorage = { suppliers: [] }

export default {
	invoice: {
		query: () => {
			invoiceStorage = JSON.parse(window.localStorage.getItem(INVOICE_STORAGE_KEY)) || { invoices: [] }

			// if (!(invoiceStorage && invoiceStorage.invoices && invoiceStorage.invoices.length)) {
			// 	invoiceStorage.invoices.push(getMockInvoice())
			// }

			return Promise.resolve(invoiceStorage.invoices || [])
		},
		create: item => {
			invoiceStorage.invoices.unshift(item)
			window.localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoiceStorage))
			return Promise.resolve(item)
		},
	},
	settings: {
		query: () => {
			return new Promise((resolve, reject) => {
				settingsStorage = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)) || { suppliers: [] }
				setTimeout(() => {
					resolve(settingsStorage.suppliers || [])
				}, 500)
			})
		},
		create: item => {
			settingsStorage.suppliers.push(item)
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
					return resolve(item)
				}, 500)
			})
		},
		update: item => {
			for (var i = settingsStorage.suppliers.length;i--;) {
				if (settingsStorage.suppliers[i].id === item.id) {
					settingsStorage.suppliers[i] = item
					break
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
					return resolve({ ok: true })
				}, 500)
			})
		},
		delete: id => {
			for (var i = settingsStorage.suppliers.length;i--;) {
				if (settingsStorage.suppliers[i].id === id) {
					settingsStorage.suppliers.splice(i, 1)
					break
				}
			}
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
					return resolve({ ok: true })
				}, 500)
			})
		}
	}
}

///////////////////

function getMockInvoice() {
	// const newId = (new Date()).getTime()
	const newId = 1548095071868

	return {
		id: newId,

		// settings_snapshot: {},
		logo: '<svg version="1.1" id="BlackGlobe-logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 250 200" enable-background="new 0 0 250 200" xml:space="preserve"><path fill="#202020" d="M0.1,6.744L0,158.648c0,3.032,1.198,5.897,3.332,8.03l33.318-33.32c0,0,0-92.961,0-103.29c0-14.662-4.996-23.325-16.66-23.325C11.961,6.744,0.1,6.744,0.1,6.744z"/><path fill="#202020" d="M43.315,126.697c0,0,27.323,56.94,36.65,66.271c5.331,5.329,8.097,7.031,16.76,7.031h28.623c3.031,0,5.897-1.199,8.029-3.336c0,0-3.333,0-9.996-6.659c-7.663-7.667-53.413-89.964-53.413-89.964L43.315,126.697z"/><path fill="#202020" d="M103.29,66.719c2.5-2.498,7.665-6.33,13.328-6.664c5.664-0.331,6.663-3.332,6.663-3.332H83.297c0,0,0.334,3.332,3.332,3.332c3,0,6.665,1.999,6.665,6.664c0,1.668-0.4,3-0.932,3.998c-1.034,1.966-3.831,7.729-2.301,9.331C90.061,80.048,100.792,69.218,103.29,66.719z"/><path fill="#202020" d="M136.712,90.044h26.654v13.327c0,0,13.996-13.327,39.984-13.327c25.99,0,36.883,10.229,39.98,13.327c3.102,3.099,6.67,10.999,6.67,16.659c0,5.668,0,79.97,0,79.97s-10.332,0-19.998,0c-10.092,0-16.656-6.966-16.656-16.664c0-20.655,0-61.675,0-66.637c0-12.761-6.566-19.991-19.994-19.991c-7.229,0-18.326,1.666-29.986,13.327c-14.997,14.994-29.988,33.32-29.988,33.32c-2.132-2.133-3.333-5.032-3.333-8.029v-31.154c0-4.565-2.563-12.062-6.663-14.128H136.712z"/></svg>',

		language: 'CS',

		issue_date: '2019-01-21',
		due_date: '2019-02-04',
		order_number_of_the_day: 1,
		order_number: '1901210001',
		to_other_eu_country: false,

		price: 14000,
		currency: 'CZK',

		supplier: {
			text: 'Ing. Kamil Novotný<br />'
				+ 'Svépomoc IV 1670/11<br />750 02 Přerov I-Město<br />'
				+ '<br />IČ: 012 09 965'
				+ '<br />DIČ: CZ9008196065',
		},
		purchaser: {
			id: 'tm',
			label: 'TopMonks',
			text: 'TopMonks s. r. o.<br />Struhařovská 2931/9<br />141 00 Praha 4<br /><br />IČ: 248 47 437<br />DIČ: CZ 248 47 437',
			registered_for_vat: true
		},
		bank_account: {
			id: 'fio',
			value: {
				currency: 'czk',
				label: '2200301755/2010',
				bank: 'Fio banka a.s.',
				account_number: '2200301755/2010',
				iban: 'CZ0920100000002200301755',
				swift: 'FIOBCZPPXXX'
			},
		},
		qr_code: true,
		invoice_rows: [
			['Programátorské služby', '100000']
		],
	}
}