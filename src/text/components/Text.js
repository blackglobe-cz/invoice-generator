import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Text(props) {

	const {
		children,
		style,
		className,
		tag,
		t: toBeTranslated,
		tOptions,
		text,
		title,
	} = props

	const { t } = useTranslation()

	let content = children || text || t(toBeTranslated, tOptions)

	if (!content) return ''

	const Tag = tag || 'div'

	if (typeof content === 'string') {
		content = <Tag className={className} style={style} title={title} dangerouslySetInnerHTML={{ __html: content }} />
	} else {
		content = <Tag className={className} style={style} title={title}>{content}</Tag>
	}

	return content
}