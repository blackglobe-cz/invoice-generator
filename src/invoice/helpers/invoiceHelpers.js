import InvoiceModel from 'invoice/stores/InvoiceModel'

export {
  getInvoiceBasedOnSupplier,
}

function getInvoiceBasedOnSupplier(supplier) {

  const due_date = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(supplier.default_due_date_period || 14)))).toISOString().slice(0, 10)
  const invoice_rows = []
  let price = 0
  ;(supplier.default_invoice_rows || []).map(item => {
    price += parseFloat(item.price)
    invoice_rows.push([item.text, item.price])
  })

  return new InvoiceModel({
    supplier: prepareForContentEditable(copy(supplier)),
    logo: supplier.logo,
    language: supplier.language,
    currency: supplier.default_currency,
    purchaser: copy(supplier.purchasers[0]),
    bank_account: copy(supplier.bank_accounts[0]),
    invoice_rows,
    qr_code: supplier.show_qr_code,
    footer: supplier.footer,
    due_date,
    price,
  })
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function prepareForContentEditable(supplier = {}) {
  supplier.identification_text = supplier.identification_text.replace(/\n/g, '<br />')
  return supplier
}