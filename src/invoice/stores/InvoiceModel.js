import { computed, observable, runInAction } from 'mobx'

import isoCurrencies from 'currency/helpers/list'

export default class InvoiceModel {
	id
	logo
	@observable language
	@observable issue_date
	@observable tax_date
	@observable due_date
	@observable order_number_of_the_day
	// @observable order_number
	@computed get order_number() {
		if (!this.issue_date) return ''
		const date = new Date(this.issue_date)
		return ('' + date.getFullYear()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(0, 2) + ('0' + date.getDate()).slice(0, 2) + ('000' + this.order_number_of_the_day).slice(0, 4)
	}
	@observable to_other_eu_country
	@observable price
	@computed get vat_amount() {
		return 0.21 * (this.price || 0)
	}
	@computed get total_price() {
		return this.price + this.vat_amount
	}
	@observable currency
	@observable supplier
	@observable purchaser
	@observable bank_account
	@observable qr_code
	@observable footer
	@computed get qr_code_value() {
		if (!(
			this.bank_account && this.bank_account.iban && this.bank_account.swift
			&& this.total_price > 0
			&& this.currency && isoCurrencies.indexOf(this.currency) > -1
			&& this.due_date && typeof this.due_date.getDate === 'function'
			&& this.order_number
		)) return ''
		const spayd = 'SPD*1.0'
			+ '*ACC:' + this.bank_account.iban + '+' + this.bank_account.swift
			+ '*AM:' + String(this.total_price)
			+ '*CC:' + String(this.currency).toUpperCase()
			+ '*DT:' + this.due_date.getISOString().slice(0, 10)
			+ '*X-VS:' + String(this.order_number.slice(0, 10))
		// qrcode.makeCode(spayd)
		// fe($('.qr-outer-wrapper'), el => (checkQRValidity() ? el.classList.remove('invalid') : el.classList.add('invalid')))
		return spayd
	}
	@observable invoice_rows

	constructor({
		id,
		logo,
		language,
		issue_date,
		tax_date,
		due_date,
		order_number_of_the_day,
		// order_number,
		to_other_eu_country,
		price,
		currency,
		supplier,
		purchaser,
		bank_account,
		qr_code,
		invoice_rows,
		footer,
	} = {}) {
		runInAction(() => {
			this.id = id || (new Date()).getTime()
			this.logo = logo
			this.language = language
			// this.issue_date = ensureDate(issue_date) || new Date()
			// this.tax_date = ensureDate(tax_date) || new Date()
			// this.due_date = ensureDate(due_date) || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 14)) // + 14 days
			this.issue_date = issue_date || (new Date()).toISOString().slice(0, 10)
			this.tax_date = tax_date || (new Date()).toISOString().slice(0, 10)
			this.due_date = due_date || (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 14))).toISOString().slice(0, 10) // + 14 days
			this.order_number_of_the_day = order_number_of_the_day || 1
			// this.order_number = order_number
			this.to_other_eu_country = to_other_eu_country || false
			this.price = price || 0
			this.currency = currency || 'CZK'
			this.supplier = supplier
			this.purchaser = purchaser
			this.bank_account = bank_account
			this.qr_code = qr_code || true
			this.invoice_rows = invoice_rows || []
			this.footer = footer || ''
		})
	}
}