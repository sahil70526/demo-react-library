import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';

const DemoTwilio = ({ getTokenFromServer }) => {
    const [roomName, setRoomName] = useState('');
    const [audioState, setAudioState] = useState(true);
    const [video, setVideo] = useState(true);
    const [room, setRoom] = useState(null);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    const [participantVideoTracks, setParticipantVideoTracks] = useState([]);



    const setupLocalVideo = async () => {
        const videoElement = document.createElement('video');
        videoElement.muted = true;

        const { createLocalVideoTrack } = require('twilio-video');
        const track = await createLocalVideoTrack();

        track.attach(videoElement);
        setLocalVideoTrack(track);

        document.getElementById('local-video-container').appendChild(videoElement);
    };

    const handleJoinRoom = async () => {
        const token = await getTokenFromServer(roomName);
        const room = await connectToRoom(token);
        setRoom(room);
        setupLocalVideo();
    };

    const connectToRoom = async (token) => {
        const Video = require('twilio-video');

        const room = await Video.connect(token, { name: roomName, video: true, audio: audioState });

        room.participants.forEach((participant) => {
            participant.tracks.forEach((publication) => {
                if (publication.track) {
                    handleTrackSubscribed(publication.track);
                }
            });
            participant.on('trackSubscribed', handleTrackSubscribed);
        });

        room.on('participantConnected', (participant) => {
            participant.tracks.forEach((publication) => {
                if (publication.track) {
                    handleTrackSubscribed(publication.track);
                }
            });

            participant.on('trackSubscribed', handleTrackSubscribed);
        });

        room.on('participantDisconnected', (participant) => {
            participant.tracks.forEach(handleTrackUnsubscribed);
        });
        setRoom(room);
    };

    const handleTrackSubscribed = (track) => {
        setParticipantVideoTracks((prevTracks) => [...prevTracks, track]);
    };

    const handleTrackUnsubscribed = (track) => {
        setParticipantVideoTracks((prevTracks) =>
            prevTracks.filter((t) => t !== track)
        );
    };

    useEffect(() => {
        return () => {
            if (localVideoTrack) {
                localVideoTrack.stop();
            }
        };
    }, []);

    return (
        <>
            <div className='main1'>
                <h1>Twilio Video Chat</h1>
                <input
                    type='text'
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder='Enter room name'
                />
                <button onClick={handleJoinRoom}>Join Room</button>
                <br />
                <br />

                <div id='local-video-container' className="video-container"></div>
                <div>
                    {participantVideoTracks.map((track, index) => (
                        <div key={track}>
                            <video ref={(el) => track.attach(el)} autoPlay width={300} />
                        </div>
                    ))}
                </div>
                {room && (
                    <div style={{ backgroundColor: "red" }}>
                        <h2>Room: {roomName}</h2>
                        <p>Participants: {room.participants.sizeu}</p>
                        <Icon disabled name='video camera' />
                    </div>
                )}
            </div >
            {audioState && <Icon name='microphone' size='big' onClick={() => setAudioState(!audioState)} />}
            {!audioState && <Icon name='microphone slash' size='big' onClick={() => setAudioState(!audioState)} />}
        </>

    );
};

export default DemoTwilio;