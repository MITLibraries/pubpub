import Immutable from 'immutable';
import {ensureImmutable} from './';

/*--------*/
// Load Actions
/*--------*/
import {
	CREATE_JOURNAL_LOAD,
	CREATE_JOURNAL_SUCCESS,
	CREATE_JOURNAL_FAIL,

	LOAD_JOURNAL_AND_LOGIN,
	LOAD_JOURNAL_AND_LOGIN_SUCCESS,
	LOAD_JOURNAL_AND_LOGIN_FAIL,

	LOAD_JOURNAL,
	LOAD_JOURNAL_SUCCESS,
	LOAD_JOURNAL_FAIL,

	SAVE_JOURNAL,
	SAVE_JOURNAL_SUCCESS,
	SAVE_JOURNAL_FAIL,

	CREATE_COLLECTION,
	CREATE_COLLECTION_SUCCESS,
	CREATE_COLLECTION_FAIL,

} from '../actions/journal';

/*--------*/
// Initialize Default State 
/*--------*/
export const defaultState = Immutable.Map({
	createJournalData: {
		journalCreated: false,
		status: 'loaded',
		error: null,
		subdomain: null,	
	},
	journalData: {},
	status: 'loading',
	error: null,
	baseSubdomain: undefined, // Will be null if on pubpub and defined if on a journal
	journalSaving: false,
	journalSavingError: null,
	createCollectionStatus: null,
	createCollectionSlug: null,

});

/*--------*/
// Define reducing functions 
//
// These functions take in an initial state and return a new
// state. They are pure functions. We use Immutable to enforce this. 
/*--------*/

function createJournalLoad(state) {
	return state.mergeIn(['createJournalData'], {
		status: 'loading',
		error: null,
		subdomain: null,
	});
}

function createJournalSuccess(state, result) {

	return state.mergeIn(['createJournalData'], {
		status: 'loaded',
		error: null,
		journalCreated: true,
		subdomain: result,
	});
}

function createJournalFail(state, error) {
	return state.mergeIn(['createJournalData'], {
		status: 'loaded',
		error: error,
	});
}

function loadJournal(state) {
	return state.set('status', 'loading');
}

function loadJournalSuccess(state, journalData) {
	const newBaseSubdomain = journalData.subdomain ? journalData.subdomain : null;
	return state.merge({
		status: 'loaded',
		error: null,
		baseSubdomain: state.get('baseSubdomain') === undefined ? newBaseSubdomain : state.get('baseSubdomain'),
		journalData
	});
}

function loadJournalFail(state, error) {	
	return state.merge({
		status: 'loaded',
		error: error,
	});
}

function saveJournal(state) {
	return state.set('journalSaving', true);
}

function saveJournalSuccess(state, journalData) {
	return state.merge({
		journalSaving: false,
		journalSavingError: null,
		journalData
	});
}

function saveJournalFail(state, error) {	
	return state.merge({
		journalSaving: false,
		journalSavingError: error,
	});
}

function createCollection(state) {
	return state.set('createCollectionStatus', 'creating');
}

function createCollectionSuccess(state, result, newSlug) {
	return state.merge({
		createCollectionStatus: 'created',
		createCollectionSlug: newSlug,
		journalData: {
			...state.get('journalData').toJS(),
			collections: result,
		},
	});
}

function createCollectionFail(state, error) {	
	console.log('createCollection Failed: ', error);
	return state.set('createCollectionStatus', 'failed');
}

/*--------*/
// Bind actions to specific reducing functions.
/*--------*/
export default function loginReducer(state = defaultState, action) {
	switch (action.type) {

	case CREATE_JOURNAL_LOAD:
		return createJournalLoad(state);
	case CREATE_JOURNAL_SUCCESS:
		return createJournalSuccess(state, action.result);
	case CREATE_JOURNAL_FAIL:
		return createJournalFail(state, action.error);

	case LOAD_JOURNAL_AND_LOGIN:
		return loadJournal(state);
	case LOAD_JOURNAL_AND_LOGIN_SUCCESS:
		return loadJournalSuccess(state, action.result.journalData);
	case LOAD_JOURNAL_AND_LOGIN_FAIL:
		return loadJournalFail(state, action.error);

	case LOAD_JOURNAL:
		return loadJournal(state);
	case LOAD_JOURNAL_SUCCESS:
		return loadJournalSuccess(state, action.result);
	case LOAD_JOURNAL_FAIL:
		return loadJournalFail(state, action.error);

	case SAVE_JOURNAL:
		return saveJournal(state);
	case SAVE_JOURNAL_SUCCESS:
		return saveJournalSuccess(state, action.result);
	case SAVE_JOURNAL_FAIL:
		return saveJournalFail(state, action.error);

	case CREATE_COLLECTION:
		return createCollection(state);
	case CREATE_COLLECTION_SUCCESS:
		return createCollectionSuccess(state, action.result, action.newCollectionSlug);
	case CREATE_COLLECTION_FAIL:
		return createCollectionFail(state, action.error);

	default:
		return ensureImmutable(state);
	}
}