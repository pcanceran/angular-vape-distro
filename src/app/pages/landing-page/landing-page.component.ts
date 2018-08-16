import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer/customer.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  username: string;
  password: string;
  
  constructor(private router: Router, private _customer: CustomerService) { }

  ngOnInit() {
  }

  getIn(){
    console.log("Entered");
    this._customer.userLogin();
    this.router.navigate(['home']);
  }
}
