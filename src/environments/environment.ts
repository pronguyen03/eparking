// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://125.212.225.178:8082',
  apiUrl: 'http://125.212.225.178:8082/api',
  parkingId: 1,
  firebaseConfig: {
    apiKey: 'AIzaSyCpYPJNx7x5XfSM0GxFELNlclDImJ_EWRo',
    authDomain: 'eparking-a70a7.firebaseapp.com',
    databaseURL: 'https://eparking-a70a7.firebaseio.com',
    projectId: 'eparking-a70a7',
    storageBucket: 'eparking-a70a7.appspot.com',
    messagingSenderId: '140044308383',
    appId: '1:140044308383:web:c492199bb3b562935537aa'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
