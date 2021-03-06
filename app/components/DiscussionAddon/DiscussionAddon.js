import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionEditable from './DiscussionEditable';
import DiscussionStatic from './DiscussionStatic';

const propTypes = {
	threads: PropTypes.array,
	routerContext: PropTypes.object,
	slug: PropTypes.string,
	/* All addons get the following props,
	but certain schema-based addons may not need them */
	// containerId: PropTypes.string.isRequired,
	// view: PropTypes.object.isRequired,
	// editorState: PropTypes.object.isRequired,
};
const defaultProps = {
	threads: [],
	routerContext: {},
	slug: '',
};

class DiscussionAddon extends Component {
	static schema = (props)=> {
		return {
			nodes: {
				discussion: {
					atom: true,
					// content: 'inline*',
					attrs: {
						threadNumber: { default: null },
						align: { default: 'center' },
					},
					inline: false,
					group: 'block',
					draggable: false,
					selectable: true,
					insertMenu: {
						label: 'Insert Discussion Thread',
						icon: 'pt-icon-chat',
						onInsert: (view) => {
							const discussionNode = view.state.schema.nodes.discussion.create();
							const transaction = view.state.tr.replaceSelectionWith(discussionNode);
							view.dispatch(transaction);
						},
					},
					toEditable(node, view, decorations, isSelected, helperFunctions) {
						return (
							<DiscussionEditable
								node={node}
								threadNumber={node.attrs.threadNumber}
								align={node.attrs.align}
								isSelected={isSelected}
								view={view}
								{...helperFunctions}
								threads={props.threads}
								slug={props.slug}
								routerContext={props.routerContext}
							/>
						);
					},
					toStatic(node) {
						return (
							<DiscussionStatic
								align={node.attrs.align}
								threadNumber={node.attrs.threadNumber}
								threads={props.threads}
								slug={props.slug}
								routerContext={props.routerContext}
							/>
						);
					},
				},
			}
		};
	};

	render() {
		return null;
	}
}

DiscussionAddon.propTypes = propTypes;
DiscussionAddon.defaultProps = defaultProps;
export default DiscussionAddon;
