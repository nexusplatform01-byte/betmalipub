var _GTAG_ID = "G-Z48ZZR7C49";
var _COUNTRY = {
    "0": "ke",
    "1": "ug",
    "2": "ng",
    "4": "gh",
    "5": "tz"
};

const _FIREBASE = {
    "SWGGLXH5": "1",
    "SWGGZYH5": "1",
    "CWVVGGGAME": "1",
    "CWVVGGSPORTS": "1",
}

var _FACEBOOK_CHANNEL = {
    SWVVFBBET: '1339817950218888',
    SWZYFB: '957895621990242',
    CWVVFBT: '896271524983664',
    CWVVFBY: '304385262000864',
    CWVVFBAB: '304385262000864',
    CWVVFBWI: '304385262000864',
    CWVVFBABWI: '304385262000864',
    CWVVFBDLHUNT: '918309925973067',
    CWVVFBGAT: '581867573797335',
    SWVVFBGATHER: '751363942822513',
    SWFBLXH5: '1465122380775399',
    SWFBDYH: '1353450592394998',
    KSWFBDL: '1312543243724429',
    SWBDPWAEXTKE: '871605411902952',
    SWBDPWAGH: '1892182091723291',
    SWBDPWANG: '877502854937776',
    SWBDPWATZ: '877502854937776',
    SWBDPWAKE: '1254661030040455'
};

var _TABOOLA = {
    SWZYTBLANDPAGE: 1606353,
    SWTBZYLPAVIATOR: 1606353,
    SWZYTBHOMEPAGE: 1596241,
    CWTLTBH5: 1600795,
    CWTLTBHOMEPAGE: 1600795,
    CWYYTBH5: 1600795,
    CWYYTBHOMEPAGE: 1600795,
    SWTBZYH5: 1725123,
    SWTBLXH5: 1725123,
}

var _WANGMENG = {
    SWTESTWANGMENG: 1
}

var _TWITTER_CHANNEL = {
    "WVVTW": "ogwjd"
};
var _DSP_CHANNEL = {
    "WVVEK": "13895",
};
var _ADSRVR_KSWVVTA = {
    "KSWVVTA": "0oave24"
};

function isPwa() {
    var isPwa = false;
    try {
        isPwa = window.navigator.standalone || (window.matchMedia('(display-mode: standalone)').matches);
    } catch (err) {
        console.log(err);
    }
    return isPwa;
}

function getLocalStorage(key) {
    var rlt = null;
    window.localStorage && (rlt = window.localStorage.getItem(key));
    return rlt;
}

function removeLocalStorage(key) {
    window.localStorage && window.localStorage.removeItem(key);
}

function setLocalStorage(key, value) {
    window.localStorage && window.localStorage.setItem(key, value);
}

function isNewPlayer() {
    var nowDate = new Date();
    var nowFullDate = nowDate.getFullYear() + "_" + nowDate.getMonth();
    var accessDate = getLocalStorage("access-date");
    if (accessDate) {
        nowFullDate += "_" + nowDate.getDate();
        if (nowFullDate != accessDate) {
            return false;
        } else {
            return true;
        }
    } else {
        //old mode check used user
        var channelFlag = getLocalStorage("channel");
        var isNewPlayer = !channelFlag;
        if (isNewPlayer) {
            nowFullDate += "_" + nowDate.getDate();
        } else {
            nowFullDate += "_" + (nowDate.getDate() - 1);
        }
        setLocalStorage("access-date", nowFullDate);
        return isNewPlayer;
    }
}

function trimSpace(str) {
    if (!str) {
        return "";
    }
    str = str.replace(/^\s*|\s*$/g, "");
    if (str == "null" || str == "undefined") {
        return "";
    }
    return str;
}

/**
 * uri params
 */
function analyzeUrl() {
    var baseUri = window.location.search;
    var hrefArr = baseUri.split("?");
    var query = hrefArr.length > 1 ? hrefArr[1] : "";
    var vars = query.split("&");
    // cnQuery: { } // google advertising parameters
    var rlt = {

    };
    for (var i = 0; i < vars.length; i++) {
        if (trimSpace(vars[i]) == "") continue;
        var pair = vars[i].split("=");
        var pairKey = trimSpace(pair[0]);
        var pairVal = trimSpace(pair[1]);
        if (pair.length < 2) {
            !rlt['cn'] && (rlt['cn'] = pairKey);
        } else {
            var utmArr = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'];
            if (!rlt['cn'] && pairKey.toLowerCase() == 'utm_term') {
                rlt['cn'] = pairVal;
                !rlt.cnQuery && (rlt.cnQuery = {});
                rlt.cnQuery['utm_term'] = pairVal;
            } else {
                if (utmArr.indexOf(pairKey.toLowerCase()) != -1) {
                    !rlt.cnQuery && (rlt.cnQuery = {});
                    rlt.cnQuery[pairKey] = pairVal;
                } else {
                    rlt[pairKey] = pairVal;
                }
            }
        }
    }
    if (rlt['cn'] && !rlt['country']) {
        var c = rlt['cn'].substring(0, 1).toLowerCase();
        if (c == "u") rlt['country'] = "ug";
        else if (c == "k") rlt['country'] = "ke";
        else if (c == "n") rlt['country'] = "ng";
        else if (c == "g") rlt['country'] = "gh";
        else if (c == "g") rlt['country'] = "tz";
        else rlt['country'] = "ke";
    }
    // if (rlt['country'] && !rlt['cn']) {
    //     if (rlt['country'] == "ke") rlt['cn'] = "KSWVVSYS";
    //     else if (rlt['country'] == "ug") rlt['cn'] = "USWVVSYS";
    //     else if (rlt['country'] == "ng") rlt['cn'] = "NSWVVSYS";
    //     else if (rlt['country'] == "gh") rlt['cn'] = "GSWVVSYS";
    //     else rlt['cn'] = "KSWVVSYS";
    // }
    if (rlt['koc']) {
        rlt['cn'] = rlt['koc'];
    }
    return rlt;
}

function loadJs(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    if (typeof(callback) != "function") return;
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else {
        script.onload = function() {
            callback();
        }
    }
    script.src = url;
    document.body.appendChild(script);
}

//------------------------- third part jssdk ----
function checkChannel(arr) {
    if (!window.bangGoogle) return null;
    if (!window.bangGoogle.channel) return null;
    // it's not all channel
    var channel = window.bangGoogle.channel.toUpperCase();
    var _fbId = arr[channel];
    if (!_fbId && channel) {
        for (var key in arr) {
            if (channel.indexOf(key.toUpperCase()) != -1) {
                _fbId = arr[key];
            }
        }
    }
    return _fbId;
}

function initFirebase() {
    if (window.bangGoogle.channelCode) {
        return;
    }
    var _firebaseId = checkChannel(_FIREBASE);
    if (!!_firebaseId) {
        var firebaseConfig = {
            apiKey: "AIzaSyCHOCOq22UMybiDzOfR-ybOkNLFKjOMOhs",
            authDomain: "bangbet-20399.firebaseapp.com",
            databaseURL: "https://bangbet-20399.firebaseio.com",
            projectId: "bangbet-20399",
            storageBucket: "bangbet-20399.appspot.com",
            messagingSenderId: "565089040122",
            appId: "1:565089040122:web:39ed8ae006fb285abefb43",
            measurementId: "G-7G4GNWQ02M"
        };
        loadJs('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js', function() {
            loadJs('https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics-compat.js', function() {
                firebase.initializeApp(firebaseConfig);
            })
        })
    }
}


function initWangmeng() {
    var _wangmengId = checkChannel(_WANGMENG);
    if (!!_wangmengId) {
        window.wrapUrlWithClickId = (function() {
            "use strict";

            function n(n, r) {
                var e;
                void 0 === r && (r = "uclick");
                var u = null === (e = n.match(/\?.+?$/)) || void 0 === e ? void 0 : e[0];
                return u ? Array.from(u.matchAll(new RegExp("[?&](clickid|" + r + ")=([^=&]*)", "g"))).map((function(n) {
                    return {
                        name: n[1],
                        value: n[2]
                    }
                })) : []
            }

            function r(n) {
                var r = n();
                return 0 === r.length ? {} : r.reduce((function(n, r) {
                    var e;
                    return Object.assign(n, ((e = {})[r.name] = "" + r.value, e))
                }), {})
            }

            function e(e) {
                void 0 === e && (e = "uclick");
                var u, i, t = r((function() {
                        return (function(n) {
                            return void 0 === n && (n = "uclick"), Array.from(document.cookie.matchAll(new RegExp("(?:^|; )(clickid|" + n + ")=([^;]*)", "g"))).map((function(n) {
                                return {
                                    name: n[1],
                                    value: n[2]
                                }
                            }))
                        })(e)
                    })),
                    c = r((function() {
                        return n(document.referrer, e)
                    })),
                    a = r((function() {
                        return n(document.location.search, e)
                    }));
                return (u = [e, "clickid"], i = [t, c, a], u.reduce((function(n, r) {
                    return n.concat(i.map((function(n) {
                        return [r, n]
                    })))
                }), [])).map((function(n) {
                    return {
                        name: n[0],
                        value: n[1][n[0]]
                    }
                })).find((function(n) {
                    return n.value
                })) || null
            }

            function u(n, r, e) {
                var u = n.replace(new RegExp(r + "=[^=&]*", "g"), r + "=" + e);
                return -1 !== u.indexOf(r) ? u : (function(n, r, e) {
                    var u = n.trim(),
                        i = r + "=" + e;
                    return -1 === u.indexOf("?") ? u + "?" + i : u.endsWith("?") ? "" + u + i : u + "&" + i
                })(n, r, e)
            }
            return function(n, r) {
                void 0 === r && (r = "uclick");
                var i = e(r);
                return null === i ? n : n.includes("cnv_id") ? i.name === r ? u(n, i.name, i.value) : i.value ? u(n, "cnv_id", i.value) : n : u(n, i.name, i.value)
            }
        })();
        window.setFbevents = function(event, val, uid) {
            if (event == "CompleteRegistration") event = "event1";
            else if (event == "InitiateCheckout") event = "event2";
            else if (event == "Purchase") event = "event3";
            if (!!val) {
                var countryRate = {
                    gh: 13,
                    ng: 1477,
                    ug: 3880,
                    ke: 133,
                    tz: 2650
                };
                var ct = "ug";
                if (window.bangGoogle['country']) ct = window.bangGoogle['country'];
                var amount = 0;
                if (Number(val) && countryRate[ct]) {
                    amount = (val / countryRate[ct]).toFixed(5);
                } else {
                    amount = num;
                }

                var isSingleEvent = true;
                var registerCts = getLocalStorage("register_cts");
                if (!!registerCts && !isNaN(Number(registerCts))) {
                    var h = (new Date().getTime() - Number(registerCts)) / 1000 / 3600;
                    if (h <= 24) {
                        if (!uid) {
                            uid = getLocalStorage("fingerPrint");
                            if (!uid) {
                                uid = Math.floor(Math.random() * 1000000);
                            }
                        }
                        isSingleEvent = false;
                        var img = document.createElement('img');
                        img.src = window.wrapUrlWithClickId('https://tracker.net/click.php?event3=' + amount + "&event4=" + amount);
                        img.referrerPolicy = 'no-referrer-when-downgrade';
                    }
                }
                if (isSingleEvent) {
                    var img = document.createElement('img');
                    img.src = window.wrapUrlWithClickId('https://tracker.net/click.php?event3=' + amount);
                    img.referrerPolicy = 'no-referrer-when-downgrade';
                }
            } else {
                var isEvent = true;
                if (event == "event1") {
                    if ("1" == getLocalStorage("isNewRegister")) {
                        removeLocalStorage("isNewRegister");
                    } else {
                        isEvent = false;
                    }
                }
                if (isEvent) {
                    var img = document.createElement('img');
                    img.src = window.wrapUrlWithClickId('https://tracker.net/click.php?' + event + '=1');
                    img.referrerPolicy = 'no-referrer-when-downgrade';
                }
            }
        }
        window.setFbevents("CompleteRegistration", 0);

    }

}

function initTaboola() {
    var _tbId = checkChannel(_TABOOLA);
    if (!!_tbId) {
        window._tfa = window._tfa || [];
        window._tfa.push({
            notify: 'event',
            name: 'page_view',
            id: _tbId
        });
        ! function(t, f, a, x) {
            if (!document.getElementById(x)) {
                t.async = 1;
                t.src = a;
                t.id = x;
                f.parentNode.insertBefore(t, f);
            }
        }(document.createElement('script'),
            document.getElementsByTagName('script')[0],
            '//cdn.taboola.com/libtrc/unip/' + _tbId + '/tfa.js',
            'tb_tfa_script');
        //Mutually exclusive with Facebook
        window.setFbevents = function(event, val, uid) {
            if (event == "CompleteRegistration") event = "complete_registration";
            else if (event == "InitiateCheckout") event = "add_payment_info";
            else if (event == "Purchase") event = "make_purchase";
            if (!!val) {
                var countryRate = {
                    gh: 13,
                    ng: 1477,
                    ug: 3880,
                    ke: 133,
                    tz: 2650
                };
                var ct = "ug";
                if (window.bangGoogle['country']) ct = window.bangGoogle['country'];
                var amount = 0;
                if (Number(val) && countryRate[ct]) {
                    amount = (val / countryRate[ct]).toFixed(5);
                } else {
                    amount = num;
                }
                window._tfa.push({
                    notify: 'event',
                    name: event,
                    id: _tbId,
                    currency: "USD",
                    revenue: amount
                });
                var registerCts = getLocalStorage("register_cts");
                if (!!registerCts && !isNaN(Number(registerCts))) {
                    var h = (new Date().getTime() - Number(registerCts)) / 1000 / 3600;
                    if (h <= 24) {
                        if (!uid) {
                            uid = getLocalStorage("fingerPrint");
                            if (!uid) {
                                uid = Math.floor(Math.random() * 1000000);
                            }
                        }
                        window._tfa.push({
                            notify: 'event',
                            name: 'today_purchase',
                            id: _tbId,
                            currency: "USD",
                            revenue: amount
                        });
                    }
                }
            } else {
                if (event == "complete_registration") {
                    if ("1" == getLocalStorage("isNewRegister")) {
                        removeLocalStorage("isNewRegister");
                        window._tfa.push({
                            notify: 'event',
                            name: event,
                            id: _tbId
                        });
                    }
                } else {
                    window._tfa.push({
                        notify: 'event',
                        name: event,
                        id: _tbId
                    });
                }
            }
        }
        window.setFbevents("CompleteRegistration", 0);
    }
}

function initFacebook() {
    if (window.bangGoogle.channelCode) {
        return;
    }
    var _fbId = checkChannel(_FACEBOOK_CHANNEL);
    if (!!_fbId) {
        ! function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            t.onerror = function() {
                var lf = b.createElement(e);
                lf.async = !0;
                lf.src = '/static/fbevents.js';
                var s2 = b.getElementsByTagName(e)[0];
                s2.parentNode.insertBefore(lf, s2);
            };
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', _fbId);
        fbq('track', 'PageView');
        window.setFbevents = function(event, val, uid) {
            if (!!val) {
                var countryRate = {
                    gh: 13,
                    ng: 1477,
                    ug: 3880,
                    ke: 133,
                    tz: 2650
                };
                var ct = "ug";
                if (window.bangGoogle['country']) ct = window.bangGoogle['country'];
                var amount = 0;
                if (Number(val) && countryRate[ct]) {
                    amount = (val / countryRate[ct]).toFixed(5);
                } else {
                    amount = num;
                }
                fbq('track', event, {
                    value: amount,
                    currency: "USD"
                });
                var registerCts = getLocalStorage("register_cts");
                if (!!registerCts && !isNaN(Number(registerCts))) {
                    var h = (new Date().getTime() - Number(registerCts)) / 1000 / 3600;
                    if (h <= 24) {
                        if (!uid) {
                            uid = getLocalStorage("fingerPrint");
                            if (!uid) {
                                uid = Math.floor(Math.random() * 1000000);
                            }
                        }
                        fbq('trackCustom', "TodayPurchase", {
                            custom_parameter: uid + "",
                            value: amount,
                            currency: "USD"
                        });
                    }
                }

            } else {
                fbq('track', event);
            }
        }
        //register report
        // window.setFbevents("CompleteRegistration" , 0);
    } else {
        initTaboola();
        initTwitter();
        initEsk();
        // old reporter discard
        // setActionBeforeLoaded();
    }
}

function initTwitter() {
    var _fbId = checkChannel(_TWITTER_CHANNEL);
    if (!!_fbId) {
        ! function(e, t, n, s, u, a) {
            e.twq || (s = e.twq = function() {
                    s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                }, s.version = '1.1',
                s.queue = [],
                u = t.createElement(n),
                u.async = !0,
                u.src = '//static.ads-twitter.com/uwt.js',
                a = t.getElementsByTagName(n)[0],
                a.parentNode.insertBefore(u, a))
        }(window, document, 'script');
        twq('config', _fbId);
        window.setTwitterBet = function(val) {
            var ct = "ug";
            if (window.bangGoogle['country']) ct = window.bangGoogle['country'];
            var countryCurrency = {
                gh: "GHC",
                ng: "NGN",
                ug: "UGX",
                ke: "KES"
            };
            twq('event', 'tw-ogwjd-oh98l', {
                value: val,
                currency: countryCurrency[ct]
            });
        }

        window.setFbevents = function(event, val, uid) {
            if (event == "CompleteRegistration") {
                if ("1" == getLocalStorage("isNewRegister")) {
                    removeLocalStorage("isNewRegister");
                    twq('event', 'tw-ogwjd-oh98c', {
                        value: 1
                    });
                }
            } else if (event == "Purchase") {
                var ct = "ug";
                if (window.bangGoogle['country']) ct = window.bangGoogle['country'];
                var countryCurrency = {
                    gh: "GHC",
                    ng: "NGN",
                    ug: "UGX",
                    ke: "KES"
                };
                twq('event', 'tw-ogwjd-oh98j', {
                    value: val,
                    currency: countryCurrency[ct]
                });
            }
        }
        window.setFbevents("CompleteRegistration", 0);
    }
}

function initEsk() {
    var _fbId = checkChannel(_DSP_CHANNEL);
    if (!!_fbId) {
        ! function(f, e, t, u, n, s, p) {
            if (f.esk) return;
            n = f.esk = function() {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f.___esk) f.___esk = n;
            n.push = n;
            n.loaded = !0;
            n.queue = [];
            s = e.createElement(t);
            s.async = !0;
            s.src = u;
            p = e.getElementsByTagName(t)[0];
            p.parentNode.insertBefore(s, p)
        }(window, document, 'script', 'https://dsp-media.eskimi.com/assets/js/e/gtr.min.js?_=0.0.0.4');
        window.esk('init', _fbId);
        if ("1" == getLocalStorage("isNewRegister")) {
            removeLocalStorage("isNewRegister");
            window.esk('track', 'Conversion');
        }
    }
}

function initAdsrvr() {
    var _fbId = checkChannel(_ADSRVR_KSWVVTA);
    if (!!_fbId) {
        loadJs("https://js.adsrvr.org/up_loader.1.1.0.js", function() {
            ttd_dom_ready(function() {
                if (typeof TTDUniversalPixelApi === 'function') {
                    var universalPixelApi = new TTDUniversalPixelApi();
                    universalPixelApi.init("kzlrsll", [_fbId], "https://insight.adsrvr.org/track/up");
                }
            });
        });
    } else {
        setActionBeforeLoaded();
    }
}

//--------------------window funciton------------------------------------
window.initBang = function() {
    if (!window.bangGoogle) return;
    var country = getLocalStorage("country");
    if (country) {
        _COUNTRY[country] && (window.bangGoogle['country'] = _COUNTRY[country]);
    }
    var channel = getLocalStorage("channel");
    channel && (channel = JSON.parse(channel));
    channel && (window.bangGoogle['channel'] = channel, window.cachechannel = channel);
}

//--google path
window.renderPage = function() {
    var path = window.location.pathname;
    (path == "/") && (path = "/index");
    path += "/render";
    if (window.lastRenderPath != path) {
        window.lastRenderPath = path;
        if (window.bangGoogle) {
            if (window.bangGoogle.country) path += "/" + window.bangGoogle.country;
            else path += "/unkown";
            if (window.bangGoogle.isNewPlayer) path += "/new";
            else path += "/old";
            if (window.bangGoogle.isPwa) path += "/pwa";
            else path += "/h5";
            if (window.bangGoogle.channel) path += "/" + window.bangGoogle.channel;
            else path += "/unkown";
        }
        gtag("event", "page_view", {
            'page_path': path
        });
    }
}

window.getIosIdfa = (idfa, adid) => {
    if (localStorage) {
        localStorage.setItem('IosAdid', adid)
        localStorage.setItem('IosIdfa', idfa)
    }
}

window.initialization = function() {
    if (window.localStorage.getItem('page_only') == 2) {
        window.googleEvent && window.googleEvent("", "page_only", 0);
        window.localStorage.setItem('page_only', 1);
    }
}

//-----------google event------
window.googleUserData = function() {
    var dataStr = getLocalStorage("user");
    if (!!dataStr) {
        try {
            var data = JSON.parse(dataStr);
            if (data.username) {
                //has been setted.
                if (window.googleUserPhone && window.googleUserPhone == data.username) {
                    return;
                }
                gtag('set', 'user_data', {
                    'phone_number': "+" + data.username
                });
                window.googleUserPhone = data.username;
                //report register info
                var regTag = getLocalStorage("isgoogleRegister");
                if (!!regTag && regTag == "1") {
                    var channel = data.channel;
                    if (!channel) channel = "UNKOWN";
                    gtag('event', 'complete_register', {
                        'event_category': "register",
                        'event_label': channel
                    });
                    removeLocalStorage("isgoogleRegister");
                }
            }
        } catch (e) {

        }
    }
}

window.googleEvent = function(category, action, value, params) {
    //close the event action
    if (window.bangGoogle) {
        !window.bangGoogle.timerEvents && (window.bangGoogle.timerEvents = {});
        if (window.bangGoogle.country) category += "_" + window.bangGoogle.country;
        else category += "_unkown";
        if (window.bangGoogle.isNewPlayer) action += "_new";
        else action += "_old";
        if (window.bangGoogle.isPwa) action += "_pwa";
        else action += "_h5";
        if (category == "initialization" && action == "socket") {
            if (window.isNeedInitSocket) {
                window.isNeedInitSocket = false;
                value = "time";
            } else {
                category = "apiSpeed";
            }
        }
        // special events
        // init event and time event must be the same about number.
        // it's a pair events.
        var timeKey = null;
        if (category == "apiSpeed") {
            if (action.indexOf("rollMatch") != -1) {
                timeKey = "apiSpeed-rollMatch";
            }
        }
        if (value == "init") {
            window.bangGoogle.time = (new Date()).getTime();
            value = 0;
            if (timeKey) {
                if (window.bangGoogle.timerEvents[timeKey]) {
                    var gap = window.bangGoogle.time - window.bangGoogle.timerEvents[timeKey];
                    // max expire time = 10sec
                    if (gap < 10000) {
                        return;
                    }
                }
                window.bangGoogle.timerEvents[timeKey] = window.bangGoogle.time;
            }
        } else if (value == "time") {
            var now = (new Date()).getTime();
            !window.bangGoogle.time && (window.bangGoogle.time = now);
            value = now - window.bangGoogle.time;
            if (timeKey && window.bangGoogle.timerEvents[timeKey]) {
                window.bangGoogle.timerEvents[timeKey] = 0;
                delete window.bangGoogle.timerEvents[timeKey];
            }
        }
    }!value && (value = 0);
    isNaN(parseFloat(value)) && (value = 0);
    value = parseInt(value);
    gtag('event', action, {
        'event_category': category,
        'event_label': getPlatfromChannel(),
        'value': value,
        'event_referrer': document.referrer,
        'event_device': window.bangGoogle.isPwa ? "pwa" : "h5",
        ...(params || {})
    });
}



window.googleAdEvent = function(action, value) {
    const channels = ['WGG3479', 'WVVGG3479']
    // 过滤渠道标
    const flag = channels.some(item => window.bangGoogle && window.bangGoogle.channel.includes(item))
    if (flag) {
        let currency = ''
        const currencyOpt = {
            ke: 'KES',
            gh: 'GHS',
            tz: 'TZS',
            ng: 'NGN',
            ur: 'UGX',
        }

        if (window.bangGoogle && window.bangGoogle.country) {
            currency = currencyOpt[window.bangGoogle.country]
        }

        gtag('event', 'conversion', {
            'send_to': 'AW-11285167297/' + action,
            'value': value,
            'currency': currency
        })
    }
}

// 根据设备展示不同渠道标
function getPlatfromChannel() {
    let channel = window.bangGoogle.channel || "default";
    if (window.bangGoogle.isPwa) {
        let urls = ['keopen.hoteasymoney777.com', 'pwagame123.com', 'jamesbang3.com', 'housex6cookie.com', 'happy7dday.com', 'bedroom3w.com']
        let referrer = document.referrer;
        if (!channel.includes("SWBDPWA")) {
            let country = window.bangGoogle.country.toUpperCase();
            urls.forEach((url, index) => {
                if (referrer.includes(url)) {
                    channel = index == 0 ? country + 'SWBDPWA777HY' : country + 'SWBDPWA123HY';
                }
            });

        }
    }

    return channel;
}

//------------------------auto action------------------------------------
function init() {
    window.googleUserData && window.googleUserData();
    window.bangGoogle = {
        country: "ke",
        channel: "KSWVVSYS",
        isNewPlayer: isNewPlayer(),
        isPwa: isPwa(),
        time: (new Date()).getTime()
    }
    window.cachechannel = "";
    window.urlChannel = "";
    var params = analyzeUrl();

    params['country'] && (window.bangGoogle['country'] = params['country']);
    window.initBang();
    //before show platform: uri , cache
    //after show platfrom: cache
    params['cn'] && (window.bangGoogle['channel'] = params['cn'], window.urlChannel = params['cn'], setLocalStorage("channel", JSON.stringify(params['cn'])));
    //jqueryfo
    params.cnQuery && (setLocalStorage("init.string", JSON.stringify(params.cnQuery)), setLocalStorage("init.objStr", JSON.stringify(params.cnQuery)));
    // invitation_code
    params.koc && (setLocalStorage("invitation_code", params.koc));
    //google upload
    window.initialization() && window.initialization();
    //socket event tag
    window.isNeedInitSocket = true;
}

function setPerfume() {
    var metricNames = ['fp', 'fcp', 'lcp', 'lcpFinal', 'fid', 'cls', 'clsFinal', 'tbt', 'tbt10S', 'tbtFinal', 'homeRollBall'];
    new Perfume({
        analyticsTracker: function(res) {
            //{metricName, data, navigatorInformation}
            var metricName = res.metricName;
            var data = res.data;
            var navigatorInformation = res.navigatorInformation;
            // if (metricNames && metricNames.indexOf(metricName) != -1) {
            //     gtag('event', metricName, {
            //         'event_category': 'Performance.mobile',
            //         'value': metricName === 'cls' ? data * 1000 : data,
            //         'event_label': navigatorInformation.isLowEndExperience ? 'lowEndExperience' : 'highEndExperience'
            //     });
            // }
            try {
                if (metricName == 'resourceTiming') {
                    // if (data.initiatorType == 'xmlhttprequest') {
                    //     if (apiSpeedObj && location.pathname == '/m/') {
                    //         var key = data.name
                    //         if (key.indexOf('casino-api') != -1 || key.indexOf('bet-api') != -1) {
                    //             if (apiSpeedObj[key] && typeof apiSpeedObj[key] == 'object') {
                    //                 apiSpeedObj[key].push(data.duration)
                    //             } else {
                    //                 apiSpeedObj[key] = [data.duration]
                    //             }
                    //         }
                    //     }
                    // }
                    if (data.initiatorType == 'script' && location.pathname == '/m/') {
                        gtag('event', data.name, {
                            'event_category': 'home_js_start_time',
                            'value': data.startTime
                        });
                    }
                }
            } catch (err) {
                console.log('perfume analyze error', e);
            }
        }
    });
}

function setListener() {
    window.addEventListener('pageLoaded', function() {
        var ele = document.getElementById('bet-insert')
        var timeStamp = localStorage.getItem('time-stamp')
        var time = new Date().getTime()
        var gap = 0
        if (ele) {
            if (timeStamp) {
                gap = 2000 - (time - timeStamp)
                gap = gap < 0 ? 0 : gap
            }
            setTimeout(() => {
                localStorage.removeItem('time-stamp')
                ele.style.display = 'none'
            }, gap);
        }
    })

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function() {
            navigator.serviceWorker.register("/service-worker.js").then(function(reg) {
                // console.log("Service worker registered.", reg);
                var script = document.createElement('script');
                script.src = '/static/utils/pwaInfo.js?v=1.39.6'
                document.body.appendChild(script);
            });
        });
    }

    window.addEventListener('error', function(e) {
        // gtag('event', 'exception', {
        //     'description': e.target? e.target.className + '-error': 'event-error',
        //     'fatal': false
        // });
        e.preventDefault()
    }, true);

    //sacle
    document.addEventListener(
        "gesturestart",
        function(event) {
            event.preventDefault();
        },
        false
    );

    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false)

    requireBangpay()
}

function requireBangpay() {
    var script = document.createElement('script');
    script.src = '/casino/pay/static/sdk/libs/dist/bangpaysdk.min.js?t=' + new Date().getTime();
    document.body.appendChild(script);
    setTimeout(function() {
        if (window.bangPayer && window.bangPayer.preLoadAction) {
            window.bangPayer.preLoadAction();
        }
    }, 15000);
}

//-------------------------window loaded action--------------------------
function setActionBeforeLoaded() {
    !window.thirdCounter && (window.thirdCounter = 0);
    ++window.thirdCounter;
    if (window.thirdCounter < 4) {
        window.thirdHandler && clearTimeout(window.thirdHandler);
        window.thirdHandler = setTimeout(function() {
            window.thirdHandler && clearTimeout(window.thirdHandler);
            window.thirdHandler = null;
            setActionBeforeLoaded();
        }, 1500);
    }
    (window.thirdCounter == 1) && initFacebook();
    (window.thirdCounter == 2) && initTwitter();
    (window.thirdCounter == 3) && initEsk();
    // (window.thirdCounter == 4) && initAdsrvr();
}

window.firebaseEvent = function(eventName, params = {}) {
    if (window.firebase && typeof window.firebase.analytics == 'function') {
        var analytics = window.firebase.analytics()
        var channel = window.bangGoogle ? window.bangGoogle.channel : ''
        var eventParams = Object.assign(params, {
            channel_name: channel
        })
        analytics.logEvent(eventName, eventParams)
    }
}

// setPerfume();1
setListener();
(function() {
    init();
    // setTimeout(function () {
    initFacebook();
    initFirebase()
    // }, 2000);
    // setTimeout(function () {
    //     setActionBeforeLoaded();
    // }, 6000);
})();