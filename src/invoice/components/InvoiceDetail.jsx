import React from 'react'
import { inject, observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import Text from 'text/components/Text'
import InvoiceParamsForm from './InvoiceParamsForm'
import InvoiceView from './InvoiceView'
import InvoiceModel from 'invoice/stores/InvoiceModel'

@inject('InvoiceStore', 'SettingsStore')
@withNamespaces()
@observer
export default class InvoiceDetail extends React.Component {

	constructor() {
		super()

		this.state = {
			detail: false,
		}
	}

	componentDidMount() {
		const {
			match,
			InvoiceStore,
		} = this.props

		InvoiceStore.load(parseInt(match.params.id))
		this.init()
	}
	componentDidUpdate() {
		this.init()
	}

	init() {
		if (this.state.detail) return

		const {
			match,
			InvoiceStore,
			SettingsStore: {
				loaded,
				suppliers,
			},
		} = this.props

		if (!(InvoiceStore.loaded && loaded)) return
		
		this.setState({
			detail: match.params.id === 'new' ? this.getBlankInvoice(suppliers[0]) : InvoiceStore.invoice(parseInt(match.params.id)),
		})
	}

	getBlankInvoice(supplier) {
		console.log('blank',supplier);
		
		return new InvoiceModel({
			supplier,
			logo: supplier.logo,
			language: supplier.language,
			currency: supplier.default_currency,
			purchaser: supplier.purchasers[0],
			bank_account: supplier.bank_accounts[0],
			invoice_rows: (supplier.default_invoice_rows || []).map(item => [item.text, item.price]),
			qr_code: supplier.show_qr_code,
			footer: supplier.footer,
		})
	}

	render() {

		const {
			t,
			InvoiceStore,
			SettingsStore,
		} = this.props
		// const t = a => a

		const {
			detail,
		} = this.state

		const {
			loaded: invoicesLoaded,
		} = InvoiceStore

		const {
			loaded: settingsLoaded,
		} = SettingsStore
		
		if (!(invoicesLoaded && settingsLoaded)) return (
			<Text className='wrapper empty' text={t('invoice.detail_loading')} />
		)

		if (!detail) return (
			<Text className='wrapper empty' text={t('invoice.detail_loading_failed')} />
		)

		return (
			<div className='wrapper'>
				<div className='grid grid-large' style={{ 'gridTemplateColumns': '200px auto' }}>
					<InvoiceParamsForm data={detail} />
					<InvoiceView data={detail} />
				</div>
			</div>
		)
	}
}