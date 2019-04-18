import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AuthenticationService, AppAlertService, } from 'src/app/_services';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

function compare(c: AbstractControl): any {
  if (!c.parent || !c) { return; }
  const pwd = c.parent.get('password');
  const cpwd = c.parent.get('c_password');
  if (!pwd || !cpwd) { return; }
  if (pwd.value !== cpwd.value) {
    return { invalid: true };
  }
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  private profile: FormGroup;
  private changepswdForm: FormGroup;
  private changeRoleForm: FormGroup;
  private profilePic: any;
  private user: any;
  public uploader: FileUploader = new FileUploader({});
  show_U_spinner: any = false;


  submitted: any;
  errMSG = '';
  successMSG = '';
  username: any = '';
  private modalRef;
  showThisDIV: any;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alert: AppAlertService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService) {
    auth.user.subscribe(output => {
      this.user = JSON.parse(output);
    });

  }

  ngOnInit(): void {
    this.titleService.setTitle('Edit profile');
    this.user = this.auth.getUser();
    this.profilePic = localStorage.getItem('profile_pic') + '?=' + Math.random();

    this.profile = this.formBuilder.group({
      userid: new FormControl(this.user.id),
      role: new FormControl(this.user.role),
      fname: new FormControl(this.user.fname, Validators.required),
      lname: new FormControl(this.user.lname, Validators.required),
      phone: new FormControl(this.user.phone_no, Validators.required),
      email: new FormControl(this.user.email, Validators.compose([Validators.required,
      Validators.pattern('^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
      ]))
    });

    this.changepswdForm = this.formBuilder.group({
      old_password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
      new_password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
      confirm_password: new FormControl('', Validators.compose([Validators.minLength(6), Validators.required])),
    }, { validator: this.passwordMatchValidator });

    this.changeRoleForm = this.formBuilder.group({
      role: new FormControl('4', Validators.required),
    });



  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['new_password'].value === frm.controls['confirm_password'].value ? null : { 'mismatch': true };
  }


  get f() {
    return this.changepswdForm.controls;
  }


  editSubmit(): void {
    this.auth.editProfile(this.profile).then((data: any) => {
      console.log(JSON.stringify(data));
      if (data['status'] === false && data['errors'] !== '') {
        this.alert.error(data.errors.email);
        this.profile.controls['email'].setErrors({ 'duplicate': data.errors.email });
      } else if (data['status']) {
        localStorage.setItem('user', JSON.stringify(data['data']));
        this.auth.updateUser(JSON.stringify(data['data']));
        this.alert.success('Profile updated.');
        this.router.navigate(['user-dashboard/user-profile']);
      }
    });
  }


  // upload profile image
  importFile(event: any) {
    if (event.target.files.length === 0) {
      return;
    } else {
      const file: File = event.target.files[0];
      this.uploadFIle(file);
    }
  }

  uploadFIle(file: any) {
    this.show_U_spinner = true;
    const formData = new FormData();
    formData.append('userid', this.user.id);
    formData.append('profile_image', file);
    this.auth.upload_dp(formData)
      .then((data: any) => {
        if (data['status'] === true) {
          localStorage.setItem('user', JSON.stringify(data['data']));
          localStorage.setItem('profile_pic', data['image']);
          this.auth.updateProfile_pic(data['image']);
          this.alert.success('Profile picture updated.');
          this.show_U_spinner = false;
          this.ngOnInit();
        } else {
          this.show_U_spinner = false;
          this.alert.error('Something went wrong. Try again later!');
        }
      });
  }

  openmodal_c_p(content) {
    this.modalRef = this.modalService.open(content);
    this.showThisDIV = true;
    this.successMSG = '';
    this.errMSG = '';
  }

  goback() {
    this.router.navigate(['user-dashboard/user-profile']);
  }

  change_my_pswd() {
    this.submitted = true;
    if (this.changepswdForm.invalid) {
      return;
    }
    this.auth.changepassword(this.changepswdForm.value, this.user)
      .subscribe((data: any) => {
        console.log(data);
        if (data['password_match'] && data['status']) {
          this.showThisDIV = false;
          this.successMSG = 'Password changed successfully';
        } else if (data.password_match === false && data.status === false) {
          this.showThisDIV = true;
          this.errMSG = '*Old password does not match';
        }
      });
  }

  change_my_role() {
    this.auth.changeRole(this.user.id).then((result) => {
      console.log(result);
      if (result['status']) {
        localStorage.setItem('user', JSON.stringify(result['data']));
        this.auth.updateUser(JSON.stringify(result['data']));
        this.alert.success('Congratulation! Your role updated.');
        this.modalRef.close();
      } else {
        this.alert.error('Something went wrong');
      }
    });
  }
}
