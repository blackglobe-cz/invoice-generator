import React from 'react'
import { inject, observer } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import Text from 'text/components/Text'
import InvoiceParamsForm from './InvoiceParamsForm'
import InvoiceView from './InvoiceView'
import InvoiceModel from 'invoice/stores/InvoiceModel'

@inject('InvoiceStore')
@observer
// @withNamespaces()
class InvoiceDetail extends React.Component {

	componentDidMount() {
		const {
			match,
			InvoiceStore,
		} = this.props

		InvoiceStore.load(parseInt(match.params.id))
	}

	render() {

		const {
			// t,
			match,
			InvoiceStore,
		} = this.props
const t = a => a
		const {
			loaded,
		} = InvoiceStore

		const detail = match.params.id === 'new' ? new InvoiceModel() : InvoiceStore.invoice(parseInt(match.params.id))

		if (!loaded) return (
			<Text className='wrapper empty' text={t('invoice.detail_loading')} />
		)

		if (!loaded && !detail) return (
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

export default withNamespaces()(InvoiceDetail)