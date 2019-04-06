import React from 'react'
import { runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import Button from '@material/react-button'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'

import logger from 'logger'
import { getInvoiceBasedOnSupplier } from '../helpers/invoiceHelpers'

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
		const creating = location.pathname.indexOf('/invoice/new') > -1
		this.props.InvoiceStore.save(this.props.data, creating).then(() => {
			if (creating) this.setState({ redirectTo: `/invoice/${this.props.data.id}` })
		}).catch(err => {
			logger.log('err saving invoice', err);
		})
	}

	handleInput(prop, value) {
		runInAction(() => {
			const data = this.props.data
			data[prop] = value

			// if we change any prop that might affect order number, we recalculate
			if (data.order_number_autocalc && ['issue_date'].indexOf(prop) > -1) {
				this.props.InvoiceStore.getNextOrderNumber(data.supplier.id, data.issue_date).then(res => {
					data.order_number = res
				})
			}
		})
	}

	handleSupplierChange(e) {
		const value = e.target.value
		this.setState({
			supplier: value,
		}, () => {
			const supplier = this.props.SettingsStore.suppliers.find(item => ('' + item.id) === ('' + value))
			runInAction(() => {
				Object.assign(this.props.data, getInvoiceBasedOnSupplier(supplier, this.props.data.id))
			})
		})
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
		if (data && data.supplier) {
			bank_accounts = data.supplier.bank_accounts
			purchasers = data.supplier.purchasers
		}

		if (redirectTo) return (<Redirect to={redirectTo} />)

		if (!data) return (<Text text={t('error.generic')} />)

		const formConfig = [
			[
				{ type: 'select', name: 'invoice.language', prop: 'language', opts: [['cs', 'Česky'], ['en', 'English']] }
			], [
				{ type: 'date', name: 'date.issue', prop: 'issue_date' },
				{ type: 'date', name: 'date.due', prop: 'due_date' },
				// { type: 'number', name: 'invoice.order_number_of_the_day', prop: 'order_number_of_the_day' }
				{ type: 'text', name: 'invoice.order_number', prop: 'order_number' },
				{ type: 'checkbox', name: 'invoice.order_number_autocalc', prop: 'order_number_autocalc' }
			], [
				{ type: 'checkbox', name: 'invoice.to_other_eu_country', prop: 'to_other_eu_country' },
				{ type: 'select', name: 'purchaser.purchaser', prop: 'purchaser', optSrc: purchasers, opts: purchasers.map(item => [item, item.label]) },
				{ type: 'date', name: 'date.tax_short', prop: 'tax_date', labelProps: { title: t('date.tax_long') } }
			], [
				{ type: 'number', name: 'price.total_to_pay', prop: 'price', props: { min: '0', step: '10.00', disabled: data.autocalc } },
				{ type: 'checkbox', name: 'price.autocalc', prop: 'autocalc' }
			], [
				{ type: 'select', name: 'payment_type.payment_type', prop: 'payment_type', optSrc: paymentTypes, opts: paymentTypes.map(item => [t(item.label), t(item.label)]) },
				{ type: 'select', name: 'currency.currency', prop: 'currency', opts: [['CZK', 'Kč'], ['EUR', 'Euro']] },
				{ type: 'select', name: 'bank.account', prop: 'bank_account', optSrc: bank_accounts, opts: bank_accounts.map(item => [item, item.label]) }
			]
		]

		return (
			<div className='controls screen-only'>
				<form onSubmit={e => this.handleFormSubmit(e)}>
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
										<FormControl type={control.type} name={control.name} prop={control.prop} onChange={(control.onChange || this.handleInput).bind(this)} optSrc={control.optSrc || control.opts} value={control.type === 'select' ? (control.optSrc || control.opts).indexOf(data[control.prop]) : data[control.prop]} opts={control.opts || null} {...(control.props || {})} />
									</label>
								</div>
							))}
						</li>
					))}
					<li>
						<Button raised type='submit' className='full-width block'>
							<Text text={t('document.save')} />
						</Button>
						<Button outlined type='button' onClick={window.print} className='full-width'>
							<Text text={t('document.print')} />
						</Button>
					</li>
				</form>
			</div>
		)
	}

}