import InvoiceModel from 'invoice/stores/InvoiceModel'
import InvoiceStore from 'invoice/stores/InvoiceStore'
import SupplierModel from 'settings/stores/SupplierModel'

export {
  getInvoiceBasedOnSupplier,
}

function getInvoiceBasedOnSupplier(supplier, id) {
  return new Promise((resolve, reject) => {
		let ignoreSupplier
		if (!supplier) {
			supplier = new SupplierModel()
			ignoreSupplier = true
		}
    const due_date = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(supplier.default_due_date_period || 14)))).toISOString().slice(0, 10)
    const invoice_rows = []
    let price = 0
    ;(supplier.default_invoice_rows || []).map(item => {
      price += parseFloat(item.price)
      invoice_rows.push([item.text, item.price])
    })

    supplier = prepareForContentEditable(copy(supplier))

    InvoiceStore.getNextOrderNumber(supplier.id, (new Date()).toISOString().slice(0, 10), ignoreSupplier).then(res => {
      return resolve(new InvoiceModel({
        id,
        order_number: res,
        supplier: supplier,
        logo: supplier.logo,
        language: supplier.language,
        currency: supplier.default_currency,
        purchaser: copy(supplier.purchasers[0]),
        bank_account: copy(supplier.bank_accounts[0]),
        invoice_rows,
        qr_code: !!supplier.show_qr_code,
        footer: supplier.footer,
        due_date,
        price,
      }))
    }).catch(err => {
      console.log('fok', err);
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