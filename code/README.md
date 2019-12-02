# Gaddum Mood Music
## This is an Ionic V1 App
You'll need to install the development kit:
### Windows 10?
Find the How-To, right [here](https://github.com/AliceDigitalLabs/SupportingLiveProjects_2018/wiki/Ionic-and-Cordova-on-Win-10)  

### Mac?
There is a supplemental for Mac users, [here](https://github.com/AliceDigitalLabs/Supporting_LiveProjects_2019/wiki/Ionic-and-Cordova-on-Win-10:-Mac-Supplemental)

### Building



1. Install cordova

```
npm install -g cordova
```

2. Install ionic
```
npm install -g ionic@3.20.0
```  

Note: The latest version (4.3) of the Ionic CLI contains a breaking change. Make sure you use the above version: 3.20.0


* check your installation:

For ionic:  

```
ionic -v
```

For cordova: 
```
cordova -v
```

4. When you can successfully run ionic, you're on to trying a build!  

* Add the android platform to your project.
 * in the top-level of the project (where you can see config.xml) use the following command:

```
ionic cordova platform add android@6.3.0
```

* Adding the platform should go OK.


* Check you have a gulpfile.js in the top level of your project. If not, download it from https://github.com/ionic-team/ionic-app-base/blob/master/gulpfile.js  

* Check that you have Gradle installed.
```
gradle -v
```
We're running version 4.10

* If Gradle is not installed, go to https://gradle.org/install/
 * Download the zip file. DON'T use a package manager!
 * Create a folder in which to put Gradle: 
 * Extract the contents of the .zip file to the folder.
 * You now need to add the location of the Gradle binaries to your PATH environmnent variable:
 
 For example:
 ```
 C:\Gradle\gradle-4.10.2\bin
 ```

* you will need to add the ionic v1 toolkit  package to the ionic CLI:
(this is an ionic v1 project (yes, we're still using ionic v1 and angularjs. BECAUSE.))

```
npm i -D @ionic/v1-toolkit
```


* Now you're ready to try a build:

```
ionic cordova build android
```

This should create an android .apk file for you. in .\platforms\android\app\build\outputs\apk\debug

* Android Studio is installed, but you will need to put the tools in your PATH before you can deploy to a phone.

```
C:\AndroidSDK\platform-tools
```

* connect up your android phone to your PC, using a USB cable. Make sure the device is ready to accept your deployed app:
 * You will need to do that special ['thing'](https://www.digitaltrends.com/mobile/how-to-get-developer-options-on-android/) to get 'Developer Options' available.
 * In developer options, enable USB debugging.
* check that your device is available
```
adb devices
```

* you should see an entry for your device.



* Now give it a try:


```
ionic cordova run android
```

* Hey, presto! We're on your device.


## This is a Spotify App

Actually, this app is designed to use many Music Streaming Providers. 

When you build the app, you will need to register it with Spotify (and any other service providers we will hopefully support). 
You will need to obtain a Spotify Client Id. 



## Android build with android-barcode-scanner

Make sure phonegap-plugin-bardocdescanner is version 6.0.1

~~(See here to solve first issue, cause by two references to the `uses-feature` tag)[https://github.com/phonegap/phonegap-plugin-barcodescanner/issues/418#issuecomment-361588203]~~

~~(Here is the solution to the `Execution failed for task ':transformClassesWithJarMergingForDebug' issue)[https://github.com/phonegap/phonegap-plugin-push/issues/2792#issuecomment-512662354] *(Use cordova-push-plugin@2.2.1)*~~

(This link provides a helpful solution that worked for me)[https://stackoverflow.com/a/51489200]
`cordova plugin add cordova-android-support-gradle-release --variable ANDROID_SUPPORT_VERSION=27.+`
Remember to `cordova platform remove android`, `cordova platform add android@6.3.0`, then `cp google-services.json ./platforms/android/`

