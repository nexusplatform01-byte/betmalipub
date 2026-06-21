(function() {
    window.$addStorageEvent = function(type, key, data) {
        if (type === 1) {
            // StorageEvent event
            var newStorageEvent = document.createEvent('StorageEvent');
            const storage = {
                setItem: function(k, val) {
                    localStorage.setItem(k, val);
                    // init
                    newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
                    // dispatch
                    window.dispatchEvent(newStorageEvent);
                }
            }
            return storage.setItem(key, data);
        } else {
            // event
            var newStorageEvent = document.createEvent('StorageEvent');
            const storage = {
                setItem: function(k, val) {
                    sessionStorage.setItem(k, val);
                    // init
                    newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
                    // dispatch
                    window.dispatchEvent(newStorageEvent);
                }
            }
            return storage.setItem(key, data);
        }
    }
    if (!window.AndroidBridge && 'serviceWorker' in navigator && 'PushManager' in window) {
        var swRegistration = null;
        //pwa start
        var isSubscribed = false;
        //watch
        window.isNeedInstall = false;
        window.$addStorageEvent(1, "isNeedInstall", false);
        window.deferredInstallPrompt = null;
        //消息推送安装
        const applicationServerPublicKey = 'BOppBcey9ZBloFMeORchTsM4hD4IhApB11LJgcfjQsst1J1t749YToL8eLOkTrnCRgJGGnkkLFJvt7qTFCOfdHw';
        // CODELAB: Add event listener for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', function(evt) {
            if (window.ispwaExcute != false) window.ispwaExcute = true;

            //install
            window.isNeedInstall = true;
            evt.preventDefault();
            window.$addStorageEvent(1, "isNeedInstall", true);
            window.deferredInstallPrompt = evt;
            console.log('beforeinstallprompt.', evt);
            window.initPWAinfo && window.initPWAinfo();
        });
        window.addEventListener('appinstalled', function(evt) {
            if (window.ispwaExcute != false) window.ispwaExcute = true;

            //alkreadt
            window.isNeedInstall = false;
            window.$addStorageEvent(1, "isNeedInstall", false);
            console.log('installed.', evt);
            window.initPWAinfo && window.initPWAinfo();
        });

        //install
        window.installPWA = function(callback) {
            window.deferredInstallPrompt.prompt();
            window.deferredInstallPrompt.userChoice
                .then(function(choice) {
                    if (choice.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt', choice);
                        if (callback) {
                            callback()
                        }
                    } else {
                        console.log('User dismissed the A2HS prompt', choice);
                    }
                    window.isNeedInstall = false;
                    window.$addStorageEvent(1, "isNeedInstall", false);
                    window.deferredInstallPrompt = null;
                });
        }
        //pwa end

        // window.isPwa = navigator.standalone || (window.matchMedia('(display-mode: standalone)').matches);

        navigator.serviceWorker.register('service-worker.js')
            .then(function(swReg) {
                swRegistration = swReg;
                window.swRegistration = swRegistration;
                window.isPreSwRegistration = true;
            })
            .catch(function(error) {
                window.isPreSwRegistration = false;
            });

        function urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
        window.getSubscription = function(cb, ecb) {
            if (!swRegistration) {
                console.log("err swRegistration");
                return;
            }
            swRegistration.pushManager.getSubscription()
                .then(function(subscription) {
                    console.log('User subscribed', JSON.stringify(subscription));
                    // isSubscribed = !(subscription === null);
                    // if (isSubscribed) {
                    cb(subscription)
                    // } else {
                    //   console.log('User is NOT subscribed.');
                    //   cb(null)
                    // }
                });
        }
        window.subscribeUser = function(cb) {
            if (!swRegistration) {
                console.log("err swRegistration");
                return;
            }
            const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
            swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            }).then(function(subscription) {
                // updateSubscriptionOnServer(subscription);
                cb(subscription);
            }, function(err) {
                console.log(err)
            }).catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
            });
        }
        window.unsubscribeUser = function() {
            if (!swRegistration) {
                console.log("err swRegistration");
                return;
            }
            swRegistration.pushManager.getSubscription()
                .then(function(subscription) {
                    if (subscription) {
                        return subscription.unsubscribe();
                    }
                })
                .catch(function(error) {
                    console.log('Error unsubscribing', error);
                }).then(function() {
                    // updateSubscriptionOnServer(null);
                    console.log('User is unsubscribed.');
                    isSubscribed = false;
                });
        }
    } else {
        console.warn('Push messaging is not supported');
    }
})()