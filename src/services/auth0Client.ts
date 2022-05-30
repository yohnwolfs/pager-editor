class Auth0 {
  private _token: string | undefined;
  get token() {
    return sessionStorage.getItem('auth0token') || undefined;
  }
  set token(t: string | undefined) {
    t
      ? sessionStorage.setItem('auth0token', t)
      : sessionStorage.removeItem('auth0token');
  }
  clearToken() {
    this.token = undefined;
  }
}

const auth0 = new Auth0();

export default auth0;
