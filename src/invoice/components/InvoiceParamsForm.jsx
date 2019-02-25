import React from 'react'
import { action, runInAction, toJS } from 'mobx'
// import { toJS } from 'mobx-utils'
import { inject, observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'
import InvoiceModel from 'invoice/stores/InvoiceModel'
import { isNull } from 'util'

import { getInvoiceBasedOnSupplier } from '../helpers/invoiceHelpers'

@inject('SettingsStore')
@withNamespaces()
@observer
export default class InvoiceParamsForm extends React.Component {

	constructor() {
		super()

		this.state = {
			supplier_id: null,
		}
	}

	handleFormSubmit() {
		console.log('Form submitted yo!')

	}

	handleInput(prop, value) {
		action(() => { this.props.data[prop] = value })()
	}

	handleSupplierChange(e) {
		const value = e.target.value
		this.setState({
			supplier: value,
		}, () => {
			const supplier = this.props.SettingsStore.suppliers.find(item => ('' + item.id) === ('' + value))
			runInAction(() => {
				Object.assign(this.props.data, getInvoiceBasedOnSupplier(supplier))
			})
		})
	}

	renderInput(control) {
		return (
			<input
				value={this.props.data[control.prop]}
				type={control.type === 'input' ? 'text' : control.type}
				name={control.prop}
				onChange={e => this.handleInput(control.prop, control.type === 'checkbox' ? e.target.checked : e.target.value, e)}
				{...(control.props || {})}
			/>
		)
	}

	render() {

		const {
			t,
			data,
			SettingsStore,
		} = this.props

		const {
			supplier,
		} = this.state

		const {
			suppliers,
		} = SettingsStore

		let bank_accounts = []
		let purchasers = []
		if (data && data.supplier) {
			bank_accounts = data.supplier.bank_accounts
			purchasers = data.supplier.purchasers
		}

		if (!data) return (<div>wat</div>)

		const formConfig = [
			[
			// 	{ type: 'select', name: 'supplier.supplier', prop: 'supplier', opts: suppliers.map(item => [item.id, item.label]), onChange: supplierChange }
			// ], [
				{ type: 'select', name: 'language.language', prop: 'language', opts: [['cs', 'Česky'], ['en', 'English']] }
			], [
				{ type: 'date', name: 'date.issue', prop: 'issue_date' },
				{ type: 'date', name: 'date.due', prop: 'due_date' }
			], [
				{ type: 'checkbox', name: 'invoice.to_other_eu_country', prop: 'to_other_eu_country' },
				{ type: 'select', name: 'purchaser.purchaser', prop: 'purchaser', opts: purchasers.map((item, index) => [index, item.label]) },
				{ type: 'date', name: 'date.tax_short', prop: 'tax_date', labelProps: { title: t('date.tax_long') } }
			], [
				{ type: 'number', name: 'price.total_to_pay', prop: 'price', props: { min: '0', step: '10.00', disabled: data.autocalc } },
				{ type: 'checkbox', name: 'price.autocalc', prop: 'autocalc' },
				{ type: 'input', name: 'payment_type.payment_type', prop: 'payment_type', props: { disabled: true } },
				{ type: 'select', name: 'currency.currency', prop: 'currency', opts: [['CZK', 'Kč'], ['EUR', 'Euro']] },
				{ type: 'select', name: 'bank.account', prop: 'bank_account', opts: bank_accounts.map((item, index) => [index, item.label]) }
			]
		]

		console.log('rendering disabled', data.autocalc);

		return (
			<div className='controls screen-only'>
				<form onSubmit={this.handleFormSubmit}>
					<li>
						<div className='control-block'>
							<label className='control-input-select'>
								<Text tag='span' text={t('supplier.supplier')} />
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
					{formConfig.map((section, index) => (
						<li key={index}>
							{section.map(control => (
								<div className='control-block' key={control.name}>
									<label className={'control-input-' + control.type}>
										<Text tag='span' text={t(control.name)} {...(control.labelProps || {})} />

										{/*
										{control.type === 'select' && (
											<div>
												<select value={data[control.prop]} name={control.prop} onChange={control.onChange || (e => this.handleInput(control.prop, e.target.value, e))}>
													{control.opts.map((opt, index) => (
														<option key={index} value={opt[0]}>{opt[1]}</option>
													))}
												</select>
											</div>
										)}
										{(control.type === 'checkbox') && this.renderInput(control)}
										{(control.type === 'input' || control.type === 'date' || control.type === 'number') && this.renderInput(control)}
										*/}
										<FormControl type={control.type} name={control.prop} onChange={(control.onChange || this.handleInput).bind(this)} value={data[control.prop]} opts={control.opts || null} {...(control.props || {})} />

									</label>
								</div>
							))}
						</li>
					))}
				</form>
			</div>
		)
	}

}