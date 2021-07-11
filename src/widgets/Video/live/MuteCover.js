import React from "react";

class MuteCover extends React.Component {
  render() {
    const { localPeerConnection } = this.props;
    if (localPeerConnection) {
      return (
        <div style={{ width: "100%" }}>
          {localPeerConnection.getAudioTracks().length > 0 && (
            <div
              onClick={() =>
                localPeerConnection.getAudioTracks()[0].enabled
                  ? () =>
                      (localPeerConnection.getAudioTracks()[0].enabled = false)
                  : () =>
                      (localPeerConnection.getAudioTracks()[0].enabled = true)
              }
              style={{
                zIndex: "5",
                display: "flex",
                position: "absolute",
                bottom: "0px",
                backgroundColor: "red"
              }}
            >
              mute
            </div>
          )}
          {localPeerConnection.getAudioTracks().length > 0 && (
            <div
              onClick={() =>
                localPeerConnection.getVideoTracks()[0].enabled
                  ? () =>
                      (localPeerConnection.getVideoTracks()[0].enabled = false)
                  : () =>
                      (localPeerConnection.getVideoTracks()[0].enabled = true)
              }
              style={{
                right: "0px",
                zIndex: "5",
                display: "flex",
                position: "absolute",
                bottom: "0px",
                backgroundColor: "red"
              }}
            >
              cover
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default MuteCover;
