export default {
	serialize: invoice => {
		const serialized = {
			id: invoice.id,
			logo: invoice.logo,
			language: invoice.language,
			issue_date: invoice.issue_date,
			tax_date: invoice.tax_date,
			due_date: invoice.due_date,
			order_number: invoice.order_number,
			order_number_autocalc: invoice.order_number_autocalc,
			to_other_eu_country: invoice.to_other_eu_country,
			price: invoice.price,
			currency: invoice.currency,
			is_tax_document: invoice.is_tax_document,
			supplier: invoice.supplier,
			purchaser: invoice.purchaser,
			payment_type: invoice.payment_type,
			qr_code: invoice.qr_code,
			invoice_rows: invoice.invoice_rows,
			footer: invoice.footer,
		}
		if (invoice.supplier_ref) serialized.supplier_id = invoice.supplier_ref.id
		if (invoice.purchaser_ref) serialized.purchaser_id = invoice.purchaser_ref.id
		if (invoice.bank_account_id) {
			serialized.bank_account_id = invoice.bank_account_id
		} else {
			serialized.bank_account = invoice.bank_account
		}
		return serialized
	},
	deserialize: invoice => {
		return invoice
	},
}