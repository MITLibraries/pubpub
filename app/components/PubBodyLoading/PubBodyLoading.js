import React from 'react';
import PropTypes from 'prop-types';

require('./pubBodyLoading.scss');

const propTypes = {
	content: PropTypes.node.isRequired,
};

const PubBodyLoading = function(props) {
	return (
		<div className={'pub-body-loading'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={'col-12 pt-skeleton'}>
						{props.content}
					</div>
				</div>
			</div>
		</div>
	);
};

PubBodyLoading.propTypes = propTypes;
export default PubBodyLoading;
