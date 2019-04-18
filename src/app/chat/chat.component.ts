import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppAlertService, AuthenticationService, UserService, MessagingService, DataService } from '../_services';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {



  @ViewChild('firstMessage') elementView: ElementRef;

  user: any;
  space_id: any;
  incoming_space_name: any;
  incoming_space_id: any;
  filterForm: FormGroup;
  messageForm: FormGroup;

  sender_id: any;
  receiver_id: any;
  incoming_receiver_id: any;
  private modalRef: any;
  picURL = environment.profilePicURL;


  AllChatListing: any = [];
  SellerChatListing: any = [];
  RenterChatListing: any = [];


  noChatList: any = false;
  SearchChatListSelller: any = [];
  SearchChatListRenter: any = [];
  sellerSpaceListing: any = [];


  chatHistory: any;
  receiver_pic: any;
  receiver_name: any;

  currentPerson: any;
  isProfile_pic: any = false;
  isRefreshing: any = false;
  noSearchFound: any = false;

  isSellerChecked: boolean;
  roleState = new BehaviorSubject(2);

  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalService: NgbModal,
    private alert: AppAlertService,
    private msg: MessagingService,
    private titleService: Title) {
    this.user = this.userService.getUserData() || [];
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }


  ngOnInit() {
    this.titleService.setTitle('Chat : : Lonely Spaces');
    this.filterForm = this.formBuilder.group({
      space_id: new FormControl('0'),
      searchText: new FormControl('')
    });

    this.messageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });

    this.roleState.subscribe(value => {
      console.log(value);
      if (value === 1) {
        this.isSellerChecked = true;
        this.getSellerChatListing(0);
      } else {
        this.isSellerChecked = false;
        this.getRenterChatListing();
      }
    });

    if (this.dataService.tempData) {
      this.space_id = this.incoming_space_id = this.dataService.tempData.space_id;
      this.incoming_space_name = this.dataService.tempData.space_name;
      this.receiver_id = this.incoming_receiver_id = this.dataService.tempData.space_owner;
    } else {
      this.space_id = 0;
      this.incoming_receiver_id = 0;
    }
  }
  scrollToBottom() {
    // console.log('sdddddd');

    // const element = document.getElementById('myList');
    // element.scrollIntoView
    // element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });


  }

  getSellerChatListing(space_id) {
    console.log('get seller list');
    const body = { user_id: this.user.id, space_id: space_id, role: 1 };
    this.msg.getAllChatParticipants(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        let tt = [];
        result['data'].map((item, i) => {
          tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
        });

        this.SellerChatListing = this.SearchChatListSelller = tt;
        this.sellerSpaceListing = result['filter'];
        this.openChat(this.SellerChatListing[0]);
        this.noChatList = false;
      } else if (result['data'] && !result['status']) {
        this.noChatList = true;
        this.SellerChatListing = '';
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }



  getChatsBySpaceID(space_id) {
    console.log(space_id);
    this.getSellerChattingBYFilter(space_id);
  }

  getSellerChattingBYFilter(space_id) {
    const body = { user_id: this.user.id, space_id: space_id, role: 1 };
    // this.space_id = (space_id === 0) ? 0 : space_id;
    this.msg.getAllChatParticipants(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        let tt = [];
        result['data'].map((item, i) => {
          tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
        });

        this.SellerChatListing = this.SearchChatListSelller = tt;
        this.sellerSpaceListing = result['filter'];
        this.openChat(this.SellerChatListing[0]);
        this.noChatList = false;
      } else if (result['data'] && !result['status']) {
        this.noChatList = true;
        this.SellerChatListing = '';
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }


  getRenterChatListing() {
    console.log('renter chat');
    const body = { user_id: this.user.id, space_id: 0, role: 2 };
    this.msg.getAllChatParticipants(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        let tt = [];
        result['data'].map((item, i) => {
          tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
        });

        this.RenterChatListing = this.SearchChatListRenter = tt;
        this.openChat(this.RenterChatListing[0]);
        this.isFirstMessage();
        this.noChatList = false;
      } else if (result['data'] && !result['status']) {
        this.noChatList = true;
        this.RenterChatListing = [];
        this.isFirstMessage();
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }


  // check is this first message
  isFirstMessage() {
    console.log('check first msg');
    console.log(this.incoming_space_id);
    console.log(this.incoming_receiver_id);

    if (this.incoming_space_id !== 0 && this.incoming_receiver_id !== 0) {
      const rt = this.RenterChatListing.filter((x) => (x.space_id * 1 === this.incoming_space_id * 1 && x.uid * 1 === this.incoming_receiver_id * 1));
      if (rt[0]) {
        console.log('alreday chat started');
      } else {
        console.log('no chat started');
        this.modalRef = this.modalService.open(this.elementView);
      }
    }
  }

  openChat(cList) {
    this.isRefreshing = true;
    this.currentPerson = cList;
    const body = { sender_id: this.user.id, receiver_id: cList.uid, space_id: cList.space_id };
    this.msg.getPersonalChat(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        this.chatHistory = result['data'];
        this.receiver_pic = this.picURL + '/' + cList.uid + '/' + cList.profile_image;
        this.receiver_name = cList.name;
        this.space_id = cList.space_id;
        this.receiver_id = cList.uid * 1;
        this.isRefreshing = false;
        this.isProfile_pic = (cList.profile_image != null) ? true : false;
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }

  refresh() {
    this.openChat(this.currentPerson);
  }

  sendMessage() {
    if (this.space_id) {
      const body = {
        sender_id: this.user.id,
        receiver_id: this.receiver_id,
        message: this.messageForm.controls['message'].value,
        space_id: this.space_id
      };
      // console.log(body);
      this.msg.sendMSG(body).then((result) => {
        console.log('msg sent');
        if (result['status']) {
          this.messageForm.reset();
          this.openChat(this.currentPerson);
          if (this.isSellerChecked) {
            this.getSellerChattingBYFilter(0);
            this.filterForm.controls['space_id'].setValue(0);
          } else {
            this.getRenterChatListing();
          }
        } else {
          this.alert.error('Failed. Something went wrong');
        }
      });
    }
  }



  sendFirstMSg() {
    console.log(this.messageForm.value);
    if (this.incoming_space_id !== 0) {
      const body = {
        sender_id: this.user.id,
        receiver_id: this.incoming_receiver_id,
        message: this.messageForm.controls['message'].value,
        space_id: this.incoming_space_id
      };
      this.msg.sendMSG(body).then((result) => {
        console.log(result);
        if (result['status']) {
          this.messageForm.reset();
          this.modalService.dismissAll();
          this.incoming_space_id = 0;
          this.getRenterChatListing();
        } else {
          this.alert.error('Something went wrong');
        }
      });
    }
  }


  onSearchChangeSS(sTEXT: string) {
    const originalBigData = this.SearchChatListSelller;
    let searchText = sTEXT.toLowerCase();
    searchText = searchText.trim();
    let ss = [];

    if (searchText.length > 1) {
      // this.SellerChatListing = [];
      for (let index = 0; index < this.SearchChatListSelller.length; index++) {
        if ((this.SearchChatListSelller[index]['name'].toLowerCase().indexOf(searchText) >= 0)) {
          ss.push(this.SearchChatListSelller[index]);
        }
      }
      this.noSearchFound = (ss.length > 0) ? false : true;
      this.SellerChatListing = ss;
    } else {
      this.SellerChatListing = originalBigData;
      this.noSearchFound = false;
    }
  }


  onSearchChangeRR(sTEXT: string) {
    const originalBigData = this.SearchChatListRenter;
    let searchText = sTEXT.toLowerCase();
    searchText = searchText.trim();
    let ss = [];

    if (searchText.length > 1) {
      // this.SellerChatListing = [];
      for (let index = 0; index < this.SearchChatListRenter.length; index++) {
        if ((this.SearchChatListRenter[index]['name'].toLowerCase().indexOf(searchText) >= 0)) {
          ss.push(this.SearchChatListRenter[index]);
        }
      }
      this.noSearchFound = (ss.length > 0) ? false : true;
      this.RenterChatListing = ss
    } else {
      this.RenterChatListing = originalBigData;
      this.noSearchFound = false;
    }
  }



  doTrim(name, length) {
    return this.dataService.doTrim(name, length);
  }

  change_chat_role(role: any) {
    this.filterForm.controls['searchText'].reset();
    this.noSearchFound = false;
    if (role === 1) {
      this.roleState.next(1);
      this.filterForm.controls['space_id'].setValue(0);
    } else {
      this.roleState.next(2);
    }
  }

  closeModal() {
    this.incoming_space_id = 0;
    this.dataService.tempData = { space_id: 0, space_owner: 0 };
  }
  ngOnDestroy(): void {
    this.incoming_space_id = 0;
    this.dataService.tempData = { space_id: 0, space_owner: 0 };
  }
}
