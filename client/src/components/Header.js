import React from 'react';
import { Link } from 'react-router-dom';
import SpotifyAuth from './SpotifyAuth'

const Header = () => {
    return (
        <div className="ui secondary pointing menu">
            <Link to="/" className="item">
                Streamy
            </Link>
            <div className="right menu">
                <Link to="/" className="item">
                    Party Play
                </Link>
                <SpotifyAuth />
            </div>
        </div>
    )
}

export default Header;