import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatMessageHttpProvider} from "../../../providers/http/chat-message-http";
import {ItemSliding, TextInput} from "ionic-angular";
import Timer from 'easytimer.js/dist/easytimer.js';
import {AudioRecorderProvider} from "../../../providers/audio-recorder/audio-recorder";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

/**
 * Generated class for the ChatFooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'chat-footer',
    templateUrl: 'chat-footer.html'
})
export class ChatFooterComponent implements OnInit {

    text: string = '';
    messageType = 'text';
    timer = new Timer();
    recording = false;

    @ViewChild('inputFileImage')
    inputFileImage: TextInput;
    @ViewChild('itemSliding')
    itemSliding: ItemSliding;

    subjectReleaseAudioButton = new Subject();

    constructor(private chatMessageHttp: ChatMessageHttpProvider,
                private audioRecorder: AudioRecorderProvider) {
    }

    private getMinutSeconds() {
        return this.timer.getTimeValues().toString().substring(3);
    }

    ngOnInit(): void {
        this.onStopRecord();
    }

    onDrag() {
        if (this.itemSliding.getSlidingPercent() > 0.93) {
            this.itemSliding.close();
            this.clearRecording();
            this.audioRecorder.stopRecord()
                .then(
                    blob => console.log('stop recording...'),
                    error => console.log(error)
                );
        }
    }

    onStopRecord() {
        this.subjectReleaseAudioButton
            .pipe(debounceTime(500))
            .subscribe(() => {
                if (!this.recording) return;

                if (this.itemSliding.getSlidingPercent() === 0) {
                    this.clearRecording();

                    this.audioRecorder.stopRecord()
                        .then(
                            blob => this.sendMessageAudio(blob),
                            error => console.log(error)
                        );
                }
            });
    }

    clearRecording() {
        this.timer.stop();
        this.text = '';
        this.recording = false;
    }

    holdAudioButton() {
        this.recording = true;
        this.audioRecorder.startRecord();
        this.timer.start({precision: 'seconds'});
        this.timer.addEventListener('secondsUpdated', (e) => {
            const time = this.getMinutSeconds();

            this.text = `${time} Gravando...`;
        });
    }


    releaseAudioButton() {
        this.subjectReleaseAudioButton.next();
    }

    sendMessage(data: { content, type }) {
        this.chatMessageHttp.create(1, data)
            .subscribe(response => {
                this.text = '';
                console.log('enviou');
            });
    }

    sendMessageText() {
        if (!this.text.length) {
            return;
        }

        this.sendMessage({content: this.text, type: 'text'});
    }

    sendMessageImage(files: FileList) {
        if (!files.length) {
            return;
        }

        this.sendMessage({content: files[0], type: 'image'});
    }

    sendMessageAudio(blob: Blob) {
        this.sendMessage({content: blob, type: 'audio'});
    }

    selectImage() {
        const nativeElement: HTMLElement = this.inputFileImage.getElementRef().nativeElement;
        const inputFile = nativeElement.querySelector('input');
        inputFile.click();
    }

    getIconSendMessage() {
        if (this.messageType === 'text') {
            return this.text === '' ? 'mic' : 'send';
        }

        return 'mic';
    }
}
