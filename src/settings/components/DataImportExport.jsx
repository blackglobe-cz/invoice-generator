import React from 'react'
import { action, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'
import { withNamespaces } from 'react-i18next'
import { withRouter } from 'react-router-dom'

import { STORAGE_KEYS } from 'agent'

import MaterialIcon from '@material/react-material-icon'
import IconButton from '@material/react-icon-button'
import Button from '@material/react-button'
import TextField, { Input } from '@material/react-text-field'
import Drawer from '@material/react-drawer'
import List, { ListItem, ListItemText, ListDivider } from '@material/react-list'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'

@inject('SettingsStore')
@withNamespaces()
@withRouter
@observer
export default class DataImportExport extends React.Component {

  constructor() {
		super()

		this.state = {
      activeTab: 'export',
			valueInvoices: localStorage.getItem(STORAGE_KEYS.INVOICE),
			valueSettings: localStorage.getItem(STORAGE_KEYS.SETTINGS),
      invoiceImport: '',
      settingsImport: '',
		}
	}

  handleFormSubmit(event, dataString, localStorageProp) {
    localStorage.setItem(localStorageProp, dataString)
    this.props.history.push('/')
  }

  handleInput(prop, value, event) {
		runInAction(() => { this.state[prop] = value })
  }

  render() {

    const {
			t,
		} = this.props

    const {
      activeTab,
      valueInvoices,
      valueSettings,
      invoiceImport,
      settingsImport,
    } = this.state

    return (
      <div className='grid grid-large' style={{ gridTemplateColumns: '260px auto' }}>
        <Drawer className='settings-drawer'>
          <List>
            <ListItem onClick={() => this.setState({ activeTab: 'export' })} className={'cursor-pointer' + (activeTab === 'export' ? ' mdc-list-item--selected' : '')}>
              <Text text={t('data.export')} />
            </ListItem>
            <ListItem onClick={() => this.setState({ activeTab: 'import' })} className={'cursor-pointer' + (activeTab === 'import' ? ' mdc-list-item--selected' : '')}>
              <Text text={t('data.import')} />
            </ListItem>
          </List>
        </Drawer>
        {activeTab === 'export' && (
          <div>
            <div className='block'>
              <label className='block'>
                <Text text={t('data.invoice_export')} />
                <FormControl readOnly rows='10' type='textarea' prop='invoiceExport' name='invoice_export' value={valueInvoices} />
              </label>
            </div>
            <div className='block'>
              <label className='block'>
                <Text text={t('data.settings_export')} />
                <FormControl readOnly rows='10' type='textarea' prop='settingsExport' name='settings_export' value={valueSettings} />
              </label>
            </div>
          </div>
        )}
        {activeTab === 'import' && (
          <div>
            <form onSubmit={e => this.handleFormSubmit(e, invoiceImport, STORAGE_KEYS.INVOICE)}>
              <label className='block'>
                <Text text={t('data.import_invoices')} />
                <FormControl type='textarea' prop='invoiceImport' name='invoice_import' placeholder={t('data.import_invoices')} value={invoiceImport} onChange={this.handleInput.bind(this)} />
              </label>
              <Button raised type='submit'>
                <Text text={t('data.import_invoices_submit')} />
              </Button>
            </form>
            <form onSubmit={e => this.handleFormSubmit(e, settingsImport, STORAGE_KEYS.SETTINGS)}>
              <label className='block'>
                <Text text={t('data.import_settings')} />
                <FormControl type='textarea' prop='settingsImport' name='settings_import' placeholder={t('data.import_settings')} value={settingsImport} onChange={this.handleInput.bind(this)} />
              </label>
              <Button raised type='submit'>
                <Text text={t('data.import_settings_submit')} />
              </Button>
            </form>
          </div>
        )}
      </div>
    )
  }

}