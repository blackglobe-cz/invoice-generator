import { observable, action, computed } from 'mobx'

const STORAGE_KEY = 'bg-invoice-generator-settings'

class SettingsStore {

    @observable loaded = false
    @observable items = observable.map()

    @computed get invoices() {
        return this.items.values()
    }

    @action load(id) {
        return new Promise((resolve, reject) => {
            if (!this.loaded) {
                let storage = window.localStorage.getItem(STORAGE_KEY)
                if (!(storage && storage.issuers && storage.issuers.length)) {
					storage = { issuers: [] }
				}
                this.items.merge(storage.issuers)
                this.loaded = true
            }

            if (!id) return resolve({
				issuers: Array.from( this.items.values() ),
			})
            return resolve(this.items.get(id))
        })
    }

    @action save(invoice) {
        this.items.set(invoice.id, invoice)
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
            issuers: Array.from( this.items.values ),
        }))
    }
}

export default new SettingsStore()