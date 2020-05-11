import React from 'react'
import { runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import Button from '@material/react-button'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'

import logger from 'logger'
import setDocumentTitle from 'docTitle'
import { currencies } from 'currency/helpers/formatter'
import { getInvoiceBasedOnSupplier } from '../helpers/invoiceHelpers'

import { LANGUAGES } from 'consts'

@inject('SettingsStore', 'PaymentTypeStore', 'InvoiceStore')
@withTranslation()
@observer
export default class InvoiceParamsForm extends React.Component {

	constructor() {
		super()

		this.state = {
			supplier_id: null,
			redirectTo: null,
		}
	}

	componentDidUpdate() {
		if (this.state.redirectTo) {
			this.setState({
				redirectTo: null,
			})
		}
	}

	handleFormSubmit(event) {
		event.preventDefault()

		const {
			InvoiceStore,
			data,
		} = this.props

		const creating = !data.id

		InvoiceStore.save(data, creating).then(res => {
			if (creating) this.setState({ redirectTo: `/invoice/${res.id}` })
		}).catch(err => {
			logger.log('err saving invoice', err)
		})
	}

	handleInput(prop, value) {
		runInAction(() => {
			const {
				InvoiceStore,
				data,
			} = this.props

			// I can encounter nested properties
			const propertyChain = prop.split('.')
			let target = data
			propertyChain.forEach((propertyName, index) => {
				if (index === (propertyChain.length - 1)) return // don't assign the last one, because it will be a primitive
				target = data[propertyName] || {} // it might be an undefined for all I know..
			})
			target[propertyChain[propertyChain.length - 1]] = value

			// if we change any prop that might affect order number, we recalculate
			if (data.order_number_autocalc && ['issue_date', 'order_number_autocalc'].indexOf(prop) > -1) {
				InvoiceStore.getNextOrderNumber(data.supplier_ref.id, data.issue_date).then(res => {
					runInAction(() => {
						data.order_number = res
						setDocumentTitle(null, { invoiceModel: data })
					})
				})
			}
		})
	}

	handleSupplierChange(e) {
		const value = e.target.value
		const {
			SettingsStore,
			data,
		} = this.props

		this.setState({
			supplier: value,
		}, () => {
			const supplier = SettingsStore.suppliers.find(item => ('' + item.id) === ('' + value))
			runInAction(() => {
				Object.assign(data, getInvoiceBasedOnSupplier(supplier, data.id))
			})
		})
	}

	bankAccountShouldBeVisible(data) {
		return data.payment_type && data.payment_type.includes_bank_transfer
	}

	render() {

		const {
			t,
			data,
			SettingsStore,
			PaymentTypeStore,
		} = this.props

		const {
			supplier,
			redirectTo,
		} = this.state

		const {
			suppliers,
		} = SettingsStore

		const {
			paymentTypes,
		} = PaymentTypeStore

		let bank_accounts = []
		let purchasers = []
		if (data && data.supplier_ref) {
			bank_accounts = data.supplier_ref.bank_accounts
			purchasers = data.supplier_ref.purchasers
		}

		if (redirectTo) return (<Redirect to={redirectTo} />)

		if (!data) return (<Text t='error.generic' />)

		const bankFormControls = []
		if (bank_accounts.length) {
			bankFormControls.push(
				{ type: 'select', name: 'bank.account', prop: 'bank_account', optSrc: bank_accounts, opts: bank_accounts.map(item => [item, item.label]), if: this.bankAccountShouldBeVisible }
			)
		} else {
			bankFormControls.push(
				{ type: 'input', name: 'bank.account_number', prop: 'bank_account.account_number', if: this.bankAccountShouldBeVisible },
				{ type: 'input', name: 'bank.bank', prop: 'bank_account.bank', if: this.bankAccountShouldBeVisible },
				{ type: 'input', name: 'bank.iban', prop: 'bank_account.iban', if: this.bankAccountShouldBeVisible },
				{ type: 'input', name: 'bank.swift', prop: 'bank_account.swift', if: this.bankAccountShouldBeVisible }
			)
		}

		const formConfig = [
			[
				{ type: 'select', name: 'invoice.language', prop: 'language', opts: LANGUAGES, optSrc: LANGUAGES.map(i => i[0]) }
			], [
				{ type: 'date', name: 'date.issue', prop: 'issue_date' },
				{ type: 'date', name: 'date.due', prop: 'due_date' },
				{ type: 'text', name: 'invoice.order_number', prop: 'order_number', props: { disabled: data.order_number_autocalc } },
				{ type: 'checkbox', name: 'invoice.order_number_autocalc', prop: 'order_number_autocalc' }
			], [
				{ type: 'checkbox', name: 'invoice.is_tax_document', prop: 'is_tax_document', if: () => !(data && data.supplier_ref) },
				{ type: 'checkbox', name: 'invoice.to_other_eu_country', prop: 'to_other_eu_country' },
				{ type: 'select', name: 'purchaser.purchaser', prop: 'purchaser', optSrc: purchasers, opts: purchasers.map(item => [item, item.label]) },
				{ type: 'date', name: 'date.tax_short', prop: 'tax_date', labelProps: { title: t('date.tax_long') } }
			], [
				{ type: 'number', name: 'price.total_to_pay', prop: 'price', props: { min: '0', step: '10.00', disabled: data.autocalc } },
				{ type: 'checkbox', name: 'price.autocalc', prop: 'autocalc' }
			], [
				{ type: 'select', name: 'payment_type.payment_type', prop: 'payment_type', optSrc: paymentTypes, opts: paymentTypes.map(item => [t(item.label, { lng: data.language }), t(item.label, { lng: data.language })]) },
				{ type: 'select', name: 'currency.currency', prop: 'currency', opts: Object.values(currencies).map(i => [i, i.label]), optSrc: Object.values(currencies).map(i => i.code) },
				...bankFormControls
			]
		]

		return (
			<div className='controls screen-only'>
				<form onSubmit={e => this.handleFormSubmit(e)}>
					{suppliers.length > 1 && (
						<li>
							<div className='control-block'>
								<label className='control-input-select'>
									<Text tag='span' t='supplier.supplier' />
									<div>
										<select value={supplier} name='supplier' onChange={this.handleSupplierChange.bind(this)} autoFocus>
											{suppliers.map((opt, index) => (
												<option key={index} value={opt.id}>{opt.label}</option>
											))}
										</select>
									</div>
								</label>
							</div>
						</li>
					)}
					{formConfig.map((section, index) => (
						<li key={index}>
							{section.map(control => (control.if !== void 0 ? control.if(data) : true) && (
								<div className='control-block' key={control.name}>
									<label className={'control-input-' + control.type}>
										<Text tag='span' t={control.name} {...(control.labelProps || {})} />
										<FormControl type={control.type} name={control.name} prop={control.prop} onChange={(control.onChange || this.handleInput).bind(this)} optSrc={control.optSrc || control.opts} value={control.type === 'select' ? (control.optSrc || control.opts).indexOf(data[control.prop]) : data[control.prop]} opts={control.opts || null} {...(control.props || {})} />
									</label>
								</div>
							))}
						</li>
					))}
					<li>
						<Button raised type='submit' className='full-width block'>
							<Text t='document.save' />
						</Button>
						<Button outlined type='button' onClick={window.print} className='full-width'>
							<Text t='document.print' />
						</Button>
					</li>
				</form>
			</div>
		)
	}

}