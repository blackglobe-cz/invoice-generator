import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Text(props) {

	const {
		children,
		className,
		style,
		suffix = '',
		tag: Tag = 'div',
		t: toBeTranslated,
		tOptions,
		text,
		title,
	} = props

	const { t } = useTranslation()

	let content = children || text || t(toBeTranslated, tOptions)

	if (!content) return ''

	if (typeof content === 'string') {
		content = <Tag className={className} style={style} title={title} dangerouslySetInnerHTML={{ __html: `${content}${suffix}` }} />
	} else {
		content = <Tag className={className} style={style} title={title}>{content}{suffix}</Tag>
	}

	return content
}