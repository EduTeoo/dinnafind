import { all, fork } from 'redux-saga/effects';

import { watchAuth } from './sagas/authSaga';
import { watchLocation } from './sagas/locationSaga';
import { watchVenues } from './sagas/venuesSaga';

// Root saga
export function* rootSaga() {
  yield all([fork(watchAuth), fork(watchLocation), fork(watchVenues)]);
}
