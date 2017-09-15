import React from 'react';
import PropTypes from 'prop-types';

require('./pubPresHeaderLoading.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	backgroundImage: PropTypes.string,
};

const defaultProps = {
	description: undefined,
	backgroundImage: undefined,
};

const PubPresHeaderLoading = function(props) {
	const backgroundStyle = {};
	if (props.backgroundImage) {
		backgroundStyle.backgroundImage = `url("${props.backgroundImage}")`;
		backgroundStyle.color = 'white';
	}

	return (
		<div className={'pub-pres-header-loading'} style={backgroundStyle}>
			<div className={`wrapper ${props.backgroundImage ? 'dim' : ''}`}>
				<div className={'container pub'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1 className={'pt-skeleton'}>{props.title}</h1>
							{props.description &&
								<div className={'description pt-skeleton'}>{props.description}</div>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubPresHeaderLoading.defaultProps = defaultProps;
PubPresHeaderLoading.propTypes = propTypes;
export default PubPresHeaderLoading;
