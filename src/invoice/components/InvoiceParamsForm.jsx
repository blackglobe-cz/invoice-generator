import React from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'

import Text from 'text/components/Text'
import { withNamespaces } from 'react-i18next'

@observer
@withNamespaces()
export default class InvoiceParamsForm extends React.Component {

	handleFormSubmit() {
		console.log('Form submitted yo!');

	}

	handleInput(prop, value, event) {
		console.log('change', prop, value, event, event.target, this.props);
		action(() => { this.props.data[prop] = value })()
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
		} = this.props

		const formConfig = [
			[
				{ type: 'select', name: 'supplier.supplier', prop: 'supplier', opts: [] }
			], [
				{ type: 'select', name: 'language.language', prop: 'language', opts: [['cs', 'Česky'], ['en', 'English']] }
			], [
				{ type: 'date', name: 'date.issue', prop: 'issue_date' },
				{ type: 'date', name: 'date.due', prop: 'due_date' }
			], [
				{ type: 'checkbox', name: 'invoice.to_other_eu_country', prop: 'to_other_eu_country' },
				{ type: 'select', name: 'purchaser.purchaser', prop: 'purchaser', opts: [] },
				{ type: 'date', name: 'date.tax_short', prop: 'tax_date', labelProps: { title: t('date.tax_long') } }
			], [
				{ type: 'number', name: 'price.total_to_pay', prop: 'price', props: { min: '0', step: '10.00' } },
				{ type: 'input', name: 'payment_type.payment_type', prop: 'payment_type', props: { disabled: true } },
				{ type: 'select', name: 'currency.currency', prop: 'currency', opts: [['CZK', 'Kč'], ['EUR', 'Euro']] },
				{ type: 'select', name: 'bank.account', prop: 'bank_account', opts: [] }
			]
		]

		return (
			<div className='controls screen-only'>
				<form onSubmit={this.handleFormSubmit}>
					{formConfig.map((section, index) => (
						<li key={index}>
							{section.map(control => (
								<div className='control-block' key={control.name}>
									<label className={'control-input-' + control.type}>
										<Text tag='span' text={t(control.name)} {...(control.labelProps || {})} />
										{control.type === 'select' && (
											<div>
												<select value={data[control.prop]} name={control.prop} onChange={e => this.handleInput(control.prop, e.target.value)}>
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