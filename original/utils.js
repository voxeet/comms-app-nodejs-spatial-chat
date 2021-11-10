const avatars = [
    "alien.png",
    "archer.png",
    "celebrity.png",
    "cyborg.png",
    "man.png",
    "spy.png",
    "vr-glasses.png",
    "wizard.png",
    "woman.png",
];

const getRandomAvatar = () => {
    return avatars[Math.floor(Math.random() * avatars.length)];
};

const getRandomExternalId = () => {
    const rand = Math.round(Math.random() * 10000);
    return `id-${rand}`;
};

const isSpeakingColors = [
    "red",
    "blue",
    "green",
];

const getRandomIsSpeakingColor = () => {
    return isSpeakingColors[Math.floor(Math.random() * isSpeakingColors.length)];
};

/**
 * Load the audio and video devices
 */
const loadAudioVideoDevices = async () => {
    try {
        // Load the Output Audio devices
        const audioOutput = await VoxeetSDK.mediaDevice.enumerateAudioDevices("output");
        console.log("Output Audio Devices");
        console.log(audioOutput);

        audioOutput.forEach(device => {
            $('#output-audio-devices').append(new Option(device.label, device.deviceId));
        });

        $('#btn-set-output-audio-device').attr('disabled', false);

        // Load the Input Audio devices
        const audioInput = await VoxeetSDK.mediaDevice.enumerateAudioDevices("input");
        console.log("Input Audio Devices");
        console.log(audioInput);

        audioInput.forEach(device => {
            $('#input-audio-devices').append(new Option(device.label, device.deviceId));
        });

        $('#btn-set-input-audio-device').attr('disabled', false);

        // Load the Video devices
        const videoInput = await VoxeetSDK.mediaDevice.enumerateVideoDevices("input");
        console.log("Video Devices");
        console.log(videoInput);

        videoInput.forEach(device => {
            $('#video-devices').append(new Option(device.label, device.deviceId));
        });

        $('#btn-set-video-device').attr('disabled', false);
    } catch (error) {
        console.error(error);
    }
};

/**
 * Add a graphical element to indicate when a user is speaking.
 */
const listenIsSpeaking = () => {
    setInterval(() => {
        [...VoxeetSDK.conference.participants].map((val) => {
            const participant = val[1];
            VoxeetSDK.conference.isSpeaking(participant, (isSpeaking) => {
                const videoContainer = $(`[data-participant-id="${participant.id}"] .video-container`);
                if (videoContainer.length) {
                    if (isSpeaking) {
                        videoContainer.addClass('is-speaking');
                    } else {
                        videoContainer.removeClass('is-speaking');
                    }
                }
            });
        });
    }, 500);
};
