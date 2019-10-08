// src/components/NavBar.js

import React from "react";

const NavBar = (props) => {
    const {isAuthenticated, loginWithRedirect, logout} = props;

    return (
        <div>
            {!isAuthenticated && <button onClick={() => loginWithRedirect({})}> Log in </button>}
            {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
        </div>
    );
};

export default NavBar;