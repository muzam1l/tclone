import React from 'react'
import './auth.css'
import { Link } from 'react-router-dom'
import { filterInput } from '../../utils/helpers'
import { AuthContext } from '../../utils/context/auth'

class Signup extends React.Component {
    static contextType = AuthContext;
    state = {
        disabled: false,
        error: null
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.state.disabled)
            return
        this.setState({ error: null, disabled: true })
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
            this.setState({ disabled: false })
            this.context.login(data.user);
        } catch (error) {
            console.log(error.message);
            this.setState({ error: error.message, disabled: false })
        }
    }
    render() {
        let disabled = this.state.disabled ? "disabled" : ""
        return (
            <>
                <div className="thumb">
                    <img src="img/login-thumb-vector.svg" alt="people vector" />
                    <a href="https://www.freepik.com/free-photos-vectors/people">People vector created by pikisuperstar - www.freepik.com</a>
                </div>
                <div style={{}} className="title">
                    Sign up to see fake_world right now
            </div>
                <form onSubmit={this.handleSubmit} className={`auth ${disabled}`} method="POST">
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
            </>
        )
    }
}
export default Signup