// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://visionvivante.com/lonely_spaces/public/api',
  picURL: 'http://visionvivante.com/lonely_spaces/public/SpaceImages',
  picURLSpaceType: 'http://visionvivante.com/lonely_spaces/public',
  profilePicURL: 'http://visionvivante.com/lonely_spaces/public/profile_images',
  googleMapURL: 'https://www.google.com/maps/embed/v1/place?q=',
  googleMapAPIKey: 'AIzaSyABA5OJGDAxnNac8ukDnnweOuUlqaJvwdY',
  stripeKey: 'pk_test_W4Fy1g5gC2g3KxjR26ykZroP',
  // stripeImage: 'https://picsum.photos/200/300',
  stripeImage: 'http://visionvivante.com/ravi/stripe_logo.png',
  authToken: btoa('admin:admin'),

};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
