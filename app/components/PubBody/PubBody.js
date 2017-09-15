import React from 'react';
import PropTypes from 'prop-types';

require('./pubBody.scss');

const propTypes = {
	content: PropTypes.node.isRequired,
	isLoading: PropTypes.boolean,
};

const defaultProps = {
	isLoading: undefined,
};

const PubBody = function(props) {
	return (
		<div className={'pub-body'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={`col-12 ${props.isLoading ? 'pt-skeleton' : ''}`}>
						{props.content}
					</div>
				</div>
			</div>
		</div>
	);
};

PubBody.defaultProps = defaultProps;
PubBody.propTypes = propTypes;
export default PubBody;
