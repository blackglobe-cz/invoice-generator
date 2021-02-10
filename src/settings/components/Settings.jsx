import React from 'react'
import { action, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { createViewModel } from 'mobx-utils'
import { withTranslation } from 'react-i18next'

import MaterialIcon from '@material/react-material-icon'
import IconButton from '@material/react-icon-button'
import Button from '@material/react-button'
import Drawer from '@material/react-drawer'
import List, { ListItem, ListItemText } from '@material/react-list'

import logger from 'logger'
import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'
import currencyList from 'currency/helpers/list'
import SupplierModel from '../stores/SupplierModel'
import PurchaserModel from '../stores/PurchaserModel'
import BankAccountModel from '../stores/BankAccountModel'
import InvoiceRowModel from '../stores/InvoiceRowModel'

import {
	LANGUAGES,
	VAT_AMOUNT,
} from 'consts'

@inject('SettingsStore')
@withTranslation()
@observer
export default class Settings extends React.Component {

	constructor() {
		super()

		this.state = {
			activeSupplier: null,
			creatingNewSupplier: false,
			formError: false,
			formSuccess: false,
		}
	}

	openSupplier(supplier = new SupplierModel(), creating) {
		if (this.state.creatingNewSupplier && creating) return
		this.setState({
			activeSupplier: createViewModel(supplier),
			creatingNewSupplier: !!creating,
		})
	}

	handleFormSubmit(e, supplierViewModel) {
		e.preventDefault()

		// TODO: needs to be revisited
		if (!(
			supplierViewModel.label
			&& supplierViewModel.identification_text
			// && supplierViewModel.purchasers.length && supplierViewModel.purchasers[0].label && supplierViewModel.purchasers[0].text
			&& supplierViewModel.bank_accounts.length
				&& supplierViewModel.bank_accounts[0].label
				&& supplierViewModel.bank_accounts[0].bank
				&& supplierViewModel.bank_accounts[0].account_number
				&& supplierViewModel.bank_accounts[0].iban
				&& supplierViewModel.bank_accounts[0].swift
			&& Number.isInteger(Number.parseInt(supplierViewModel.default_due_date_period))
		)) {
			return this.setState({
				formError: true,
				formSuccess: false,
			})
		}

		supplierViewModel.submit() // mobx submit

		// clean-up the model
		supplierViewModel.purchasers = supplierViewModel.purchasers.filter(item => item.text || item.label)

		this.props.SettingsStore.save(supplierViewModel, !!this.state.creatingNewSupplier).then(() => {
			this.setState({
				formError: false,
				formSuccess: true,
				creatingNewSupplier: false,
			})
		}).catch(err => {
			logger.log('err settings form submit', err)
		})
	}

	handleInput(prop, value, event, target) {
		runInAction(() => { (target || this.state.activeSupplier)[prop] = value })
	}

	componentDidUpdate() {
		this.init()
	}
	componentDidMount() {
		this.init()
	}

	init() {
		if (this.props.SettingsStore.loaded && !this.state.activeSupplier) {
			if (!this.props.SettingsStore.suppliers.length) {
				this.openSupplier(void 0, true)
			} else {
				this.openSupplier(this.props.SettingsStore.suppliers[0], false)
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

		if (!(loaded && activeSupplier)) return (
			<Text tag='div' className='empty' text={t('loading')} />
		)

		return (
			<div className='grid grid-large' style={{ gridTemplateColumns: '260px auto' }}>
				<div>
					<Drawer className='settings-drawer'>
						{creatingNewSupplier && (
							<ListItem disabled={true} className='mdc-list-item--disabled mdc-list-item--disabled-selected'>
								<Text t='supplier.new' />
							</ListItem>
						)}
						<List>
							{(suppliers || []).map((item, index) => (
								<ListItem key={index} onClick={() => this.openSupplier(item)} className={'cursor-pointer' + (item.id === activeSupplier.id ? ' mdc-list-item--selected' : '')}>
									<ListItemText primaryText={item.label} />
								</ListItem>
							))}
						</List>
						<hr />
						<Button outlined type='button' className='button button-alt button-primary wrap' onClick={() => this.openSupplier(void 0, true)}>
							<Text t='supplier.add' />
						</Button>
					</Drawer>
				</div>

				<div>
					{!creatingNewSupplier && (
						<div className='text-align-right'>
							<Button icon={<MaterialIcon icon='delete' />} type='button' className='button button-alt button-danger' onClick={() => this.deleteSupplier()}>
								<Text t='supplier.delete' />
							</Button>
						</div>
					)}
					<form onSubmit={e => this.handleFormSubmit(e, activeSupplier)}>
						<Text tag='h2' className='heading-4' text={t('settings.general')} />
						<div className='block'>
							<label>
								<Text t='label' suffix='*' />
								<FormControl value={activeSupplier.label} type='input' name='label' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='logo.logo' />
								<FormControl value={activeSupplier.logo} type='input' name='logo.logo' prop='logo' placeholder='<svg ... />' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='invoice.order_number_format' />
								<FormControl value={activeSupplier.order_number_format} type='input' name='invoice.order_number_format' prop='order_number_format' placeholder='YYYYNNN' onChange={this.handleInput.bind(this)} maxLength='10' />
								<Text tag='small' class='' text={t('invoice.order_number_format_helper')} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='invoice.language' suffix='*' />
								<FormControl value={LANGUAGES.findIndex(item => item[0] === activeSupplier.default_language)} type='select' name='invoice.language' prop='default_language' onChange={this.handleInput.bind(this)} optSrc={LANGUAGES.map(i => i[0])} opts={LANGUAGES} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='supplier.identification_text' />
								<FormControl value={activeSupplier.identification_text} type='textarea' rows='6' name='supplier.identification_text' prop='identification_text' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label className='flex flex-space-between flex-align-center'>
								<Text t='supplier.registered_for_vat' />
								<FormControl value={activeSupplier.registered_for_vat} type='checkbox' name='supplier.registered_for_vat' prop='registered_for_vat' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='currency.default' suffix='*' />
								<FormControl value={currencyList.indexOf(activeSupplier.default_currency)} type='select' name='currency.default' prop='default_currency' onChange={this.handleInput.bind(this)} opts={currencyList} />
							</label>
						</div><div className='block'>
							<label>
								<Text t='date.due_default_period' suffix='*' />
								<FormControl value={activeSupplier.default_due_date_period} type='number' name='date.due_default_period' prop='default_due_date_period' onChange={this.handleInput.bind(this)} min='0' />
							</label>
						</div><div className='block'>
							<label>
								<Text t='footer' />
								<FormControl value={activeSupplier.footer} type='textarea' name='footer' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<label className='flex flex-space-between flex-align-center'>
								<Text t='qr.show' />
								<FormControl value={activeSupplier.show_qr_code} type='checkbox' name='qr.show' prop='show_qr_code' onChange={this.handleInput.bind(this)} />
							</label>
						</div><div className='block'>
							<Text tag='h2' className='heading-4' text={t('purchaser.purchasers')} />
							{activeSupplier.purchasers.map((item, index) => (
								<div key={index} className='box block'>
									<div className='flex flex-align-center block'>
										<div className='flex flex-align-center flex-1'>
											<Text className='margin-horizontal-large heading-2' text={index + 1} />
											<IconButton type='button' disabled={index === 0} className='button button-icon button-alt' onClick={action(() => {
												const temp = activeSupplier.purchasers[index]
												activeSupplier.purchasers[index] = activeSupplier.purchasers[index - 1]
												activeSupplier.purchasers[index - 1] = temp
											})}>
												<MaterialIcon icon='arrow_upward' />
											</IconButton>
											<IconButton type='button' disabled={index === activeSupplier.purchasers.length - 1} className='button button-icon button-alt' onClick={action(() => {
												const temp = activeSupplier.purchasers[index]
												activeSupplier.purchasers[index] = activeSupplier.purchasers[index + 1]
												activeSupplier.purchasers[index + 1] = temp
											})}
											>
												<MaterialIcon icon='arrow_downward' />
											</IconButton>
										</div>
										<IconButton type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.purchasers.splice(index, 1))}>
											<MaterialIcon icon='delete_outline' />
										</IconButton>
									</div>
									<hr className='block' />

									<div className='block'>
										<label>
											<Text t='purchaser.label' />
											<FormControl value={item.label} type='input' name='label' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
										</label>
									</div>
									<div className='block'>
										<label>
											<Text t='purchaser.text' />
											<FormControl value={item.text} type='textarea' rows='6' name='text' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
										</label>
									</div>
									<div className=''>
										<label className='flex flex-space-between flex-align-center'>
											<Text t='purchaser.registered_for_vat' />
											<FormControl value={item.registered_for_vat} type='checkbox' name='purchaser.registered_for_vat' prop='registered_for_vat' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
										</label>
									</div>
								</div>
							))}
							<Button type='button' onClick={action(() => activeSupplier.purchasers.push(new PurchaserModel()))}>
								<Text t='purchaser.add' />
							</Button>
						</div><div className='block'>
							<Text tag='h2' className='heading-4' t='bank.accounts' />
							{activeSupplier.bank_accounts.map((item, index) => (
								<div key={index} className='box block'>
									<div className='flex flex-align-center block'>
										<div className='flex-1 flex flex-align-center'>
											<Text text={index + 1} className='heading-2 margin-horizontal-large' />
											<IconButton type='button' disabled={index === 0} className='button button-icon button-alt' onClick={action(() => {
												const temp = activeSupplier.bank_accounts[index]
												activeSupplier.bank_accounts[index] = activeSupplier.bank_accounts[index - 1]
												activeSupplier.bank_accounts[index - 1] = temp
											})}>
												<MaterialIcon icon='arrow_upward' />
											</IconButton>
											<IconButton type='button' disabled={index === activeSupplier.bank_accounts.length - 1} className='button button-icon button-alt' onClick={action(() => {
												const temp = activeSupplier.bank_accounts[index]
												activeSupplier.bank_accounts[index] = activeSupplier.bank_accounts[index + 1]
												activeSupplier.bank_accounts[index + 1] = temp
											})}
											>
												<MaterialIcon icon='arrow_downward' />
											</IconButton>
										</div>
										<IconButton type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.bank_accounts.splice(index, 1))}>
											<MaterialIcon icon='delete_outline' />
										</IconButton>
									</div>
									<hr className='block' />

									<label className='block'>
										<Text t='bank.label' suffix='*' />
										<FormControl value={item.label} type='input' name='label' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									</label>
									<label className='block'>
										<Text t='bank.bank_name' suffix='*' />
										<FormControl value={item.bank} type='input' name='bank.bank' prop='bank' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									</label>
									<label className='block'>
										<Text t='bank.account_number' suffix='*' />
										<FormControl value={item.account_number} type='input' name='bank.account_number' prop='account_number' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
									</label>
									<div className='flex block'>
										<label className='flex-1'>
											<Text t='bank.iban' suffix='*' />
											<FormControl value={item.iban} type='input' name='bank.iban' prop='iban' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
										</label>
										<label className='flex-1'>
											<Text t='bank.swift' suffix='*' />
											<FormControl value={item.swift} type='input' name='bank.swift' prop='swift' onChange={(prop, value, e) => this.handleInput(prop, value, e, item)} />
										</label>
									</div>
								</div>
							))}
							<Button type='button' className='button' onClick={action(() => activeSupplier.bank_accounts.push(new BankAccountModel()))}>
								<Text t='bank.add_account' />
							</Button>
						</div><div className='block'>
							<Text tag='h2' className='heading-4 margin-bottom-large' text={t('invoice.default_invoice_row.rows')} />

							<div className='flex flex-align-center'>
								<Text text='#' className='margin-horizontal-medium' />
								<Text t='invoice.row_text' className='flex-2' />
								<Text t='tax.vat_percent' className='flex-1' />
								<Text t='invoice.row_price' className='flex-1' />
								<div style={{minWidth: '48px'}} />
							</div>
							<hr className='block' />

							{activeSupplier.default_invoice_rows.map((rawItem, index) => {
								const item = new InvoiceRowModel(rawItem)
								return (
									<div key={index} className='flex flex-align-center'>
										<Text text={index + 1} className='margin-horizontal-medium' />
										<FormControl className='flex-2' value={item.text} type='input' name='text' onChange={(prop, value, e) => this.handleInput(prop, value, e, rawItem)} />
										<FormControl className='flex-1' value={item.vat} type='number' name='tax.vat_percent' prop='vat' onChange={(prop, value, e) => this.handleInput(prop, value, e, rawItem)} />
										<FormControl className='flex-1' value={item.price} type='number' name='price.price' prop='price' onChange={(prop, value, e) => this.handleInput(prop, value, e, rawItem)} />
										<IconButton type='button' className='button button-icon button-alt' onClick={action(() => activeSupplier.default_invoice_rows.splice(index, 1))}>
											<MaterialIcon icon='delete_outline' />
										</IconButton>
									</div>
								)
							})}
							<Button type='button' className='button' onClick={action(() => activeSupplier.default_invoice_rows.push(new InvoiceRowModel({ vat: activeSupplier.registered_for_vat ? VAT_AMOUNT : 0 })))}>
								<Text t='invoice.default_invoice_row.add' />
							</Button>
						</div>
						{formError && (
							<div className='block flex flex-space-between alert danger'>
								<Text t='form.error' />
								<i onClick={() => this.setState({ formError: false })}>&times;</i>
							</div>
						)}
						{formSuccess && (
							<div className='block flex flex-space-between alert success'>
								<Text t='form.success' />
								<i onClick={() => this.setState({ formSuccess: false })}>&times;</i>
							</div>
						)}
						<div className='block'>
							<Button raised type='submit' className='button button-primary'>
								<Text t='supplier.save' />
							</Button>
						</div>
					</form>
				</div>
			</div>
		)
	}

}