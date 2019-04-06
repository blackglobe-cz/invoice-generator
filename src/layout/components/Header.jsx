import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import Modal from 'react-modal'
import { withTranslation } from 'react-i18next'

import Button from '@material/react-button'
import IconButton from '@material/react-icon-button'
import MaterialIcon from '@material/react-material-icon'
import Tab from '@material/react-tab'
import TabBar from '@material/react-tab-bar'

import Text from '../../text/components/Text'
import Settings from '../../settings/components/Settings'
import DataImportExport from '../../settings/components/DataImportExport'
import BlackGlobeLogo from 'images/BlackGlobeLogo'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		position: 'relative',
		maxWidth: '800px',
		padding: '0',
		margin: '5% auto',
		top: '0', right: '0', bottom: '0', left: '0',
	}
}

@withRouter
@withTranslation()
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
							<BlackGlobeLogo className='project-logo' />
							<Text style={{ alignSelf: 'center' }} text='Lo and behold - Black Globe&apos;s Invoice Generator!' />
						</Link>
					</div>
					<div>
						<Button dense icon={<i className='material-icons'>settings</i>} type='button' onClick={this.openSettings}>
							<Text text={t('settings.settings')} />
						</Button>
					</div>
				</div>

				<Modal
					isOpen={this.state.modalIsOpen}
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
								<IconButton type='button' onClick={this.closeModal}>
									<MaterialIcon icon='close' />
								</IconButton>
							</div>
						</div>

						<TabBar
							activeIndex={activeIndex}
							handleActiveIndexUpdate={this.handleActiveIndexUpdate}
							className='margin-bottom-large'
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
			</div>
		)
	}

}