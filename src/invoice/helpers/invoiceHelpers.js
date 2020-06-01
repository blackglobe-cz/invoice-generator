import InvoiceModel from 'invoice/stores/InvoiceModel'
import InvoiceStore from 'invoice/stores/InvoiceStore'
import SupplierModel from 'settings/stores/SupplierModel'
import { DEFAULT_DUE_PERIOD } from 'consts'

export {
	isPriceLike,
	getInvoiceBasedOnSupplier,
	prepareDataForGraph,
}

function isPriceLike(priceString) {
	return /^(\s*[0-9]+\s*)+(\.\d+)?$/.test(priceString)
}

function getInvoiceBasedOnSupplier(supplier, id) {
	return new Promise((resolve, reject) => {
		if (!supplier) {
			supplier = new SupplierModel({
				id: null,
			})
		}
		const due_date = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(supplier.default_due_date_period || DEFAULT_DUE_PERIOD)))).toISOString().slice(0, 10)
		const invoice_rows = []
		let price = 0
		;(supplier.default_invoice_rows.length ? supplier.default_invoice_rows : [{ text: '', price: 0 }]).map(item => {
			price += parseFloat(item.price)
			invoice_rows.push([item.text, item.price])
		})

		supplier = prepareForContentEditable(copy(supplier))
		const purchaser = supplier.purchasers.length ? supplier.purchasers.find(p => p.default) || supplier.purchasers[0] : { text: '' }

		InvoiceStore.getNextOrderNumber(supplier.id, (new Date()).toISOString().slice(0, 10)).then(res => {
			return resolve(new InvoiceModel({
				id,
				order_number: res,
				supplier: supplier.identification_text,
				supplier_id: supplier.id ? supplier.id : void 0,
				supplier_ref: supplier,
				is_tax_document: !!supplier.registered_for_vat,
				logo: supplier.logo,
				language: supplier.language,
				currency: supplier.default_currency,
				purchaser: purchaser.text,
				purchaser_id: supplier.id ? purchaser.id : void 0,
				purchaser_ref: supplier.id ? purchaser : void 0,
				bank_account: supplier.bank_accounts.length ? copy(supplier.bank_accounts[0]) : {},
				invoice_rows,
				qr_code: !!supplier.show_qr_code,
				footer: supplier.footer,
				due_date,
				price,
			}))
		}).catch(err => {
			return reject(err)
		})
	})
}

function copy(obj) {
	return JSON.parse(JSON.stringify(obj))
}

function prepareForContentEditable(supplier = {}) {
	supplier.identification_text = supplier.identification_text.replace(/\n/g, '<br />')
	supplier.purchasers.forEach(item => item.text = item.text.replace(/\n/g, '<br />'))
	return supplier
}

/**
 *	Prepares one-year of data from invoices
 */
function prepareDataForGraph(invoices, { date, t } = {}) {
	let dateAlt = (date && typeof date.getTime === 'function') ? new Date(date.getTime()) : (new Date())
	dateAlt.setDate(15)
	const year = dateAlt.getFullYear()
	const month = dateAlt.getMonth()

	const data = []
	const dataKeys = []
	const totals = {}

	// prepare X axis
	for (var i = 12;i--;) {
		let loopMonth = dateAlt.getMonth()
		data.unshift({ name: t(`date.month.${loopMonth + 1}`) + (([11, 0].includes(i) || loopMonth === 0) ? ` ${dateAlt.getFullYear()}` : '') })
		dateAlt = new Date(dateAlt.getFullYear(), dateAlt.getMonth() - 1, 15)
	}

	// prepare data
	invoices.forEach(item => {
		const dataKeyTotals = (item.supplier_ref && item.supplier_ref.id) ? (item.supplier_ref.label || item.supplier_ref.id) : 'undefined'

		// const dataKey = `${dataKeyTotals}_${item.currency}`
		const dataKey = `${dataKeyTotals}`

		if (dataKeys.indexOf(dataKey) === -1) dataKeys.push(dataKey)
		const dataYear = parseInt(item.issue_date.slice(0, 4), 10)
		const dataMonth = parseInt(item.issue_date.slice(5, 7), 10) - 1

		// throw away invoices older than a year
		if ((dataYear < year && dataMonth < month) || dataYear > year) return

		const dataIndex = 11 - ((year - dataYear) * 12) - (month - dataMonth)
		if (dataIndex < 0 || dataIndex > 11) return

		data[dataIndex][dataKey] = data[dataIndex][dataKey] || 0
		data[dataIndex][dataKey] += item.price

		totals[dataKeyTotals] = totals[dataKeyTotals] || {}
		totals[dataKeyTotals][item.currency] = totals[dataKeyTotals][item.currency] || { total: 0, price: 0, vat: 0 }
		totals[dataKeyTotals][item.currency].total += item.total_price
		totals[dataKeyTotals][item.currency].price += item.price
		totals[dataKeyTotals][item.currency].vat += item.vat_amount
	})

	return { data, dataKeys, totals }
}