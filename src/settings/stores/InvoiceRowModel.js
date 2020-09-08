import { observable, runInAction } from 'mobx'

export default class InvoiceRowModel {

	@observable text
	@observable vat
	@observable price

	constructor({ text, vat, price } = {}) {
		runInAction(() => {
			this.text = text || ''
			this.vat = typeof vat !== 'undefined' ? vat : 0
			this.price = typeof price !== 'undefined' ? price : 0
		})
	}
}