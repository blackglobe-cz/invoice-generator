import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Header from './layout/components/Header'
import InvoiceList from './invoice/components/InvoiceList'
import InvoiceDetail from './invoice/components/InvoiceDetail'

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

	issuers = []

	componentDidMount() {
		this.props.SettingsStore.load().then(res => {
			this.issuers = res.issuers
			this.setState({ loaded: true })
		})
	}

	render() {

		const {
			SettingsStore: {
				suppliers
			}
		} = this.props

		return (
			<div>
				<Header />

				{this.state.loaded && !suppliers.length && (
					<div className='wrapper alert info screen-only-a'>
						It seems like you don't have any preferences or issuers. Set them up in settings!
						{/* <button className='button primary-button' type='button'>
							Let's do it!
						</button> */}
					</div>
				)}

				<Switch>
					<Route exact path='/' component={InvoiceList} />
					<Route path='/invoice/:id' component={InvoiceDetail} />
				</Switch>
			</div>
		)
	}
}