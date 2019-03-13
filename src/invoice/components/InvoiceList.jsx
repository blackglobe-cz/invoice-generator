import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next/hooks'

import Button from '@material/react-button'

import Text from 'text/components/Text'
import formatCurrency from 'currency/helpers/formatter'

////////

@inject('InvoiceStore')
@withRouter
@observer
export default class InvoiceList extends React.Component {

	componentDidMount() {
		this.props.InvoiceStore.load()
	}

	render() {

		// const [t, i18n] = useTranslation()

		const {
			InvoiceStore,
		} = this.props

		if (!InvoiceStore.loaded) return (
			<div>
				Loading invoices...
			</div>
		)

		if (!InvoiceStore.items.length) return (
		// if (!this.invoices.length) return (
			<div className='wrapper box empty'>
				<div className='block'>You have no invoices yet!</div>
				{/* <button className='button'>{t('invoice.add')}</button> */}
				<Link to='/invoice/new'>
					<Button raised type='button' className='button button-primary'>Create invoice</Button>
				</Link>
			</div>
		)

		return (
			<div className='wrapper box'>
				<div className='block'>
					<Link to='/invoice/new'>
						<button className='button button-primary'>Create new invoice</button>
					</Link>
				</div>
				<ul className='list anchor-list'>
					{InvoiceStore.items.map((item, index) => (
						<li key={index}>
							<Link to={`/invoice/${item.id}`} className='flex'>
								<Text className='flex-1' text={index + 1}></Text>
								<Text className='flex-1' text={item.order_number}></Text>
								<Text className='flex-1' text={formatCurrency(item.price, item.currency)}></Text>
								<Text className='flex-1' text={item.purchaser.label}></Text>
								<Text className='flex-1' text={item.issued_at}></Text>
							</Link>
						</li>
					))}
				</ul>
			</div>
		)

	}
}