import React from 'react'
import { useTranslation } from 'react-i18next'

import {
	ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

import { COLORS } from 'consts'
import formatDate from 'date/helpers/formatter'

export default function InvoiceHistoryGraph(props) {

	const {
		invoices,
	} = props

	const { t } = useTranslation()

	const data = []
	const dataKeys = []
	let date = new Date()
	const thisMonth = date.getMonth()
	const thisYear = date.getFullYear()
	date.setDate(15)

	// prepare X axis
	for (var i = 12;i--;) {
		data.unshift({ name: t(`date.month.${date.getMonth() + 1}`) })
		date = new Date(date.getFullYear(), date.getMonth() - 1, 15)
	}

	// prepare data
	invoices.forEach(item => {
		const dataKey = (item.supplier_ref && item.supplier_ref.id) ? (item.supplier_ref.label || item.supplier_ref.id) : 'undefined'
		if (dataKeys.indexOf(dataKey) === -1) dataKeys.push(dataKey)
		const dataYear = parseInt(item.issue_date.slice(0, 4), 10)
		const dataMonth = parseInt(item.issue_date.slice(5, 7), 10) - 1

		// throw away invoices older than a year
		if (dataYear < thisYear && dataMonth < thisMonth) return

		const dataIndex = 11 - ((thisYear - dataYear) * 12) - Math.abs(thisMonth - dataMonth)
		data[dataIndex][dataKey] = data[dataIndex][dataKey] || 0
		data[dataIndex][dataKey] += item.total_price
	})

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