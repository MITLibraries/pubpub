import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Button, NonIdealState } from '@blueprintjs/core';
import Footer from 'components/Footer/Footer';
import LayoutPubs from 'components/LayoutPubs/LayoutPubs';
import LayoutHtml from 'components/LayoutHtml/LayoutHtml';
import LayoutDrafts from 'components/LayoutDrafts/LayoutDrafts';
import LayoutText from 'components/LayoutText/LayoutText';
import NoMatch from 'containers/NoMatch/NoMatch';
import { getCollectionData } from 'actions/collection';
import { createPub } from 'actions/pubCreate';
import { getDefaultLayout } from 'utilities';

require('./collection.scss');

const propTypes = {
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubCreateData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Collection extends Component {
	constructor(props) {
		super(props);
		this.handleCreatePub = this.handleCreatePub.bind(this);
		this.getComponentFromType = this.getComponentFromType.bind(this);
		this.generateRenderList = this.generateRenderList.bind(this);
	}
	componentWillMount() {
		this.dispatchGetCollectionData(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.slug !== this.props.match.params.slug) {
			this.dispatchGetCollectionData(nextProps);
		}
		if (!this.props.pubCreateData.data && nextProps.pubCreateData.data) {
			this.props.history.push(`/pub/${nextProps.pubCreateData.data.newPubSlug}/collaborate`);
		}
	}

	dispatchGetCollectionData(props) {
		// Currently, this has to wait until appData has been fetched and loaded before
		// even sending off the request. If we find this is slow, we can try sending
		// the slug (available from url immediately) to the API, and use the origin
		// to do a Community query to identify which communityId we need to restrict
		// by. This is all because collection slugs are not unique.
		if (props.appData.data) {
			const collectionId = props.appData.data.collections.reduce((prev, curr)=> {
				if (curr.slug === '' && props.match.params.slug === undefined) { return curr.id; }
				if (curr.slug === props.match.params.slug) { return curr.id; }
				return prev;
			}, undefined);
			if (collectionId) {
				const communityId = props.appData.data.id;
				this.props.dispatch(getCollectionData(collectionId, communityId));
			}
		}
	}

	handleCreatePub() {
		const communityId = this.props.appData.data.id;
		const collectionId = this.props.collectionData.data.id;
		this.props.dispatch(createPub(collectionId, communityId));
	}
	getComponentFromType(item, index, pubRenderLists) {
		const collectionData = this.props.collectionData.data || {};
		const pubs = collectionData.pubs || [];

		if (item.type === 'pubs') {
			return (
				<LayoutPubs
					key={`item-${item.id}`}
					layoutIndex={index}
					content={item.content}
					pubRenderList={pubRenderLists[index]}
					isLoading={!collectionData.id}
				/>
			);
		}
		if (item.type === 'text') {
			return (
				<LayoutText
					key={`item-${item.id}`}
					content={item.content}
				/>
			);
		}
		if (item.type === 'html') {
			return (
				<LayoutHtml
					key={`item-${item.id}`}
					content={item.content}
				/>
			);
		}
		if (item.type === 'drafts') {
			return (
				<LayoutDrafts
					key={`item-${item.id}`}
					content={item.content}
					pubs={pubs.filter((pub)=> {
						return !pub.firstPublishedAt;
					})}
				/>
			);
		}
		return null;
	}
	generateRenderList(layout) {
		const collectionData = this.props.collectionData.data || {};
		const pubs = collectionData.pubs || [];
		const allPubs = pubs.filter((item)=> {
			return item.firstPublishedAt;
		}).sort((foo, bar)=> {
			if (foo.firstPublishedAt < bar.firstPublishedAt) { return 1; }
			if (foo.firstPublishedAt > bar.firstPublishedAt) { return -1; }
			return 0;
		});
		const nonSpecifiedPubs = [...allPubs];
		const pubRenderLists = {};
		layout.forEach((block)=> {
			if (block.type === 'pubs') {
				const specifiedPubs = block.content.pubIds;
				nonSpecifiedPubs.forEach((pub, index)=> {
					if (specifiedPubs.indexOf(pub.id) > -1) {
						nonSpecifiedPubs.splice(index, 1);
					}
				});
			}
		});
		layout.forEach((block, index)=> {
			if (block.type === 'pubs') {
				const pubsById = pubs.reduce((prev, curr)=> {
					const output = prev;
					output[curr.id] = curr;
					return output;
				}, {});
				const renderList = block.content.pubIds.map((id)=> {
					return pubsById[id];
				});
				const limit = block.content.limit || (nonSpecifiedPubs.length + renderList.length);
				for (let pubIndex = renderList.length; pubIndex < limit; pubIndex++) {
					if (nonSpecifiedPubs.length) {
						renderList.push(nonSpecifiedPubs[0]);
						nonSpecifiedPubs.splice(0, 1);
					}
				}
				pubRenderLists[index] = renderList;
			}
		});
		return pubRenderLists;
	}

	render() {
		const collectionData = this.props.collectionData.data || { pubs: [] };
		const title = this.props.appData.data.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && this.props.match.params.slug === undefined) { return curr.title; }
			if (curr.slug === this.props.match.params.slug) { return curr.title; }
			return prev;
		}, undefined);
		if (!title) { return <NoMatch />; }
		const numPublished = collectionData.pubs.reduce((prev, curr)=> {
			if (curr.firstPublishedAt) { return prev + 1; }
			return prev;
		}, 0);
		const publicDrafts = collectionData.pubs.filter((item)=> {
			return !item.firstPublishedAt;
		}).sort((foo, bar)=> {
			if (foo.updatedAt > bar.updatedAt) { return -1; }
			if (foo.updatedAt < bar.updatedAt) { return 1; }
			return 0;
		});
		const layout = collectionData.layout || getDefaultLayout(collectionData.isPage);
		const pubRenderLists = this.generateRenderList(layout);
		return (
			<div>
				<div className={'collection'}>
					<Helmet>
						{title !== 'Home' &&
							<title>{title}</title>
						}
						<meta name={'description'} content={collectionData.description} />
					</Helmet>

					<div className={'container'}>
						{((!collectionData.isPage && collectionData.isOpenSubmissions) || (title && title !== 'Home')) &&
							<div className={'row'}>
								<div className={'col-12'}>
									{!collectionData.isPage && collectionData.isOpenSubmissions &&
										<div className={'create-pub-wrapper'}>
											<Button
												type={'button'}
												className={'pt-button pt-intent-primary'}
												loading={this.props.pubCreateData.isLoading}
												onClick={this.handleCreatePub}
												text={'Create Pub in Collection'}
											/>
											{collectionData.createPubMessage &&
												<Link to={`/${collectionData.slug}/submit`} className={'instructions-link'}>
													Submission Instructions
												</Link>
											}
										</div>
									}
									{title && title !== 'Home' &&
										<h1>{title}</h1>
									}
								</div>
							</div>
						}

						{layout.filter((item)=> {
							if (collectionData.id && !numPublished && item.type === 'pubs') {
								return false;
							}
							return true;
						}).map((item, index)=> {
							const editorTypeComponent = this.getComponentFromType(item, index, pubRenderLists);
							if (!editorTypeComponent) { return null; }
							return <div key={`block-${item.id}`} className={'component-wrapper'}>{editorTypeComponent}</div>;
						})}

						{!publicDrafts.length && !!collectionData.id && !numPublished && !collectionData.isPage &&
							<NonIdealState
								title={'Empty Collection'}
								description={'This collection has no Pubs.'}
								visual={'pt-icon-applications'}
							/>
						}
					</div>
				</div>

				{!this.props.collectionData.isLoading &&
					<Footer />
				}

			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default withRouter(connect(state => ({
	appData: state.app,
	loginData: state.login,
	pubCreateData: state.pubCreate,
	collectionData: state.collection,
}))(Collection));
