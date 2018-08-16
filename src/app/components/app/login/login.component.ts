import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../../services/customer/customer.service';
import { Subscription } from 'rxjs';
import { MediaQueryService } from '../../../services/media-query/media-query.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ForgotPasswordComponent } from '../../modals/forgot-password/forgot-password.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  email: string;
  expanded: boolean;
  @Input() logged: boolean;
  loginAttemptSubscription: Subscription;
  logAttemptMessage: string;
  ForgotPasswordSubscription: Subscription;
  forgotPasswordHeight: string;
  forgotPasswordWidth: string;

  constructor(private _customer: CustomerService, public dialog: MatDialog, private _mqService: MediaQueryService,private router: Router) {
    this.username = '';
    this.password = '';
    this.email = '';
    this.expanded = false;

    this.ForgotPasswordSubscription = _mqService.forgotPasswordLayoutStatus$
    .subscribe((layout: ForgotPasswordLayout) => {
      this.forgotPasswordHeight = layout.modalHeight;
      this.forgotPasswordWidth = layout.modalWidth;
    })
  }

  ngOnInit() {
    this.loginAttemptSubscription = this._customer.loggedSuccess$
      .subscribe( message => this.logAttemptMessage = message );
  }

  toggleLogin() {
    this.expanded = this.expanded ? false : true;
  }

  attemptLogin() {
    this._customer.login(this.username, this.password);
    this.username = '';
    this.password = '';
  }

  userLog(){ //to login when button is clicked
    console.log("userLogin() entered.");
    this._customer.userLogin();
  }

  openForgotPassword(){
    let dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: this.forgotPasswordWidth,
      height: this.forgotPasswordHeight
    })
  }

  emailReset() {
    this._customer.passwordResetEmail(this.email);
    // inform if email exists they will recieve an email
  }

  verifyEmail(prms: string) {
    console.log("param is " + prms);
  //  if(prms === 'notify'){
      this.router.navigate(['verify-email', prms]);
    // }
    // else{
    //   console.log("not notify");  
    //   console.log("param is " + prms);
    // }
  }



}

interface ForgotPasswordLayout {
  modalHeight: string,
  modalWidth: string
}