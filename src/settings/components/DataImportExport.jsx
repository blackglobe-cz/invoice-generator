import React from 'react'
import { action, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { withNamespaces } from 'react-i18next'

import MaterialIcon from '@material/react-material-icon'
import IconButton from '@material/react-icon-button'
import Button from '@material/react-button'

import Text from 'text/components/Text'
import TextField, { Input } from '@material/react-text-field'
import FormControl from 'form/components/FormControl'

@inject('SettingsStore')
@withNamespaces()
@observer
export default class DataImportExport extends React.Component {

  constructor() {
		super()

		this.state = {
			valueInvoices: localStorage.getItem('bg-invoice-generator-invoices'),
			valueSettings: localStorage.getItem('bg-invoice-generator-settings'),
		}
	}

  render() {
    return (
      <div>
        <h1>Import / Export</h1>
        <div className='block'>
          <TextField textarea label='invoice.invoice_export'><Input value={this.state.valueInvoices} /></TextField>
        </div>
        <div className='block'>
          <TextField textarea label='settings.settings_export'><Input value={this.state.valueSettings} /></TextField>
        </div>
      </div>
    )
  }

}