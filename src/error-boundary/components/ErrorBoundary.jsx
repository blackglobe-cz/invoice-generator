import React from 'react';

import { withTranslation } from 'react-i18next'

import logger from 'logger'
import Text from 'text/components/Text'

@withTranslation()
export default class ErrorBoundary extends React.Component {

	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { error: error.stack, hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		logger.log('boundary catch', error, errorInfo);
		this.setState({ ...this.state, error, errorInfo })
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='error-boundary'>
					<Text className='heading-3 block' t='error.generic' />
					<div className='block'>
						<textarea rows='5' readOnly value={this.state.error} />
					</div>
					<div className='block'>
						<textarea rows='5' readOnly value={this.state.errorInfo} />
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}