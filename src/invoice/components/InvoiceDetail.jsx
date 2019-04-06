import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router'
import Modal from 'react-modal'

import MaterialIcon from '@material/react-material-icon'
import IconButton from '@material/react-icon-button'

import logger from 'logger'

import Text from 'text/components/Text'
import InvoiceParamsForm from './InvoiceParamsForm'
import InvoiceView from './InvoiceView'
import InvoiceModel from 'invoice/stores/InvoiceModel'

import { getInvoiceBasedOnSupplier } from '../helpers/invoiceHelpers'

const customStyles = {
	content: {
		position: 'relative',
		maxWidth: '800px',
		padding: '0',
		margin: '5% auto',
		top: '0', right: '0', bottom: '0', left: '0',
	}
}

@inject('InvoiceStore', 'SettingsStore')
@withTranslation()
@observer
export default class InvoiceDetail extends React.Component {

	constructor() {
		super()

		this.state = {
			redirectTo: null,
			detail: false,
			importExportShown: false,
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

		if (match.params.id === 'new') {
			this.getBlankInvoice(suppliers.length && suppliers[0]).then(newInvoice => {
				this.setState({
					detail: newInvoice,
				})
			})
		} else {
			this.setState({
				detail: new InvoiceModel(toJS(InvoiceStore.invoice(parseInt(match.params.id)))),
			})
		}
	}

	getBlankInvoice(supplier) {
		return getInvoiceBasedOnSupplier(supplier)
	}

	deleteInvoice() {
		if (!confirm(this.props.t('invoice.delete_confirm'))) return
		this.props.InvoiceStore.delete(this.state.detail.id).then(() => {
			this.setState({
				redirectTo: '/',
			})
		}).catch(err => {
			logger.log('err invoice delete', err);
		})
	}

	toggleImportExport(importExportShown) {
		this.setState({ importExportShown })
	}

	closeImportExport

	render() {

		const {
			t,
			InvoiceStore,
			SettingsStore,
		} = this.props

		const {
			detail,
			redirectTo,
			importExportShown,
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
				<div className='layout-grid'>
					<InvoiceParamsForm data={detail} />
					<InvoiceView data={detail} />

					<div className='screen-only'>
						<div className='box'>
							<IconButton type='button' disabled={location.pathname.indexOf('/invoice/new') !== -1} onClick={() => this.deleteInvoice()}>
								<MaterialIcon icon='delete_outline' />
							</IconButton>
							<IconButton type='button' onClick={() => this.toggleImportExport(true)}>
								<MaterialIcon icon='import_export' />
							</IconButton>
						</div>

						<Modal
							isOpen={importExportShown}
							onRequestClose={() => this.toggleImportExport()}
							style={customStyles}
							contentLabel={t('invoice.import_export')}
						>
							<div className='modal-wrapper'>
								<div className='block flex flex-space-between flex-align-center'>
									<div className='flex-1'>
										<Text tag='h1' text={t('invoice.export')} />
									</div>
									<div>
										{/*
										<Button icon={<i className='material-icons'>close</i>} type='button' className='button button-phantom button-icon' onClick={this.closeModal}>&times;</Button>
										*/}
										<IconButton type='button' onClick={() => this.toggleImportExport(false)}>
											<MaterialIcon icon='close' />
										</IconButton>
									</div>
								</div>
								{/*<textarea readOnly rows='10' value={JSON.stringify(toJS(detail), 2)} />*/}
								<pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(toJS(detail), null, 2)}</pre>
							</div>
						</Modal>
					</div>

				</div>
			</div>
		)
	}
}