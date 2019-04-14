const fallback = 'Invoice Generator'

export default function(title, { invoiceModel = {} } = {}) {
	document.title = title || invoiceModel.order_number || fallback
}