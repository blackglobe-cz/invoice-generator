export default function (date) {
	if (date === null || date === void 0) return ''

	if (typeof date === 'string') date = new Date(date)

	let res = `${date.getDate()}.\u00A0${date.getMonth() + 1}.\u00A0${date.getFullYear()}`

	return res
}