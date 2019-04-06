import React from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material/react-checkbox'

export default function FormControl(props) {

	const { t } = useTranslation()

	const {
		type = 'input',
		value,
		name,
		prop,
		placeholder,
		onChange,
		opts,
		optSrc,
		...otherProps
	} = props

	if (type === 'select') {
		return (
			<select
				value={value}
				name={name}
				onChange={e => {
					onChange(prop || name, (optSrc || opts)[parseInt(e.target.value)], e)
				}}
				{...otherProps}
			>
				{opts.map((opt, index) => {
					// const val = typeof opt !== 'string' && opt.length >= 1 ? opt[0] : opt
					const label = typeof opt !== 'string' && opt.length > 1 ? opt[1] : opt
					return (
						<option key={index} value={index}>{label}</option>
					)
				})}
			</select>
		)
	}
	if (type === 'textarea') {
		return (
			<textarea
				value={value}
				name={name}
				onChange={e => onChange(prop || name, e.target.value, e)}
				placeholder={placeholder || t(name)}
				{...otherProps}
			/>
		)
	}

	if (type === 'checkbox') {
		return (
			<Checkbox
				checked={!!value}
				name={name}
				onChange={e => onChange(prop || name, type === 'checkbox' ? e.target.checked : e.target.value, e)}
				{...otherProps}
			/>
		)
	}

	return (
		<input
			value={value}
			type={type === 'input' ? 'text' : type}
			checked={type === 'checkbox' ? !!value : null}
			name={name}
			onChange={e => onChange(prop || name, type === 'checkbox' ? e.target.checked : e.target.value, e)}
			placeholder={placeholder || t(name)}
			{...otherProps}
		/>
	)

}