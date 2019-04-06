export default {
	log: function() {
		const args = Array.from(arguments)

		// eslint-disable-next-line
		console.info(...args)
	},
}