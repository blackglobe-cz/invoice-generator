import { observable, action, runInAction, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'

import InvoiceModel from './InvoiceModel'
import agent from 'agent'

class InvoiceStore {

	@observable loaded = false
	@observable items = []

	// @computed get selectedItem() {
	// 	return toJS(this.item)
	// }
	// @computed get invoices() {
	// 	return Object.values(toJS(this.items))
	// }
	@computed get invoices() {
		return this.items
	}
	@computed get invoicesLength() {
		return this.items.length
	}
	// @computed get invoice() {
	// 	console.log('getter', arguments)
		
	// 	return this.items.find(item => item.id === id)
	// }
	invoice = createTransformer(id => this.items.find(item => item.id === id))

	fetchRunning = false
	q = []

	@action
	load(id) {
		return new Promise((resolve, reject) => {
			if (!this.loaded) {
				if (this.fetchRunning) return this.q.push({ resolve, reject })
				this.fetchRunning = true

				agent.invoice.query().then(invoices => {
					runInAction(() => invoices.forEach(inv => this.items.push(new InvoiceModel(inv))))

					this.q.forEach(item => item.resolve(item.id ? this.items.find(inv => inv.id = item.id) : this.items))

					return resolve(id ? invoices.find(inv => inv.id === id) : invoices)
				}).catch(e => {
					console.log('invoice list fetch faiiled', e);
					this.q.forEach(item => item.reject(e))
					return reject(e)
				}).finally(() => {
					runInAction(() => {
						this.fetchRunning = false
						this.loaded = true
					})
				})
				return
			}
			return resolve(id ? this.items.find(item => item.id === id) : this.items)
		})
	}

	@action save(invoice) {
		const newInvoice = new InvoiceModel(invoice)
		this.items.push(newInvoice)
		agent.invoice.create(newInvoice).then(res => {
			console.log('Invoice created ok');
		}).catch(err => {
			for (var i = this.items.length;i--;) {
				if (this.items[i].id === invoice.id) {
					console.log('Failed to save invoice');
					runInAction(() => {
						this.items.splice(i, 1)
					})
					return
				}
			}
		})
	}
}

export default new InvoiceStore()