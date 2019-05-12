import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Text from 'text/components/Text'
import Header from './layout/components/Header'
import Footer from './layout/components/Footer'
import InvoiceList from './invoice/components/InvoiceList'
import InvoiceDetail from './invoice/components/InvoiceDetail'
import PageNotFound from './common/PageNotFound'

@inject('SettingsStore')
@withRouter
@observer
export default class App extends React.Component {

	constructor() {
		super()

		this.state = {
			loaded: false,
		}
	}

	componentDidMount() {
		this.props.SettingsStore.load().then(() => {
			this.setState({ loaded: true })
		})
	}

	render() {

		const {
			SettingsStore: {
				suppliers,
			},
		} = this.props

		return (
			<div>
				<Header />

				{this.state.loaded && !suppliers.length && (
					<div className='wrapper alert info screen-only'>
						<Text t='settings.no_settings_yet' />
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