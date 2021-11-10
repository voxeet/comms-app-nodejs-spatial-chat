$('#btn-video-on').click(async () => {
    try {
        await VoxeetSDK.conference.startVideo(VoxeetSDK.session.participant);

        $('#btn-video-off').removeClass('d-none');
        $('#btn-video-on').addClass('d-none');
    } catch (error) {
        console.error(error);
    }
});

$('#btn-video-off').click(async () => {
    try {
        await VoxeetSDK.conference.stopVideo(VoxeetSDK.session.participant);

        $('#btn-video-off').addClass('d-none');
        $('#btn-video-on').removeClass('d-none');
    } catch (error) {
        console.error(error);
    }
});

$('#btn-unmute').click(async () => {
    try {        
        VoxeetSDK.conference.mute(VoxeetSDK.session.participant, false);

        $('#btn-unmute').addClass('d-none');
        $('#btn-mute').removeClass('d-none');
    } catch (error) {
        console.error(error);
    }
});

$('#btn-mute').click(() => {
    try {
        VoxeetSDK.conference.mute(VoxeetSDK.session.participant, true);

        $('#btn-unmute').removeClass('d-none');
        $('#btn-mute').addClass('d-none');
    } catch (error) {
        console.error(error);
    }
});

$("#btn-set-video-device").click(async () => {
    try {
        const videoInput = $('#video-devices').val();
        await VoxeetSDK.mediaDevice.selectVideoInput(videoInput);
    } catch (error) {
        console.error(error);
    }
});

$("#btn-set-input-audio-device").click(async () => {
    try {
        const audioInput = $('#input-audio-devices').val();
        await VoxeetSDK.mediaDevice.selectAudioInput(audioInput);
    } catch (error) {
        console.error(error);
    }
});

$("#btn-set-output-audio-device").click(async () => {
    try {
        const audioOutput = $('#output-audio-devices').val();
        await VoxeetSDK.mediaDevice.selectAudioOutput(audioOutput);
    } catch (error) {
        console.error(error);
    }
});
