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
              private router: Router,
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
        this.notificacionSnackBar.open( 'El comentario fue respondido exitosamente.', '', {
          duration: 3000,
        } );
        this.router.navigate(['product', commentary.idProduct]);
      } else {
        this.notificacionSnackBar.open( 'Existio un problema al responder.', '', {
          duration: 3000,
        } );
      }
    }, err => {
      this.notificacionSnackBar.open( err.message, '', {
        duration: 3000,
      } );
    });
  }

  isLogged() {
    return this.tokenService.decodeToken();
  }
}
