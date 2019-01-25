import React from 'react'
import { inject } from 'mobx-react';

@inject('SettingsStore')
export default class InvoiceDetail extends React.Component {

	activeIssuer = {}

	issuers = []

	openIssuerForm(issuer = {}) {
		this.setState({ activeIssuer: issuer })
	}

	render() {

		const {
			SettingsStore,
		} = this.props

		const {
			issuers,
		} = SettingsStore

		return (
			<div className='grid grid-large' style={{ gridTemplateColumns: '200px auto' }}>
				<div>
					<ul>
						{(issuers || []).map((item, index) => (
							<li key={index} onClick={() => this.openIssuerForm(item)}>
								{item.label}
							</li>
						))}
						<li>
							<button type='button' className='button' onClick={() => this.openIssuerForm()}>Add issuer</button>
						</li>
					</ul>
				</div>
				<div>
					{JSON.stringify(this.activeIssuer || { empty: true })}
				</div>
			</div>
		)
	}

}