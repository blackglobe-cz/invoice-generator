import { computed, observable, runInAction } from 'mobx'

// import isoCurrencies from 'currency/helpers/list'

export default class SupplierModel {
	id
	@observable label
	@observable logo
	@observable default_language
	@observable identification_text
	@observable registered_for_vat
	// @observable decimal_delimiter
	@observable default_currency
	@observable default_due_date_period
	// @observable issuers
	// @observable default_issuer
	@observable purchasers
	// @observable default_purchaser
	@observable bank_accounts
	// @observable default_bank_account
	@observable footer
	@observable show_qr_code
	@observable default_invoice_rows

	constructor({
		id,
		label,
		logo,
		default_language,
		identification_text,
		registered_for_vat,
		default_currency,
		default_due_date_period,
		// issuers,
		// default_issuer,
		purchasers,
		// default_purchaser,
		bank_accounts,
		// default_bank_account,
		footer,
		show_qr_code,
		default_invoice_rows,
	} = {}) {
		runInAction(() => {
			this.id = id || (new Date()).getTime()
			this.logo = logo || ''
			this.label = label || ''
			this.default_language = default_language || 'cs'
			this.identification_text = identification_text || ''
			this.registered_for_vat = registered_for_vat || false
			this.default_currency = default_currency || 'CZK'
			this.default_due_date_period = default_due_date_period || 14
			// this.issuers = issuers || [{ label: '', text: '' }]
			// this.default_issuer = default_issuer
			this.purchasers = purchasers || [{ label: '', text: '', registered_for_vat: true }]
			// this.default_purchaser = default_purchaser
			this.bank_accounts = bank_accounts || [{
				// code: '',
				label: '',
				bank: '',
				account_number: '',
				iban: '',
				swift: '',
			}]
			// this.default_bank_account = default_bank_account
			this.footer = footer || ''
			this.show_qr_code = typeof show_qr_code !== void 0 ? show_qr_code : true
			this.default_invoice_rows = default_invoice_rows || [{ text: '', price: 0 }]
		})
	}
}