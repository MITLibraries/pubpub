import React from 'react';
import { storiesOf } from '@storybook/react';
import PubPresDetails from 'components/PubPresDetails/PubPresDetails';
import PubPresHeader from 'components/PubPresHeader/PubPresHeader';
import PubBody from 'components/PubBody/PubBody';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight, pubData, pubBody, pubBodyLoading } from './_data';

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
			<PubPresHeader
				title={'Soundscapes'}
				description={pubData.description}
				backgroundImage={'/dev/pubHeader3.jpg'}
			/>
			<PubPresDetails
				collaborators={pubData.contributors}
				slug={pubData.slug}
				numDiscussions={10}
				numSuggestions={8}
				versions={pubData.versions}
			/>
			<PubBody content={pubBody} />
		</div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'Soundscapes'}
				description={pubData.description}
			/>
			<PubPresDetails
				collaborators={pubData.contributors}
				slug={pubData.slug}
				numDiscussions={10}
				numSuggestions={8}
				versions={pubData.versions}
			/>
			<PubBody content={pubBody} />
		</div>
	</div>
);

const loadingContent = (
	<div className={'pub-presentation'}>
		<div style={wrapperStyle}>
			<PubPresHeader
				isLoading={true}
				title={'Loading Title'}
				description={'Loading content description. Eveniet non quae inventore asperiores qui eius. Voluptatem nulla natus ad. Qui totam sunt nesciunt aut suscipit quibusdam officiis illum aspernatur. Non voluptas sed quisquam distinctio. Aliquam excepturi dolores dolorem excepturi occaecati. Consequatur voluptas asperiores libero.'}
			/>
			<PubPresDetails
				collaborators={[]}
				slug={'loading'}
				versions={[]}
				isLoading={true}
			/>
			<PubBody
				isLoading={true}
				content={pubBodyLoading}
			/>
		</div>
		<div style={wrapperStyle}>
			<PubPresHeader
				title={'Soundscapes'}
				description={pubData.description}
			/>
			<PubPresDetails
				collaborators={pubData.contributors}
				slug={pubData.slug}
				numDiscussions={10}
				numSuggestions={8}
				versions={pubData.versions}
			/>
			<PubBody content={pubBody} />
		</div>
	</div>
);

storiesOf('PubPresentation', module)
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
))
.add('Loading', () => (
	<div>
		{loadingContent}
	</div>
));
