import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Card, Icon, Image } from 'semantic-ui-react';


class SongPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: 'BQDXrc0cvM7RhwE7Ytjc814TQpv5suwLjIzGds5zl3RYW-S7Od7-WcSooRqrbVmefepYAAJzXnPkeUUiWCrOiGdiwiIGNh7hmUEHg1_buCkdn2M6eXU4gxnUm7KbClOKQ18hDC9rNf5CHh3AC4b3CUjDtAS7ffEiDJg',
            deviceId: "",
            loggedIn: false,
            error: "",
            trackName: "",
            artistName: "",
            albumName: "",
            playing: false,
            position: 0,
            duration: 0,
            albumArt: ''

        }

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);


    }

    createEventHandlers() {
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
            console.error(e);
            this.setState({ loggedIn: false });
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });

        // Playback status updates
        this.player.on('player_state_changed', state => { console.log(state); });

        // Ready
        this.player.on('ready', async data => {
            let { device_id } = data;
            console.log("Let the music play on!");
            this.setState({ deviceId: device_id });
            await this.setState({ deviceId: device_id });
            this.transferPlaybackHere();
        });

        // if the player state changes, we must update the componenent state
        this.player.on('player_state_changed', state => this.onStateChange(state));

    }

    checkForPlayer() {
        const { token } = this.state;

        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "George's Spotify Player",
                getOAuthToken: cb => {
                    cb(token);
                },
            });
            this.createEventHandlers();

            this.player.connect();
        }
    }

    onStateChange(state) {
        if (state !== null) {
            const {
                current_track: currentTrack,
                position,
                duration,
            } = state.track_window;
            const trackName = currentTrack.name;
            const albumArt = currentTrack.album.images[0].url;
            const albumName = currentTrack.album.name;
            const artistName = currentTrack.artists
                .map(artist => artist.name)
                .join(", ");
            const playing = !state.paused;
            this.setState({
                position,
                duration,
                trackName,
                albumName,
                artistName,
                playing,
                albumArt
            });
        }
    }

    onPrevClick = () => {
        this.player.previousTrack();
    }

    onPlayClick = () => {
        this.player.togglePlay();
        console.log(this.state);
    }

    onNextClick = () => {
        this.player.nextTrack();
    }

    transferPlaybackHere() {
        const { deviceId, token } = this.state;
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [deviceId],
                "play": true,
            }),
        });
    }

    render() {
        return (
            <Card fluid>
                <Card.Content>
                    <Image
                        fluid
                        floated='left'
                        size='tiny'
                        src={this.state.albumArt}
                    />
                    <Card.Header>{this.state.trackName}</Card.Header>
                    <Card.Meta>{this.state.artistName}</Card.Meta>
                    <Card.Description>

                        <p>
                            <Button icon>
                                <Icon name='step backward' onClick={this.onPrevClick} />
                            </Button>
                            <Button icon>
                                <Icon name={this.state.playing ? 'pause' : 'play'} onClick={this.onPlayClick} />
                            </Button>
                            <Button icon onClick={this.onNextClick}>
                                <Icon name='step forward' />
                            </Button>
                        </p>
                    </Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

export default SongPlayer;