import { observable, action, runInAction, computed } from 'mobx'
import { createTransformer } from 'mobx-utils'

import InvoiceModel from './InvoiceModel'
import agent from 'agent'
import logger from 'logger'
import SettingsStore from 'settings/stores/SettingsStore'

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

				Promise.all([
					agent.invoice.query(),
					SettingsStore.load()
				]).then(res => {
					const [invoices, suppliers] = res

					runInAction(() => invoices.forEach(inv => {
						inv.supplier_ref = suppliers.find(supplier => supplier.id === inv.supplier_id)
						if (inv.supplier_ref && inv.purchaser_id) {
							inv.purchaser_ref = (inv.supplier_ref.purchasers || []).find(purchaser => purchaser.id === inv.purchaser_id)
						}
						this.items.push(new InvoiceModel(inv))
					}))

					this.q.forEach(item => item.resolve(item.id ? this.items.find(inv => inv.id = item.id) : this.items))

					return resolve(id ? invoices.find(inv => inv.id === id) : invoices)
				}).catch(e => {
					logger.log('invoice list fetch failed', e)
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
		return new Promise((resolve, reject) => {
			agent.invoice[create ? 'create' : 'update'](invoice).then(res => {
				if (create) {
					runInAction(() => {
						this.items.unshift(invoice)
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
				return resolve(res)
			}).catch(err => {
				for (var i = this.items.length;i--;) {
					if (this.items[i].id === invoice.id) {
						logger.log('err invoice save', err)
						runInAction(() => {
							this.items.splice(i, 1)
						})
						return
					}
				}
				return reject(err)
			})
		})
	}

	@action
	delete(invoiceId) {
		return new Promise((resolve, reject) => {
			let item
			agent.invoice.delete(invoiceId).then(() => {
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

	@action
	getNextOrderNumber(supplierId, date) {
		return agent.invoice.getNextOrderNumber({ supplierId, date })
	}

	@action
	exportInvoices() {
		return agent.invoice.export()
	}

	@action
	importInvoices(importString) {
		return agent.invoice.import(importString)
	}

}

export default new InvoiceStore()