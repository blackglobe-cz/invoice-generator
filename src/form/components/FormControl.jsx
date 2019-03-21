import React from 'react'
import { withNamespaces } from 'react-i18next'

import TextField, { HelperText, Input } from '@material/react-text-field'
import Select from '@material/react-select'
import Checkbox from '@material/react-checkbox'

class FormControl extends React.Component {
	render() {

		const {
			t,
			tReady,
			lng,
			i18n,
			i18nOptions,
			defaultNS,
			reportNS,

			type = 'input',
			value,
			name,
			prop,
			placeholder,
			onChange,
			opts,
			optSrc,
			...otherProps,
		} = this.props

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
						const val = typeof opt !== 'string' && opt.length >= 1 ? opt[0] : opt
						const label = typeof opt !== 'string' && opt.length > 1 ? opt[1] : opt
						// <option key={index} value={index}>{label}</option>
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
				></textarea>
			)
			// return (
			// 	<TextField
	    //     // label='Dogo'
	    //     // helperText={<HelperText>Help Me!</HelperText>}
	    //     // onTrailingIconSelect={() => this.setState({value: ''})}
	    //     // trailingIcon={<MaterialIcon role="button" icon="delete"/>}
			// 		dense
			// 		fullWidth
			// 		textarea
	    //   >
			// 		<Input
			// 			type={type === 'input' ? 'text' : type}
	    //       value={value}
	    //       onChange={e => onChange(prop || name, type === 'checkbox' ? e.target.checked : e.target.value, e)}
			// 		/>
			// 	</TextField>
			// )
		}

		if (type === 'checkbox') {
			return (
				<Checkbox
          checked={!!value}
					name={name}
          // indeterminate={this.state.indeterminate}
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

		// return (
		// 	<TextField
    //     // label='Dogo'
    //     // helperText={<HelperText>Help Me!</HelperText>}
    //     // onTrailingIconSelect={() => this.setState({value: ''})}
    //     // trailingIcon={<MaterialIcon role="button" icon="delete"/>}
		// 		dense
		// 		fullWidth
    //   >
		// 		<Input
		// 			type={type === 'input' ? 'text' : type}
    //       value={value}
    //       onChange={e => onChange(prop || name, type === 'checkbox' ? e.target.checked : e.target.value, e)}
		// 		/>
		// 	</TextField>
		// )
	}
}
export default withNamespaces()(FormControl)