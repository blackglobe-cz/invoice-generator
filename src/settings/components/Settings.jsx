import React from 'react'
import { action, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'
import currencyList from 'currency/helpers/list'
import SupplierModel from '../stores/SupplierModel'

@inject('SettingsStore')
@observer
class Settings extends React.Component {

	constructor() {
		super()

		this.state = {
			activeSupplier: {},
			creatingNewSupplier: false,
			formError: false,
			formSuccess: false,
		}
	}

	openSupplier(supplier = new SupplierModel(), creating) {
		if (this.state.creatingNewSupplier && creating) return
		this.setState({ activeSupplier: supplier, creatingNewSupplier: !!creating })
	}

	handleFormSubmit(e, supplier) {
		e.preventDefault()

		if (!(
			supplier.label
			&& supplier.identification_text
			&& supplier.purchasers.length && supplier.purchasers[0].label && supplier.purchasers[0].text
			&& supplier.bank_accounts.length
				&& supplier.bank_accounts[0].label
				&& supplier.bank_accounts[0].bank
				&& supplier.bank_accounts[0].account_number
				&& supplier.bank_accounts[0].iban
				&& supplier.bank_accounts[0].swift
			&& Number.isInteger(Number.parseInt(supplier.default_due_date_period))
		)) return this.setState({
			formError: true
		})
		this.props.SettingsStore.save(supplier, !!this.state.creatingNewSupplier).then(res => {
			console.log('saved :)', res);
			this.setState({ formSuccess: true, creatingNewSupplier: false })
		}).catch(err => {
			console.log('caught an error');
			
		})
	}

	handleInput(prop, value, event, target) {
		runInAction(() => { (target || this.state.activeSupplier)[prop] = value })
		console.log(this.props.SettingsStore.suppliers[0]);
		
	}

	componentDidUpdate() {
		this.init()
	}
	componentDidMount() {
		this.init()
	}

	init() {
		if (this.props.SettingsStore.loaded && !this.state.activeSupplier.id) {
			if (!this.props.SettingsStore.suppliers.length) {
				this.setState({ activeSupplier: new SupplierModel(), creatingNewSupplier: true })
			} else {
				this.setState({ activeSupplier: this.props.SettingsStore.suppliers[0], creatingNewSupplier: false })
			}
		}
	}

	deleteSupplier() {
		const {
			t,
			SettingsStore,
		} = this.props

		const {
			activeSupplier,
		} = this.state

		if (confirm(t('are_you_sure'))) SettingsStore.delete(activeSupplier)
	}

	render() {

		const {
			activeSupplier,
			creatingNewSupplier,
			formError,
			formSuccess,
		} = this.state

		const {
			t,
			SettingsStore,
		} = this.props

		const {
			loaded,
			suppliers,
		} = SettingsStore

		if (!(loaded && activeSupplier.id)) return (
			<Text tag='div' className='empty' text={t('loading')} />
		)

		return (
			<div className='grid grid-large' style={{ gridTemplateColumns: '200px auto' }}>
				<div>
					<ul className='list'>
						{(suppliers || []).map((item, index) => (
							<li key={index} onClick={() => this.openSupplier(item)} className={item.id === activeSupplier.id ? 'list-item-active' : ''}>
								<Text text={item.label} />
							</li>
						))}
						{creatingNewSupplier && (
							<li className='list-item-active'>
								<Text text={t('supplier.new')} />
							</li>
						)}
						<li>
							<button type='button' className='button button-alt button-primary wrap' onClick={() => this.openSupplier(void 0, true)}>
								<Text text={t('supplier.add')} />
							</button>
						</li>
					</ul>
				</div>
				<div>
					{!creatingNewSupplier && (
						<div className='text-align-right'>
							<button type='button' className='button button-alt button-danger' onClick={() => this.deleteSupplier()}>
								<Text text={t('supplier.delete')} />
							</button>
						</div>
					)}
					<form onSubmit={e => this.handleFormSubmit(e, activeSupplier)}>
						<Text tag='h2' className='heading-4' text={t('settings.general')} />
						<div className='block'>
							<label>
								<Text text={t('label') + '*'} />
								<FormControl value={activeSupplier.label} type='input' name='label' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('logo.logo')} />
								<FormControl value={activeSupplier.logo} type='input' name='logo.logo' prop='logo' placeholder='<svg ... />' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('language.language') + '*'} />
								<FormControl value={activeSupplier.language} type='select' name='language.language' prop='language' onChange={this.handleInput.bind(this)} opts={[['cs', 'Česky'], ['en', 'English']]} />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('supplier.identification_text')} />
								<FormControl value={activeSupplier.identification_text} type='textarea' name='supplier.identification_text' prop='identification_text' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label className='flex flex-space-between'>
								<Text text={t('supplier.registered_for_vat') + '*'} />
								<FormControl value={activeSupplier.registered_for_vat} type='checkbox' name='supplier.registered_for_vat' prop='registered_for_vat' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('currency.default') + '*'} />
								<FormControl value={activeSupplier.default_currency} type='select' name='currency.default' prop='default_currency' onChange={this.handleInput.bind(this)} opts={currencyList} />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('date.due_default_period') + '*'} />
								<FormControl value={activeSupplier.default_due_date_period} type='number' name='date.due_default_period' prop='default_due_date_period' onChange={this.handleInput.bind(this)} min='0' />
							</label>
						</div><div className='block'>
							<label>
								<Text text={t('footer')} />
								<FormControl value={activeSupplier.footer} type='textarea' name='footer' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<Text tag='h2' className='heading-4' text={t('purchaser.purchasers')} />
							{activeSupplier.purchasers.map((item, index) => (
								<div key={index} className='flex flex-align-center'>
									<Text text={(index + 1) + '&nbsp;'} />
									<FormControl value={item.label} type='input' name='label' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.text} type='input' name='text' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<div className='flex flex-align-center'>
										<Text text={t('purchaser.registered_for_vat')} />
										<FormControl value={item.registered_for_vat} type='checkbox' name='purchaser.registered_for_vat' prop='registered_for_vat' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									</div>
									<button type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.purchasers.splice(index, 1))}>
										&times;
									</button>
								</div>
							))}
							<button type='button' className='button' onClick={action(() => activeSupplier.purchasers.push({ label: '', text: '' }))}>
								<Text text={t('purchaser.add')} />
							</button>
						</div><div className='block'>
							<label className='flex flex-space-between'>
								<Text text={t('qr.show')} />
								<FormControl value={activeSupplier.show_qr_code} type='checkbox' name='qr.show' prop='show_qr_code' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<Text tag='h2' className='heading-4' text={t('bank.accounts')} />
							{activeSupplier.bank_accounts.map((item, index) => (
								<div key={index} className='flex flex-align-center'>
									{index + 1}&nbsp;
									<FormControl value={item.label} type='input' name='label' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.bank} type='input' name='bank.bank' prop='bank' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.account_number} type='input' name='bank.account_number' prop='account_number' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.iban} type='number' name='bank.iban' prop='iban' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.swift} type='input' name='bank.swift' prop='swift' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<button type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.bank_accounts.splice(index, 1))}>
										&times;
									</button>
								</div>
							))}
							<button type='button' className='button' onClick={action(() => activeSupplier.bank_accounts.push({ label: '', bank: '', account_number: '', iban: '', swift: '' }))}>
								<Text text={t('invoice.default_invoice_row.add')} />
							</button>
						</div><div className='block'>
							<Text tag='h2' className='heading-4' text={t('invoice.default_invoice_row.rows')} />
							{activeSupplier.default_invoice_rows.map((item, index) => (
								<div key={index} className='flex flex-align-center'>
									{index + 1}&nbsp;
									<FormControl value={item.text} type='input' name='text' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<FormControl value={item.price} type='number' name='price.price' prop='price' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									<button type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.default_invoice_rows.splice(index, 1))}>
										&times;
									</button>
								</div>
							))}
							<button type='button' className='button' onClick={action(() => activeSupplier.default_invoice_rows.push({ text: '', price: '' }))}>
								<Text text={t('invoice.default_invoice_row.add')} />
							</button>
						</div>
						{formError && (
							<div className='block flex flex-space-between alert danger'>
								<Text text={t('form.error')} />
								<i onClick={() => this.setState({ formError: false })}>&times;</i>
							</div>
						)}
						{formSuccess && (
							<div className='block flex flex-space-between alert success'>
								<Text text={t('form.success')} />
								<i onClick={() => this.setState({ formSuccess: false })}>&times;</i>
							</div>
						)}
						<div className='block'>
							<button type='submit' className='button button-primary'>
								<Text text={t('supplier.save')} />
							</button>
						</div>
					</form>
				</div>
			</div>
		)
	}

}

export default withNamespaces()(Settings)