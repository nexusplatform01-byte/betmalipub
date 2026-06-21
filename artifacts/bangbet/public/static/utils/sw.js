/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, serviceworker, es6 */

'use strict';
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    let data = JSON.parse(event.data.text())

    const title = data.title;
    const options = {
        body: data.body,
        icon: 'static/images/icons/icon-128x128.png',
        badge: data.badge ? data.badge : 'static/images/icons/icon-128x128.png',
        data: data.data
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    let params = typeof event.notification.data === 'string' ? JSON.parse(event.notification.data) : event.notification.data
    let url = params.target
    let id = params.autoMessageId
    if (url.includes('?')) {
        url = url + "&autoMessageId=" + id
    } else {
        url = url + "?autoMessageId=" + id
    }
    event.waitUntil(
        clients.openWindow(url ? url : "https://www.bangbet.com/")
    );
});