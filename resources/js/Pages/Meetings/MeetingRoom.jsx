import React, { useEffect, useRef } from 'react';

const MeetingRoom = ({ roomSlug, userName }) => {
    const jitsiContainerRef = useRef(null);

    useEffect(() => {
        const domain = 'meet.jit.si';
        const options = {
            roomName: roomSlug,
            parentNode: jitsiContainerRef.current,
            userInfo: {
                displayName: userName || 'Guest User',
            },
            configOverwrite: {
                disableDeepLinking: true,
                startWithAudioMuted: true,
                startWithVideoMuted: true,
            },
            interfaceConfigOverwrite: {
                // Customize the button color and UI
                DEFAULT_BUTTON_BACKGROUND: '#4CAF50', // Green background for buttons
                DEFAULT_BUTTON_TEXT: '#FFFFFF', // White text for buttons
            },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);

        // Cleanup on component unmount
        return () => api.dispose();
    }, [roomSlug, userName]);

    return (
        <div
            id="jitsi-container-wrapper"
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F9F9F3',
            }}
        >
            <div
                id="jitsi-container"
                ref={jitsiContainerRef}
                style={{
                    height: '100%',
                    width: '100%',
                }}
            ></div>
        </div>
    );
};

export default MeetingRoom;
