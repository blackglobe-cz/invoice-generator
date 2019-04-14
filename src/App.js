import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { withTranslation } from 'react-i18next'

import Text from 'text/components/Text'
import Header from './layout/components/Header'
import Footer from './layout/components/Footer'
import InvoiceList from './invoice/components/InvoiceList'
import InvoiceDetail from './invoice/components/InvoiceDetail'
import PageNotFound from './common/PageNotFound'

@inject('SettingsStore')
@withTranslation()
@withRouter
@observer
export default class App extends React.Component {

	constructor() {
		super()

		this.state = {
			loaded: false,
		}
	}

	// issuers = []

	componentDidMount() {
		this.props.SettingsStore.load().then(res => {
			// this.issuers = res.issuers
			this.setState({ loaded: true })
		})
	}

	render() {

		const {
			t,
			SettingsStore: {
				suppliers,
			},
		} = this.props

		return (
			<div>
				<Header />

				{this.state.loaded && !suppliers.length && (
					<div className='wrapper alert info screen-only'>
						<Text text={t('settings.no_settings_yet')} />
					</div>
				)}

				<Switch>
					<Route exact path='/' component={InvoiceList} />
					<Route exact path='*./index.html' component={InvoiceList} />
					<Route path='/invoice/:id' component={InvoiceDetail} />
					<Route component={PageNotFound} />
				</Switch>

				<Footer />
			</div>
		)
	}
}