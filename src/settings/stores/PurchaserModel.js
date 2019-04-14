import { observable, runInAction } from 'mobx'

export default class PurchaserModel {

	@observable id
	@observable label
	@observable text
	@observable registered_for_vat

	constructor() {
		runInAction(() => {
			this.id = Date.now()
			this.label = ''
			this.text = ''
			this.registered_for_vat = true
		})
	}
}