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
        // STEP 5 - Set the spatial placement for the user
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

// STEP 2 - Function to set the environment

// STEP 4 - Function to set the spatial placement for a user

// STEP 7 - Handle the window resize event

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
            // STEP 1 - Turn on Spatial Audio
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
