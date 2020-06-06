import React from 'react'
import './auth.css'
import { Link } from 'react-router-dom'
import { filterInput } from '../../utils/helpers'
import { AuthContext } from '../../utils/context/auth'

class Signup extends React.Component {
    static contextType = AuthContext;
    state = {
        error: null
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ error: null })
        try {
            let form = e.target;
            let username = filterInput(form.username.value, 'username', { min_length: 4 });
            let password = filterInput(form.password.value, 'password');
            let fullname = filterInput(form.fullname.value, 'name', { min_length: 0 });
            let responce = await fetch('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password,
                    fullname
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!responce.ok) {
                if (responce.status === 409) //conflict
                    throw Error((await responce.json()).message);
                throw Error('Something went wrong')
            }
            let data = await responce.json();
            console.log(data.message);
            this.context.login(data.user);

        } catch (error) {
            console.log(error.message);
            this.setState({ error: error.message })
        }
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="auth" method="POST">
                <div className="group">
                    <div className="label">Choose a username - (required)</div>
                    <input type="text"
                        name="username"
                        autoComplete="off"
                        autoCapitalize="off"
                    />
                </div>
                <div className="group">
                    <div className="label">Full name - (optional)</div>
                    <input name="fullname" type="text" />
                </div>
                <div className="group">
                    <div className="label">Choose a password - (required)</div>
                    <input type="password" name="password" />
                </div>
                <div className="links">
                    Already have account?
                    <Link to="/login"> login instead</Link>
                </div>
                <div className="error">
                    {this.state.error}
                </div>
                <div className="buttons">
                    <button
                        type="submit"
                        className="btn active">
                        <span>Sign up</span>
                    </button>
                    <div className="seperator"><span>or</span></div>
                    <Link
                        to="login"
                        className="btn passive">
                        <span>Log in</span>
                    </Link>
                </div>
            </form>
        )
    }
}
export default Signup