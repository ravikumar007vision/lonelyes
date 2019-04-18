import { BrowserModule } from '@angular/platform-browser';

import { AuthenticationService, UserService, AppAlertService, DataService, SpaceService } from './_services';
import { TooltipModule } from 'ng2-tooltip-directive';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { Ng2ImgMaxModule } from 'ng2-img-max';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng5SliderModule } from 'ng5-slider';
import { DateRangePickerModule } from '@uiowa/date-range-picker';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HalfCircleSpinnerModule } from 'angular-epic-spinners';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';


import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { BookingPageComponent } from './booking-page/booking-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { BillingPageComponent } from './billing-page/billing-page.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { WatchListComponent } from './watch-list/watch-list.component';
import { ChatPageComponent } from './chat-page/chat-page.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';
import { AlertsModule } from 'angular-alert-module';
import { EditProfileComponent } from './user-profile/edit-profile/edit-profile.component';
import { CreateSpaceComponent } from './seller/create-space/create-space.component';
import { SellerSpaceListingComponent } from './seller/seller-space-listing/seller-space-listing.component';
import { ModifySpaceComponent } from './seller/modify-space/modify-space.component';
import { SiteFooterComponent } from './site-footer/site-footer.component';
import { FooterComponent } from './site-footer/footer/footer.component';
import { SubscribeSectionComponent } from './site-footer/subscribe-section/subscribe-section.component';
import { CopyRightComponent } from './site-footer/copy-right/copy-right.component';
import { SliderComponent } from './home/slider/slider.component';
import { FeaturedSpaceComponent } from './home/featured-space/featured-space.component';
import { RewardSectionComponent } from './home/reward-section/reward-section.component';
import { SearchByCategoryComponent } from './home/search-by-category/search-by-category.component';
import { RentSectionComponent } from './home/rent-section/rent-section.component';
import { CustomerTestimonialComponent } from './home/customer-testimonial/customer-testimonial.component';
import { ExploreSpacesComponent } from './explore-spaces/explore-spaces.component';
import { ViewSpaceComponent } from './view-space/view-space.component';
import { SpaceReviewBeforeSubmissionComponent } from './seller/space-review-before-submission/space-review-before-submission.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PrivacyPolicyComponent } from './site_links/privacy-policy/privacy-policy.component';
import { TermsOfUsesComponent } from './site_links/terms-of-uses/terms-of-uses.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TokenInterceptor } from './auth/token.interceptor';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SpaceReviewsComponent } from './space-reviews/space-reviews.component';
import { BookingsComponent } from './seller/bookings/bookings.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ChatComponent } from './chat/chat.component';
import { from } from 'rxjs';
import { CareersComponent } from './site_links/careers/careers.component';
import { AdvocateProgramComponent } from './site_links/advocate-program/advocate-program.component';
import { PressMediaComponent } from './site_links/press-media/press-media.component';
import { SupportComponent } from './site_links/support/support.component';
import { ServicesComponent } from './site_links/services/services.component';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('1985344801591731')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('975148129418-p59ssflecnu1rr9m29aigkdg43hlcfs9.apps.googleusercontent.com')
      },
      {
        id: LinkedinLoginProvider.PROVIDER_ID,
        provider: new LinkedinLoginProvider('1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com')
      },
    ]);
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    SliderComponent,
    FeaturedSpaceComponent,
    RewardSectionComponent,
    SearchByCategoryComponent,
    RentSectionComponent,
    CustomerTestimonialComponent,
    SubscribeSectionComponent,
    CopyRightComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginSignupComponent,
    BookingPageComponent,
    UserProfileComponent,
    EditProfileComponent,
    EnquiryComponent,
    BillingPageComponent,
    ReservationsComponent,
    BookingsComponent,
    WatchListComponent,
    ChatPageComponent,
    CreateSpaceComponent,
    SellerSpaceListingComponent,
    ModifySpaceComponent,
    SiteFooterComponent,
    ExploreSpacesComponent,
    ViewSpaceComponent,
    SpaceReviewBeforeSubmissionComponent,
    UserDashboardComponent,
    PrivacyPolicyComponent,
    TermsOfUsesComponent,
    SpaceReviewsComponent,
    ContactUsComponent,
    ChatComponent,
    CareersComponent,
    AdvocateProgramComponent,
    PressMediaComponent,
    SupportComponent,
    ServicesComponent,
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    NgbModule,
    AppRoutingModule,
    TooltipModule,
    FileUploadModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileDropModule,
    Ng2ImgMaxModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    HalfCircleSpinnerModule,
    SocialLoginModule,
    DateRangePickerModule,
    PasswordStrengthBarModule,
    AlertsModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [
    AuthenticationService,
    UserService,
    AppAlertService,
    DataService,
    SpaceService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
