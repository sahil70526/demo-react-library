"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DemoTwilio = _ref => {
  let {
    getTokenFromServer
  } = _ref;
  const [roomName, setRoomName] = (0, _react.useState)('');
  const [room, setRoom] = (0, _react.useState)(null);
  const [localVideoTrack, setLocalVideoTrack] = (0, _react.useState)(null);
  const [participantVideoTracks, setParticipantVideoTracks] = (0, _react.useState)([]);
  const setupLocalVideo = async () => {
    const videoElement = document.createElement('video');
    videoElement.muted = true;
    const {
      createLocalVideoTrack
    } = require('twilio-video');
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
  const connectToRoom = async token => {
    const Video = require('twilio-video');
    const room = await Video.connect(token, {
      name: roomName,
      video: true
    });
    room.participants.forEach(participant => {
      participant.tracks.forEach(publication => {
        if (publication.track) {
          handleTrackSubscribed(publication.track);
        }
      });
      participant.on('trackSubscribed', handleTrackSubscribed);
    });
    room.on('participantConnected', participant => {
      participant.tracks.forEach(publication => {
        if (publication.track) {
          handleTrackSubscribed(publication.track);
        }
      });
      participant.on('trackSubscribed', handleTrackSubscribed);
    });
    room.on('participantDisconnected', participant => {
      participant.tracks.forEach(handleTrackUnsubscribed);
    });
    setRoom(room);
  };
  const handleTrackSubscribed = track => {
    setParticipantVideoTracks(prevTracks => [...prevTracks, track]);
  };
  const handleTrackUnsubscribed = track => {
    setParticipantVideoTracks(prevTracks => prevTracks.filter(t => t !== track));
  };
  (0, _react.useEffect)(() => {
    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "main1"
  }, /*#__PURE__*/_react.default.createElement("h1", null, "Twilio Video Chat"), /*#__PURE__*/_react.default.createElement("input", {
    type: "text",
    value: roomName,
    onChange: e => setRoomName(e.target.value),
    placeholder: "Enter room name"
  }), /*#__PURE__*/_react.default.createElement("button", {
    onClick: handleJoinRoom
  }, "Join Room"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
    id: "local-video-container",
    className: "video-container"
  }), /*#__PURE__*/_react.default.createElement("div", null, participantVideoTracks.map((track, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: track
  }, /*#__PURE__*/_react.default.createElement("video", {
    ref: el => track.attach(el),
    autoPlay: true,
    width: 300
  })))), room && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: "red"
    }
  }, /*#__PURE__*/_react.default.createElement("h2", null, "Room: ", roomName), /*#__PURE__*/_react.default.createElement("p", null, "Participants: ", room.participants.sizeu))));
};
var _default = exports.default = DemoTwilio;