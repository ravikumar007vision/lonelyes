import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../../environments/environment';
import { RequestOptions } from '@angular/http';
import { sp } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  constructor(private http: HttpClient) { }

  createSpace(spaceForm: any, files: any, publish: any, not_avail_ar: any) {
    const body = {
      spaceTitle: spaceForm.spaceTitle,
      space_type: spaceForm.spaceType,
      capacity_of_space: spaceForm.spaceCapacity,
      other_capacity_of_space: spaceForm.otherSpaceCapacity,
      overview: spaceForm.spaceDescribe,

      address1: spaceForm.inputAddress,
      address2: spaceForm.inputAddress2,
      city: spaceForm.inputCity,
      state: spaceForm.inputState,
      postcode: spaceForm.inputZip,

      from_date: spaceForm.from_date,
      to_date: spaceForm.to_date,

      pricetype: spaceForm.priceType,
      pricerate: spaceForm.price,
      minbookingdays: spaceForm.minbookingdays,
      minbookinghours: spaceForm.minbookinghours,

      cancel_policy: spaceForm.cancel_policy,
      amenities_id: spaceForm.amenity,
      otheramenities: spaceForm.otherAmenities,
      ruleofuse: spaceForm.rulesOfUse,
      owner_id: spaceForm.owner_id,
      publish: publish,
      fileUpload: files,
      not_avail_ar: not_avail_ar
    };

    // console.log(JSON.stringify(body));
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/addspace', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // modify space
  modifySpace(spaceForm, old, files, not_avail_ar: any) {
    // console.log(JSON.stringify(spaceForm));
    // console.log(JSON.stringify(old));

    const body = {
      spaceTitle: spaceForm.spaceTitle,
      space_type: spaceForm.spaceType,
      capacity_of_space: spaceForm.spaceCapacity,
      other_capacity_of_space: spaceForm.otherSpaceCapacity,
      overview: spaceForm.spaceDescribe,

      address1: spaceForm.inputAddress,
      address2: spaceForm.inputAddress2,
      city: spaceForm.inputCity,
      state: spaceForm.inputState,
      postcode: spaceForm.inputZip,

      from_date: spaceForm.from_date,
      to_date: spaceForm.to_date,
      pricetype: spaceForm.priceType,
      pricerate: spaceForm.price,
      minbookingdays: spaceForm.minbookingdays,
      minbookinghours: spaceForm.minbookinghours,

      cancel_policy: spaceForm.cancel_policy,
      amenities_id: spaceForm.amenity,
      otheramenities: spaceForm.otherAmenities,
      ruleofuse: spaceForm.rulesOfUse,
      owner_id: spaceForm.owner_id,
      publish: spaceForm.publish,
      id: spaceForm.spaceId,
      hidden_img: old,
      fileUpload: files,
      not_avail_ar: not_avail_ar
    };
    // console.log(JSON.stringify(body));

    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/updatespace', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get all required data for creating space in create new space page
  getCreateSpaceFormData(body) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getFormData', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        });
    });

  }

  // get cities list of a state
  getCityList(state_id) {
    const body = { 'state_id': state_id };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/City', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        });
    });
  }

  // get all space created by a user
  SellerSpaceList(userID) {
    const body = { userID: userID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getSpaces', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }




  // get Data of Space to modify
  getModifySpaceData(userID, spaceID) {
    const body = { userID: userID, spaceID: spaceID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getModifySpaces', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // delete space by the owner
  deleteSpace(user: any, spaceID: any) {
    // console.log(user);
    const body = { userID: user.id, spaceID: spaceID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/delspace', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // get featured space on home page
  getFeaturedSpaces() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getFeaturedSpaces', 'xyz', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // view a particular space
  viewSpace(data) {
    // const body = { 'id': spaceID , user_id: userID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/viewSpaces', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // contact seller for enquiry
  contactSeller(data, owner_id) {
    const body = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      owner_id: owner_id
    };

    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/SpaceOwnerContact', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // get similar spaces
  getSimilarSpaces() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/SimilarSpace', 'ff', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // wishlist toggle
  toggleWishlist(userID, spaceID) {
    const body = { user_id: userID, space_id: spaceID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/AddRemoveWishlist', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get all wishlisted spaces
  getWishListedSpaces(userID) {
    const body = { user_id: userID };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/MyWishlist', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get spacetype with icon and bc images
  getAllcategories() {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getCategorySpace', 'xyz', {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });

  }

  // explore or searchSpaces
  searchSpaces(data, offset) {
    // console.log(data);
    const body = {
      searchtext: data.searchText,
      spacetype: data.spaceType,
      state: data.inputState,
      city: data.inputCity,
      min_price: data.price[0] || '0',
      max_price: data.price[1] || '',
      timebase: data.time_base,
      offset: offset,
      sort_by: data.sort_by,
      order: data.order
    };

    console.log(JSON.stringify(body));
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/SpaceSearchDetail', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // home page slider search
  searchSpaceList(searchWord) {
    const body = { search: searchWord };
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/ExploreSpaceSearch', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }
  //book space
  book_space(data) {
    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/bookingSpaces', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }
  // get all bookings/reservations
  getBookings(userID: any, type) {
    const body = { user_id: userID, type: type };

    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/getbookings', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }
  // post feedback for booking
  postSpaceFeedback(user_id, space_id, booking_id, form_data) {
    const body = {
      user_id: user_id,
      booking_id: booking_id,
      space_id: space_id,
      rate: form_data.rating_stars,
      review: form_data.feedback,
    };
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/SpaceReviews', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // get feedback of specific space booking
  getFeedback(booking_id, space_id, user_id) {
    const body = { user_id: user_id, space_id: space_id, booking_id: booking_id };
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/GetOneSpaceReview', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // give rating to renter
  rateYourRenter(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/AddBuyerReview', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get the Renter Rating for updation
  getRenterRating(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/ViewSingleBuyerReview', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get all reviews of a space
  getAllReviews(space_id) {
    const body = { space_id: space_id };
    console.log(body);
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/GetReviewsBySpace', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get all reviews of a renter
  getRenterRatings(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/GetBuyerReview', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // booking Approval from seller/owner
  booking_approval(body) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/ChangeBookingStatus', JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }

  // get Extra info on booking page like rate,reviews and similar spaces
  getExtraInfoOnBookingPage(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/SimilarSpaceBook', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }


  // make payment
  makePayment(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiURL + '/PaymentSuccess', JSON.stringify(data), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
      })
        .subscribe(res => {
          resolve(res);
          // console.log(JSON.stringify(res));
        }, (err) => {
          reject(err);
        }, () => {
        });
    });
  }
}
