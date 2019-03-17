import { observable, action, runInAction, computed, toJS } from 'mobx'
import { createTransformer } from 'mobx-utils'

import PaymentTypeModel from './PaymentTypeModel'
import agent from 'agent'

class PaymentTypeStore {

  @observable items = [
    new PaymentTypeModel({ label: 'payment_type.bank_transfer', includes_bank_transfer: true }),
    new PaymentTypeModel({ label: 'payment_type.cash' })
  ]
  @computed get paymentTypes() {
		return this.items
	}

}

export default new PaymentTypeStore()