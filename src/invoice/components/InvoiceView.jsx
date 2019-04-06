import React from 'react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'

import MaterialIcon from '@material/react-material-icon'

import Text from 'text/components/Text'
import formatDate from 'date/helpers/formatter'
import formatPrice from 'currency/helpers/formatter'
import QRCode from 'qrcode.react'

import {
	VAT_AMOUNT,
} from 'consts'

@withTranslation()
@observer
export default class InvoiceView extends React.Component {

	constructor() {
		super()

		this.supplier_node = React.createRef()
		this.purchaser_node = React.createRef()
		this.invoice_rows_nodes = []

		this.state = {
			supplier_id: null,
			supplier_text: null,
			purchaser_text: null,
			purchaser_label: null,
			invoice_rows: [],
		}
	}

	componentDidMount() {
		this.resetLocalState()
		this.setState({
			purchaser_label: this.props.data.purchaser.label,
		})
	}

	resetLocalState() {
		const data = this.props.data
		this.setState({
			supplier_id: data.supplier.id,
			supplier_text: data.supplier.identification_text,
			purchaser_text: data.purchaser.text,
			invoice_rows: JSON.parse(JSON.stringify(data.invoice_rows)),
		})
	}

	componentDidUpdate() {
		const data = this.props.data
		if (this.state.supplier_id !== data.supplier.id) {
			this.resetLocalState()
		}
		if (data.purchaser.label !== this.state.purchaser_label) {
			this.setState({
				purchaser_text: data.purchaser.text,
				purchaser_label: data.purchaser.label,
			})
		}
	}

	assignRow = (el, index, rowIndex) => {
		this.invoice_rows_nodes[index] = this.invoice_rows_nodes[index] || []
		this.invoice_rows_nodes[index][rowIndex] = el
	}

	handlePriceInput = (e, item) => {
		if (!this.props.data.autocalc) return
		const data = this.props.data
		const newPrice = parseFloat(e.target.innerHTML)
		runInAction(() => {
			item[1] = newPrice
			const np = data.invoice_rows.reduce((acc, item) => acc + parseFloat(item[1]), 0)
			data.price = np
		})
	}

	handleCEInput = (e, prop, opts) => {
		runInAction(() => {
			if (prop === 'supplier') {
				this.props.data.supplier.identification_text = this.supplier_node.current.innerHTML
			} else if (prop === 'purchaser') {
				this.props.data.purchaser.text = this.purchaser_node.current.innerHTML
			} else if (prop === 'invoice_row') {
				this.props.data.invoice_rows[opts.index] = this.props.data.invoice_rows[opts.index] || []
				this.props.data.invoice_rows[opts.index][opts.rowIndex] = this.invoice_rows_nodes[opts.index][opts.rowIndex].innerHTML

				this.recalculatePrice()
			}
		})
	}

	// is expected to be run in a runInAction block
	recalculatePrice() {
		this.props.data.price = this.props.data.invoice_rows.reduce((acc, item) => acc + parseFloat(item[1] || '0'), 0)
	}

	render() {
		const {
			data: {
				logo,
				language,
				bank_account = {},
				order_number,
				supplier = {},
				payment_type,
				issue_date,
				due_date,
				tax_date,
				price,
				currency,
				vat_amount,
				total_price,
				to_other_eu_country,
				invoice_rows,
				qr_code,
				qr_code_value,
			},
		} = this.props

		const t = (tString, opts) => this.props.t(tString, language ? Object.assign({}, opts, { lng: language }) : opts)

		const addInvoiceRow = () => {
			runInAction(() => invoice_rows.push(['', 0]))
			this.setState({
				invoice_rows: JSON.parse(JSON.stringify(invoice_rows)),
			})
		}
		const removeInvoiceRow = index => {
			runInAction(() => {
				invoice_rows.splice(index, 1)
				this.recalculatePrice()
			})
			this.setState({
				invoice_rows: JSON.parse(JSON.stringify(invoice_rows)),
			})
		}

		const isTaxDocument = (supplier && supplier.registered_for_vat) || to_other_eu_country

		return (
			<div>
				<div className='box invoice-wrapper'>
					<div className='invoice-grid'>

						<div className='invoice-grid-full-width'>
							<Text className='invoice-logo' text={logo} />
							<Text tag='h1' text={t('invoice.invoice_#', { number: order_number || '' })} />
						</div>
						<div className='invoice-grid-full-width'>
							<div className='flex flex-space-between'>
								<Text text={t('document.document')} />
								<Text className={isTaxDocument ? 'text-emphasize' : ''} text={t('invoice.invoice') + (isTaxDocument ? t('document.tax_document') : '')} />
							</div>
							<div className='flex flex-space-between'>
								<Text text={t('document.document_number')} />
								<Text tag='div' text={order_number} />
							</div>
							{!isTaxDocument && (
								<div className='flex flex-space-between text-emphasize'>
									<div></div>
									<Text text={t('document.not_a_tax_document')} />
								</div>
							)}
						</div>

						<div className='invoice-grid-full-width margin-bottom-tiny'>
							<hr />
						</div>

						<div className='invoice-side-wrapper'>
							<div className='invoice-side-label'>{t('supplier.supplier')}</div>
							<div className='invoice-side-text' id='invoice-supplier' ref={this.supplier_node} contentEditable suppressContentEditableWarning={true} onInput={e => this.handleCEInput(e, 'supplier')}><Text text={this.state.supplier_text} /></div>
						</div>
						<div className='invoice-side-wrapper'>
							<div className='invoice-side-label'>{t('purchaser.purchaser')}</div>
							<div className='invoice-side-text' id='invoice-purchaser' ref={this.purchaser_node} contentEditable suppressContentEditableWarning={true} onInput={e => this.handleCEInput(e, 'purchaser')}><Text text={this.state.purchaser_text} /></div>
						</div>

						<div className='invoice-grid-full-width margin-bottom-medium'>
							<hr />
						</div>

						<div className='margin-bottom-medium'>
							<div className='flex flex-space-between'>
								<Text text={t('payment_type.payment_type')} />
								<Text text={t(payment_type.label)} />
							</div>

							<div className='flex flex-space-between'>
								<Text text={t('bank.bank')} />
								<Text text={bank_account.bank} />
							</div>
							<div className='flex flex-space-between'>
								<Text text={t('bank.account_number')} />
								<Text className={to_other_eu_country ? '' : 'text-emphasize'} text={bank_account.account_number} />
							</div>
							{to_other_eu_country && [
								<div key='iban' className='flex flex-space-between text-emphasize'>
									<Text text={t('bank.iban')} />
									<Text text={bank_account.iban} />
								</div >,
								<div key='swift' className='flex flex-space-between'>
									<Text text={t('bank.swift')} />
									<Text text={bank_account.swift} />
								</div >
							]}
							<div className='flex flex-space-between'>
								<Text text={t('bank.variable_symbol')} />
								<Text className='text-emphasize' text={order_number} />
							</div>
						</div>
						<div className='margin-bottom-medium'>
							<div className='flex flex-space-between'>
								<Text text={t('date.issue')} />
								<Text text={formatDate(issue_date)} />
							</div>
							{isTaxDocument && (
								<div className='flex flex-space-between'>
									<Text text={t('date.tax')} />
									<Text text={formatDate(tax_date)} />
								</div>
							)}
							<div className='flex flex-space-between text-emphasize'>
								<Text text={t('date.due')} />
								<Text text={formatDate(due_date)} />
							</div>
						</div>

						<div className='invoice-grid-full-width'>
							<Text text={t('invoice.rows_heading')} />

							<hr className='margin-vertical-small' />
							<table className='invoice-rows'>
								<tbody>
									{this.state.invoice_rows.map((item, index) => (
										<tr key={index}>
											<td style={{ width: '80%' }} contentEditable suppressContentEditableWarning={true} ref={el => this.assignRow(el, index, 0)} onInput={e => this.handleCEInput(e, 'invoice_row', { index, rowIndex: 0 } )}>
												{item[0]}
											</td>
											<td contentEditable suppressContentEditableWarning={true} className='text-align-right' ref={el => this.assignRow(el, index, 1)} onInput={e => this.handleCEInput(e, 'invoice_row', { index, rowIndex: 1 } )}>
												{item[1]}
											</td>
											<td className='screen-only addon'>
												<div>
													<MaterialIcon icon='close' className='icon-small cursor-pointer invoice-rows-icon' onClick={() => removeInvoiceRow(index)} />
												</div>
											</td>
										</tr>
									))}
									<tr className='screen-only'>
										<td colSpan='3'>
											<MaterialIcon icon='add' className='icon-small cursor-pointer invoice-rows-icon' onClick={addInvoiceRow} />
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div>&nbsp;</div>
						<div>
							{isTaxDocument && (
								<div>
									<div className='flex flex-space-between'>
										<Text text={t('tax.base')} />
										<Text text={formatPrice(price, currency)} />
									</div>
									<div className='flex flex-space-between'>
										<Text text={t('tax.tax_#', { amount: VAT_AMOUNT })} />
										<Text text={formatPrice(vat_amount, currency)} />
									</div>
								</div>
							)}
							<div className='flex flex-space-between text-emphasize'>
								<Text text={t('price.total_to_pay')} />
								<Text text={formatPrice(total_price, currency)} />
							</div>
						</div>

						{qr_code && qr_code_value && (
							<div className='invoice-grid-full-width qr-wrapper text-align-right'>
								<QRCode renderAs='svg' size={100} value={qr_code_value} level='H' />
							</div>
						)}

					</div>
				</div >
			</div >
		)
	}

}