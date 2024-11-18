class AudioPlayer {
    constructor(sounds) {
        this.sounds = sounds

    };
    //play a single sound
    play_sound(ind) {
        this.sounds[ind].play()
    }
    //stop a single sound
    stop_sound(ind) {
        this.sounds[ind].stop()
    }

    isPlaying(ind) {
        return this.sounds[ind].playing()
    }

    getDuration(ind) {
        return this.sounds[ind]._duration
    }
    //stop all sounds
    stop_all() {
        this.sounds.forEach(function (sound) {
            sound.stop()
        })
    }
}

var source_names = ['block-start.wav', 'travarse.mp3', 'to-input.wav', 'error.wav', 'end.wav', 'enter.flac', 'leave.flac', 'switch.wav', 'running.mp3', 'na.mp3', 'edit.wav']
var sources = []
for (i = 0; i < source_names.length; i++) {
    var sound = new Howl({
        src: ["./sounds/" + source_names[i]],
        loop: false,
        volume: 0.2
    })
    // sound.once('load', () => {
    //     sound.idSoundPlaying = sound.play();
    // })
    sound.once('loaderror', () => {
        sound.unload();
    });

    sound.once('playerror', () => {
        sound.unload();
    });
    sound.once('stop', () => {
    });

    sound.once('unlock', () => {
    });

    sound.once("end", () => {
        sound.stop(sound.idSoundPlaying);
    })
    sources.push(sound);
}
var audioPlayer = new AudioPlayer(sources)

function playNewBlockSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(0)
}

function playTravarseSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(1)
}

function playToInputSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(2)
}

function playErrorSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(3)
}

function playErrorCue() {
    if (!globals.realTimeErrorBeep && globals.errorCue && !globals.isContextMenuOpen && !globals.isDialogOpen) {
        audioPlayer.stop_all()
        audioPlayer.play_sound(3)
    }
    setTimeout(function () {
        var errorLine = document.getElementById('table').querySelectorAll('[data-error-line="true"]')[0]
        if (globals.errorCue && !globals.isContextMenuOpen && !globals.isDialogOpen) {
            textToSpeech('error at line ' + errorLine.getAttribute('data-line-number'))
        }
    }, 1000)
}

function playEndSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(4)
}

function playEnterSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(5)
}

function playLeaveSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(6)
}

function playSwitchSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(7)
}

function playRunningSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(8)
}

function playNoOpSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(9)
}
function playEditSound() {
    audioPlayer.stop_all()
    audioPlayer.play_sound(10)
}