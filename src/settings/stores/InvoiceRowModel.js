import { observable, runInAction } from 'mobx'

export default class InvoiceRowModel {

	@observable text
	@observable price

	constructor() {
		runInAction(() => {
			this.text = ''
			this.price = 0
		})
	}
}