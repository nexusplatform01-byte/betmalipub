!(function(t, e) {
    var o, n, p, r;
    e.__SV ||
        ((window.posthog = e),
            (e._i = []),
            (e.init = function(i, s, a) {
                function g(t, e) {
                    var o = e.split('.');
                    2 == o.length && ((t = t[o[0]]), (e = o[1])),
                        (t[e] = function() {
                            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                        });
                }
                ((p = t.createElement('script')).type = 'text/javascript'),
                (p.crossOrigin = 'anonymous'),
                (p.async = !0),
                (p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js?v=1.371.2'),
                (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
                var u = e;
                for (
                    void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
                    u.people = u.people || [],
                    u.toString = function(t) {
                        var e = 'posthog';
                        return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
                    },
                    u.people.toString = function() {
                        return u.toString(1) + '.people (stub)';
                    },
                    o =
                    'init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug'.split(
                        ' '
                    ),
                    n = 0; n < o.length; n++
                )
                    g(u, o[n]);
                e._i.push([i, s, a]);
            }),
            (e.__SV = 1));
})(document, window.posthog || []);
posthog.init('phc_qihoCjQKDjMDzZ7bRaoRkfUTzcmP64WmYV5fYN7sNTkT', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30',
    capture_pageview: true,
    persistence: 'localStorage',
    disable_cookies: true,
    loaded: function(ph) {
        window.phReady = true;
        window.phInstance = ph;
        window.dispatchEvent(new Event('phReady'));
    }
});

/**
 * postHog用户绑定
 * 绑定匿名用户与登录用户行为
 * @param {*} userInfo 用户信息对象
 */
window.bingPostHogUserInfo = function(userInfo) {
    if (!window.phReady || !window.phInstance) return;

    const postHog = window.phInstance;
    const finalUserId = userInfo ? .userId || userInfo ? .id;
    if (!finalUserId) return;

    const currentDistinctId = postHog.get_distinct_id();

    if (currentDistinctId && currentDistinctId != finalUserId) {
        postHog.alias(finalUserId, currentDistinctId);
    }

    const userProperties = {
        country: userInfo ? .country,
        channel: userInfo ? .channel,
        device: getDevice(),
        userId: finalUserId,
        vipLevel: userInfo ? .vipLevel
    };

    postHog.identify(finalUserId, userProperties);
};

/**
 * 登出时重置PostHog状态
 */
window.logoutPostHog = function() {
    if (!window.phReady || !window.phInstance) return;
    window.phInstance.reset();
};

/**
 * 页面加载时自动检查并绑定已登录用户
 */
function autoBindPostHogUser() {
    if (!window.phReady || !window.phInstance) return;

    const userStr = localStorage.getItem('user.loginInfo') || localStorage.getItem('user');
    if (!userStr) return;

    try {
        const userObj = JSON.parse(userStr);
        const finalUserId = userObj ? .userId || userObj ? .id;
        if (!finalUserId) return;

        window.bingPostHogUserInfo(userObj);
    } catch (e) {
        console.error('autoBindPostHogUser error:', e);
    }
}

// PostHog加载完成后自动绑定
setTimeout(autoBindPostHogUser, 500);
window.addEventListener('phReady', autoBindPostHogUser);

function getUUid() {
    if (!window.localStorage) {
        return false;
    }
    var ret = {
        guid: '',
        num: 0,
        stamp: 0
    };
    var now = Math.floor(new Date().getTime() / 1000);
    var udidData = window.localStorage.getItem('helper-udid-third');
    if (udidData && udidData.indexOf('{') != -1) {
        ret = JSON.parse(udidData);
        if (ret.stamp) {
            if (now - ret.stamp > 3600 * 24 * 7) {
                ret.num = 0;
                ret.stamp = now;
            }
        }
    }
    if (!ret.guid || ret.guid == '') {
        ret = {
            guid: S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4(),
            num: 0,
            stamp: now
        };
        if (window.localStorage) window.localStorage.setItem('helper-udid-third', JSON.stringify(ret));
    }
    return ret;
}

function getDevice() {
    var uuidData = getUUid();
    var device = {
        lobbyVersion: '1.0.0',
        deviceModel: '',
        deviceHeight: '',
        deviceWidth: '',
        osName: '',
        osVersion: '',
        macAddr: '',
        udid: uuidData.guid,
        isp: '',
        network: '',
        appVersion: '',
        imei: '',
        location: '',
        open_info: '',
        app_base_ver: '',
        regid: '',
        isEmulator: ''
    };
    if (window.navigator) {
        device['osVersion'] = window.navigator.appVersion || '';
        device['open_info'] = window.navigator.userAgent || '';
    }
    return device;
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}