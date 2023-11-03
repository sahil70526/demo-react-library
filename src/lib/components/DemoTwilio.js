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
<div className='full-screen-container'>
      <div className='main-container'>
        <h1 className='title'>Twilio Video Chat</h1>
        <div className='room-input'>
          <input
            type='text'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder='Enter room name'
          />
          <button onClick={handleJoinRoom} className='join-button'>
            Join Room
          </button>
        </div>

        <div className='video-chat-container'>
          <div id='local-video-container' className='video-container local-video'>
            {/* Add any content you want here */}
          </div>
          <div className='remote-video-container'>
            {participantVideoTracks.map((track, index) => (
              <div key={track} className='remote-video'>
                <video ref={(el) => track.attach(el)} autoPlay width={300} />
              </div>
            ))}
          </div>
          {room && (
            <div className='room-info'>
              <h2>Room: {roomName}</h2>
              <p>Participants: {room.participants.size}</p>
            </div>
          )}
        </div>
      </div>

      <div className='control-icons'>
        {audioState && (
          <Icon name='microphone' size='big' onClick={() => setAudioState(!audioState)} className='icon' />
        )}
        {!audioState && (
          <Icon name='microphone slash' size='big' onClick={()=>setAudioState(!audioState)} className='icon' />
        )}
        <Icon name='video camera' className='icon' />
      </div>
    </div>

    );
};

export default DemoTwilio;