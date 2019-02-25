import React from 'react'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { withNamespaces, WithNamespaces } from 'react-i18next'

import Text from 'text/components/Text'
import formatDate from 'date/helpers/formatter'
import formatPrice from 'currency/helpers/formatter'
import QRCode from 'qrcode.react'

@withNamespaces()
@observer
export default class InvoiceView extends React.Component {

	handlePriceInput = (e, item) => {
		if (!this.props.data.autocalc) return
		const data = this.props.data
		console.log('e', e, e.target.innerHTML);
		const newPrice = parseFloat(e.target.innerHTML)
		runInAction(() => {
			item[1] = newPrice
			console.log(data.invoice_rows);
			const np = data.invoice_rows.reduce((acc, item) => acc + parseFloat(item[1]), 0)
			data.price = np
			console.log(np, newPrice);
			setTimeout(() => {
				console.log(this.props);
			}, 200)
		})
	}

	render() {
		const {
			t,
			data: {
				logo,
				order_number,
				supplier,
				purchaser,
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

		const bank_account = {
			name: 'Fio',
			number: '2400329442',
			code: '2010',
		}

		const addInvoiceRow = () => {
			runInAction(() => { invoice_rows.push(['', 0]) })
		}
		const removeInvoiceRow = index => {
			runInAction(() => { invoice_rows.splice(index, 1) })
		}

		return (
			<div className='box invoice-wrapper'>
				<div className='invoice-grid'>

					<div className='invoice-grid-full-width'>
						<Text className='invoice-logo' text={logo} />
						<h1>
							<span translate='invoice'>Faktura</span>&nbsp;<Text tag='span' text={order_number} />
						</h1>
					</div>
					<div className='invoice-grid-full-width'>
						<div className='flex flex-space-between'>
							<div translate='document'>Dokument</div>
							<div>
								<span translate='invoice'>Faktura</span>
								<span className='registered-for-vat-only not-registered-for-vat-only-eu-only' translate='tax_document'> - daňový doklad</span>
							</div>
						</div>
						<div className='flex flex-space-between'>
							<div translate='document_number'>Číslo dokumentu</div>
							<Text tag='div' text={order_number} />
						</div>
						<div className='flex flex-space-between'>
							{/* <tr className='not-registered-for-vat-only not-registered-for-vat-inland-only'> */}
							<div></div>
							<div translate='not_a_tax_document'>Není daňový doklad</div>
							{/* </tr> */}
						</div>
					</div>

					<div className='invoice-grid-full-width'>
						<hr />
					</div>

					<div>
						<div translate='supplier'>Dodavatel</div>
						<div className='invoice-side' id='invoice-supplier' contentEditable suppressContentEditableWarning={true}><Text text={supplier.identification_text} /></div>
					</div>
					<div>
						<div translate='purchaser'>Odběratel</div>
						<div className='invoice-side' id='invoice-purchaser' contentEditable suppressContentEditableWarning={true}><Text text={purchaser.text} /></div>
					</div>

					<div className='invoice-grid-full-width'>
						<hr />
					</div>

					<div>
						<div className='flex flex-space-between'>
							<div translate='payment_type'>Způsob úhrady</div>
							<Text text={payment_type} />
						</div>

						<div className='flex flex-space-between'>
							<div translate='bank'>Banka</div>
							<Text text={bank_account.name} />
						</div>
						<div className='flex flex-space-between'>
							<div translate='account_number'>Číslo účtu</div>
							<Text className='text-emphasize' text={bank_account.number + '/' + bank_account.code} />
						</div>
						{to_other_eu_country && [
							<div key='iban' className='flex flex-space-between'>
								<div>IBAN</div>
								<Text text={bank_account.iban} />
							</div >,
							<div key='swift' className='flex flex-space-between'>
								<div>BIC/SWIFT</div>
								<Text text={bank_account.swift} />
							</div >
						]}
						<div className='flex flex-space-between'>
							<div translate='variable_symbol'>Variabilní symbol</div>
							<Text className='text-emphasize' text={order_number} />
						</div>
					</div>
					<div>
						<div className='flex flex-space-between'>
							<div translate='variable_symbol'>Datum vystavení</div>
							<Text text={formatDate(issue_date)} />
						</div>
						<div className='flex flex-space-between'>
							<div translate='variable_symbol'>Datum zdanitelného plnění</div>
							<Text text={formatDate(tax_date)} />
						</div>
						<div className='flex flex-space-between'>
							<div translate='variable_symbol'>Datum splatnosti</div>
							<Text text={formatDate(due_date)} />
						</div>
					</div>

					<div className='invoice-grid-full-width'>
						<div>
							Fakturujeme Vám
						</div>

						<hr />
						<table className='invoice-rows'>
							<tbody>
								{invoice_rows.map((item, index) => (
									<tr key={index}>
										<td contentEditable suppressContentEditableWarning={true}>
											{item[0]}
										</td>
										<td contentEditable suppressContentEditableWarning={true} className='text-align-right' onInput={e => this.handlePriceInput(e, item)}>
											{item[1]}
										</td>
										<td className='screen-only addon'>
											<div onClick={() => removeInvoiceRow(index)}>
												&times;
											</div>
										</td>
									</tr>
								))}
								<tr className='screen-only'>
									<td colSpan='3' onClick={addInvoiceRow}>
										+
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div>&nbsp;</div>
					<div>
						<div className='flex flex-space-between'>
							<Text text='Základ daně' />
							<Text text={formatPrice(price, currency)} />
						</div>
						<div className='flex flex-space-between'>
							<Text text='DPH (21%)' />
							<Text text={formatPrice(vat_amount, currency)} />
						</div>
						<div className='flex flex-space-between text-emphasize'>
							<Text text='Celkem k úhradě' />
							<Text text={formatPrice(total_price, currency)} />
						</div>
					</div>

					{qr_code && (
						<div className='invoice-grid-full-width qr-wrapper text-align-right'>
							<QRCode renderAs='svg' size={100} value={qr_code_value} level='H' />
						</div>
					)}

				</div>
			</div >
		)
	}

}