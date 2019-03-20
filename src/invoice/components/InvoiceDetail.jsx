import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { Route, Redirect } from 'react-router'

import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'
import IconButton from '@material/react-icon-button'

import Text from 'text/components/Text'
import InvoiceParamsForm from './InvoiceParamsForm'
import InvoiceView from './InvoiceView'
import InvoiceModel from 'invoice/stores/InvoiceModel'

import { getInvoiceBasedOnSupplier } from '../helpers/invoiceHelpers'

@inject('InvoiceStore', 'SettingsStore')
@withNamespaces()
@observer
export default class InvoiceDetail extends React.Component {

	constructor() {
		super()

		this.state = {
			redirectTo: null,
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
			detail: match.params.id === 'new' ? this.getBlankInvoice(suppliers[0]) : new InvoiceModel(toJS(InvoiceStore.invoice(parseInt(match.params.id)))),
		})
	}

	getBlankInvoice(supplier) {
		return getInvoiceBasedOnSupplier(supplier)
	}

	deleteInvoice() {
		if (!confirm(this.props.t('invoice.delete_confirm'))) return
		this.props.InvoiceStore.delete(this.state.detail.id).then(res => {
			this.setState({
				redirectTo: '/',
			})
		}).catch(err => {
			console.log('ERROR invoice delete', err);
		})
	}

	importExport() {
		console.log('TBD yo!');
	}

	render() {

		const {
			t,
			InvoiceStore,
			SettingsStore,
		} = this.props

		const {
			detail,
			redirectTo,
		} = this.state

		const {
			loaded: invoicesLoaded,
		} = InvoiceStore

		const {
			loaded: settingsLoaded,
		} = SettingsStore

		if (redirectTo) return (<Redirect to={redirectTo} />)

		if (!(invoicesLoaded && settingsLoaded)) return (
			<Text className='wrapper empty' text={t('invoice.detail_loading')} />
		)

		if (!detail) return (
			<Text className='wrapper empty' text={t('invoice.detail_loading_failed')} />
		)

		return (
			<div className='wrapper'>
				{/*location.pathname.indexOf('/invoice/new') === -1 &&
					<div className='text-align-right screen-only'>
						<hr className='margin-bottom-small' />
						<Button className='button-danger margin-bottom-small' icon={<MaterialIcon icon='delete_outline' />} onClick={() => this.deleteInvoice()}>
							<Text text={t('invoice.delete')} />
						</Button>
					</div>
				*/}

				<div className='layout-grid'>
					<InvoiceParamsForm data={detail} />
					<InvoiceView data={detail} />
					<div className='screen-only'>
						<div className='box'>
							<IconButton type='button' disabled={location.pathname.indexOf('/invoice/new') !== -1} onClick={() => this.deleteInvoice()}>
								<MaterialIcon icon='delete_outline' />
							</IconButton>
							<IconButton type='button' onClick={() => this.importExport()}>
								<MaterialIcon icon='import_export' />
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		)
	}
}