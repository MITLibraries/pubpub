/* ---------- */
// Load Actions
/* ---------- */
import {
	GET_APP_DATA_LOAD,
	GET_APP_DATA_SUCCESS,
	GET_APP_DATA_FAIL,

	PUT_APP_DATA_LOAD,
	PUT_APP_DATA_SUCCESS,
	PUT_APP_DATA_FAIL,

	POST_COMMUNITY_ADMIN_LOAD,
	POST_COMMUNITY_ADMIN_SUCCESS,
	POST_COMMUNITY_ADMIN_FAIL,

	DELETE_COMMUNITY_ADMIN_LOAD,
	DELETE_COMMUNITY_ADMIN_SUCCESS,
	DELETE_COMMUNITY_ADMIN_FAIL,
} from 'actions/app';

import {
	POST_COLLECTION_LOAD,
	POST_COLLECTION_SUCCESS,
	POST_COLLECTION_FAIL,

	PUT_COLLECTION_LOAD,
	PUT_COLLECTION_SUCCESS,
	PUT_COLLECTION_FAIL,

	DELETE_COLLECTION_LOAD,
	DELETE_COLLECTION_SUCCESS,
	DELETE_COLLECTION_FAIL,
} from 'actions/collection';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
	data: undefined,
	isLoading: false,
	error: undefined,
	putIsLoading: false,
	putError: undefined,
	postCollectionIsLoading: false,
	postCollectionError: undefined,
	putCollectionIsLoading: false,
	putCollectionError: undefined,
	deleteCollectionIsLoading: false,
	deleteCollectionError: undefined,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
	switch (action.type) {
	case GET_APP_DATA_LOAD:
		return {
			data: undefined,
			loading: true,
			error: undefined,
		};
	case GET_APP_DATA_SUCCESS:
		return {
			data: {
				...action.result,
				userData: undefined,
			},
			loading: false,
			error: undefined,
		};
	case GET_APP_DATA_FAIL:
		return {
			data: undefined,
			loading: false,
			error: action.err,
		};
	/* PUT App Data */
	case PUT_APP_DATA_LOAD:
		return {
			...state,
			putIsLoading: true,
			putError: undefined,
		};
	case PUT_APP_DATA_SUCCESS:
		return {
			data: {
				...state.data,
				...action.result,
			},
			putIsLoading: false,
			putError: undefined,
		};
	case PUT_APP_DATA_FAIL:
		return {
			...state,
			putIsLoading: false,
			putError: action.error,
		};
	/* POST Collection */
	case POST_COLLECTION_LOAD:
		return {
			...state,
			postCollectionIsLoading: true,
		};
	case POST_COLLECTION_SUCCESS:
		return {
			data: {
				...state.data,
				navigation: action.result.navigation,
				collections: [
					...state.data.collections,
					action.result.collection,
				]
			},
			postCollectionIsLoading: false,
			postCollectionError: undefined
		};
	case POST_COLLECTION_FAIL:
		return {
			...state,
			postCollectionIsLoading: false,
			postCollectionError: action.error
		};
	/* PUT Collection */
	case PUT_COLLECTION_LOAD:
		return {
			...state,
			putCollectionIsLoading: true,
			putCollectionError: undefined
		};
	case PUT_COLLECTION_SUCCESS:
		return {
			data: {
				...state.data,
				collections: state.data.collections.map((item)=> {
					if (item.id !== action.result.id) { return item; }
					return {
						...item,
						...action.result,
					};
				})
			},
			putCollectionIsLoading: false,
			putCollectionError: undefined
		};
	case PUT_COLLECTION_FAIL:
		return {
			...state,
			putCollectionIsLoading: false,
			putCollectionError: action.error
		};
	/* DELETE Collection */
	case DELETE_COLLECTION_LOAD:
		return {
			...state,
			deleteCollectionIsLoading: true,
			deleteCollectionError: undefined
		};
	case DELETE_COLLECTION_SUCCESS:
		return {
			data: {
				...state.data,
				collections: state.data.collections.filter((item)=> {
					return item.id !== action.result.collectionId;
				}),
				navigation: action.result.navigation,
			},
			deleteCollectionIsLoading: false,
			deleteCollectionError: undefined
		};
	case DELETE_COLLECTION_FAIL:
		return {
			...state,
			deleteCollectionIsLoading: false,
			deleteCollectionError: action.error
		};
	/* POST Community Admin Data */
	/* -------------------- */
	case POST_COMMUNITY_ADMIN_LOAD:
		return state;
	case POST_COMMUNITY_ADMIN_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				admins: [
					...state.data.admins,
					action.result,
				]
			}
		};
	case POST_COMMUNITY_ADMIN_FAIL:
		return state;
	/* DELETE Community Admin Data */
	/* -------------------- */
	case DELETE_COMMUNITY_ADMIN_LOAD:
		return state;
	case DELETE_COMMUNITY_ADMIN_SUCCESS:
		return {
			...state,
			data: {
				...state.data,
				admins: state.data.admins.filter((item)=> {
					return item.id !== action.result;
				})
			}
		};
	case DELETE_COMMUNITY_ADMIN_FAIL:
		return state;
	default:
		return state;
	}
}
