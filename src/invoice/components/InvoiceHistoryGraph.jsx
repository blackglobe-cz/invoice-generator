import React from 'react'

import {
	ResponsiveContainer,
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

import { COLORS } from 'consts'
import formatCurrency from 'currency/helpers/formatter'

export default function InvoiceHistoryGraph({ data, dataKeys }) {
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
				<YAxis tickFormatter={val => formatCurrency(val, null, { skipCurrency: true, decimals: 0 })} />
				<Tooltip
					formatter={(val, name, props) =>
						formatCurrency(val, null, { skipCurrency: true })
						+ (props.payload[`${name}VAT`] ? ` (${formatCurrency(props.payload[`${name}VAT`], null, { skipCurrency: true })})` : '')
					}
				/>
				{dataKeys.length > 1 && <Legend />}
				{dataKeys.map((key, index) => (
					<Line key={key} type='monotone' dataKey={key} stroke={COLORS[index % COLORS.length]} />
				))}
			</LineChart>
		</ResponsiveContainer>
	)
}