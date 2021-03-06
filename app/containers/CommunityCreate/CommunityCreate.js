import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import { postCommunity } from 'actions/communityCreate';

require('./communityCreate.scss');

const propTypes = {
	communityCreateData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class CommunityCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subdomain: '',
			title: '',
			description: '',
			largeHeaderLogo: '',
			accentColor: '#2D2E2F',
		};
		this.onCreateSubmit = this.onCreateSubmit.bind(this);
		this.onSubdomainChange = this.onSubdomainChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onDescriptionChange = this.onDescriptionChange.bind(this);
		this.onLargeHeaderLogoChange = this.onLargeHeaderLogoChange.bind(this);
		this.onAccentColorChange = this.onAccentColorChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const prevData = this.props.communityCreateData.data;
		const nextData = nextProps.communityCreateData.data;
		if (!prevData && nextData) {
			window.location.href = nextData;
		}
	}

	onCreateSubmit(evt) {
		evt.preventDefault();
		this.props.dispatch(postCommunity({
			subdomain: this.state.subdomain,
			title: this.state.title,
			description: this.state.description,
			smallHeaderLogo: this.state.largeHeaderLogo,
			largeHeaderLogo: this.state.largeHeaderLogo,
			accentColor: this.state.accentColor,
		}));
	}

	onSubdomainChange(evt) {
		this.setState({ subdomain: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase() });
	}
	onTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}
	onDescriptionChange(evt) {
		this.setState({ description: evt.target.value.substring(0, 280).replace(/\n/g, ' ') });
	}
	onLargeHeaderLogoChange(val) {
		this.setState({ largeHeaderLogo: val });
	}
	onAccentColorChange(evt) {
		this.setState({ accentColor: evt.target.value });
	}

	render() {
		const colorRegex = /^#([a-f]|[A-F]|[0-9]){6}$/;
		return (
			<div className={'community-create'}>
				<Helmet>
					<title>Community Create</title>
				</Helmet>

				{!this.props.loginData.data &&
					<NonIdealState
						title={'Must be Logged In to Create'}
						visual={'error'}
						action={<Link to={'/login'} className={'pt-button'}>Login</Link>}
					/>
				}

				{this.props.loginData.data &&
					<div className={'container small'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<h1>Create Community</h1>
								<form onSubmit={this.onCreateSubmit}>
									<InputField
										label={'URL'}
										isRequired={true}
										value={this.state.subdomain}
										onChange={this.onSubdomainChange}
										helperText={`https://${this.state.subdomain || '[URL]'}.pubpub.org`}
									/>
									<InputField
										label={'Title'}
										isRequired={true}
										value={this.state.title}
										onChange={this.onTitleChange}
									/>
									<InputField
										label={'Description'}
										isTextarea={true}
										value={this.state.description}
										onChange={this.onDescriptionChange}
										helperText={`${this.state.description.length}/280 characters`}
									/>
									<ImageUpload
										htmlFor={'large-header-logo-upload'}
										label={'Community Logo'}
										isRequired={true}
										defaultImage={this.state.largeHeaderLogo}
										height={60}
										width={150}
										onNewImage={this.onLargeHeaderLogoChange}
										helperText={'Used on the landing page. Suggested height: 200px'}
									/>
									<InputField
										label={'Accent Color'}
										isRequired={true}
										value={this.state.accentColor}
										onChange={this.onAccentColorChange}
										error={!colorRegex.test(this.state.accentColor) ? 'Must be of form #123456' : ''}
										helperText={<div className={'color-swatch'} style={{ backgroundColor: this.state.accentColor }} />}
									/>
									<InputField error={this.props.communityCreateData.error}>
										<Button
											name={'create'}
											type={'submit'}
											className={'pt-button pt-intent-primary create-account-button'}
											onClick={this.onCreateSubmit}
											text={'Create Community'}
											disabled={!this.state.subdomain || !this.state.title || !this.state.largeHeaderLogo || !colorRegex.test(this.state.accentColor)}
											loading={this.props.communityCreateData.isLoading || this.props.communityCreateData.data}
										/>
									</InputField>
								</form>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}

CommunityCreate.propTypes = propTypes;
export default withRouter(connect(state => ({
	communityCreateData: state.communityCreate,
	loginData: state.login,
}))(CommunityCreate));
