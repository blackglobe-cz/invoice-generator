import React from 'react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'

import MaterialIcon from '@material/react-material-icon'

import Text from 'text/components/Text'
import formatDate from 'date/helpers/formatter'
import formatPrice, { currencies, isSuffixed } from 'currency/helpers/formatter'
import QRCode from 'qrcode.react'
import { isPriceLike } from '../helpers/invoiceHelpers'

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
			purchaser_label: this.props.data.purchaser_ref ? this.props.data.purchaser_ref.label : '',
		})
	}

	resetLocalState() {
		const data = this.props.data
		this.setState({
			supplier_id: data.supplier_id,
			supplier_text: data.supplier || '',
			purchaser_text: data.purchaser || '',
			invoice_rows: JSON.parse(JSON.stringify(data.invoice_rows)).map(row => {
				row[1] = isPriceLike(row[1]) ? formatPrice((typeof row[1] !== 'undefined' ? '' + row[1] : '0').replace(/\s/g, ''), 0, { skipCurrency: true, decimals: void 0 }) : '' + row[1]
				return row
			}),
		})
	}

	componentDidUpdate() {
		const data = this.props.data
		if (this.state.supplier_id !== data.supplier_id) {
			this.resetLocalState()
		}
		if (data.purchaser_ref && data.purchaser_ref.label !== this.state.purchaser_label) {
			this.setState({
				purchaser_text: data.purchaser_ref.text,
				purchaser_label: data.purchaser_ref.label,
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
				this.props.data.supplier = this.supplier_node.current.innerHTML
			} else if (prop === 'purchaser') {
				this.props.data.purchaser = this.purchaser_node.current.innerHTML
			} else if (prop === 'invoice_row') {
				this.props.data.invoice_rows[opts.index] = this.props.data.invoice_rows[opts.index] || []
				this.props.data.invoice_rows[opts.index][opts.rowIndex] = this.invoice_rows_nodes[opts.index][opts.rowIndex].innerHTML

				this.recalculatePrice()
			}
		})
	}

	formatIfPriceLike(e, { index }) {
		const content = this.invoice_rows_nodes[index][1].innerText
		const contentFormatted = isPriceLike(content) ? formatPrice(content.replace(/\s/g, ''), 0, { skipCurrency: true, decimals: void 0 }) : content
		if (contentFormatted !== content) this.invoice_rows_nodes[index][1].innerHTML = contentFormatted
	}

	deformatIfPriceLike(e, { index }) {
		const content = this.invoice_rows_nodes[index][1].innerText
		const contentDeformatted = isPriceLike(content) ? content.replace(/\s/g, '') : content
		if (contentDeformatted !== content) this.invoice_rows_nodes[index][1].innerHTML = contentDeformatted
	}

	// is expected to be run in a runInAction block
	recalculatePrice() {
		this.props.data.price = this.props.data.invoice_rows.reduce((acc, item) => acc + parseFloat(item[1].replace(/\s/g, '') || '0'), 0)
	}

	render() {
		const {
			data: {
				logo,
				language,
				bank_account = {},
				order_number,
				supplier_ref = {},
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

		const isTaxDocument = (supplier_ref && supplier_ref.registered_for_vat) || to_other_eu_country

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

							{payment_type && payment_type.includes_bank_transfer && (
								<>
									<div className='flex flex-space-between'>
										<Text text={t('bank.bank')} />
										<Text text={bank_account.bank} />
									</div>
									<div className='flex flex-space-between'>
										<Text text={t('bank.account_number')} />
										<Text className={to_other_eu_country ? '' : 'text-emphasize'} text={bank_account.account_number} />
									</div>
									{to_other_eu_country && (
										<>
											<div className='flex flex-space-between text-emphasize'>
												<Text text={t('bank.iban')} />
												<Text text={bank_account.iban} />
											</div>
											<div key='swift' className='flex flex-space-between'>
												<Text text={t('bank.swift')} />
												<Text text={bank_account.swift} />
											</div>
										</>
									)}
								</>
							)}
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
											{!isSuffixed(currency) && (
												<td className='addon'>{currencies[currency] ? currencies[currency].short + '\u00A0' : (currency + '\u00A0')}</td>
											)}
											<td contentEditable suppressContentEditableWarning={true} className='text-align-right addon' ref={el => this.assignRow(el, index, 1)} onInput={e => this.handleCEInput(e, 'invoice_row', { index, rowIndex: 1 } )} onBlur={e => this.formatIfPriceLike(e, { index })} onFocus={e => this.deformatIfPriceLike(e, { index })}>
												{item[1]}
											</td>
											{isSuffixed(currency) && (
												<td className='addon'>{currencies[currency] ? '\u00A0' + currencies[currency].short : ('\u00A0' + currency)}</td>
											)}
											<td className='screen-only addon'>
												<div>
													<MaterialIcon icon='close' className='icon-small cursor-pointer invoice-rows-icon' onClick={() => removeInvoiceRow(index)} />
												</div>
											</td>
										</tr>
									))}
									<tr className='screen-only'>
										<td colSpan='4'>
											<MaterialIcon icon='add' className='icon-small cursor-pointer invoice-rows-icon' onClick={addInvoiceRow} />
										</td>
									</tr>
								</tbody>
							</table>

							{/* this can't be part of the grid because of the <hr /> vertical alignment */}
							<div className='flex'>
								<div className='flex-1'>&nbsp;</div>
								<div className='flex-1 margin-left-large'>
									<hr className='margin-vertical-small' />
									{isTaxDocument && (
										<div>
											<div className='flex flex-space-between'>
												<Text text={t('tax.base')} />
												<Text text={formatPrice(price, currency)} />
											</div>
											<div className='flex flex-space-between'>
												<Text text={t('tax.tax_#', { amount: VAT_AMOUNT + '%' })} />
												<Text text={formatPrice(vat_amount, currency)} />
											</div>
										</div>
									)}
									<div className='flex flex-space-between text-emphasize'>
										<Text text={t('price.total_to_pay')} />
										<Text text={formatPrice(total_price, currency)} />
									</div>
								</div>
							</div>

						</div>

						{qr_code && qr_code_value && (
							<div className='invoice-grid-full-width text-align-right'>
								<div className='qr-outer-wrapper'>
									<div className='qr-wrapper'>
										<QRCode renderAs='svg' size={110} value={qr_code_value} level='H' />
										<div className='qr-label'>{t('qr.label')}</div>
									</div>
								</div>
							</div>
						)}

					</div>
				</div >
			</div >
		)
	}

}