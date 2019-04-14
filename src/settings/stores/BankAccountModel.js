import { observable, runInAction } from 'mobx'

export default class BankAccountModel {

	@observable id
	@observable label
	@observable bank
	@observable account_number
	@observable iban
	@observable swift

	constructor() {
		runInAction(() => {
			this.id = Date.now()
			this.label = ''
			this.bank = ''
			this.account_number = ''
			this.iban = ''
			this.swift = ''
		})
	}
}