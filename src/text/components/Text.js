import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Text(props) {

	const {
		children,
		className,
		tag,
		t: toBeTranslated,
		text,
		title,
	} = props

	const { t, i18n } = useTranslation()

	let content = children || text || t(toBeTranslated)

	if (!content) return ''

	const Tag = tag || 'div'

	if (typeof content === 'string') {
		content = <Tag className={className} title={title} dangerouslySetInnerHTML={{ __html: content.trim() }} />
	} else {
		content = <Tag className={className} title={title}>{content}</Tag>
	}

	return content
}