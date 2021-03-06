import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';

require('./pubAdminPermissions.scss');

const propTypes = {
	appData: PropTypes.object,
	pubData: PropTypes.object,
	onSave: PropTypes.func,
	hideNone: PropTypes.bool,
};

const defaultProps = {
	appTitle: {},
	pubData: {},
	onSave: ()=>{},
	hideNone: false,
};

class PubAdminPermissions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			permissions: props.pubData.adminPermissions,
		};
		this.handlePermissionsChange = this.handlePermissionsChange.bind(this);
	}

	handlePermissionsChange(permissionsValue) {
		this.setState({ permissions: permissionsValue });
		this.props.onSave({
			adminPermissions: permissionsValue,
		});
	}

	render() {
		return (
			<div className={'pub-admin-permissions'}>
				{/*<div className={'content'}>*/}
					{/*<div className={'name'}>
						{this.props.appData.title} Team
					</div>*/}
				{/*</div>*/}
				{/*<div className={'remove-wrapper'}>*/}
					<div className={'dropdown'}>
						<PubCollabDropdownPermissions
							value={this.state.permissions}
							onChange={this.handlePermissionsChange}
							hideNone={this.props.hideNone}
							leftAligned={true}
						/>
					</div>
					<div className={'details'}>Permissions for the {this.props.appData.title} team.</div>
					
				{/*</div>*/}
			</div>
		);
	}
}

PubAdminPermissions.propTypes = propTypes;
PubAdminPermissions.defaultProps = defaultProps;
export default PubAdminPermissions;
