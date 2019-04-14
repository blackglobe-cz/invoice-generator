import InvoiceModel from 'invoice/stores/InvoiceModel'
import InvoiceStore from 'invoice/stores/InvoiceStore'
import SupplierModel from 'settings/stores/SupplierModel'

export {
	invoiceSerializer,
	getInvoiceBasedOnSupplier,
}

function invoiceSerializer(invoice) {
	if (!invoice) return invoice

	return invoice
	// const i = JSON.parse(JSON.stringify(invoice))
	// i.supplier_id = i.supplier.id
	// i.supplier = i.supplier.text
	// return i
}

function getInvoiceBasedOnSupplier(supplier, id) {
	return new Promise((resolve, reject) => {
		if (!supplier) {
			supplier = new SupplierModel({
				id: null,
			})
		}
		const due_date = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(supplier.default_due_date_period || 14)))).toISOString().slice(0, 10)
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