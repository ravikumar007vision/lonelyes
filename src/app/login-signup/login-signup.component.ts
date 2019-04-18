import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, UserService, AppAlertService } from '../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { C } from '@angular/core/src/render3';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'angular-6-social-login';



function passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c) { return; }
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('c_password');
  if (!pwd || !cpwd) { return; }
  if (pwd.value !== cpwd.value) {
    return { invalid: true };
  }
}

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {
  @ViewChild('verifyme') elementView: ElementRef;

  loginForm: FormGroup;
  registrationFrom: FormGroup;
  verifyForm: FormGroup;
  private forgetForm: FormGroup;
  private resetpswdForm: FormGroup;
  userRole: any = 3;
  public TnC: any = 1;
  public modalRef: any;
  public newuser: any;

  resend_mail: any = false;
  show_L_spinner: any = false;
  show_R_spinner: any = false;

  show_resend_spinner: any = false;
  show_verify_spinner: any = false;
  show_forget_spinner: any = false;
  show_reset_spinner: any = false;


  private reqEmail: any;
  submittedforgetPSWD: any;
  submittedReset: any;
  hideFirst: any;
  showTokenSendMsg: any;
  errMSG = '';
  successMSG = '';
  errToken = '';

  returnUrl: any;
  tncData: any;
  tc_val: any = false;

  public barLabel = 'Password:';
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private alert: AppAlertService,
    private auth: AuthenticationService,
    // private socialAuthService: AuthService,
    private modalService: NgbModal) {
    if (localStorage.getItem('user') !== null) {
      this.router.navigate(['home']);
    }
    this.submittedforgetPSWD = false;
    this.submittedReset = false;
    this.hideFirst = true;
    this.showTokenSendMsg = false;
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
      ]))
    });

    this.verifyForm = this.formBuilder.group({
      verification_code: new FormControl('', Validators.required),
      user_id: new FormControl(' '),
    });

    this.registrationFrom = this.formBuilder.group({
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      // company: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      role: new FormControl('4'),
      c_password: new FormControl('', [Validators.required, passwordConfirming, Validators.minLength(6), Validators.maxLength(15)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
      ])),
      TnC: new FormControl('', Validators.required),
    });

    this.forgetForm = this.formBuilder.group({
      email: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
    });

    this.resetpswdForm = this.formBuilder.group({
      email: new FormControl({ value: '', disabled: true }, Validators.required),
      token: new FormControl('', [Validators.compose([Validators.required])]),
      password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
      cpassword: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
    }, { validator: this.passwordMatchValidator });

  }

  get fp() {
    return this.forgetForm.controls;
  }
  get resetpd() {
    return this.resetpswdForm.controls;
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['cpassword'].value ? null : { 'mismatch': true };
  }



  doLogin(): void {
    this.show_L_spinner = true;
    this.auth.tryLogin(this.loginForm).then((data: any) => {
      console.log(JSON.stringify(data));
      if (data['error'] && data['verify_pending']) {
        this.newuser = data['user']['id'];
        this.verifyForm.controls['user_id'].setValue(data['user']['id']);
        this.show_L_spinner = false;
        this.open(this.elementView);
      } else if (data['error']) {
        this.loginForm.controls['password'].setErrors({ 'unmatched': data['error'] });
        this.show_L_spinner = false;
        // this.alert.error('Password mismatch!');
        this.alert.error(data['error']);
      } else {
        localStorage.setItem('user', JSON.stringify(data['user']));
        localStorage.setItem('profile_pic', data['image']);
        this.show_L_spinner = false;
        this.alert.success('Login successful!');
        this.auth.updateUser(JSON.stringify(data['user']));
        this.auth.updateProfile_pic(data['image']);
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl);
        }, 250);
      }
    });
  }


  verifySubmit(): void {
    this.show_verify_spinner = true;
    this.auth.verifyemail(this.verifyForm).subscribe((data) => {
      this.show_verify_spinner = false;
      if (data['errors']) {
        this.verifyForm.controls['verification_code'].setErrors({ 'unmatched': data['errors']['invalid'] });
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        this.modalRef.close();
        this.router.navigate(['/']);
        window.location.reload();
      }
    });
  }


  public tNcChange(e) {
    if (e.target.checked) {
      this.TnC = 1;
      this.tc_val = true;
      this.registrationFrom.controls['TnC'].setErrors(null);
    } else {
      this.TnC = 0;
      this.tc_val = false;
      this.registrationFrom.controls['TnC'].setErrors({ 'custom': true });
    }
  }

  tc_clicked(val) {
    if (val === 1) {
      this.registrationFrom.controls['TnC'].setErrors(null);
      this.tc_val = true;
      this.modalRef.close();
    } else {
      this.tc_val = false;
      this.registrationFrom.controls['TnC'].setErrors({ 'custom': true });
      this.modalRef.close();
    }
  }
  // chnageRole(role) {
  //   this.userRole = role;
  // }

  onFirstPasswordChange() {
    const cpass = this.registrationFrom.controls['c_password'].value;
    const pass = this.registrationFrom.controls['password'].value;
    if (cpass !== '' && cpass !== pass) {
      this.registrationFrom.controls['c_password'].setErrors({ 'mismatch': 'Password does not match.' });
    } else {
      console.log('good');
    }
  }

  RegisterUser(): void {
    // this.registrationFrom.controls['role'].setValue(this.userRole);
    this.registrationFrom.controls['role'].setValue(4);
    this.show_R_spinner = true;

    this.auth.tryRegister(this.registrationFrom).subscribe((data) => {
      this.registrationFrom.reset();
      this.tc_val = false;
      if (data['errors'] && data['errors']['email']) {
        this.registrationFrom.controls['email'].setErrors({ 'duplicate': data['errors']['email'] });
        this.alert.error('This email address is already registered , Try Login!');
        this.show_R_spinner = false;
      } else {
        this.verifyForm.controls['user_id'].setValue(data['user']['id']);
        this.newuser = data['user']['id'];
        this.alert.success('We have sent you a verification code to your email.');
        this.show_R_spinner = false;
        this.open(this.elementView);
      }
    });
  }

  open(content) {
    this.modalRef = this.modalService.open(content);
  }

  openmodal(content) {
    this.modalRef = this.modalService.open(content);
  }

  resendMail() {
    this.show_resend_spinner = true;
    this.verifyForm.controls['verification_code'].reset();
    this.auth.resendemail(this.newuser).subscribe((data) => {
      this.show_resend_spinner = false;
      if (data['errors']) {
        this.resend_mail = false;
        this.alert.error('Something Went wrong. Try again!');
      } else {
        this.resend_mail = true;
        this.alert.success('Verification code sent!');
        setTimeout(() => {
          this.resend_mail = false;
        }, 2000);
      }
    });
  }

  forgetUser() {
    this.submittedforgetPSWD = true;
    if (this.forgetForm.invalid) {
      return false;
    } else {
      this.show_forget_spinner = true;
      this.auth.forgetpassword(this.forgetForm.value).subscribe((data: any) => {
        console.log(data);
        this.show_forget_spinner = false;
        if (data.data.send_tokken === true) {
          this.showTokenSendMsg = true;
          this.reqEmail = this.forgetForm.get('email').value;
          this.resetpswdForm.controls['email'].setValue(this.reqEmail);
        }
      });
    }

  }

  resetpswd() {
    this.submittedReset = true;
    if (this.resetpswdForm.invalid) {
      return;
    } else {
      this.show_reset_spinner = true;
      this.auth.resetForgottenpswd(this.resetpswdForm.value, this.reqEmail).subscribe((data: any) => {
        console.log(data);
        this.show_reset_spinner = false;
        if (data.message === 'This password reset token is invalid.' && data.data !== '') {
          this.errToken = data.message;
        } else if (data.message === 'Your password has been reset!' && data.data == null) {
          this.successMSG = data.message;
          this.showTokenSendMsg = false;
          this.hideFirst = false;
        }
      });
    }
  }

  getTC() {
    console.log('tc');
    this.userService.terms_conditions().then((response) => {
      console.log(response);
      if (response['status']) {
        this.tncData = response['data'];
      }
    });
  }
  pswdSTR() {
    console.log('keo');
  }

  // public socialSignIn(socialPlatform: string) {
  //   let socialPlatformProvider;
  //   if (socialPlatform == 'facebook') {
  //     socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
  //   } else if (socialPlatform == 'google') {
  //     socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
  //   } else if (socialPlatform == 'linkedin') {
  //     socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
  //   }

  //   this.socialAuthService.signIn(socialPlatformProvider).then(
  //     (userData) => {
  //       console.log(socialPlatform + ' sign in data : ', userData);
  //       // Now sign-in with userData
  //       console.log('email:', userData.email);
  //       console.log('name:', userData.name);
  //       console.log('image:', userData.image);
  //       console.log('provider:', userData.provider);
  //       // token+id+idToken

  //       this.continueSocial_Login(userData)
  //       // ...
  //     }
  //   );
  // }

  // continueSocial_Login(userData: any) {

  // }
}
