import React from 'react'
import { runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

import { STORAGE_KEYS } from 'agent'

import Button from '@material/react-button'
import Drawer from '@material/react-drawer'
import List, { ListItem } from '@material/react-list'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'

@inject('InvoiceStore', 'SettingsStore')
@withTranslation()
@withRouter
@observer
export default class DataImportExport extends React.Component {

	constructor() {
		super()

		this.state = {
			loaded: false,
			error: false,
			activeTab: 'export',
			valueInvoices: '',
			valueSettings: '',
			invoiceImport: '',
			settingsImport: '',
		}
	}

	componentDidMount() {
		const {
			InvoiceStore,
			SettingsStore,
		} = this.props

		Promise.all([
			InvoiceStore.exportInvoices(),
			SettingsStore.exportSettings()
		]).then(res => {
			this.setState({
				loaded: true,
				valueInvoices: res[0],
				valueSettings: res[1],
			})
		}).catch(err => {
			this.setState({ error: err })
		})
	}

	handleFormSubmit(event, dataString, localStorageProp) {
		event.preventDefault()
		localStorage.setItem(localStorageProp, dataString)
		this.props.history.push('/')
	}

	handleInput(prop, value/*, event*/) {
		runInAction(() => { this.setState({ [prop]: value }) })
	}

	render() {

		const {
			t,
		} = this.props

		const {
			loaded,
			error,
			activeTab,
			valueInvoices,
			valueSettings,
			invoiceImport,
			settingsImport,
		} = this.state

		if (error) return (<Text t='error.generic' />)
		if (!loaded) return (<Text className='empty' t='loading_data' />)

		return (
			<div className='grid grid-large' style={{ gridTemplateColumns: '260px auto' }}>
				<Drawer className='settings-drawer'>
					<List>
						<ListItem onClick={() => this.setState({ activeTab: 'export' })} className={'cursor-pointer' + (activeTab === 'export' ? ' mdc-list-item--selected' : '')}>
							<Text text={t('data.export')} />
						</ListItem>
						<ListItem onClick={() => this.setState({ activeTab: 'import' })} className={'cursor-pointer' + (activeTab === 'import' ? ' mdc-list-item--selected' : '')}>
							<Text text={t('data.import')} />
						</ListItem>
					</List>
				</Drawer>
				{activeTab === 'export' && (
					<div>
						<div className='block'>
							<label className='block'>
								<Text text={t('data.invoice_export')} />
								<FormControl readOnly rows='10' type='textarea' prop='invoiceExport' name='data.invoice_export' value={valueInvoices} />
							</label>
						</div>
						<div className='block'>
							<label className='block'>
								<Text text={t('data.settings_export')} />
								<FormControl readOnly rows='10' type='textarea' prop='settingsExport' name='data.settings_export' value={valueSettings} />
							</label>
						</div>
					</div>
				)}
				{activeTab === 'import' && (
					<div>
						<form onSubmit={e => this.handleFormSubmit(e, invoiceImport, STORAGE_KEYS.INVOICE)}>
							<label className='block'>
								<Text text={t('data.import_invoices')} />
								<FormControl type='textarea' prop='invoiceImport' name='invoice_import' placeholder={t('data.import_invoices')} value={invoiceImport} onChange={this.handleInput.bind(this)} />
							</label>
							<Button raised type='submit'>
								<Text text={t('data.import_invoices_submit')} />
							</Button>
						</form>
						<form onSubmit={e => this.handleFormSubmit(e, settingsImport, STORAGE_KEYS.SETTINGS)}>
							<label className='block'>
								<Text text={t('data.import_settings')} />
								<FormControl type='textarea' prop='settingsImport' name='settings_import' placeholder={t('data.import_settings')} value={settingsImport} onChange={this.handleInput.bind(this)} />
							</label>
							<Button raised type='submit'>
								<Text text={t('data.import_settings_submit')} />
							</Button>
						</form>
					</div>
				)}
			</div>
		)
	}

}