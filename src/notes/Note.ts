import '@logseq/libs'
import * as AnkiConnect from '../anki-connect/AnkiConnect';
import { LazyAnkiNoteManager } from '../anki-connect/LazyAnkiNoteManager';
import _ from 'lodash';
import { convertLogseqToHtml } from '../Converter';

export abstract class Note {
    public uuid: string;
    public content: string;
    public format: string;
    public properties: any;
    public page: any;
    public parent: number;
    public type: string;
    public ankiId: number;
    static ankiNoteManager: LazyAnkiNoteManager;

    public constructor(uuid: string, content: string, format: string, properties: any, page: any, parent: number) {
        this.uuid = uuid;
        this.content = content;
        this.format = format;
        this.properties = properties;
        this.page = page;
        this.parent = parent;
    }

    public static setAnkiNoteManager(ankiNoteManager: LazyAnkiNoteManager) {
        Note.ankiNoteManager = ankiNoteManager;
    }

    public abstract addClozes(): Note;

    public getContent(): string {
        return this.content;
    }

    public getAnkiId(): number {
        if (this.ankiId) return this.ankiId;
        let ankiNotesArr = Array.from(Note.ankiNoteManager.noteInfoMap.values());
        let filteredankiNotesArr = ankiNotesArr.filter((note) => note.fields["uuid-type"].value == `${this.uuid}-${this.type}`);
        if(filteredankiNotesArr.length == 0) this.ankiId = null;
        else this.ankiId = parseInt(filteredankiNotesArr[0].noteId);
        return this.ankiId;
    }

    public async convertToHtml(): Promise<Note> {
        this.content = await convertLogseqToHtml(this.content, this.format);
        return this;
    }

    // public static async abstract getBlocksFromLogseq(): Block[];
}