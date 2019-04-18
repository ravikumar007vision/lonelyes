import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { SpaceListingComponent } from './space-listing/space-listing.component';
// import { SingleSpaceSectionComponent } from './single-space-section/single-space-section.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { EnquiryComponent } from './enquiry/enquiry.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { BillingPageComponent } from './billing-page/billing-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { EditProfileComponent } from './user-profile/edit-profile/edit-profile.component';
import { AuthGuard } from './_guards/auth.guard';
import { ModifySpaceComponent } from './seller/modify-space/modify-space.component';
import { CreateSpaceComponent } from './seller/create-space/create-space.component';
import { SellerSpaceListingComponent } from './seller/seller-space-listing/seller-space-listing.component';
import { ExploreSpacesComponent } from './explore-spaces/explore-spaces.component';
import { ViewSpaceComponent } from './view-space/view-space.component';
import { SpaceReviewBeforeSubmissionComponent } from './seller/space-review-before-submission/space-review-before-submission.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { TermsOfUsesComponent } from './site_links/terms-of-uses/terms-of-uses.component';
import { PrivacyPolicyComponent } from './site_links/privacy-policy/privacy-policy.component';
import { SpaceReviewsComponent } from './space-reviews/space-reviews.component';
import { BookingsComponent } from './seller/bookings/bookings.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ChatComponent } from './chat/chat.component';
import { AdvocateProgramComponent } from './site_links/advocate-program/advocate-program.component';
import { SupportComponent } from './site_links/support/support.component';
import { CareersComponent } from './site_links/careers/careers.component';
import { PressMediaComponent } from './site_links/press-media/press-media.component';
import { ServicesComponent } from './site_links/services/services.component';
import { SellerGuard } from './_guards/seller.guard';




const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login&register', component: LoginSignupComponent, },
  { path: 'explore-spaces', component: ExploreSpacesComponent },
  { path: 'space-detail', component: ViewSpaceComponent },
  { path: 'space-reviews', component: SpaceReviewsComponent },
  { path: 'booking', component: BookingPageComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingPageComponent },
  // { path: 'chat1', component: ChatPageComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'terms-conditions', component: TermsOfUsesComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'advocate-program', component: AdvocateProgramComponent },
  { path: 'support', component: SupportComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'media&press', component: PressMediaComponent },
  { path: 'services', component: ServicesComponent },

  // {
  //   path: 'seller', component: BuyerDashboardComponent, children: [
  //     { path: 'modify-space', component: ModifySpaceComponent },
  //     { path: 'review-space', component: SpaceReviewBeforeSubmissionComponent },
  //   ]
  // },
  {
    path: 'user-dashboard', component: UserDashboardComponent, children: [
      { path: '', redirectTo: 'user-profile', pathMatch: 'full' },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
      { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
      { path: 'enquiry', component: EnquiryComponent },
      { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },
      { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
      { path: 'watchlist', component: WatchListComponent, canActivate: [AuthGuard] },
      { path: 'create-space', component: CreateSpaceComponent, canActivate: [AuthGuard, SellerGuard], },
      { path: 'modify-space', component: ModifySpaceComponent, canActivate: [AuthGuard] },
      { path: 'review-space', component: SpaceReviewBeforeSubmissionComponent, canActivate: [AuthGuard] },
      { path: 'seller-space-listing', component: SellerSpaceListingComponent, canActivate: [AuthGuard] },
    ], canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule,
  ],
  declarations: []
})
export class AppRoutingModule { }
