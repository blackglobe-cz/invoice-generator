import React from 'react'
import { inject, observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'
import { withRouter, Link } from 'react-router-dom'

import Button from '@material/react-button'
import List, { ListItem, ListDivider } from '@material/react-list'

import Text from 'text/components/Text'
import formatCurrency from 'currency/helpers/formatter'
import formatDate from 'date/helpers/formatter'
import PrintPlaceholder from 'common/PrintPlaceholder'

@inject('InvoiceStore')
@withTranslation()
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
			<>
				<PrintPlaceholder />
				<Text className='screen-only' text={t('invoice.list_loading')} />
			</>
		)

		if (!InvoiceStore.items.length) return (
			<>
				<PrintPlaceholder />
				<div className='screen-only'>
					<div className='wrapper box empty'>
						<Text className='block' text={t('invoice.empty_list')}></Text>
						<Link to='/invoice/new'>
							<Button raised type='button' className='button button-primary'><Text text={t('invoice.add')} /></Button>
						</Link>
					</div>
				</div>
			</>
		)

		return (
			<>
				<PrintPlaceholder />
				<div className='screen-only'>
					<div className='wrapper box'>
						<div className='block'>
							<Link to='/invoice/new'>
								<Button outlined type='button'><Text text={t('invoice.add')} /></Button>
							</Link>
						</div>
						<List className='mdc-list-anchors'>
							<li className='flex mdc-list-heading'>
								<Text className='flex-1'>{t('date.issue')}</Text>
								<Text className='flex-1'>{t('invoice.order_number')}</Text>
								<Text className='flex-1'>{t('supplier.supplier')}</Text>
								<Text className='flex-1'>{t('purchaser.purchaser')}</Text>
								<Text className='flex-1 text-align-right'>{t('price.price')}</Text>
							</li>
							<ListDivider />
							{InvoiceStore.items.map((item, index) => (
								<ListItem key={index}>
									<Link to={`/invoice/${item.id}`} className='flex flex-1 flex-align-center'>
										<Text className='flex-1' text={formatDate(item.issue_date)} />
										<Text className='flex-1' text={item.order_number} />
										<Text className='flex-1' text={item.supplier ? item.supplier.label : '??'} />
										<Text className='flex-1' text={item.purchaser ? item.purchaser.label : '??'} />
										<Text className='flex-1 text-align-right' text={formatCurrency(item.total_price, item.currency)} />
									</Link>
								</ListItem>
							))}
						</List>
					</div>
				</div>
			</>
		)

	}
}