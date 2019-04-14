import { observable, runInAction } from 'mobx'

import BankAccountModel from './BankAccountModel'
import PurchaserModel from './PurchaserModel'
import InvoiceRowModel from './InvoiceRowModel'

import {
	DEFAULT_ORDER_NUMBER_FORMAT,
	DEFAULT_LANGUAGE,
	DEFAULT_CURRENCY,
	DEFAULT_DUE_PERIOD,
} from 'consts'
// import isoCurrencies from 'currency/helpers/list'

export default class SupplierModel {
	id
	@observable label
	@observable logo
	@observable order_number_format
	@observable default_language
	@observable identification_text
	@observable registered_for_vat
	@observable default_currency
	@observable default_due_date_period
	@observable purchasers
	@observable bank_accounts
	@observable footer
	@observable show_qr_code
	@observable default_invoice_rows

	constructor({
		id,
		label,
		logo,
		order_number_format,
		default_language,
		identification_text,
		registered_for_vat,
		default_currency,
		default_due_date_period,
		purchasers,
		bank_accounts,
		footer,
		show_qr_code,
		default_invoice_rows,
	} = {}) {
		runInAction(() => {
			const idIsDefined = id !== void 0
			this.id = id
			this.logo = logo || ''
			this.order_number_format = order_number_format || DEFAULT_ORDER_NUMBER_FORMAT
			this.label = label || ''
			this.default_language = default_language || DEFAULT_LANGUAGE
			this.identification_text = identification_text || ''
			this.registered_for_vat = registered_for_vat || false
			this.default_currency = default_currency || DEFAULT_CURRENCY
			this.default_due_date_period = default_due_date_period || DEFAULT_DUE_PERIOD
			this.purchasers = purchasers || ( idIsDefined ? [] : [new PurchaserModel()] )
			this.bank_accounts = bank_accounts || ( idIsDefined ? [] : [new BankAccountModel()] )
			this.footer = footer || ''
			this.show_qr_code = show_qr_code !== void 0 ? show_qr_code : true
			this.default_invoice_rows = default_invoice_rows || ( idIsDefined ? [] : [new InvoiceRowModel()] )
		})
	}
}