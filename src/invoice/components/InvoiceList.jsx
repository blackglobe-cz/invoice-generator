import React from 'react'
import { inject, observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { withRouter, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next/hooks'

import Button from '@material/react-button'

import Text from 'text/components/Text'
import formatCurrency from 'currency/helpers/formatter'

////////

@inject('InvoiceStore')
@withNamespaces()
@withRouter
@observer
export default class InvoiceList extends React.Component {

	componentDidMount() {
		this.props.InvoiceStore.load()
	}

	render() {

		const {
			t,
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
				<Text className='block' text={t('invoice.empty_list')}></Text>
				{/* <button className='button'>{t('invoice.add')}</button> */}
				<Link to='/invoice/new'>
					<Button raised type='button' className='button button-primary'><Text text={t('invoice.add')} /></Button>
				</Link>
			</div>
		)

		// console.log(InvoiceStore.items);

		return (
			<div className='wrapper box'>
				<div className='block'>
					<Link to='/invoice/new'>
						<Button outlined type='button'><Text text={t('invoice.add')} /></Button>
					</Link>
				</div>
				<ul className='list anchor-list'>
					{InvoiceStore.items.map((item, index) => (
						<li key={index}>
							<Link to={`/invoice/${item.id}`} className='flex'>
								{/*<Text className='flex-1' text={index + 1} />*/}
								<Text className='flex-1' text={item.order_number} />
								<Text className='flex-1' text={formatCurrency(item.total_price, item.currency)} />
								<Text className='flex-1' text={item.purchaser ? item.purchaser.label : '??'} />
								<Text className='flex-1' text={item.issued_at} />
							</Link>
						</li>
					))}
				</ul>
			</div>
		)

	}
}