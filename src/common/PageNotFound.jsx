import React from 'react'
import { useTranslation } from 'react-i18next'

import Text from 'text/components/Text'

export default function PageNotFound() {

	const { t, i18n } = useTranslation()
	
	return (
		<div className='wrapper box empty'>
			<Text tag='h2' t='error.page_not_found' />
		</div>
	)

}