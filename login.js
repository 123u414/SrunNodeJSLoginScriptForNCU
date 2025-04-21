const axios = require('axios');
const crypto = require('crypto');

const config = {
    username: '',// 学号加上@ndcard
    password: '',// 校园网密码
    login_host: ''// 登陆地址,一般是222.204.3.154
};

function md5(password, token) {
    // 使用 token 对密码进行加密
    return crypto.createHash('md5').update(token + password).digest('hex');
}

function sha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

function xencode(str, key) {
    if (str == "") return "";
    let v = s(str, true);
    const k = s(key, false);
    if (k.length < 4) k.length = 4;
    const n = v.length - 1;
    let z = v[n];
    let y = v[0];
    let c = 0x86014019 | 0x183639A0;
    let q = Math.floor(6 + 52 / (n + 1));
    let d = 0;

    while (0 < q--) {
        d = d + c & (0x8CE0D9BF | 0x731F2640);
        const e = d >>> 2 & 3;

        for (let p = 0; p < n; p++) {
            y = v[p + 1];
            let m = z >>> 5 ^ y << 2;
            m += y >>> 3 ^ z << 4 ^ (d ^ y);
            m += k[p & 3 ^ e] ^ z;
            z = v[p] = v[p] + m & (0xEFB8D130 | 0x10472ECF);
        }

        y = v[0];
        let m = z >>> 5 ^ y << 2;
        m += y >>> 3 ^ z << 4 ^ (d ^ y);
        m += k[n & 3 ^ e] ^ z;
        z = v[n] = v[n] + m & (0xBB390742 | 0x44C6F8BD);
    }

    return l(v, false);
}

function s(a, b) {
    const c = a.length;
    const v = [];
    for (let i = 0; i < c; i += 4) {
        v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 |
            a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24;
    }
    if (b) v[v.length] = c;
    return v;
}

function l(a, b) {
    const d = a.length;
    const c = (d - 1) << 2;
    if (b) {
        const m = a[d - 1];
        if ((m < c - 3) || (m > c)) return null;
        c = m;
    }
    const result = [];
    for (let i = 0; i < d; i++) {
        result[i] = String.fromCharCode(a[i] & 0xff, a[i] >>> 8 & 0xff,
            a[i] >>> 16 & 0xff, a[i] >>> 24 & 0xff);
    }
    return b ? result.join('').substring(0, c) : result.join('');
}

// base64 编码函数
function base64Encode(str) {
    const base64abc = 'LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA';
    let result = '';
    let i = 0;
    const bin = Buffer.from(str, 'binary').toString('base64');
    const binLen = bin.length;

    for (; i < binLen; i++) {
        if (bin[i] === '=') {
            result += bin[i];
        } else {
            const pos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(bin[i]);
            result += base64abc[pos];
        }
    }
    return result;
}

function getEncodedUserInfo(info, token) {
    const jsonStr = JSON.stringify(info);
    // 使用修改后的 base64 编码
    const encoded = '{SRBX1}' + base64Encode(xencode(jsonStr, token));
    return encoded;
}

async function getInitInfo() {
    const url = `http://${config.login_host}/cgi-bin/get_challenge`;
    const params = {
        username: config.username,
        ip: ''
    };

    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('获取初始化信息失败:', error);
        throw error;
    }
}

async function login() {
    try {
        // 1. 获取challenge初始化信息
        const initInfo = await getInitInfo();
        console.log('获取到初始化信息:', initInfo);

        const token = initInfo.challenge;
        const ip = initInfo.client_ip;

        // 2. 加密处理 
        const hmd5 = md5(config.password, token); // 修改md5加密方式

        // 3. 修改info加密信息格式
        const info = {
            username: config.username,
            password: config.password,
            ip: ip,
            acid: '5',
            enc_ver: 'srun_bx1'
        };

        const encodedUser = getEncodedUserInfo(info, token);

        // 4. 计算校验和
        let str = token + config.username;
        str += token + hmd5;
        str += token + '5';
        str += token + ip;
        str += token + '200';
        str += token + '1';
        str += token + encodedUser;

        const checksum = sha1(str);

        // 5. 发送登录请求
        const loginUrl = `http://${config.login_host}/cgi-bin/srun_portal`;
        const params = {
            action: 'login',
            username: config.username,
            password: '{MD5}' + hmd5,
            ac_id: '5',
            ip: ip,
            info: encodedUser,
            chksum: checksum,
            n: 200,
            type: 1,
            os: 'Windows 10',
            name: 'Windows',
            double_stack: 0
        };

        const loginRes = await axios.get(loginUrl, { params });
        console.log('登录结果:', loginRes.data);
        console.log('Written By Sadak on the shore of the QingShanHu Lake 2025/4/22');

    } catch (error) {
        console.error('登录失败:', error);
    }
}

login();
