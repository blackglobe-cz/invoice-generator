import { observable, action, runInAction, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'

import InvoiceModel from './InvoiceModel'
import agent from 'agent'

class InvoiceStore {

	@observable loaded = false
	@observable items = []

	@computed get invoices() {
		return this.items
	}
	@computed get invoicesLength() {
		return this.items.length
	}

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

	@action
	save(invoice, create) {
		// console.log('Saving invoice', invoice);
		agent.invoice[create ? 'create' : 'update'](invoice).then(res => {
			console.log('Invoice saved ok');
			if (create) {
				runInAction(() => {
					this.items.push(invoice)
				})
			} else {
				for (var i = this.items.length;i--;) {
					if (this.items[i].id === invoice.id) {
						runInAction(() => {
							this.items[i] = invoice
						})
						break
					}
				}
			}
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

	@action
	delete(invoiceId) {
		return new Promise((resolve, reject) => {
			let item
			agent.invoice.delete(invoiceId).then(res => {
				for (var i = this.items.length;i--;) {
					if (this.items[i].id === invoiceId) {
						runInAction(() => {
							item = this.items.splice(i, 1)
						})
						break
					}
				}
				resolve(item)
			}).catch(err => {
				reject(err)
			})
		})
	}

}

export default new InvoiceStore()