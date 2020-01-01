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
import InvoiceHistoryGraph from './InvoiceHistoryGraph'
import { prepareDataForGraph } from '../helpers/invoiceHelpers'

import setDocumentTitle from 'docTitle'

@inject('InvoiceStore')
@withTranslation()
@withRouter
@observer
export default class InvoiceList extends React.Component {

	componentDidMount() {
		this.props.InvoiceStore.load()
		setDocumentTitle(this.props.t('invoice.list'))
	}

	getCleanFirstLine(str) {
		return ('' + str || '').replace(/<.?div>/g, '').split(/<br.*?>/).slice(0, 1)
	}

	getSupplierText(item) {
		return (item.supplier_ref && item.supplier_ref.label) || this.getCleanFirstLine(item.supplier) || '-'
	}

	getPurchaserText(item) {
		return (item.purchaser_ref && item.purchaser_ref.label) || this.getCleanFirstLine(item.purchaser) || '-'
	}

	render() {

		const {
			InvoiceStore,
			t,
		} = this.props

		if (!InvoiceStore.loaded) return (
			<>
				<PrintPlaceholder />
				<Text className='screen-only' t='invoice.list_loading' />
			</>
		)

		if (!InvoiceStore.items.length) return (
			<>
				<PrintPlaceholder />
				<div className='screen-only'>
					<div className='wrapper box empty'>
						<Text className='block' t='invoice.empty_list'></Text>
						<Link to='/invoice/new'>
							<Button raised type='button' className='button button-primary'><Text t='invoice.add_first' /></Button>
						</Link>
					</div>
				</div>
			</>
		)

		const invoices = InvoiceStore.items.slice().sort((i1, i2) => new Date(i1.issue_date) > new Date(i2.issue_date) ? -1 : 1)

		const date = new Date()
		const { data, dataKeys, totals } = prepareDataForGraph(InvoiceStore.items, { date, t })
		const totalsKeys = Object.keys(totals)

		return (
			<>
				<PrintPlaceholder />
				<div className='screen-only'>
					<div className='wrapper box'>
						<div className='flex flex-space-between block'>
							<Link to='/invoice/new'>
								<Button outlined type='button'><Text t='invoice.add' /></Button>
							</Link>
							<div className='flex'>
								<Text t='invoice.invoiced_in_last_12_months' />
								&nbsp;
								<div>
									{totalsKeys && totalsKeys.map((supplierKey, index) => (
										<div key={index}>
											{supplierKey}: {Object.keys(totals[supplierKey]).map(currencyKey => formatCurrency(totals[supplierKey][currencyKey], currencyKey)).join(', ')}
										</div>
									))}
								</div>
							</div>
						</div>
						<div className='padding-top-large'>
							<InvoiceHistoryGraph data={data} dataKeys={dataKeys} date={date} type='std' />
						</div>
						<List className='mdc-list-anchors'>
							<li className='flex mdc-list-heading'>
								<Text className='flex-1' t='date.issue' />
								<Text className='flex-1' t='invoice.order_number' />
								<Text className='flex-1' t='supplier.supplier' />
								<Text className='flex-1' t='purchaser.purchaser' />
								<Text className='flex-1 text-align-right' t='price.price' />
							</li>
							<ListDivider />
							{invoices.map((item, index) => (
								<ListItem key={index}>
									<Link to={`/invoice/${item.id}`} className='flex flex-1 flex-align-center'>
										<Text className='flex-1' text={formatDate(item.issue_date) || '-'} />
										<Text className='flex-1' text={item.order_number || '-'} />
										<Text className='flex-1 one-liner' text={this.getSupplierText(item)} />
										<Text className='flex-1 one-liner' text={this.getPurchaserText(item)} />
										<Text className='flex-1 text-align-right' text={formatCurrency(item.total_price, item.currency) || '-'} />
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