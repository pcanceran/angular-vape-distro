import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-verify-email-modal',
  templateUrl: './verify-email-modal.component.html',
  styleUrls: ['./verify-email-modal.component.scss']
})
export class VerifyEmailModalComponent implements OnInit {
  email: string;
  errorMessages: string = "";
  successMessages: string = "";
  showError: boolean;
  showSuccess: boolean;

  constructor(public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<VerifyEmailModalComponent>) { }

  ngOnInit() {
  }

  cancel(){
    this.dialogRef.close();
  }

  submit(){
    this.errorMessages = "";
    this.successMessages = "";

    if (!this.email) {
      this.errorMessages = "Please enter your email!"
    } else {
      this.verifyEmail();
      //if success
     // this.successMessages = 'Thank you! You will receive an email shortly if a valid email address was entered.';
      console.log(' submitted!');
    }
  }

  verifyEmail(){

  }
}
