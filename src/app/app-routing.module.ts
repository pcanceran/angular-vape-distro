import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules  } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { SupportTicketPageComponent } from './pages/support-ticket-page/support-ticket-page.component';
import { PasswordResetPageComponent } from './pages/password-reset-page/password-reset-page.component';
import { AuthGuard } from './services/auth/auth.guard';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/trudo', pathMatch: 'full' },
  { path: 'trudo', component: LandingPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'products/:type', component: ProductsPageComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountPageComponent, canActivate: [AuthGuard] },
  { path: 'order-checkout', component: CheckoutPageComponent, canActivate: [AuthGuard] },
  { path: 'support-ticket', component: SupportTicketPageComponent, canActivate: [AuthGuard] },
  { path: 'password-reset', component: PasswordResetPageComponent, canActivate: [AuthGuard] },
  { path: 'password-reset/:id/:token', component: PasswordResetPageComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/:param', component: VerifyEmailComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}