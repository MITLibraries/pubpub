import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
import PubModalHistoryRow from './PubModalHistoryRow';
// import PubModalHistoryDiff from './PubModalHistoryDiff';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistory = React.createClass({
	propTypes: {
		historyData: PropTypes.array,
		activeDiff: PropTypes.string,

		setQueryHandler: PropTypes.func,
		goBackHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			historyData: [],
			activeDiff: undefined,
		};
	},

	// getInitialState() {
	// 	return {
	// 		activeChangesViewer: undefined,
	// 	};
	// },

	showChangesViewer: function(index) {
		
		return ()=>{
			this.props.setQueryHandler({
				mode: 'history',
				diff: index,
			});	
		};
		
		// return ()=>{
		// 	// this.setState({
		// 	// 	activeChangesViewer: this.props.historyData[index].diffObject
		// 	// });	
		// 	// document.getElementById('modal-container').scrollTop = 0;
		// 	this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {mode: 'history', diff: index}));
		// };
	},

	// hideChangesViewer: function() {
		// this.setState({activeChangesViewer: undefined});
		// document.getElementById('modal-container').scrollTop = 0;
		// this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {mode: activeModal}));
		// goBackHandler()
	// },

	render: function() {
		// const activeDiffObject = this.props.historyData[this.props.activeDiff] ? this.props.historyData[this.props.activeDiff].diffObject : undefined;

		return (
			<div style={[baseStyles.pubModalContainer, styles.container]}>

				{/* <div style={[styles.shown, activeDiffObject !== undefined && styles.hidden]}> */}
				<div>
					<div style={baseStyles.pubModalTitle}>History</div>

					{()=>{
						const historyDivs = [];

						for (let index = this.props.historyData.length; index-- > 0; ) {
							historyDivs.push( 
								<PubModalHistoryRow key={'historyRow-' + index} historyItem={this.props.historyData[index]} index={index} setDiffViewer={this.showChangesViewer}/>
							);
						}

						return historyDivs;
					}()}
				</div>

				{/* 
					<div style={[styles.hidden, activeDiffObject !== undefined && styles.shown]}>
						<PubModalHistoryDiff diffObject={activeDiffObject} goBackHandler={this.props.goBackHandler}/>
					</div>
				*/}
				

			</div>
		);
	}
});

export default Radium(PubModalHistory);

styles = {
	container: {
		overflow: 'hidden',
	},

	hidden: {
		display: 'none',
		transform: 'translateX(105%)',
		transition: '.1s linear transform',
	},

	shown: {
		display: 'block',
		position: 'absolute',
		top: 0,
		left: 0,
		width: 'calc(100% - 30px)',
		height: 'calc(100% - 30px)',
		padding: 15,
		overflowY: 'scroll',
		transform: 'translateX(0%)',
		transition: '.1s linear transform',

		backgroundColor: 'rgba(200,0,0,0.8)',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: '100%',
			position: 'fixed',
			top: '0px',
			left: '0px',
			// paddingLeft: '15px',
			height: '100vh',
			overflow: 'hidden',
			overflowY: 'scroll',
		}
	},
};