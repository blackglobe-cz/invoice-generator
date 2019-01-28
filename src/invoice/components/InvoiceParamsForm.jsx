import React from 'react'
import { action, toJS } from 'mobx'
// import { toJS } from 'mobx-utils'
import { inject, observer } from 'mobx-react'

import Text from 'text/components/Text'
import { withNamespaces } from 'react-i18next'
import { isNull } from 'util';

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
		console.log('Form submitted yo!');

	}

	handleInput(prop, value) {
		action(() => { this.props.data[prop] = value })()
	}

	handleSupplierChange(e) {
		const value = e.target.value
		this.setState({
			supplier: value,
		}, () => {
			this.handleInput('supplier', this.props.SettingsStore.suppliers.find(item => ('' + item.id) === ('' + value)))
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
			// console.log('data.sup', data.supplier, data.supplier.purchasers);
			
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
				{ type: 'number', name: 'price.total_to_pay', prop: 'price', props: { min: '0', step: '10.00' } },
				{ type: 'input', name: 'payment_type.payment_type', prop: 'payment_type', props: { disabled: true } },
				{ type: 'select', name: 'currency.currency', prop: 'currency', opts: [['CZK', 'Kč'], ['EUR', 'Euro']] },
				{ type: 'select', name: 'bank.account', prop: 'bank_account', opts: bank_accounts.map((item, index) => [index, item.label]) }
			]
		]

		return (
			<div className='controls screen-only'>
				<form onSubmit={this.handleFormSubmit}>
					<li>
						<div className='control-block'>
							<label className='control-input-select'>
								<Text tag='span' text={t('supplier.supplier')} />
								<div>
									<select value={supplier} name='supplier' onChange={this.handleSupplierChange.bind(this)}>
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