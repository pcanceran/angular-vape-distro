import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MediaQueryService } from '../../services/media-query/media-query.service';
import { VerifyEmailModalComponent } from '../../components/modals/verify-email-modal/verify-email-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  paramsSubscription: Subscription;
  par: string;

  verifyEmailSubscription: Subscription;
  verifyEmailModalHeight: string;
  verifyEmailModalWidth: string;

  constructor(private route: ActivatedRoute, private router: Router, private _mqService: MediaQueryService, private dialog: MatDialog) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( params => {
      this.par = params['param'];
      console.log("par " + this.par);
    });

    this.verifyEmailSubscription = this._mqService.verifyEmailModalLayoutStatus$
    .subscribe((layout: VerifyEmailLayout) => {
      this.verifyEmailModalHeight = layout.modalHeight;
      this.verifyEmailModalWidth = layout.modalWidth;
    })
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  sendVerification(){
    let dialog = this.dialog.open(VerifyEmailModalComponent,{
      width: this.verifyEmailModalWidth,
      height: this.verifyEmailModalHeight,
      data: ''
    })
  }
}

interface VerifyEmailLayout{
  modalHeight: string;
  modalWidth: string;
}
