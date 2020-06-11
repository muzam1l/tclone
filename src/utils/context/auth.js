import React from 'react'
const AuthContext = React.createContext()

class AuthProvider extends React.Component {
    state = {
        isAuthenticated: false,
        loading: false,
        user: null,
    }
    async logon() {
        this.setState({ loading: true, error: false });
        try {
            let responce = await fetch('/auth/login');
            if (responce.status >= 500) {
                this.setState({ error: true })
            }
            if (responce.status >= 400) {
                this.logout()
            }
            else if (responce.ok) {
                let dat = await responce.json();
                //console.log(dat.message, dat.user)
                this.login(dat.user)
            }
        } catch (error) {
            console.log(error);
            this.setState({ error: true })
        } finally {
            this.setState({ loading: false })
        }
    }
    logon = this.logon.bind(this);
    login(user) {
        this.setState({
            isAuthenticated: true,
            user
        })
    }
    login = this.login.bind(this)
    logout() {
        fetch('/auth/logout')
        this.setState({
            isAuthenticated: false,
            user: null
        })
    }
    logout = this.logout.bind(this)
    render() {
        return (
            <AuthContext.Provider value={{
                ...this.state,
                login: this.login,
                logout: this.logout,
                logon: this.logon
            }} {...this.props} />
        )
    }
}
const useAuth = () => React.useContext(AuthContext)
//for functional components

export { AuthProvider, useAuth, AuthContext }