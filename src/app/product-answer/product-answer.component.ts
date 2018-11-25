import { Component, OnInit  } from '@angular/core';
import { Product } from '../models/product';
import { Commentary } from '../models/commentary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentaryService } from '../services/commentary.service';
import { TokenService } from '../services/token.service';
import { User } from '../models/user';
import { UploadService } from '../services/upload.service';
import { AppSocketIoService } from '../services/socketIo.service';

@Component({
  selector: 'app-product-answer',
  templateUrl: './product-answer.component.html',
  styleUrls: ['./product-answer.component.css']
})
export class ProductAnswerComponent implements OnInit  {

  commentary: Commentary;

  constructor(private commentaryService: CommentaryService,
              private tokenService: TokenService,
              private uploadService: UploadService,
              public notificacionSnackBar: MatSnackBar,
              private SocketIoService: AppSocketIoService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
        this.commentary = new Commentary();
        this.commentary.product = new Product();
        this.commentary.user = new User();
    }

  ngOnInit() {
    this.route.params.subscribe(
        params => {
          const idAnswer = params.id;
          this.commentaryService.getCommentary(idAnswer).subscribe(commentary => {
            this.commentary = commentary;
            this.uploadService.getUrl(commentary.idUser).subscribe(url => {
              commentary.user['image'] = url;
            });
          });
        }
      );
  }

  saveAnswer() {
    this.commentaryService.update(this.commentary).subscribe(commentary => {
      if (commentary) {
        this.commentaryService.getCommentary(commentary._id).subscribe( commentaryFull => {
          this.SocketIoService.sendAnswer( commentaryFull );
        });
        this.notificacionSnackBar.open( 'The comment was answered.', '', {
          duration: 3000,
        } );
      } else {
        this.notificacionSnackBar.open( 'There was a problem responding to the comment.', '', {
          duration: 3000,
        } );
      }
    });
  }

  isLogged() {
    return this.tokenService.decodeToken();
  }
}
