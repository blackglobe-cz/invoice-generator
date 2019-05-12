import React from 'react'
// import { useTranslation } from 'react-i18next'

import {
	ResponsiveContainer,
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

import { COLORS } from 'consts'
// import formatDate from 'date/helpers/formatter'

export default function InvoiceHistoryGraph(props) {

	const {
		data,
		dataKeys,
		date: dateProp,
	} = props

	// const { t } = useTranslation()

	// const date = (dateProp && typeof dateProp.getTime === 'function') ? new Date(dateProp.getTime()) : (new Date())
	// const thisMonth = date.getMonth()
	// const thisYear = date.getFullYear()
	// date.setDate(15)
	//
	// // prepare X axis
	// for (var i = 12;i--;) {
	// 	data.unshift({ name: t(`date.month.${date.getMonth() + 1}`) })
	// 	date = new Date(date.getFullYear(), date.getMonth() - 1, 15)
	// }

	return (
		<ResponsiveContainer
			height={200}
		>
			<LineChart
				data={data}
				margin={{
					top: 10, right: 30, left: 20, bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				{dataKeys.length > 1 && <Legend />}
				{dataKeys.map((key, index) => (
					<Line key={key} type='monotone' dataKey={key} stroke={COLORS[index % COLORS.length]} />
				))}
			</LineChart>
		</ResponsiveContainer>
	)
}