# Masque World Class Casino - Electron

This app implements a simple Chromium wrapper for our game World Class Casino using Electron, including platform packaging support via [`electron-builder`](https://github.com/electron-userland/electron-builder) and HTTP auto-update support via [`electron-updater`](https://github.com/electron-userland/electron-builder/tree/master/packages/electron-updater).

As Electron is still evolving quickly, examples on the Internet tend to be outdated or have security issues. This code has been tested on Electron 13 using NPM and should, to the best of our knowledge, be using up-to-date security practices.

Much credit is due to the following examples that helped us build our wrapper:
[`Electron Quick Start`](https://www.electronjs.org/docs/tutorial/quick-start)
[`Matt Haggard's electron-updater-example`](https://github.com/iffy/electron-updater-example)
[`Martin Jakal's electron-auto-update`](https://github.com/mjakal/electron-auto-update)

## Getting started

To use Electron, you need to install [`Node.js`](https://nodejs.org/en/download/). We recommend you use the latest LTS version available.

To check that Node.js was installed correctly:

```
node -v
npm -v
```

Note: Since Electron embeds Node.js into its binary, the version running your code is unrelated to the version running on your system.

## Create the project

Clone this github repository, install any node dependencies, and launch the app using these commands:

```
git clone https://github.com/masquepublishing/worldclasscasino-electron.git
npm install
npm start
```

You should see a page displaying the app version, Chromium version, Node.js version, and Electron version. The World Class Casino web site should not load. If everything went well, you can continue with this guide.

## Code Signing Certificates

* For macOS, you will need a code-signing certificate.
    Install Xcode (from the App Store), then follow [these instructions](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW6) to make sure you have a "Mac Developer" certificate.  If you'd like to export the certificate (for automated building, for instance) [you can](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingCertificates/MaintainingCertificates.html#//apple_ref/doc/uid/TP40012582-CH31-SW7).  You would then follow [these instructions](https://www.electron.build/code-signing).
* On Windows, you can generate self-signed certificate for testing and development purposes. This certificate is required for electron-updater to work properly.
    You can generate this certificate by following steps below:
    Open Windows PowerShell with administrative privileges and execute these commands:
    ```
    $rootCert = New-SelfSignedCertificate -DnsName "some_name" -Type CodeSigningCert -CertStoreLocation "certs\"
    [System.Security.SecureString]$rootcertPassword = ConvertTo-SecureString -String "some_password" -Force -AsPlainText
    [String]$rootCertPath = Join-Path -Path 'cert:\CurrentUser\My\' -ChildPath "$($rootcert.Thumbprint)"
    [String]$rootCertPath = Join-Path -Path 'cert:\LocalMachine\My\' -ChildPath "$($rootcert.Thumbprint)"
    Export-PfxCertificate -Cert $rootCertPath -FilePath 'certs\some_file.pfx' -Password $rootcertPassword
    Export-Certificate -Cert $rootCertPath -FilePath 'certs\some_file.crt'
    ```
    
    After successful creation of certificate files, make sure that they are in correct location. Open Certificate Manager by clicking on the Start button, type certmgr.msc in the search field and press Enter key.
    
    If your newly created certificate is not in *Trusted Root Certification Authorities* certificate folder, drag and drop it from *Personal*. Otherwise automatic updates may not work.
    
    Next, open package.json in your favorite text editor and modify these three lines.
 
    ```
    "publisherName": "Some Company", // when using self signed certs, enter a random string
    "certificateFile": "./certs/some_file.pfx",
    "certificatePassword": "some_password"
    ```
    Note: self-signed certificate can only be used for testing purposes.

## Packaging And Testing

Once you have the code signing certificates, it's time for packaging and testing:

```
npm run dist
```

### Testing Auto Update

When npm run dist finishes with the building process, open /dist folder and install the app on your system. After successful install, bump the version in package.json and and run the "npm run dist" command once again. 
When done, run "npm run serve". Open the previous version that you installed on your system and voilà :)!