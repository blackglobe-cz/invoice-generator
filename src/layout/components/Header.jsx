import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import Modal from 'react-modal'

import Text from '../../text/components/Text'
import Settings from '../../settings/components/Settings'

Modal.setAppElement('#root')

const customStyles = {
	content: {
		top: '30%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)'
	}
}

@withRouter
export default class Header extends React.Component {

	constructor() {
		super()

		this.state = {
			modalIsOpen: false,
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

	render() {
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
						<button type='button' className='button' onClick={this.openSettings}>
							⚙ Settings
						</button>
					</div>
				</div>

				<Modal
					isOpen={this.state.modalIsOpen}
					// onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel='Settings'
				>
					<div className='modal-wrapper'>
						<div className='block flex flex-space-between'>
							<div className='flex-1'>
								<h1>Settings</h1>
							</div>
							<div>
								<button type='button' className='button' onClick={this.closeModal}>&times;</button>
							</div>
						</div>
						<Settings />
					</div>
				</Modal>
			</div>
		)
	}

}