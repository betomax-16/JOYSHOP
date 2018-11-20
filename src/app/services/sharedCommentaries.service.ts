import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { Commentary } from '../models/commentary';

@Injectable()
export class ShareCommentariesService {
    commentaries: Commentary[];

    commentariesSource = new BehaviorSubject<Commentary[]>( this.commentaries );

    constructor() {
    }

    sendCommentaries( commentaries ) {
        this.commentariesSource.next( commentaries );
    }
}
