import React, {Suspense} from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import DevTools from 'mobx-react-devtools'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'

import './main.scss'

// import localization for bundling
// asdf-eslint-disable-next-line
import './i18n'
// import i18n from './i18n'

import App from './App'

import InvoiceStore from './invoice/stores/InvoiceStore'
import SettingsStore from './settings/stores/SettingsStore'
import PaymentTypeStore from './payment-type/stores/PaymentTypeStore'


configure({
	enforceActions: 'always',
})

const stores = {
	InvoiceStore,
	SettingsStore,
	PaymentTypeStore,
}

render(
	<div>
		<DevTools />
		<Provider {...stores}>

			<BrowserRouter>
				<Suspense fallback={<div>Loading...</div>}>
					<App />
				</Suspense>
			</BrowserRouter>

		</Provider>
	</div>,
	document.getElementById('root')
)

// playing around in the console
window.store = stores