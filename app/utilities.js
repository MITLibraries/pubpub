export const getFirebaseConfig = function() {
	const prodConfig = {
		apiKey: 'AIzaSyAkqGZZVlMiRzVyROlOwMUSbtbdHFPza7o',
		authDomain: 'pubpub-v4-prod.firebaseapp.com',
		databaseURL: 'https://pubpub-v4-prod.firebaseio.com',
		projectId: 'pubpub-v4-prod',
		storageBucket: 'pubpub-v4-prod.appspot.com',
		messagingSenderId: '955699971712'
	};
	const devConfig = {
		apiKey: 'AIzaSyDGttY0gbzGUhrrUD9f9bllMxmYWl3WWoc',
		authDomain: 'pubpub-v4-dev.firebaseapp.com',
		databaseURL: 'https://pubpub-v4-dev.firebaseio.com',
		projectId: 'pubpub-v4-dev',
		storageBucket: 'pubpub-v4-dev.appspot.com',
		messagingSenderId: '175246944410'
	};

	if (window.location.origin.indexOf('dev.pubpub.org') > -1) { return devConfig; }
	if (window.location.origin.indexOf('localhost:') > -1) { return devConfig; }
	return prodConfig;
};

export const getResizedUrl = function(url, type, dimensions) {
	/* jake.pubpub.org is our original resizing service */
	/* hosted on Heroku with .gif support. More expensive, but works. */
	/* Unsure of how well it scales since its caching is memory-based */
	/* jakejr.pubpub.org is an AWS cloudformation distribution. */
	/* http://docs.aws.amazon.com/solutions/latest/serverless-image-handler/welcome.html */
	/* It does not have .gif support, but should scale much better */
	/* and saves its cache on cloudfront */
	if (!url || url.indexOf('https://assets.pubpub.org/') === -1) { return url; }
	const extension = url.split('.').pop().toLowerCase();
	const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
	if (validExtensions.indexOf(extension) === -1) { return 'url'; }

	const prefix = type ? `${type}/` : '';
	if (extension === 'gif') {
		return `https://jake.pubpub.org/unsafe/${prefix}${dimensions}/${url}`;
	}
	const filepath = url.replace('https://assets.pubpub.org/', '');
	return `https://jakejr.pubpub.org/${prefix}${dimensions}/${filepath}`;
};

export const apiUrlPrefix = function() {
	let urlPrefix = 'https://v4-api.pubpub.org';
	if (window.location.origin.indexOf('dev.pubpub.org') > -1) {
		// urlPrefix = 'https://pubpub-api-v4-dev.herokuapp.com';
		urlPrefix = 'https://v4-api-dev.pubpub.org';
	}
	if (window.location.origin.indexOf('localhost:') > -1) {
		urlPrefix = 'http://localhost:9876';
	}
	return urlPrefix;
};

export const apiFetch = function(path, opts) {
	const urlPrefix = apiUrlPrefix();
	// The below is no longer an issue, as long as 
	// the site is not a custom domain or Safari has been to pubpub before.
	// We will have a problem if a user goes to a custom domain and
	// logs in without ever having visited a pubpub.org subdomain before.
	// Here's what I suggest:
	// Login on the custom domain (we can check for custom and only do this then)
	// if succesful, redirect to a pubpub.org/loginwithcookie that includes the
	// password hash, email, and redirect url. 
	// Login again from that pubpub.org url - now the cookie is set.
	// Redirect to the custom domain, and the cookie being set, should let the login
	// persist.
	// ----
	// Safari has to use a redirect since it doesn't allow 3rd party cookies
	// This means they'll have to login to every pubpub community.
	// Not sure why this is working with v3 despite the non-local urls...
	// if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
	// 	urlPrefix = `${window.location.origin}/api`;
	// }

	const finalRoute = `${urlPrefix}${path}`;

	return fetch(finalRoute, {
		...opts,
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
};

export const nestDiscussionsToThreads = function(discussions) {
	const maxThreadNumber = discussions.reduce((prev, curr)=> {
		if (curr.threadNumber > prev) { return curr.threadNumber; }
		return prev;
	}, 0);

	const tempThreads = new Array(maxThreadNumber).fill([]);
	discussions.forEach((item)=> {
		tempThreads[item.threadNumber - 1] = [...tempThreads[item.threadNumber - 1], item];
	});

	return tempThreads.filter((item)=> { return item.length; });
};

export const populateNavigationIds = function(collections, navigation) {
	const collectionsObject = {};
	collections.forEach((item)=> {
		collectionsObject[item.id] = item;
	});
	return navigation.map((item)=> {
		if (item.children) {
			return {
				...item,
				children: item.children.map((child)=> {
					return collectionsObject[child];
				}).filter((child)=> {
					return !!child;
				})
			};
		}
		return collectionsObject[item];
	}).filter((item)=> {
		if (!item) { return false; }
		if (item.children && !item.children.length) { return false; }
		return true;
	});
};

export function generateHash(length) {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index++) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
}

export function getDefaultLayout(isPage) {
	if (isPage) {
		return [
			{
				id: 'kruw36cv',
				type: 'text',
				content: {
					text: undefined,
				},
			}
		];
	}
	return [
		{
			id: '0kyj32ay',
			type: 'pubs',
			content: {
				title: '',
				size: 'large',
				limit: 1,
				pubIds: []
			}
		},
		{
			id: 'gruw36cv',
			type: 'pubs',
			content: {
				title: '',
				size: 'medium',
				limit: 0,
				pubIds: []
			}
		},
		{
			id: 'kruw36cv',
			type: 'drafts',
			content: {
				title: 'Open Drafts',
			},
		}
	];
}

export function formatCitationString(item, callback) {
	const urlPrefix = apiUrlPrefix();
	const finalRoute = `${urlPrefix}/editor/citation-format`;
	fetch(finalRoute, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			input: item
		}),
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	})
	.then((result) => {
		callback(result);
	})
	.catch((error) => {
		callback(error);
	});
}
export function renderLatexString(value, isBlock, callback) {
	const urlPrefix = apiUrlPrefix();
	const finalRoute = `${urlPrefix}/editor/latex-render`;
	fetch(finalRoute, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			value: value,
			isBlock: isBlock,
		}),
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	})
	.then((result) => {
		callback(result);
	})
	.catch((error) => {
		callback(error);
	});
}
export function s3Upload(file, progressEvent, finishEvent, index) {
	function beginUpload() {
		const folderName = window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.pubpub.org'
			? generateHash(8)
			: '_testing';

		const extension = file.name !== undefined ? file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2) : 'jpg';

		// const filename = folderName + '/' + new Date().getTime() + '.' + extension;
		const filename = folderName + '/' + (Math.floor(Math.random() * 8)) + new Date().getTime() + '.' + extension;
		const fileType = file.type !== undefined ? file.type : 'image/jpeg';
		const formData = new FormData();

		formData.append('key', filename);
		formData.append('AWSAccessKeyId', 'AKIAJQ5MNLCTIMY2ZF7Q');
		formData.append('acl', 'public-read');
		formData.append('policy', JSON.parse(this.responseText).policy);
		formData.append('signature', JSON.parse(this.responseText).signature);
		formData.append('Content-Type', fileType);
		formData.append('success_action_status', '200');
		formData.append('file', file);
		const sendFile = new XMLHttpRequest();
		sendFile.upload.addEventListener('progress', (evt)=>{
			progressEvent(evt, index);
		}, false);
		sendFile.upload.addEventListener('load', (evt)=>{
			finishEvent(evt, index, file.type, filename, file.name);
		}, false);
		sendFile.open('POST', 'https://s3-external-1.amazonaws.com/assets.pubpub.org', true);
		sendFile.send(formData);
	}

	const getPolicy = new XMLHttpRequest();
	const urlPrefix = apiUrlPrefix();
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', `${urlPrefix}/uploadPolicy?contentType=${file.type}`);
	getPolicy.send();
}

export function getRandomColor() {
	const colors = [
		'244,67,54',
		'63,81,181',
		'0,150,136',
		'255,152,0',
		'96,125,139',
		'233,30,99',
		'3,169,244',
		'156,39,176',
		'139,195,74',
		'103,58,183',
		'121,85,72',
		'33,150,243',
		'255,193,7',
		'0,188,212',
		'76,175,80',
		'205,220,57',
		'255,87,34',
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
