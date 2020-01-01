import React, { useState } from 'react'
import Modal from 'react-modal'

import Button from '@material/react-button'
import IconButton from '@material/react-icon-button'
import MaterialIcon from '@material/react-material-icon'

import Text from 'text/components/Text'
import FormControl from 'form/components/FormControl'
import { CNB_PROXY_URL, CNB_RATE_STORAGE_KEY_BASE, STYLE_MODAL_DEF } from 'consts'
import formatCurrency from 'currency/helpers/formatter'
import { supportedCNBCurrencies } from 'currency/helpers/list'

export default function CurrencyRatesModal () {

	const [modalIsOpen, setModalOpen] = useState(false)
	const [loadingRate, setLoadingRate] = useState(false)
	const [formData, setFormData] = useState({
		amount: 1,
		currency: 'EUR',
		date: new Date().toISOString().slice(0, 10),
		vat: 21,
	})
	const [data, setData] = useState({})
	const [CNBCache, setCNBCache] = useState({})

	return (
		<>
			<Button dense icon={<i className='material-icons'>monetization_on</i>} type='button' onClick={() => setModalOpen(true)}>
				<Text t='currency.exchange_rates' />
			</Button>

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={() => setModalOpen()}
				style={STYLE_MODAL_DEF}
			>
				<div className='modal-wrapper'>
					<div className='block flex flex-space-between flex-align-center'>
						<div className='flex-1'>
							<Text tag='h1' t='currency.exchange_rates' />
							<Text t='currency.exchange_rates_info' />
						</div>
						<div>
							<IconButton type='button' onClick={() => setModalOpen()}>
								<MaterialIcon icon='close' />
							</IconButton>
						</div>
					</div>
					<div>

						<form onSubmit={e => handleFormSubmit(e, formData)}>
							<div className='block'>
								<label>
									<Text t='date.to_date' />
									<FormControl value={formData.date} type='date' name='date' onChange={handleInput} />
								</label>
							</div>
							<div className='block'>
								<div className='grid grid-medium' style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
									<label>
										<Text t='currency.exchange_currency_source' />
										<FormControl value={'CZK'} type='select' disabled opts={['CZK']} name='src_currency' />
									</label>
									<label>
										<Text t='currency.exchange_currency_target' />
										<FormControl value={supportedCNBCurrencies.indexOf(formData.currency)} type='select' opts={supportedCNBCurrencies} name='currency' onChange={handleInput} />
									</label>
								</div>
							</div>
							<div className='block'>
								<div className='grid grid-medium' style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
									<label>
										<Text t='currency.exchange_amount' />
										<FormControl value={formData.amount} type='number' name='amount' onChange={handleInput} />
									</label>
									<label>
										<Text t='tax.vat_percent' />
										<FormControl value={formData.vat} type='number' name='vat' onChange={handleInput} />
									</label>
								</div>
							</div>

							{/*
								TODO: add that loading
								*/}
							<Button raised type='submit'>
								<Text t='currency.exchange_submit' />
							</Button>

						</form>

						{data.value && (
							<>
								<div>
									<Text tag='span' t='currency.exchange_date' />
									&ensp;
									<Text tag='span' className='heading-2' text={data.resDate} />
								</div>
								<div>
									<Text tag='span' t='currency.exchange_rate' />
									&ensp;
									<Text className='heading-5' tag='span' text={data.currency + '&nbsp;'} />
									<Text className='heading-2' tag='span' text='1&nbsp;=&nbsp;' />
									<Text className='heading-5' tag='span' text='CZK&nbsp;' />
									<Text className='heading-2' tag='span' text={data.ratio} />
								</div>
								<hr className='margin-vertical-small' />
								<div className='grid' style={{ gridTemplateColumns: 'auto 1fr', alignItems: 'baseline', gridColumnGap: '.625rem' }}>
									<Text tag='span' t='currency.exchange_amount' />
									<Text className='heading-2 text-emphasize' tag='span' text={data.value} />
									<Text tag='span' t='tax.vat_amount' />
									<Text tag='span' className='heading-2 text-emphasize' text={formatCurrency(data.vat, 'CZK')} />
								</div>
								<hr className='margin-vertical-small' />
								<div>
									<Text tag='span' t='currency.exchange_rate_total' />
									&ensp;
									<Text tag='span' className='heading-1 text-emphasize' text={formatCurrency(data.vat + data.pureValue, 'CZK')} />
								</div>
							</>
						)}
					</div>
				</div>
			</Modal>
		</>
	)

	function handleInput(prop, value) {
		setFormData({ ...formData, [prop]: value })
	}

	function handleFormSubmit(e, data) {
		e.preventDefault()
		calculateExchangeRate(data.date, supportedCNBCurrencies[data.currency], data.amount)
	}

	function formatCNBDate(date) {
		return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`
	}

	function calculateExchangeRate(date, currency = 'EUR', amount = 1) {
		console.log('c', date, currency, amount)
		setLoadingRate(true)
		fetchCNBRates(date).then(res => {
			const currLines = res.split('\n')
			const resDate = currLines[0].split(' ')[0]
			const searchedLine = currLines.slice(1).find(l => l.includes(currency))
			if (searchedLine) {
				const searchedLineArr = searchedLine.split('|')
				const ratio = parseFloat(searchedLineArr[searchedLineArr.length - 1].replace(',', '.'), 10)
				const v = ratio * amount
				setData({
					...data,
					currency,
					pureValue: v,
					ratio,
					resDate,
					value: formatCurrency(v, 'CZK'),
					vat: v * formData.vat * .01,
				})
			}
		}).finally(() => {
			setLoadingRate(false)
		})
	}

	function fetchCNBRates(date) {
		return new Promise((resolve, reject) => {
			const CNBDate = formatCNBDate(date)
			const key = `${CNB_RATE_STORAGE_KEY_BASE}-${CNBDate}`

			const storedCNBRate = window.localStorage.getItem(key)
			if (storedCNBRate) return resolve(storedCNBRate)

			fetch(`${CNB_PROXY_URL}?date=${CNBDate}`)
				.then(resRaw => {
					resRaw.json().then(({ body: res }) => {
						window.localStorage.setItem(key, res)
						return resolve(res)
					})
				})
				.catch(reject)
		})
	}

}