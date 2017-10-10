import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';

require('./pubCollabCollaborators.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	canAdmin: PropTypes.bool,
	onOpenShare: PropTypes.func,
	onCollaboratorAdd: PropTypes.func,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	// isLoading: PropTypes.bool,
};

const defaultProps = {
	canAdmin: false,
	onOpenShare: ()=>{},
	onCollaboratorAdd: ()=>{},
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	// isLoading: false,
};

class PubCollabCollaborators extends Component {
	constructor(props) {
		super(props);
		this.handleUserSelect = this.handleUserSelect.bind(this);
	}

	handleUserSelect(user) {
		const calculateOrder = 0.75;
		this.props.onCollaboratorAdd({
			userId: user.id,
			name: user.name,
			order: calculateOrder,
			pubId: this.props.pubData.id,
		});
	}

	render() {
		return (
			<div className={'pub-collab-collaborators'}>
				<h5>Pub Collaborators</h5>
				{this.props.canAdmin &&
					<div>
						<div className={'intro'}>Use this panel to manage who is recognized and listed for working on this pub. To manage permissions and access to the pub, open the <span tabIndex={-1} role={'button'} onClick={this.props.onOpenShare}>Share Panel</span>.</div>
						<UserAutocomplete onSelect={this.handleUserSelect} allowCustomUser={true} />
					</div>
				}
				<div className={'collaborators-wrapper'}>
					{this.props.pubData.contributors.sort((foo, bar)=> {
						if (foo.Contributor.order < bar.Contributor.order) { return 1; }
						if (foo.Contributor.order > bar.Contributor.order) { return -1; }
						if (foo.id < bar.id) { return 1; }
						if (foo.id > bar.id) { return -1; }
						return 0;
					}).map((item)=> {
						return (
							<PubCollaboratorDetails
								key={`details-${item.id}`}
								pubId={this.props.pubData.id}
								collaboratorData={item}
								canAdmin={this.props.canAdmin}
								onCollaboratorUpdate={this.props.onCollaboratorUpdate}
								onCollaboratorDelete={this.props.onCollaboratorDelete}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}

PubCollabCollaborators.propTypes = propTypes;
PubCollabCollaborators.defaultProps = defaultProps;
export default PubCollabCollaborators;
