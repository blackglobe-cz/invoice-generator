import React from 'react'

export default function Text(props) {
	const {
		// align,
		children,
		className,
		// color,
		tag,
		text,
		title,
		// type,
		// wrapper,
		// weight,
	} = props

	let content = children || text

	if (!content) return ''

	
	const Tag = tag || 'div'

	if (typeof content === 'string') {
		content = <Tag className={className} title={title} dangerouslySetInnerHTML={{ __html: content.trim() }} />
	} else {
		content = <Tag className={className} title={title}>{content}</Tag>
	}

	return content
}