import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubBody from 'components/PubBody/PubBody';
import Footer from 'components/Footer/Footer';

import { getPubData } from 'actions/pub';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

const loadingData = {
	pub: {
		title: 'Soundscapes',
		slug: 'my-article',
		description: 'A virtual representation of the space of an event and provide tools by which a producer can draw upon images, graphics, data, and live cameras to create a video stream equivalent to a broadcast',
		numDiscussions: '3',
		numCollaborators: '6',
		numSuggestions: '11',
		collections: [
			{
				id: 0,
				title: 'Submissions',
				slug: 'submissions',
			},
			{
				id: 1,
				title: 'Meeting Notes',
				slug: 'meeting-notes',
				isPrivate: true,
			},
			{
				id: 2,
				title: 'Senors',
				slug: 'sensors',
			},
		],
	},
	collaborators: [
		{
			id: 0,
			slug: 'trich',
			userInitials: 'TR',
			fullName: 'Travis Rich',
			isAuthor: true,
			color: 'red',
		}
	],
	versions: [
		{
			id: 0,
			date: new Date() - 1000000000,
			active: true,
		},
		{
			id: 1,
			date: new Date() - 2000000000,
		},
		{
			id: 3,
			date: new Date() - 5000000000,
		},
		{
			id: 2,
			date: new Date() - 3000000000,
		},
	],
	body: (
		<div className={'article-content'}>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duo Reges: constructio interrete. Eam stabilem appellas. Consequens enim est et post oritur, ut dixi. Te enim iudicem aequum puto, modo quae dicat ille bene noris. Compensabatur, inquit, cum summis doloribus laetitia. <b>Hoc simile tandem est?</b> </p>
		</div>
	)
};

class PubPresentation extends Component {
	componentWillMount() {
		this.props.dispatch(getPubData(this.props.match.params.slug));
	}

	render() {
		if (!this.props.pubData.data) {
			return (
				<div className={'pub-presentation'}>

					<Helmet>
						<title>Pub</title>
					</Helmet>

					<PubPresHeaderLoading
						title={'Soundscapes'}
						description={loadingData.pub.description}
						backgroundImage={'/dev/pubHeader4.jpg'}
					/>

					<PubPresDetailsLoading
						collaborators={loadingData.collaborators}
						pubData={loadingData.pub}
						versions={loadingData.versions}
					/>

					<PubBodyLoading content={loadingData.body} />

					<div className={'license-wrapper'}>
						CCBY 4.0
					</div>

					<Footer />
				</div>
			);
		}

		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>Pub</title>
				</Helmet>

				<PubPresHeader
					title={'Soundscapes'}
					description={this.props.pubData.data.pub.description}
					backgroundImage={'/dev/pubHeader4.jpg'}
				/>

				<PubPresDetails
					collaborators={this.props.pubData.data.collaborators}
					pubData={this.props.pubData.data.pub}
					versions={this.props.pubData.data.versions}
				/>

				<PubBody content={this.props.pubData.data.body} />

				<div className={'license-wrapper'}>
					CCBY 4.0
				</div>

				<Footer />
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({
	pubData: state.pub
}))(PubPresentation));
