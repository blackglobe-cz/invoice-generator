import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import Modal from 'react-modal'
import { withNamespaces } from 'react-i18next'

import Button from '@material/react-button'
import IconButton from '@material/react-icon-button'
import MaterialIcon from '@material/react-material-icon'
// import TextField, { Input } from '@material/react-text-field'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'

import Text from '../../text/components/Text'
import Settings from '../../settings/components/Settings'
import DataImportExport from '../../settings/components/DataImportExport'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		position: 'relative',
		maxWidth: '800px',
		padding: '0',
		bottom: 'auto',
		margin: '5% auto',
		top: '0', right: '0', bottom: '0', left: '0',
	}
}

@withRouter
@withNamespaces()
export default class Header extends React.Component {

	constructor() {
		super()

		this.state = {
			modalIsOpen: false,

			activeIndex: 0,
		}
	}

	openSettings = () => {
		this.setState({ modalIsOpen: true })
	}
	// afterOpenModal = () => {
	// 	console.log('opening modal');
	// }
	closeModal = () => {
		this.setState({ modalIsOpen: false })
	}

	closeImportExport = () => {
		this.setState({ dataMgmtOpen: false })
	}

	handleActiveIndexUpdate = activeIndex => this.setState({ activeIndex })

	render() {

		const {
			activeIndex,
		} = this.state

		const {
			t,
		} = this.props

		return (
			<div className='screen-only'>
				<div className='wrapper flex flex-space-between'>
					<div className='flex-1'>
						<Link to='/' className='grid grid-large' style={{gridTemplateColumns: 'auto 1fr'}}>
							<Text text="<svg version='1.1' class='project-logo' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 256 256' enable-background='new 0 0 256 256' xml:space='preserve'><g><g><path fill-rule='evenodd' clip-rule='evenodd' d='M206.1,138.8c-0.9-15.9-6.6-30.5-15.6-42.5l-64.9,64.4L206.1,138.8z'/><path fill-rule='evenodd' clip-rule='evenodd' d='M109.9,164.9l75.4-74.8C171,74.7,150.5,65,127.8,65c-43.4,0-78.5,35.1-78.5,78.5c0,12.8,3.1,24.9,8.5,35.6L109.9,164.9z'/><path fill-rule='evenodd' clip-rule='evenodd' d='M114.1,172.1l-34,33.7C93.3,216,109.8,222,127.8,222c42.2,0,76.5-33.2,78.4-74.9L114.1,172.1z'/><path fill-rule='evenodd' clip-rule='evenodd' d='M62,186.2c3.4,5.3,7.4,10.1,12,14.4l24.5-24.3L62,186.2z'/></g><circle cx='224.7' cy='57.6' r='23.6'/><circle cx='21.5' cy='192.1' r='13.8'/></g></svg>" />
							<span style={{alignSelf: 'center'}}>Lo and behold - Black Globe's Invoice Generator!</span>
						</Link>
					</div>
					<div>
						{/*<Button dense icon={<MaterialIcon icon='import_export' />} type='button' onClick={this.openImportExport}>
							<Text text={t('import_export.import_export')} />
						</Button>*/}
						<Button dense icon={<i className='material-icons'>settings</i>} type='button' onClick={this.openSettings}>
							<Text text={t('settings.settings')} />
						</Button>
						{/*
						<button type='button' className='button button-phantom button-icon' onClick={this.openSettings}>
							⚙ {t('settings.settings')}
						</button>
						*/}
					</div>
				</div>

				<Modal
					isOpen={this.state.modalIsOpen}
					// onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel={t('settings.settings')}
				>
					<div className='modal-wrapper'>
						<div className='block flex flex-space-between flex-align-center'>
							<div className='flex-1'>
								<Text tag='h1' text={t('settings.settings')} />
							</div>
							<div>
								{/*
								<Button icon={<i className='material-icons'>close</i>} type='button' className='button button-phantom button-icon' onClick={this.closeModal}>&times;</Button>
								*/}
								<IconButton type='button' onClick={this.closeModal}>
									<MaterialIcon icon='close' />
								</IconButton>
							</div>
						</div>
						{/*<hr className='block' />*/}

						<TabBar
		          activeIndex={activeIndex}
		          handleActiveIndexUpdate={this.handleActiveIndexUpdate}
		        >
		          <Tab>
		            <Text className='mdc-tab__text-label' text={t('supplier.suppliers')} />
		          </Tab>
		          <Tab>
		            <Text className='mdc-tab__text-label' text={t('data.import_export')} />
		          </Tab>
		        </TabBar>
						{activeIndex === 0 && (
							<Settings />
						)}
						{activeIndex === 1 && (
							<DataImportExport />
						)}
					</div>
				</Modal>

				{/*<Modal
					isOpen={this.state.dataMgmtOpen}
					// onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeImportExport}
					style={customStyles}
					contentLabel={t('data.mgmt')}
				>
					<div className='modal-wrapper'>
						<h1>Import / Export</h1>
						<div className='block'>
							<TextField textarea label='invoice.invoice_export'><Input value={this.state.valueInvoices} /></TextField>
						</div>
						<div className='block'>
							<TextField textarea label='settings.settings_export'><Input value={this.state.valueSettings} /></TextField>
						</div>
					</div>
				</Modal>*/}

			</div>
		)
	}

}