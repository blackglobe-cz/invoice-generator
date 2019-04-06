import React from 'react'
// import { useTranslation } from 'react-i18next'

import Text from 'text/components/Text'
import BlackGlobeLogo from 'images/BlackGlobeLogo'

export default function PrintPlaceholder() {

	// const { t, i18n } = useTranslation()

	return (
		<div className='print-placeholder'>
			<BlackGlobeLogo />
			<Text tag='h1' className='margin-bottom-large' text='Invoice generator 2.0' />
			<Text tag='h3' text='by Black Globe' />
		</div>
	)

}