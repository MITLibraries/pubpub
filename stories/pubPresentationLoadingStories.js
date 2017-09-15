import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPresDetailsLoading from 'components/PubPresDetailsLoading/PubPresDetailsLoading';
import PubPresHeaderLoading from 'components/PubPresHeaderLoading/PubPresHeaderLoading';
import PubBodyLoading from 'components/PubBodyLoading/PubBodyLoading';
import AccentStyle from 'components/AccentStyle/AccentStyle';

import { accentDataDark, accentDataLight, pubData, pubVersions, pubCollaboratorsLoading, pubBodyLoading } from './_data';

require('containers/PubPresentation/pubPresentation.scss');

const wrapperStyle = {
	width: 'calc(50% - 2em)',
	margin: '1em',
	boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.25)',
	float: 'left',
};

const content = (
	<div className={'pub-presentation'}>
		<div style={wrapperStyle}>
			<PubPresHeaderLoading
				title={'Soundscapes'}
				description={pubData.description}
				backgroundImage={'/dev/pubHeader3.jpg'}
			/>
			<PubPresDetailsLoading
				collaborators={pubCollaboratorsLoading}
				pubData={pubData}
				versions={pubVersions}
			/>
			<PubBodyLoading content={pubBodyLoading} />
		</div>
		<div style={wrapperStyle}>
			<PubPresHeaderLoading
				title={'Soundscapes'}
				description={pubData.description}
			/>
			<PubPresDetailsLoading
				collaborators={pubCollaboratorsLoading}
				pubData={pubData}
				versions={pubVersions}
			/>
			<PubBodyLoading content={pubBodyLoading} />
		</div>
	</div>
);
storiesOf('PubPresentationLoading', module)
.add('Default', () => (
	<div>
		{content}
	</div>
))
.add('Styled Dark', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		{content}
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		{content}
	</div>
));
