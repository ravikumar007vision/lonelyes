import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppAlertService, AuthenticationService, UserService, MessagingService, DataService } from '../_services';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
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
  OwnerChatListing: any = [];


  noChatList: any = false;
  SearchResultList: any = [];
  sellerSpaceListing: any = [];


  chatHistory: any;
  receiver_pic: any;
  receiver_name: any;

  currentPerson: any;
  isProfile_pic: any = false;
  isRefreshing: any = false;
  noSearchFound: any = false;

  isSellerChecked: any = false;

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

    if (this.dataService.tempData) {
      this.space_id = this.incoming_space_id = this.dataService.tempData.space_id;
      this.incoming_space_name = this.dataService.tempData.space_name;
      this.receiver_id = this.incoming_receiver_id = this.dataService.tempData.space_owner;
    } else {
      this.space_id = 0;
      this.receiver_id = 0;
    }
    this.initiateChatting(0);      // 0 - renter 1 - seller
  }

  initiateChatting(space_id) {
    const body = { user_id: this.user.id, space_id: space_id, role: 1 };
    this.msg.getAllChatParticipants(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        let tt = [];
        result['data'].map((item, i) => {
          tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
        });

        // console.log(tt);
        // this.AllChatListing = this.SearchResultList = tt;

        tt.forEach(chat => {
          if (chat.space.owner_id == this.user.id) {
            this.SellerChatListing.push(chat);
          } else {
            this.OwnerChatListing.push(chat);
          }
        });
        this.AllChatListing = this.SearchResultList = this.OwnerChatListing;

        this.sellerSpaceListing = result['filter'];
        this.openChat(this.AllChatListing[0]);
        this.isFirstMessage();
        this.noChatList = false;
      } else if (result['data'] && !result['status']) {
        this.noChatList = true;
        this.AllChatListing = '';
        this.isFirstMessage();
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }

  isFirstMessage() {
    console.log('check first msg');
    if (this.space_id !== 0 && this.incoming_receiver_id !== 0) {
      const rt = this.AllChatListing.filter((x) => (x.space_id * 1 === this.space_id * 1 && x.uid * 1 === this.incoming_receiver_id * 1));
      if (rt[0]) {
        console.log('alreday chat started');
      } else {
        console.log('no chat started');
        this.modalRef = this.modalService.open(this.elementView);
      }
    }
  }

  getChatsBySpaceID(space_id) {
    console.log(space_id);
    this.initiateChattingBYFilter(space_id);
  }

  initiateChattingBYFilter(space_id) {
    const body = { user_id: this.user.id, space_id: space_id };
    this.msg.getAllChatParticipants(body).then((result) => {
      console.log(result);
      if (result['status'] && result['data']) {
        let tt = [];
        result['data'].map((item, i) => {
          tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
        });

        // this.AllChatListing = this.SearchResultList = tt;

        console.log(tt);
        let ss = [];
        let oo = [];

        tt.forEach(chat => {
          if (chat.space.owner_id == this.user.id) {
            ss.push(chat);
          }
        });
        this.AllChatListing = this.SearchResultList = ss;
        this.openChat(this.AllChatListing[0]);
        this.noChatList = false;
      } else if (result['data'] && !result['status']) {
        this.noChatList = true;
        this.AllChatListing = '';
      } else {
        this.alert.error('Something went wrong. Try again later');
      }
    });
  }



  openChat(cList) {
    this.isRefreshing = true;
    this.currentPerson = cList;

    const body = {
      sender_id: this.user.id,
      receiver_id: cList.uid,
      space_id: cList.space_id
    };
    this.msg.getPersonalChat(body).then((result) => {
      // console.log(result);
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

    // const body1 = { user_id: this.user.id, space_id: 0 };
    // this.msg.getAllChatParticipants(body1).then((result) => {
    //   if (result['status'] && result['data']) {
    //     let tt = [];
    //     result['data'].map((item, i) => {
    //       tt.filter(v => (v.uid === item.uid && v.space_id === item.space_id)).length === 0 && tt.push(item);
    //     });
    //     this.AllChatListing = this.SearchResultList = tt;
    //   } else {
    //     this.alert.error('Something went wrong. Try again later');
    //   }
    // });

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

          console.log('isSellerCheckd' + this.isSellerChecked);
          if (this.isSellerChecked) {
            console.log('seller part');
            this.initiateChatting(0);
          } else {
            console.log('renter part');
            // this.initiateChatting(0);

          }
          this.filterForm.controls['space_id'].setValue('0');
        } else {
          this.alert.error('Something went wrong');
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
          this.space_id = 0;
          this.initiateChatting(0);
        } else {
          this.alert.error('Something went wrong');
        }
      });
    }
  }


  onSearchChange(sTEXT: string) {
    const originalBigData = this.SearchResultList;
    let searchText = sTEXT.toLowerCase();
    searchText = searchText.trim();
    if (searchText.length > 1) {
      this.AllChatListing = [];
      for (let index = 0; index < this.SearchResultList.length; index++) {
        if ((this.SearchResultList[index]['name'].toLowerCase().indexOf(searchText) >= 0)) {
          this.AllChatListing.push(this.SearchResultList[index]);
        }
      }
      this.noSearchFound = (this.AllChatListing.length > 0) ? false : true;
    } else {
      this.AllChatListing = originalBigData;
      this.noSearchFound = false;
    }
  }

  doTrim(name, length) {
    return this.dataService.doTrim(name, length);
  }

  change_chat_role(role: any) {
    if (role === 1) {
      this.isSellerChecked = true;
      this.AllChatListing = this.SearchResultList = this.SellerChatListing;
      console.log('seller');
      console.log(this.SellerChatListing);
      this.openChat(this.AllChatListing[0]);
    } else {
      this.isSellerChecked = false;
      this.AllChatListing = this.SearchResultList = this.OwnerChatListing;
      this.openChat(this.AllChatListing[0]);
      console.log('buyer');
      console.log(this.OwnerChatListing);
    }

  }
}
