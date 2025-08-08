# Overview

Bookish is a mobile app built with React Native and Expo.  designed to help users manage, track and enjoy their reading journey. I developed this app to deepen my understanding of mobile development and gain experience in building cross-platform apps.

The app allows users to register and log in using Firebase Authentication. Once signed in, users can create and customize their own profile, where they can organize books into three personalized lists: To Read, Currently Reading, and Bookshelf. Users can track their reading progress by updating their different lists. 

Books are displayed dynamically from the Open Library API, giving users access to a vast collection of titles. Users can browse books by subject categories or search for specific titles. Each book can be selected to view detailed information on a dedicated book detail page.

All user data is stored using in Firebase’s real-time database, in order to ensure synchronization across devices.

[Software Demo Video](http://youtube.link.goes.here)

# Development Environment

* Programming Language: TypeScript v.5.8.3
* Framework: React Native with Expo
* Backend/Auth: Firebase Authentication and Firestore
* Testing Devices: Android Emulator (Android Studio AVD) & Expo Go on mobile

To Start the app, run

   ```bash
   npx expo start
   ```
Or

   ```bash
   npx expo start --tunnel
   ```
# Useful Websites

{Make a list of websites that you found helpful in this project}
* [React Native Docs](https://reactnative.dev/docs/environment-setup)
* [Expo Documentation](https://docs.expo.dev/)
* [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
* [React Navigation](https://reactnavigation.org/)
* [Firebase Documentation](https://firebase.google.com/docs?hl=fr)
* [Android Emulator Setup](https://docs.expo.dev/workflow/android-studio-emulator/)
* [Open Library API](https://openlibrary.org/developers/api)
* [NYTimes Books API](https://developer.nytimes.com/docs/books-product/1/overview)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}
* Item 1
* Item 2
* Item 3