import {
	DEFAULT_ORDER_NUMBER_FORMAT,
} from 'consts'

import invoiceTransform from './invoiceTransform'

const INVOICE_STORAGE_KEY = 'bg-invoice-generator-invoices'
let invoiceStorage = { invoices: [] }
const SETTINGS_STORAGE_KEY = 'bg-invoice-generator-settings'
let settingsStorage = { suppliers: [] }

export const STORAGE_KEYS = {
	'INVOICE': INVOICE_STORAGE_KEY,
	'SETTINGS': SETTINGS_STORAGE_KEY,
}

export default {
	invoice: {
		query: () => {
			invoiceStorage = JSON.parse(window.localStorage.getItem(INVOICE_STORAGE_KEY)) || { invoices: [] }
			return Promise.resolve(invoiceStorage.invoices.map(invoiceTransform.deserialize) || [])
		},
		create: item => {
			item.id = generateId('invoice')
			invoiceStorage.invoices.unshift(invoiceTransform.serialize(item))
			window.localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoiceStorage))
			return Promise.resolve(item)
		},
		update: item => {
			for (var i = invoiceStorage.invoices.length;i--;) {
				if (invoiceStorage.invoices[i].id === item.id) {
					invoiceStorage.invoices[i] = invoiceTransform.serialize(item)
					break
				}
			}
			window.localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoiceStorage))
			return Promise.resolve(item)
		},
		delete: id => {
			let item
			for (var i = invoiceStorage.invoices.length;i--;) {
				if (invoiceStorage.invoices[i].id === id) {
					item = invoiceStorage.invoices.splice(i, 1)
					break
				}
			}
			window.localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(invoiceStorage))
			return Promise.resolve(item)
		},
		getNextOrderNumber,
		export: () => Promise.resolve(window.localStorage.getItem(INVOICE_STORAGE_KEY) || '{ invoices: [] }'),
		import: importString => {
			return new Promise((resolve, reject) => {
				try {
					const importObject = JSON.parse(importString)
					if (importObject.invoices.length === 0) return reject('error_importing_invoices_no_data')
					window.localStorage.setItem(INVOICE_STORAGE_KEY, importString)
					return resolve({ ok: true })
				} catch(e) {
					return reject('error_importing_invoices', e)
				}
			})
		},
	},
	settings: {
		query: () => {
			return new Promise(resolve => {
				settingsStorage = JSON.parse(window.localStorage.getItem(SETTINGS_STORAGE_KEY)) || { suppliers: [] }
				// setTimeout(() => {
				resolve(settingsStorage.suppliers || [])
				// }, 500)
			})
		},
		create: item => {
			item.id = generateId('supplier')
			settingsStorage.suppliers.push(item)
			return new Promise(resolve => {
				// setTimeout(() => {
				window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
				return resolve(item)
				// }, 500)
			})
		},
		update: item => {
			for (var i = settingsStorage.suppliers.length;i--;) {
				if (settingsStorage.suppliers[i].id === item.id) {
					settingsStorage.suppliers[i] = item
					break
				}
			}
			return new Promise(resolve => {
				// setTimeout(() => {
				window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
				return resolve({ ok: true })
				// }, 500)
			})
		},
		delete: id => {
			for (var i = settingsStorage.suppliers.length;i--;) {
				if (settingsStorage.suppliers[i].id === id) {
					settingsStorage.suppliers.splice(i, 1)
					break
				}
			}
			return new Promise(resolve => {
				// setTimeout(() => {
				window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsStorage))
				return resolve({ ok: true })
				// }, 500)
			})
		},
		export: () => Promise.resolve(window.localStorage.getItem(SETTINGS_STORAGE_KEY) || '{ suppliers: [] }'),
		import: importString => {
			return new Promise((resolve, reject) => {
				try {
					const importObject = JSON.parse(importString)
					if (importObject.suppliers.length === 0) return reject('error_importing_settings_no_suppliers')
					window.localStorage.setItem(SETTINGS_STORAGE_KEY, importString)
					return resolve({ ok: true })
				} catch(e) {
					return reject('error_importing_settings', e)
				}
			})
		},
	}
}

///////////////////

function generateId() {
	const id = (new Date()).getTime()
	return id
}

function getNextOrderNumber({ supplierId, date }) {
	return new Promise((resolve, reject) => {
		const issueDate = new Date(date)
		if (!(issueDate && typeof issueDate.getDate === 'function')) return reject('error_invalid_date')

		let supplier = {}
		let invoices = []
		if (supplierId) {
			supplier = settingsStorage.suppliers.find(item => item.id === supplierId)
			if (!(supplier && supplier.id)) return reject('error_supplier_not_found')
		}
		let orderNumber = supplier.order_number_format || DEFAULT_ORDER_NUMBER_FORMAT

		const oNDate = ('0' + issueDate.getDate()).slice(-2)
		const oNMonth = ('0' + (issueDate.getMonth() + 1)).slice(-2)
		const oNYearShort = ('' + issueDate.getFullYear()).slice(-2)
		const oNYearMedium = ('' + issueDate.getFullYear()).slice(-3)
		const oNYearLong = ('' + issueDate.getFullYear()).slice(-4)

		const yearGroup = (orderNumber.match(/YY*/g) || []).filter(item => !!item)
		const monthGroup = (orderNumber.match(/MM/g) || []).filter(item => !!item)
		const dateGroup = (orderNumber.match(/DD/g) || []).filter(item => !!item)
		// const oNGroup = (orderNumber.match(/NN*/g) || []).filter(item => !!item)
		const hasYearGroup = yearGroup.length && yearGroup[0]
		const hasMonthGroup = monthGroup.length && monthGroup[0]
		const hasDateGroup = dateGroup.length && dateGroup[0]

		let regex = '..........'.slice(0, orderNumber.length)
		if (hasDateGroup) replaceString(regex, orderNumber.indexOf(dateGroup[0]), oNDate)
		if (hasMonthGroup) replaceString(regex, orderNumber.indexOf(monthGroup[0]), oNMonth)
		if (hasYearGroup && yearGroup[0].length === 4) replaceString(regex, orderNumber.indexOf(yearGroup[0]), oNYearLong)
		if (hasYearGroup && yearGroup[0].length === 3) replaceString(regex, orderNumber.indexOf(yearGroup[0]), oNYearMedium)
		if (hasYearGroup && yearGroup[0].length === 2) replaceString(regex, orderNumber.indexOf(yearGroup[0]), oNYearShort)

		let orderNumberOfTheDay = 1
		const onotdPosition = regex.indexOf('.')
		const onotdLength = regex.replace(/\d/g, '').length
		if (supplierId) {
			invoices = invoiceStorage.invoices.filter(item => {
				let ok = true
				if (item.supplier.id !== supplierId) ok = false
				if (hasYearGroup && item.issue_date.slice(0, 4) !== date.slice(0, 4)) ok = false
				if (hasMonthGroup && item.issue_date.slice(5, 7) !== date.slice(5, 7)) ok = false
				if (hasDateGroup && item.issue_date.slice(8, 10) !== date.slice(8, 10)) ok = false
				return ok
			})
		}
		if (invoices.length) {
			invoices.forEach(invoice => {
				const match = invoice.order_number && invoice.order_number.match(regex)
				if (match && match.length) {
					const oN = parseInt(invoice.order_number.slice(onotdPosition, onotdPosition + onotdLength))
					if (oN >= orderNumberOfTheDay) orderNumberOfTheDay = oN + 1
				}
			})
		}

		orderNumber = orderNumber.replace(/YYYY/g, oNYearLong)
		orderNumber = orderNumber.replace(/YYY/g, oNYearMedium)
		orderNumber = orderNumber.replace(/YY/g, oNYearShort)
		orderNumber = orderNumber.replace(/MM/g, oNMonth)
		orderNumber = orderNumber.replace(/DD/g, oNDate)

		// this can be simplified
		orderNumber = orderNumber.replace(/NNNNNN/g, ('00000' + orderNumberOfTheDay).slice(-6))
		orderNumber = orderNumber.replace(/NNNNN/g, ('0000' + orderNumberOfTheDay).slice(-5))
		orderNumber = orderNumber.replace(/NNNN/g, ('000' + orderNumberOfTheDay).slice(-4))
		orderNumber = orderNumber.replace(/NNN/g, ('00' + orderNumberOfTheDay).slice(-3))
		orderNumber = orderNumber.replace(/NN/g, ('0' + orderNumberOfTheDay).slice(-2))

		return resolve(orderNumber)
	})
}
function replaceString(sourceStr, index, replacement) {
	return sourceStr.substr(0, index) + replacement + sourceStr.substr(index + replacement.length)
}