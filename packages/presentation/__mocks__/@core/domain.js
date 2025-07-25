export class SuiteUser {
  constructor(vUserDetail) {
    this.vUserDetail = vUserDetail;
  }
}

export const AuthStatus = {
  LOADING: 'loading',
  SIGNED_IN: 'signedIn',
  SIGNED_OUT: 'signedOut',
};