import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerEmail: '',
      registerPassword: '',
      registerName: '',
      isValid: true,
    };
  }
  onEmailChange = (event) => {
    this.setState({ registerEmail: event.target.value });
    this.setState({ isValid: true });
  };
  onPasswordChange = (event) => {
    this.setState({ registerPassword: event.target.value });
    this.setState({ isValid: true });
  };
  onNameChange = (event) => {
    this.setState({ registerName: event.target.value });
    this.setState({ isValid: true });
  };

  onSubmitRegister = () => {
    if (this.state.registerName && this.state.registerEmail && this.state.registerPassword) {
      fetch('http://localhost:3000/register', {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: this.state.registerEmail,
          password: this.state.registerPassword,
          name: this.state.registerName,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user) {
            this.props.loadUser(user);
            this.props.onRouteChange('home');
          }
        });
    } else {
      this.setState({ isValid: false });
    }
  };

  render() {
    return (
      <div>
        <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
          <main className='pa4 black-80'>
            <div className='measure'>
              <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
                <legend className='f2 fw6 ph0 mh0 center'>Register</legend>
                <div className='mt3'>
                  <label className='db fw6 lh-copy f6' htmlFor='name'>
                    Name
                  </label>
                  <input
                    onChange={this.onNameChange}
                    className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                    type='text'
                    name='name'
                    id='name'
                  />
                </div>
                <div className='mt3'>
                  <label className='db fw6 lh-copy f6' htmlFor='email-address'>
                    Email
                  </label>
                  <input
                    onChange={this.onEmailChange}
                    className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                    type='email'
                    name='email-address'
                    id='email-address'
                  />
                </div>
                <div className='mv3'>
                  <label className='db fw6 lh-copy f6' htmlFor='password'>
                    Password
                  </label>
                  <input
                    onChange={this.onPasswordChange}
                    className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                    type='password'
                    name='password'
                    id='password'
                  />
                </div>
                {!this.state.isValid && <p className='red'>Invalid data!</p>}
              </fieldset>
              <div>
                <input
                  onClick={this.onSubmitRegister}
                  className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
                  type='submit'
                  value='Register'
                />
              </div>
            </div>
          </main>
        </article>
      </div>
    );
  }
}

export default Register;
