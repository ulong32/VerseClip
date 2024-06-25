photoCount = 0;
completedDownloads = 0;
fileList = [];


// ====== zip.mjs ======

zip = (w = [], f = _ => _, cs) => ((
    u = x => new Uint8Array(x), zz = u([0, 0], cs = cs && self.CompressionStream), vz = u([cs ? 20 : 10, 0]), pk = u([80, 75]), _12 = u([1, 2]), _34 = u([3, 4]), gf = u([0, 8]), cm = cs ? u([8, 0]) : zz,
    le2 = x => u([x, x >>> 8]), le4 = x => u([x, x >>> 8, x >>> 16, x >>> 24]), l = x => x.byteLength || x.size || 0, cnt = x => le4(x.reduce((a, y) => a + l(y), 0)), te = new TextEncoder(), i = 0,
    iab = x => x instanceof ArrayBuffer, dfl = b => cs ? new Response((iab(b) ? new Blob([b]) : b).stream().pipeThrough(new cs('deflate-raw'))).blob() : b,
    ddt = x => ((x.getFullYear() - 1980) << 25) | ((x.getMonth() + 1) << 21) | (x.getDate() << 16) | (x.getHours() << 11) | (x.getMinutes() << 5) | (x.getSeconds() >> 1),// mmmsssss hhhhhmmm MMMDDDDD YYYYYYYM // Y-=1980;s/=2;
    crc = (t => (buf, crc = 0) => ~buf.reduce((c, x) => t[(c ^ x) & 0xff] ^ (c >>> 8), ~crc))([...Array(256)].map((_, n) => [...Array(8)].reduce(c => (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1, n)))// https://www.rfc-editor.org/rfc/rfc1952
) => w.reduce(async (a, x, b, cb, n) => (cb = await dfl(b = x.buffer || x), f(++i / w.length / 3), n = te.encode(x.name),
    x = [vz, gf, cm, le4(ddt(new Date(x.lastModified || Date.now()))), le4(crc(u(iab(b) ? b : await new Response(b).arrayBuffer()))), le4(l(cb)), le4(l(b)), le2(l(n)), zz],// vReq flag cpsType date CRC32 cpsSize rawSize nameLength extLength
    f(++i / w.length / 3), a = await a, f(++i / w.length / 3), a.cd.push(pk, _12, vz, ...x, zz, zz, zz, zz, zz, cnt(a.lf), n), a.lf.push(pk, _34, ...x, n, cb), a// PK0102 vMade x cmtLength 0304disk intAttr extAttrLSB extAttrMSB 0304pos name , PK0304 x name content
), { lf: [], cd: [] }).then((x, _ = le2(w.length)) => new Blob([...x.lf, ...x.cd, pk, u([5, 6]), zz, zz, _, _, cnt(x.cd), cnt(x.lf), zz], { type: 'application/zip' })))(),// PK0506 disk 0304startDisk cnt0102disk cnt0102all 0102size 0102pos cmtLength

    unzip = async (w = new Blob()) => ((
        w, e = w.reduceRight((a, _, i) => a || [80, 75, 5, 6].every((x, j) => w[i + j] == x) && i, 0), le = (p, l = 2) => [...Array(l)].reduce((a, _, i) => a | w[p + i] << 8 * i, 0),
        ddt = x => new Date((x >>> 25) + 1980, (x >>> 21 & 15) - 1, x >>> 16 & 31, x >>> 11 & 31, x >>> 5 & 63, (x & 31) * 2).getTime(), td = new TextDecoder()
    ) => Promise.all([...Array(le(e + 8))].reduce((a, p = le(a.p + 42, 4), n) => (
        (n = td.decode(new Uint8Array(w.buffer, p + 30, le(p + 26))))[n.length - 1] != '/' && a.a.push((async () => new File([await {
            0: _ => _, 8: async (x, _) => (_ = self.DecompressionStream) ? await new Response(new Blob([x]).stream().pipeThrough(new _('deflate-raw'))).blob() : x
        }[le(p + 8)](new Uint8Array(w.buffer, p + 30 + le(p + 26) + le(p + 28), le(p + 18, 4)))], n, { lastModified: ddt(le(p + 10, 4)) }))()), a.p += 46 + le(a.p + 28) + le(a.p + 30) + le(a.p + 32), a
    ), { p: le(e + 16, 4), a: [] }).a))((w = w.buffer || w, new Uint8Array(w instanceof ArrayBuffer ? w : await new Response(w).arrayBuffer()))),

    dl = ({ name: n, buffer: b }) => (a => URL.revokeObjectURL(a.href = URL.createObjectURL(b instanceof Blob ? b : new Blob([b])), a.download = n, a.click()))(document.createElement('a')),
    progress = (w, f) => new Response(new ReadableStream({ start: async (c, x, s = [0, +w.headers.get('content-length')], r = w.body.getReader()) => { f(s); while (x = (await r.read()).value) { c.enqueue(x); s[0] += x.length; f(s); } c.close(); } }));

// ======================



// ダウンロード処理
function download(url, fileName) {
    fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
            fileList.push({ name: fileName, buffer: new Blob([blob]) });
            reportCompletion();
        })
        .catch((err) => {
            console.error(err);
        });
}

function getCurrentYearMonth() {
    const date = new Date();
    return (
        String(date.getFullYear()) +
        String(date.getMonth() + 1).padStart(2, "0")
    );
}
params = new URLSearchParams(location.search);
yearMonth = params.get("setDate") !== null
    ? params.get("setDate")
    : getCurrentYearMonth();


fetch("https://aipri.jp/mypage/api/myphoto-list", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Cookie": document.cookie
    },
    body: `target_ym=${yearMonth}&data_count=999`
})
.then(r => r.json())
.then((result) => {
    photoObject = result.data.photo_list;
    photoCount = photoObject.length;
    document.querySelector("body").insertAdjacentHTML("beforeend", `
<div id="dlAnnounce" style="border-radius: 20px; position: fixed; right:50px; bottom: 50px; padding: 25px; background-color: white; box-shadow: 0 0 6px 6px #0002">
    <div id="dlText" style="margin: 4px; font-size: 20px;">ダウンロード中... 0 / ${photoCount}</div>
    <progress id="dlProgress" style="width: 100%; margin:4px;" max="${photoCount}" value="0"></progress>
</div>`);
    dlAnnounce = document.querySelector("#dlAnnounce");
    dlText = document.querySelector("#dlText");
    dlProgress = document.querySelector("#dlProgress");

    photoObject.forEach((object, index) => {
        setTimeout(() => {
            download(object.photo_file_url, `aipriverse_album_${object.play_date.replace("-", "")}_${object.photo_seq}.jpg`);
        }, index * 100);
    });
});

function reportCompletion() {
    completedDownloads++;
    dlText.innerText = `ダウンロード中... ${completedDownloads} / ${photoCount}`;
    dlProgress.value = completedDownloads;
    if (completedDownloads === photoCount) {
        dlText.innerText = "ダウンロード完了。ファイル生成中...";
        zip(fileList).then((buffer) => {
            dl({
                name: "aipriverse_album_" + yearMonth + ".zip",
                buffer: buffer,
            });
            dlText.innerText = "ダウンロード完了。ファイル生成終了！";
            setTimeout(() => {
                dlAnnounce.animate(
                    [
                        { opacity: "1.0" },
                        { opacity: "0" }
                    ],
                    {
                        duration: 1250
                    }
                );
            }, 3000);
            setTimeout(() => {
                dlAnnounce.remove();
            }, 4250);
        });
    }
}
