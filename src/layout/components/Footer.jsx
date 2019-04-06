import React from 'react'
import { useTranslation } from 'react-i18next'

import Text from 'text/components/Text'
import Button from '@material/react-button'
import MaterialIcon from '@material/react-material-icon'

import Octocat from 'images/OctocatMark'

export default function Footer () {

	const { i18n } = useTranslation()

	return (
		<footer className='screen-only'>
			<div className='wrapper flex flex-space-between flex-align-center'>
				<div className='grid grid-medium' style={{ width: 'unset', gridTemplateColumns: 'auto 1fr 1fr' }}>
					<MaterialIcon style={{ alignSelf: 'center' }} className='text-muted' icon='language' />
					<Button type='button' onClick={() => i18n.changeLanguage('cs')} disabled={i18n.language === 'cs'}>
						<Text text='Česky' />
					</Button>
					<Button type='button' onClick={() => i18n.changeLanguage('en')} disabled={i18n.language === 'en'}>
						<Text text='English' />
					</Button>
				</div>
				<a href='https://github.com/Gaspari/invoice-generator-v2' target='_blank' className='flex flex-align-center'>
					<div className='icon-svg'>
						<Octocat />
					</div>
					<Text className='margin-left-medium' text={'Gaspari/invoice-generator-v2'} />
				</a>
			</div>
		</footer>
	)

}