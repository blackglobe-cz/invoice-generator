import { observable, runInAction } from 'mobx'

// import isoCurrencies from 'currency/helpers/list'

export default class PaymentTypeModel {
	@observable label
	@observable includes_bank_transfer

	constructor({
		label,
		includes_bank_transfer,
	}) {
		runInAction(() => {
			this.label = label
			this.includes_bank_transfer = includes_bank_transfer
		})
	}

}