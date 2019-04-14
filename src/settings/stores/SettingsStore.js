import { observable, action, runInAction, computed } from 'mobx'
import { createTransformer } from 'mobx-utils'

import SupplierModel from './SupplierModel'
import agent from 'agent'
import logger from 'logger'

class SettingsStore {

	@observable loaded = false
	@observable items = []
	@observable defaultSupplier

	@computed get suppliers() {
		return this.items
	}
	@computed get suppliersLength() {
		return this.items.length
	}

	supplier = createTransformer(id => this.items.find(item => item.id === id))

	fetchRunning = false
	q = []

	@action
	load(id) {
		return new Promise((resolve, reject) => {
			if (!this.loaded) {
				if (this.fetchRunning) return this.q.push({ resolve, reject })
				this.fetchRunning = true

				agent.settings.query().then(items => {
					runInAction(() => items.forEach(item => this.items.push(new SupplierModel(item))))
					this.q.forEach(item => item.resolve(item.id ? this.items.find(it => it.id = item.id) : this.items))
					return resolve(id ? items.find(it => it.id === id) : items)
				}).catch(e => {
					logger.log('settings fetch failed', e);
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

	@action save(supplier, create) {
		if (create) this.items.push(supplier)
		return agent.settings[create ? 'create' : 'update'](supplier).then(() => {
			logger.log('Supplier created ok')
		}).catch(err => {
			for (var i = this.items.length;i--;) {
				if (this.items[i].id === supplier.id) {
					logger.log('Failed to save supplier', err)
					runInAction(() => {
						this.items.splice(i, 1)
					})
					return
				}
			}
		})
	}

	@action
	delete(supplier) {
		let temp
		let tempIndex
		for (var i = this.items.length;i--;) {
			if (this.items[i].id === supplier.id) {
				temp = this.items.splice(i, 1)
				tempIndex = i
				break
			}
		}
		return agent.settings.delete(supplier.id).then(() => {
			// logger.log('Supplier deleted ok')
		}).catch(err => {
			logger.log('Failed to delete supplier', err)
			this.items.splice(tempIndex, 0 ,temp)
		})
	}

	@action
	exportSettings() {
		return agent.settings.export()
	}

	@action
	importSettings(importString) {
		return agent.settings.import(importString)
	}

}

export default new SettingsStore()