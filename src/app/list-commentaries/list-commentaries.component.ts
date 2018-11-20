import { Component, OnInit, OnDestroy } from '@angular/core';
import { Commentary } from '../models/commentary';
import { CommentaryService } from '../services/commentary.service';
import { Router } from '@angular/router';
import { ShareCommentariesService } from '../services/sharedCommentaries.service';
import { Subscription } from 'rxjs';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-list-commentaries',
  templateUrl: './list-commentaries.component.html',
  styleUrls: ['./list-commentaries.component.css']
})
export class ListCommentariesComponent implements OnInit, OnDestroy {

  news: Commentary[];
  othersCommentaries: Commentary[];
  $commentaries: Subscription;
  constructor(private router: Router,
              private commentaryService: CommentaryService,
              private uploadService: UploadService,
              private shareCommentariesService: ShareCommentariesService) {
    this.news = [];
    this.othersCommentaries = [];
  }

  ngOnInit() {
    this.$commentaries = this.shareCommentariesService.commentariesSource.subscribe(commentaries => {
      this.news = commentaries;
      this.othersCommentaries = this.news;
      if (this.news) {
        this.news.forEach(commentary => {
          this.uploadService.getUrl(commentary.product.idUser).subscribe(url => {
            commentary.product.user['image'] = url;
          });
          this.uploadService.getUrl(commentary.idUser).subscribe(url => {
            commentary.user['image'] = url;
          });
        });
        this.commentaryService.getOldAnswers().subscribe(oldAnswers => {
          this.othersCommentaries = this.othersCommentaries.concat(oldAnswers);
          this.commentaryService.getCommentariesWithoutAnswer().subscribe(oldCommentaries => {
            this.othersCommentaries = this.othersCommentaries.concat(oldCommentaries);
            this.othersCommentaries.forEach(commentary => {
              this.uploadService.getUrl(commentary.product.idUser).subscribe(url => {
                commentary.product.user['image'] = url;
              });
              this.uploadService.getUrl(commentary.idUser).subscribe(url => {
                commentary.user['image'] = url;
              });
            });
          });
        });
      }
    });
  }

  openCommentary(commentary: Commentary) {
    if (!commentary.viwedClient || !commentary.viwedPO) {
      if (commentary.answer && !commentary.viwedClient) {
        commentary.viwedClient = true;
      } else if (!commentary.answer && !commentary.viwedPO) {
        commentary.viwedPO = true;
      }
      this.commentaryService.update(commentary).subscribe(commentaryUpdated => {
        // tslint:disable-next-line:triple-equals
        this.news = this.news.filter(comment => comment._id != commentary._id);
        this.shareCommentariesService.sendCommentaries(this.news);
        if (!commentary.answer) {
          this.router.navigate(['answer', commentary._id]);
        } else {
          this.router.navigate(['product', commentary.idProduct]);
        }
      });
    } else {
      this.router.navigate(['product', commentary.idProduct]);
    }
  }

  ngOnDestroy() {
    this.$commentaries.unsubscribe();
  }
}
