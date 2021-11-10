/**
 * Returns a boolean to indicate if the participant is connected to the conference or not.
 * @param participant Participant object to get the connection status.
 * @returns `true` if the participant is connected, `false` otherwise.
 */
const isConnected = (participant) => {
    return [ 'Decline', 'Error', 'Kicked', 'Left' ].indexOf(participant.status) < 0;
};

/**
 * Triggered when a new participant is added to the conference.
 */
VoxeetSDK.conference.on('participantAdded', (participant) => {
    // Only add connected participants
    if (isConnected(participant)) {
        addParticipant(participant);
    }
});

/**
 * Triggered when a participant receives an update.
 */
VoxeetSDK.conference.on('participantUpdated', (participant) => {
    // Look for the video container element in the DOM
    const userContainer = $(`.user-container[data-external-id="${participant.info.externalId}"]`);
    if (!userContainer.length) {
        addParticipant(participant);
    }

    if (isConnected(participant)) {
        $(`.user-container[data-external-id="${participant.info.externalId}"] .participant-name`).html(participant.info.name);
        setSpatialPosition(participant);
    } else {
        userContainer.remove();
    }
});

/**
 * Adds a participant to the UI.
 * @param participant Participant object to add.
 */
const addParticipant = (participant) => {
    const person = {
        color: getRandomIsSpeakingColor(),
        participantId: participant.id,
        externalId: participant.info.externalId,
        avatarUrl: `images/${participant.info.avatarUrl}`,
        name: participant.info.name,
    };

    // Use JsRender template
    const userTemplate = $.templates("#user-template");
    const element = $(userTemplate.render(person));
    $('#users-container').append(element);

    // Count the number of connected users
    const nbUsers = $('.user-container').length;

    // Set the participant on the layout
    if (participant.id === VoxeetSDK.session.participant.id) {
        // Get the dimensions of the rectangle
        const clientRect = element[0].getBoundingClientRect();

        // Set the local participant at the center
        const top = (document.documentElement.clientHeight - clientRect.height ) / 2;
        const left = (document.documentElement.clientWidth - clientRect.width ) / 2;
        element.attr('style', `top: ${top}px; left: ${left}px;`);
    } else if (nbUsers == 2) {
        element.attr('style', `top: 20%; right: 20%;`);
    } else if (nbUsers == 3) {
        element.attr('style', `top: 20%; left: 20%;`);
    } else if (nbUsers == 4) {
        element.attr('style', `bottom: 20%; right: 20%;`);
    } else if (nbUsers == 5) {
        element.attr('style', `bottom: 20%; left: 20%;`);
    }
};

/**
 * Set the spatial scene.
 */
const setSpatialEnvironment = () => {
    // document.documentElement.clientWidth and document.documentElement.clientHeight give me the dimensions of the web page
    const scale   = { x: document.documentElement.clientWidth / 4, y: document.documentElement.clientHeight / 3, z: 1 };
    const forward = { x: 0, y: -1, z: 0 };
    const up      = { x: 0, y: 0,  z: 1 };
    const right   = { x: 1, y: 0,  z: 0 };

    VoxeetSDK.conference.setSpatialEnvironment(scale, forward, up, right);
};

/**
 * Set the position in the spatial scene for the specified participant.
 * @param participant Participant to position on the spatial scene.
 */
const setSpatialPosition = (participant) => {
    if (!VoxeetSDK.conference.current) return; // TODO: Remove this!

    // Look for the participant element
    const videoContainer = $(`[data-participant-id="${participant.id}"]`);
    if (!videoContainer.length) return;

    // Get the position of the UI element
    const elementPosition = videoContainer[0].getBoundingClientRect();

    // Get the position of the center of the UI element
    const spatialPosition = {
        x: elementPosition.x + (elementPosition.width / 2),
        y: elementPosition.y + (elementPosition.height / 2),
        z: 0,
    };

    VoxeetSDK.conference.setSpatialPosition(participant, spatialPosition);
};

var lockResizeEvent = false;

/**
 * Triggered when resizing the window.
 * The event will be processed with a maximum rate of once per second.
 */
const onWindowResize = () => {
    // Make sure the event processing is not "locked"
    if (lockResizeEvent) return;
    lockResizeEvent = true;

    // Use the setTimeout to wait a second before we process the resize event
    setTimeout(() => {
        lockResizeEvent = false;

        // Re-set the spatial audio scene dimensions
        setSpatialEnvironment();
    
        // Since the local participant UI element is at the center of the screen
        // we need to update its position based on the new window size
        const localParticipant = $(`.user-container[data-participant-id="${VoxeetSDK.session.participant.id}"]`);
        if (localParticipant.length) {
            // Get the dimensions of the rectangle
            const clientRect = localParticipant[0].getBoundingClientRect();
    
            // Set the local participant at the center
            const top = (document.documentElement.clientHeight - clientRect.height ) / 2;
            const left = (document.documentElement.clientWidth - clientRect.width ) / 2;
    
            // Animate the UI element to its new position
            localParticipant.animate({ top: `${top}px`, left: `${left}px` }, 500);
        }

        // Now, for each participant, we need to update the spatial position
        [...VoxeetSDK.conference.participants].map((val) => {
            setSpatialPosition(val[1]);
        });
    }, 1000);
};

$('#btn-join').click(async () => {
    try {
        const name = $('#input-username').val();
        const externalId = getRandomExternalId();
        const avatarUrl = getRandomAvatar();

        // Open a session for the user
        await VoxeetSDK.session.open({ name, externalId, avatarUrl });

        console.group('Session opened');
        console.log(`Name:        ${name}`);
        console.log(`External Id: ${externalId}`);
        console.log(`Avatar URL:  ${avatarUrl}`);
        console.groupEnd();

        // Hide the modal popup
        const modalElement = document.getElementById('login-modal');
        const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
        bootstrapModal.hide();

        // See: https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-conferenceoptions
        const conferenceOptions = {
            alias: $('#input-conference-alias').val(),
            // See: https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-conferenceparameters
            params: {
                liveRecording: false,
                rtcpMode: "average", // worst, average, max
                ttl: 0,
                videoCodec: "H264", // H264, VP8
                dolbyVoice: true
            }
        };

        // Create the conference
        const conference = await VoxeetSDK.conference.create(conferenceOptions);

        console.group('Conference created');
        console.log(`Id:    ${conference.id}`);
        console.log(`Alias: ${conference.alias}`);
        console.groupEnd();

        // https://docs.dolby.io/communications-apis/docs/js-client-sdk-model-joinoptions
        const joinOptions = {
            constraints: {
                audio: true,
                video: false,
            },
            spatialAudio: true // STEP 1 - Turn on Spatial Audio
        };

        // Join the conference
        await VoxeetSDK.conference.join(conference, joinOptions);

        // STEP 3 - Set the spatial audio scene
        setSpatialEnvironment();

        // Load the Audio Video devices in case the user
        // wants to change device
        await loadAudioVideoDevices();

        // Display the actions buttons
        $(joinOptions.constraints.audio ? '#btn-mute' : '#btn-unmute').removeClass('d-none');
        $(joinOptions.constraints.video ? '#btn-video-off' : '#btn-video-on').removeClass('d-none');

        // Start listening to who is speaking
        // to add a visual indication on the UI
        listenIsSpeaking();

        // STEP 6 - Listen to the resize event
        window.addEventListener('resize', onWindowResize); 
    } catch (error) {
        console.error(error);
    }
});

$(function() {
    // Get an access token from the backend
    const url = '/access-token';
    fetch(url)
        .then(d => d.json())
        // Initialize the SDK
        .then(jwt => VoxeetSDK.initializeToken(jwt.access_token, () => fetch(url).then(d => d.json()).then(jwt => jwt.access_token)) )
        .then(() => {
            // Generate a random username
            const rand = Math.round(Math.random() * 10000);
            $('#input-username').val(`Guest ${rand}`);

            // Display a modal box to prompt for a username and a conference alias
            const modalElement = document.getElementById('login-modal');
            const bootstrapModal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false,
                focus: true
            });
            bootstrapModal.show();
        });

    // Set the Voxeet SDK Version
    $('#sdk-version').text(VoxeetSDK.version);
});
