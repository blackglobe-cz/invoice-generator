import React from 'react'

export default function BlackGlobeLogo(props) {
	return (
		<svg className={'bg-logo' + (props.className ? ' ' + props.className : '')} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
			<g fillRule='evenodd' clipRule='evenodd'>
				<path d='M206.1,138.8c-0.9-15.9-6.6-30.5-15.6-42.5l-64.9,64.4L206.1,138.8z' />
				<path d='M109.9,164.9l75.4-74.8C171,74.7,150.5,65,127.8,65c-43.4,0-78.5,35.1-78.5,78.5c0,12.8,3.1,24.9,8.5,35.6L109.9,164.9z' />
				<path d='M114.1,172.1l-34,33.7C93.3,216,109.8,222,127.8,222c42.2,0,76.5-33.2,78.4-74.9L114.1,172.1z' />
				<path d='M62,186.2c3.4,5.3,7.4,10.1,12,14.4l24.5-24.3L62,186.2z' />
			</g>
			<circle cx='224.7' cy='57.6' r='23.6' />
			<circle cx='21.5' cy='192.1' r='13.8' />
		</svg>
	)
}