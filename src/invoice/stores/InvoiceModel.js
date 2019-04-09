import { computed, observable, runInAction } from 'mobx'

import {
	DEFAULT_LANGUAGE,
	DEFAULT_CURRENCY,
	DEFAULT_DUE_PERIOD,
	VAT_AMOUNT,
} from 'consts'

import isoCurrencies from 'currency/helpers/list'
import PaymentTypeStore from 'payment-type/stores/PaymentTypeStore'

export default class InvoiceModel {
	id
	logo
	@observable language
	@observable issue_date
	@observable tax_date
	@observable due_date
	@observable order_number
	@observable order_number_autocalc
	@observable to_other_eu_country
	@observable price
	@computed get vat_amount() {
		return (VAT_AMOUNT / 100) * (this.price || 0)
	}
	@computed get total_price() {
		return this.price + (((this.supplier && this.supplier.registered_for_vat) || this.to_other_eu_country) ? this.vat_amount : 0)
	}
	@observable currency
	@observable supplier
	@observable supplier_id
	@observable purchaser
	@observable purchaser_id
	@observable bank_account
	@observable payment_type
	@observable qr_code
	@observable footer
	@computed get qr_code_value() {
		const due_date = new Date(this.due_date)
		if (!(
			this.bank_account && this.bank_account.iban && this.bank_account.swift
			&& this.total_price > 0
			&& this.currency && isoCurrencies.indexOf(this.currency) > -1
			&& due_date && typeof due_date.getDate === 'function'
			&& this.order_number
		)) return ''
		const spayd = 'SPD*1.0'
			+ '*ACC:' + this.bank_account.iban + '+' + this.bank_account.swift
			+ '*AM:' + String(this.total_price)
			+ '*CC:' + String(this.currency).toUpperCase()
			+ '*DT:' + due_date.toISOString().slice(0, 10)
			+ '*X-VS:' + String(this.order_number.slice(0, 10))
		// qrcode.makeCode(spayd)
		// fe($('.qr-outer-wrapper'), el => (checkQRValidity() ? el.classList.remove('invalid') : el.classList.add('invalid')))
		return spayd
	}
	@observable invoice_rows
	@observable autocalc

	constructor({
		id,
		logo,
		language,
		issue_date,
		tax_date,
		due_date,
		order_number,
		order_number_autocalc,
		to_other_eu_country,
		price,
		currency,
		supplier,
		supplier_id,
		purchaser,
		purchaser_id,
		bank_account,
		payment_type,
		qr_code,
		invoice_rows,
		footer,
	} = {}) {
		runInAction(() => {
			this.id = id || (new Date()).getTime()
			this.logo = logo
			this.language = language || DEFAULT_LANGUAGE
			this.issue_date = issue_date || (new Date()).toISOString().slice(0, 10)
			this.tax_date = tax_date || (new Date()).toISOString().slice(0, 10)
			this.due_date = due_date || (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * DEFAULT_DUE_PERIOD))).toISOString().slice(0, 10) // + 14 days
			this.order_number = order_number
			this.order_number_autocalc = typeof order_number_autocalc !== 'undefined' ? order_number_autocalc : false
			this.to_other_eu_country = to_other_eu_country || false
			this.price = price || 0
			this.currency = currency || DEFAULT_CURRENCY
			this.supplier = supplier
			this.supplier_id = supplier_id
			this.purchaser = purchaser
			this.purchaser_id = purchaser_id
			this.bank_account = bank_account
			this.payment_type = payment_type || PaymentTypeStore.paymentTypes[0]
			this.qr_code = typeof qr_code !== void 0 ? qr_code : true
			this.invoice_rows = invoice_rows || []
			this.footer = footer || ''

			this.autocalc = true
		})
	}
}

// function defaultOrderNumberFn(invoice) {
// 	const lastOrderNumber = '?'
// 	const orderNumbers = InvoiceStore.items.map(invoice => invoice.order_number)
// 	return '112567'
// }