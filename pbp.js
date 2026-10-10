/* pbp.js – Play-by-Play Creator logic */

const SK = 'pbp_creator_v4';
const NP = new Set(['punt', 'kick', 'kick_return', 'penalty', 'timeout', 'xp', '2pt']);
const QL = ['', 'Q1', 'Q2', 'Q3', 'Q4', 'OT'];
const TL = {
    pass: 'PASS',
    rush: 'RUSH',
    inc: 'INCOMPLETE',
    intercept: 'INTERCEPT',
    sack: 'SACK',
    td: 'TOUCHDOWN',
    safety: 'SAFETY',
    xp: 'EXTRA POINT',
    '2pt': '2PT CONVERSION',
    fg: 'FIELD GOAL',
    punt: 'PUNT',
    kick: 'KICKOFF',
    kick_return: 'KICK RETURN',
    fumble: 'FUMBLE',
    turnover: 'TURNOVER',
    penalty: 'PENALTY',
    timeout: 'TIMEOUT',
    other: 'OTHER'
};

// Rosters database (loaded from rosters.json or fallback)
let rostersDB = {
    "teams": [
        {
            "name": "早大 BIGBEARS",
            "abbr": "早大",
            "city": "早稲田",
            "aliases": [
                "早大 ＢＩＧＢＥＡＲＳ",
                "早稲田大学 BIGBEARS",
                "早稲田大学 ＢＩＧＢＥＡＲＳ",
                "BIGBEARS",
                "早大",
                "早稲田",
                "早稲田大学"
            ],
            "roster": {
                "12": "QB道浦",
                "18": "QB木庭",
                "11": "QB竹原",
                "15": "QB岩井",
                "25": "RB大谷",
                "33": "RB長内",
                "28": "RB植村",
                "29": "RB池本",
                "7": "RB齊藤高",
                "45": "RB小郷",
                "31": "WR野上",
                "0": "WR鳴島",
                "10": "WR平山",
                "98": "WR安東",
                "8": "WR大沼",
                "80": "WR白田",
                "13": "WR高橋汰",
                "14": "WR高橋玄",
                "82": "WR神鳥",
                "81": "WR丸山",
                "86": "WR吉野",
                "84": "WR渡邉",
                "48": "WR大土井",
                "88": "WR安田",
                "83": "WR/K/P佐藤和",
                "89": "WR齊藤公",
                "93": "WR三澤",
                "85": "WR山口仁",
                "46": "WR大槻",
                "64": "OL小川",
                "56": "OL風間",
                "73": "OL坂田",
                "69": "OL大村",
                "55": "OL佐藤亜",
                "75": "OL福良",
                "71": "OL渡邊",
                "72": "OL宇野",
                "78": "OL木嶋",
                "67": "OL陣内",
                "51": "OL中村",
                "79": "OL宇野",
                "76": "OL堀田",
                "97": "DL北村",
                "99": "DL佐藤大",
                "20": "DL田中一",
                "95": "DL橋本",
                "94": "DL磯",
                "96": "DL中田",
                "40": "DL矢口",
                "5": "DL伊藤",
                "35": "DL坂本塁",
                "63": "DL山口太",
                "49": "DL吉川大",
                "91": "DL坂本怜",
                "92": "DL小榑",
                "39": "DL三浦",
                "9": "LB太田善",
                "37": "LB林",
                "43": "LB松井",
                "44": "LB遠藤",
                "19": "LB大井",
                "90": "LB髙野",
                "47": "LB寺田",
                "21": "DB池谷",
                "2": "DB折原",
                "6": "DB妹尾",
                "23": "DB/K日高",
                "3": "DB三平",
                "4": "DB宮下",
                "41": "DB小島",
                "30": "DB新村",
                "17": "DB鈴木万",
                "26": "DB平木",
                "1": "DB宮澤",
                "32": "DB後藤",
                "27": "DB/K/P出口",
                "87": "DB原",
                "24": "DB渡辺亮",
                "22": "DB田中渓",
                "42": "DB吉岡",
                "16": "K/P シェーファー",
                "38": "K/P 千本木"
            }
        },
        {
            "name": "法大 ORANGE",
            "abbr": "法大",
            "city": "法",
            "aliases": [
                "法大 ＯＲＡＮＧＥ",
                "法大",
                "ORANGE",
                "法政",
                "法政大学"
            ],
            "roster": {
                "0": "TE矢作",
                "1": "WR藤田",
                "2": "LB盛",
                "3": "DL中井",
                "4": "QB菊池慶",
                "5": "RB五嶋",
                "6": "RB今手",
                "7": "DB岡村",
                "8": "WR室",
                "9": "LB瀧川",
                "10": "TE佐々木",
                "11": "WR山田",
                "12": "QB田邉",
                "*12": "DB渡邉",
                "13": "DB鈴木",
                "14": "DB柴崎",
                "15": "LB犬飼",
                "16": "K鎭野",
                "*16": "WR脇田",
                "17": "WR廣田",
                "18": "WR渡辺",
                "19": "QB菊地祥",
                "*19": "DB小高",
                "20": "DB佐々木",
                "21": "DB杉山",
                "22": "LB桐原",
                "23": "DB堀",
                "24": "DB安達",
                "25": "WR新見",
                "26": "RB宮本",
                "27": "DBジュッフ",
                "28": "DB岩村",
                "29": "RB竹村",
                "30": "DB鳴嶋",
                "31": "RB石井",
                "32": "RB小池",
                "33": "RB谷崎",
                "34": "DB仲井",
                "35": "DL迫尾",
                "36": "DB野尻",
                "37": "WR寺島",
                "38": "DB西澤",
                "39": "DL柴田",
                "40": "WR柳瀬",
                "41": "LB原",
                "42": "LB前島",
                "43": "LB宇都宮",
                "44": "LB小松",
                "45": "DB高田",
                "46": "LB神保",
                "47": "LB河合",
                "48": "DB浦野",
                "49": "LB山嵜",
                "50": "LB加藤",
                "51": "LB石川",
                "52": "DL三村",
                "53": "OL橋口",
                "54": "LB川村",
                "55": "DL旗手",
                "56": "OL茂山",
                "57": "LB松尾",
                "58": "OL山本",
                "59": "OL黒川",
                "60": "DB洞井",
                "61": "LB辰巳",
                "62": "OL中村蒼",
                "64": "OL中村光",
                "65": "OL相場",
                "66": "OL金田",
                "68": "OL谷口",
                "69": "DL三浦",
                "70": "DL江渕",
                "71": "OL原",
                "72": "OL安藤",
                "73": "OL喜多見",
                "74": "DL庄司",
                "75": "OL秋本",
                "76": "OL中島",
                "77": "OL大場",
                "78": "OL石口",
                "79": "OL東",
                "80": "WR平泉",
                "81": "WR阿部",
                "82": "TE棚瀬",
                "83": "WR岩崎",
                "84": "WR山口",
                "85": "TE牛島",
                "86": "TE速水",
                "87": "TE佐藤",
                "88": "DB山下",
                "89": "TE雲田",
                "90": "DL吉川",
                "91": "DL篠",
                "92": "DL吉川",
                "93": "DL田中",
                "94": "DL三ヶ島",
                "95": "DL壽藤",
                "96": "DL小林",
                "97": "DL赤穂谷",
                "98": "DL児玉",
                "99": "DL安永"
            }
        },
                {
            "name": "明大 GRIFFINS",
            "abbr": "明大",
            "city": "明",
            "aliases": [
                "明大 ＧＲＩＦＦＩＮＳ",
                "明大",
                "GRIFFINS",
                "明治",
                "明治大学",
                "明治大"
            ],
            "roster": {
                "0": "DB大村",
                "1": "DB北本",
                "2": "WR後藤",
                "3": "LB岡田",
                "4": "LB大石",
                "5": "RB宇野",
                "6": "WR後藤",
                "7": "RB木村",
                "8": "K川崎",
                "9": "LB関",
                "10": "WR城",
                "11": "DL水野",
                "12": "QB堀切",
                "13": "QB関根",
                "14": "WR八木",
                "15": "QB京谷",
                "16": "WR三橋",
                "17": "DB須藤",
                "18": "FB田中",
                "19": "WR小潟",
                "20": "DB吉田",
                "21": "DB高橋",
                "22": "DB西念",
                "23": "RB安藤",
                "24": "LB北本",
                "25": "RB牛島",
                "26": "RB亀井",
                "27": "DB小黒",
                "28": "DB山田",
                "29": "DB川東",
                "30": "QB田中",
                "31": "RB鎗田",
                "32": "DB立田",
                "33": "DB岩崎",
                "34": "DB小林",
                "35": "LB佐尾山",
                "36": "K石山",
                "37": "WR藤本",
                "38": "WR近藤",
                "39": "DB東山",
                "40": "LB浅川",
                "41": "FB兼子",
                "42": "RB児玉",
                "43": "WR田中",
                "44": "LB海津",
                "45": "TE須川",
                "46": "TE後藤",
                "47": "FB小山田",
                "49": "DB佃",
                "51": "LB田中",
                "52": "LB中",
                "54": "OL古谷",
                "55": "LB耳田",
                "56": "LB齊藤",
                "57": "OL鈴木",
                "59": "LB丸山",
                "60": "LB梶山",
                "62": "OL鈴木",
                "63": "OL西野",
                "65": "DL田口",
                "67": "DB高坂",
                "70": "OL島田",
                "71": "OL小川",
                "72": "DL曽我辺",
                "73": "OL長田",
                "74": "OL持田",
                "75": "OL石川",
                "76": "OL東",
                "77": "OL木村",
                "78": "OL大島",
                "80": "WR村上",
                "81": "WR梶",
                "82": "WR松浦",
                "83": "RB佐川",
                "84": "WR角舘",
                "85": "FB土屋",
                "86": "WR松尾",
                "87": "TE石井",
                "88": "TE田原",
                "89": "TE田村",
                "90": "DL谷岡",
                "91": "DL渡辺",
                "92": "DL加藤",
                "93": "DL臼井",
                "94": "DL中里",
                "95": "DL池田",
                "96": "DL中村",
                "97": "DL藤井",
                "98": "DL福井",
                "99": "DL禱田"
            }
        },
                {
            "name": "東大 WARRIORS",
            "abbr": "東大",
            "city": "東",
            "aliases": [
                "東大 ＷＡＲRＩＯＲＳ",
                "東大 ＷＡＲＲＩＯＲＳ",
                "東大",
                "WARRIORS",
                "東京大学"
            ],
            "roster": {
                "0": "LB武田",
                "1": "LB近江",
                "2": "DL福永",
                "3": "QB/P田中",
                "4": "WR木岡",
                "5": "DB時永",
                "6": "WR古屋",
                "7": "DB伊東",
                "8": "LB門岡",
                "9": "DL天摩",
                "10": "DL木下",
                "11": "RB武田",
                "12": "QB/DB安田",
                "13": "WR山崎",
                "14": "DB黒川",
                "15": "DB廣岡",
                "16": "QB高橋",
                "17": "QB秋野",
                "18": "DL坂本",
                "19": "DB/K原",
                "20": "LB細見",
                "21": "DB伊藤",
                "22": "DB稲垣",
                "23": "DB神田",
                "24": "RB友安",
                "25": "DB/P加嶋",
                "26": "RB大友",
                "27": "DB/P里井",
                "28": "QB高橋",
                "29": "DB山門",
                "30": "LB吉野",
                "35": "DB桑原",
                "36": "DB古源",
                "38": "DB赤川",
                "39": "RB草場",
                "40": "RB徳岡",
                "41": "DB岸",
                "42": "DB平田",
                "43": "LB/K上甲",
                "44": "RB寅丸",
                "45": "LB/K松崎",
                "47": "OL殿村",
                "48": "DB櫻井",
                "49": "RB鈴木",
                "50": "OL大和",
                "55": "DL土屋",
                "56": "LB小村",
                "58": "DL立入",
                "61": "OL小河",
                "63": "OL荒田",
                "65": "OL塩原",
                "67": "OL吉村",
                "69": "OL大石",
                "70": "OL稲本",
                "71": "OL水野",
                "74": "OL村上",
                "76": "OL王",
                "77": "OL/P前田",
                "78": "OL邵",
                "79": "DL塚口",
                "80": "TE山口",
                "81": "DL河野",
                "82": "TE/K西田",
                "83": "TE/P神田",
                "84": "WR栗田",
                "85": "RB藤原",
                "86": "WR清水",
                "87": "WR河野",
                "88": "RB長澤",
                "89": "RB大武",
                "90": "DL吉松",
                "91": "QB/P加藤",
                "93": "DL稲穂",
                "94": "DL丹羽",
                "95": "DL久保",
                "97": "DL井上",
                "98": "DL川野",
                "99": "DL佐々木"
            }
        },
        {
        "name": "立大 RUSHERS",
        "abbr": "立大",
        "city": "立",
        "aliases": [
                "立大 ＲＵＳＨＥＲＳ",
                "立大",
                "RUSHERS",
                "立教",
                "立教大学",
                "立大rushers",
                "立大 RUSHERS",
                "立大　ＲＵＳＨＥＲＳ",
                "rushers"
        ],
        "roster": {
                "0": "DL下関",
                "1": "DB保科",
                "2": "LB丹羽",
                "3": "WR小林",
                "4": "RB平田",
                "5": "DB平田",
                "6": "WR平本",
                "7": "DB天野",
                "8": "QB南",
                "9": "DLマーティン",
                "10": "WR深澤",
                "11": "QB中川",
                "13": "WR川崎",
                "14": "DB川島",
                "15": "WR長谷川",
                "16": "K秋山",
                "17": "DB花澤",
                "19": "DB中村",
                "20": "DB丸山",
                "21": "DB白山",
                "22": "RB青木",
                "23": "DB菊池",
                "24": "RB大場",
                "25": "LB和田",
                "26": "DB伊藤",
                "27": "DB朝山",
                "28": "DB竹内",
                "29": "RB谷本",
                "30": "DB小賀",
                "31": "DB奥平",
                "32": "DB森",
                "33": "LB遠藤",
                "34": "RB阿曾",
                "35": "DB藤内",
                "37": "RB福貴田",
                "38": "DB澤頭",
                "39": "DB東",
                "40": "LB小島",
                "41": "LB飯野",
                "42": "RB橋本",
                "43": "DB上田",
                "44": "LB岩崎",
                "45": "DB小脇",
                "46": "DB林",
                "47": "LB鈴木",
                "48": "DBキーガン",
                "49": "LB粟井",
                "51": "LB藤井",
                "53": "LB田辺",
                "54": "K土生",
                "55": "DL工藤",
                "56": "OL野中",
                "57": "OL羽渕",
                "58": "DL齊藤",
                "59": "DB山口",
                "63": "OL堀川",
                "65": "OL影山",
                "66": "OL大橋",
                "67": "OL川崎",
                "71": "OL竹山",
                "73": "OL高橋",
                "74": "OL瀬尾",
                "77": "OL青北",
                "78": "OL谷澤",
                "80": "WR小寺",
                "81": "WR田崎",
                "82": "WR齋藤",
                "83": "WR笹",
                "84": "WR對馬",
                "87": "TE森本",
                "88": "TE齋藤",
                "90": "DL城阪",
                "91": "TE渡邉",
                "92": "DL植田",
                "93": "DL関口",
                "95": "DL六浦",
                "96": "DL西口",
                "99": "DL田中"
        }
},
                {
            "name": "中大 RACCOONS",
            "abbr": "中大",
            "city": "中",
            "aliases": [
                "中大 ＲＡＣＣＯＯＮＳ",
                "中大",
                "RACCOONS",
                "中央",
                "中央大学",
                "中央大"
            ],
            "roster": {
                "0": "DB安藤",
                "1": "WR/K/P新保",
                "2": "QB/WR小野",
                "3": "QB畑尾",
                "4": "WR境",
                "5": "LB村木",
                "6": "WR/K/P石川",
                "7": "WR野際",
                "8": "DB柿内",
                "9": "LB村上",
                "10": "RB/P上村",
                "11": "RB浅川",
                "12": "QB正村",
                "13": "WR吉原",
                "14": "DB大東",
                "15": "LB小林",
                "16": "DL石川",
                "17": "LB高橋",
                "18": "QB林",
                "19": "WR島田",
                "20": "DB上田",
                "21": "DB藤澤",
                "22": "DB市村",
                "23": "DB安田",
                "24": "DB鈴木",
                "25": "RB山口",
                "26": "DB堀江",
                "28": "DL/LB丹羽",
                "29": "DL草刈",
                "30": "LB小池",
                "31": "WR松田",
                "32": "WR/DB若林",
                "33": "DL唱村",
                "36": "RB中村",
                "40": "LB高木",
                "41": "RB後藤",
                "44": "TE青柳",
                "47": "DL小窪",
                "52": "OL別府",
                "54": "LB/K/P奥",
                "55": "DL石井",
                "56": "OL矢作",
                "57": "LB水谷",
                "58": "LB末永",
                "59": "OL呉",
                "65": "OL/DL木下",
                "69": "OL赤平",
                "70": "OL妹尾",
                "75": "OL南口",
                "77": "OL清野",
                "78": "OL中村",
                "79": "OL/SNP松浦",
                "80": "WR細田",
                "81": "WR山野",
                "82": "WR児玉",
                "87": "TE谷宮",
                "88": "DL古屋",
                "90": "DL鈴木",
                "94": "DL北浦",
                "95": "DL大澤",
                "97": "DL金子",
                "99": "DB伊藤"
            }
        },
                {
            "name": "慶大 UNICORNS",
            "abbr": "慶大",
            "city": "慶",
            "aliases": [
                "慶大 ＵＮＩＣＯＲＮＳ",
                "慶大",
                "UNICORNS",
                "慶應",
                "慶應義塾大学",
                "慶應大学",
                "慶應大"
            ],
            "roster": {
                "0": "DB/LB柳原",
                "2": "QB滝沢",
                "3": "WR若槻",
                "4": "DB西田",
                "5": "WR佐藤",
                "6": "LB山下",
                "7": "DB小平",
                "9": "TE/K大島",
                "10": "WR富安",
                "11": "DL天野",
                "13": "LB小林",
                "14": "WR/P高原",
                "16": "QB/P依田",
                "17": "DB山下",
                "18": "QB真島",
                "24": "DB池松",
                "25": "RB田中",
                "26": "DB佐々木",
                "*26": "DB泉山",
                "27": "DB稲井",
                "28": "DB/P加藤",
                "30": "DB三田",
                "31": "RB橋口",
                "33": "DB池松",
                "34": "DB勝見",
                "38": "RB鶴田",
                "41": "LB吉川",
                "42": "LB渡辺",
                "43": "LB井口",
                "44": "SB山口",
                "47": "LB松岡",
                "50": "OL/DL重手",
                "52": "DL山田",
                "58": "OL田口",
                "59": "OL/DL松江",
                "*59": "OL松江",
                "60": "LB文平",
                "66": "DL高橋",
                "71": "OL/DL篠原",
                "*71": "OL岩戸",
                "72": "OL海老谷",
                "73": "DL加藤",
                "75": "OL小林",
                "78": "OL松本",
                "79": "OL丹羽",
                "84": "WR津國",
                "88": "WR早川",
                "93": "LB戸田",
                "98": "LB工藤",
                "99": "LB切手"
            }
        },
                {
            "name": "日体大 TRIUMPHANT LION",
            "abbr": "日体大",
            "city": "日体",
            "aliases": [
                "日体大 ＴＲＩＵＭＰＨＡＮＴ　ＬＩＯＮ",
                "日体大",
                "TRIUMPHANT LION",
                "日本体育大学",
                "日体"
            ],
            "roster": {
                "0": "WR梶",
                "1": "DB多田",
                "2": "DB鯨岡",
                "3": "DB/P相馬",
                "4": "WR金澤",
                "5": "RB小菅",
                "6": "DL龍",
                "7": "DB大久保",
                "8": "TE福永",
                "9": "DB東口",
                "10": "DB山口",
                "11": "LB相良",
                "12": "QB八木",
                "13": "DB岩上",
                "14": "WR鈴木",
                "15": "QB石川",
                "16": "QB中嶋",
                "17": "WR篠田",
                "18": "WR/K長谷",
                "19": "DB冨樫",
                "20": "RB宇野",
                "21": "RB齋藤",
                "22": "WR駒井",
                "23": "DB/K吉越",
                "24": "RB久保",
                "25": "WR野原",
                "26": "DB中川",
                "27": "LB打越",
                "28": "WR神山",
                "29": "DB長谷川",
                "30": "RB齊藤",
                "31": "LB栗田",
                "32": "RB小峯",
                "33": "LB山塚",
                "34": "DB北野",
                "35": "DB山本",
                "36": "DB青木",
                "37": "RB佐々木",
                "39": "RB渡邉",
                "40": "LB東原",
                "41": "DB中村",
                "42": "DB田中",
                "43": "WR柴田",
                "44": "LB小林",
                "45": "LB荘司",
                "46": "WR野中",
                "47": "LB飯山",
                "48": "DB川添",
                "49": "LB久保田",
                "50": "LB橘内",
                "51": "OL阿部",
                "52": "OL佐藤",
                "53": "LB石井",
                "55": "DL森園",
                "56": "OL高木",
                "57": "OL山下",
                "58": "LB鈴木",
                "59": "LB稲垣",
                "61": "OL里井",
                "66": "LB山口",
                "70": "OL林",
                "71": "OL鷲尾",
                "73": "OL渡部",
                "74": "OL志村",
                "75": "OL岩佐",
                "77": "OL岩村",
                "78": "OL宮本",
                "79": "OL山岸",
                "80": "WR石井",
                "81": "WR齋藤",
                "82": "RB諏訪",
                "83": "WR木村",
                "84": "WR河合",
                "85": "TE加藤",
                "87": "WR/P渡部",
                "88": "WR五十嵐",
                "89": "WR渡邊",
                "*89": "WR町田",
                "90": "DL宮崎",
                "91": "DL石毛",
                "94": "DL市村",
                "95": "DL柴﨑",
                "98": "DL用田",
                "99": "DL磯谷"
            }
        },
                {
            "name": "立命大 PANTHERS",
            "abbr": "立命大",
            "city": "立命",
            "aliases": [
                "立命大 ＰＡＮＴＨＥＲＳ",
                "立命大",
                "PANTHERS",
                "立命館",
                "立命館大学",
                "立命",
                "立命館大"
            ],
            "roster": {
                "0": "DL鈴木",
                "1": "RB漆原",
                "2": "DB山本",
                "3": "DB藤岡",
                "5": "DB内野",
                "6": "WR中川",
                "7": "WR有馬",
                "10": "QB小西",
                "14": "QB安藤",
                "15": "K土手",
                "16": "QB大鹿",
                "18": "LB桐間",
                "22": "RB/WR奥村",
                "23": "RB蓑部",
                "24": "RB柳瀬",
                "27": "RB横山",
                "28": "K斎藤",
                "33": "LB土肥",
                "34": "RB野村",
                "37": "DB川井",
                "44": "LB井上",
                "48": "DB中原",
                "50": "DL高山",
                "54": "OL寺下",
                "57": "DL金城",
                "66": "OL岡田",
                "71": "OL南",
                "75": "OL小橋",
                "77": "OL宮川",
                "82": "WR林",
                "83": "P井口",
                "86": "WR大槻",
                "91": "TE宮崎",
                "97": "DL岩屋口"
            }
        },
                {
            "name": "関大 KAISERS",
            "abbr": "関大",
            "city": "関",
            "aliases": [
                "関大 ＫＡＩＳＥＲＳ",
                "関大",
                "KAISERS",
                "関西大学",
                "関西大"
            ],
            "roster": {
                "0": "DL熊田",
                "1": "DB吉田",
                "2": "QB土居",
                "3": "DB古谷",
                "4": "DB佐々木",
                "5": "RB前川",
                "6": "DB谷中",
                "7": "TE桃木",
                "8": "QB高井",
                "9": "DB岡田",
                "10": "DB上藤",
                "11": "WR辻野",
                "12": "WR足立",
                "13": "DB中山",
                "14": "DB津田",
                "15": "K鈴木",
                "16": "QB大湾",
                "17": "WR藤田",
                "18": "WR川原﨑",
                "19": "WR町井",
                "20": "DB西野",
                "21": "DB西田",
                "22": "RB亀田",
                "23": "DB中本",
                "24": "RB畑生",
                "25": "WR堀川",
                "26": "RB大谷",
                "27": "RB大野",
                "28": "RB北埜",
                "29": "RB向井",
                "30": "WR河合",
                "31": "DB山本",
                "32": "DB山路",
                "33": "LB中谷",
                "34": "DB阪本",
                "35": "DB藤田",
                "36": "DB徳田",
                "37": "DB岡村",
                "38": "RB山内",
                "39": "DB小坂",
                "40": "QB三品",
                "41": "LB橋本",
                "42": "DL小林",
                "43": "LB横山",
                "44": "RB森",
                "46": "DB/K今村",
                "47": "LB丹波",
                "48": "LB宮田",
                "49": "LB中山",
                "50": "OL乾",
                "51": "LB東",
                "52": "OL森川",
                "53": "DB畠久保",
                "54": "DL山口",
                "55": "LB阪本",
                "56": "DL北嶋",
                "57": "LB飛鳥馬",
                "58": "OL山田",
                "59": "OL出原",
                "61": "OL西田",
                "64": "OL西原",
                "65": "K中井",
                "70": "DL伊藤",
                "71": "DL西井",
                "73": "OL野田",
                "77": "OL夏目",
                "78": "OL早川",
                "79": "OL横田",
                "80": "WR柴田",
                "81": "WR梅田",
                "82": "LB寺坂",
                "83": "WR大西",
                "85": "WR朴",
                "86": "WR山口",
                "87": "TE古園",
                "88": "WR住野",
                "89": "WR新井",
                "90": "DL島上",
                "91": "DL藤林",
                "95": "DL津田",
                "98": "DL大塚",
                "99": "DL松浦"
            }
        },
                        {
            "name": "関学大 FIGHTERS",
            "abbr": "関学大",
            "city": "関学",
            "aliases": [
                "関学大 ＦＩＧＨＴＥＲＳ",
                "関学大",
                "FIGHTERS",
                "関西学院大学",
                "関西学院",
                "関学",
                "KG"
            ],
            "roster": {
                "0": "WRリンスコット",
                "2": "WR加島",
                "3": "DB藤田",
                "4": "WR小段",
                "6": "DB増田",
                "7": "DB永井",
                "8": "DB石橋",
                "9": "QB長澤",
                "11": "WR百田",
                "13": "DB豊野",
                "17": "DB東耕",
                "18": "QB星野",
                "20": "RB星野",
                "21": "K/P松井",
                "23": "DB赤澤",
                "25": "DB城島",
                "26": "RB平野",
                "27": "DB野口",
                "28": "WR酒井",
                "29": "K富田",
                "30": "RB大西",
                "31": "RB永井",
                "33": "DB庄司",
                "36": "LS栗久",
                "37": "DB井藤",
                "39": "RB深村",
                "40": "RB松村",
                "41": "LB倉田",
                "42": "LB市村",
                "44": "LB油谷",
                "47": "LB浅野",
                "49": "DB伊東",
                "50": "DL渕",
                "54": "DL馬久地",
                "56": "LB池野",
                "57": "OL城阪",
                "58": "LB上原",
                "59": "OL中野",
                "61": "OL諸星",
                "62": "DL八木",
                "63": "OL毛利",
                "65": "DL森",
                "66": "OL江岡",
                "67": "OL西山",
                "68": "OL西原",
                "69": "OL塚本",
                "70": "OL谷内",
                "71": "OL中西",
                "76": "DL富田",
                "77": "OL瀬在",
                "78": "OL林",
                "79": "OL今井",
                "82": "WR梶本",
                "83": "WR速水",
                "84": "WR塚本",
                "85": "TE大倉",
                "88": "WR北村",
                "91": "DL田渕",
                "93": "TE野手",
                "94": "DL椎名",
                "95": "DL和田",
                "96": "DL千切",
                "97": "DL武野",
                "98": "DL中村",
                "99": "DL田中"
            }
        },
                {
            "name": "京大 GANGSTERS",
            "abbr": "京大",
            "city": "京",
            "aliases": [
                "京大 ＧＡＮＧＳＴＥＲＳ",
                "京大",
                "GANGSTERS",
                "京都大学",
                "京都大",
                "京都"
            ],
            "roster": {
                "1": "DL岡山",
                "2": "WR廣田",
                "3": "QB中村",
                "4": "WR札埜",
                "5": "LB澤",
                "6": "LB竹内",
                "7": "DL川原",
                "8": "DBミルンス",
                "9": "LB井出",
                "10": "LB西尾",
                "12": "DB柏原",
                "13": "DL柴田",
                "14": "WR中嶋",
                "15": "QB中西",
                "16": "DB倉持",
                "17": "QB平岡",
                "19": "WR辻",
                "21": "RB鈴木",
                "22": "RB芳賀",
                "23": "DB齊藤",
                "24": "RB菅野",
                "25": "DB仲北",
                "27": "DB山下",
                "28": "DB谷口",
                "29": "RB赤田",
                "30": "DB櫻井",
                "33": "K宮出",
                "37": "DB平木",
                "38": "DB加藤",
                "39": "RB内藤",
                "40": "RB西山",
                "41": "TE市毛",
                "43": "RB柳川",
                "44": "LB谷口",
                "47": "LB原口",
                "48": "DB二瓶",
                "49": "RB後藤",
                "51": "OL山木",
                "52": "LB橋本",
                "54": "LB大西",
                "55": "OL一瀬",
                "56": "DL種村",
                "60": "OL曽我部",
                "64": "OL宮本",
                "66": "OL西村",
                "67": "OL鈴木",
                "69": "OL栗﨑",
                "74": "OL船戸",
                "76": "OL真鍋",
                "77": "OL前橋",
                "78": "OL吉川",
                "79": "OL前田",
                "81": "WR浅川",
                "83": "WR中村",
                "84": "WRファン",
                "86": "TE丸山",
                "87": "TE森",
                "88": "WR中山",
                "89": "WR北谷",
                "90": "DL戸田",
                "91": "DL吉川",
                "92": "LB児玉",
                "93": "DL五反田",
                "95": "DL池田",
                "96": "DL吉森",
                "97": "DL津田",
                "99": "DL徳野"
            }
        },
        {
            "name": "東北大 HORNETS",
            "abbr": "東北大",
            "city": "東北",
            "aliases": [
                "東北大 ＨＯＲＮＥＴＳ",
                "東北大",
                "HORNETS",
                "東北大学"
            ],
            "roster": {}
        }
    ]
};

// State
let state = {
    awayName: '', awayCity: '', homeName: '', homeCity: '',
    quarterScores: { away: [0, 0, 0, 0, 0], home: [0, 0, 0, 0, 0] },
    awayTotal: 0, homeTotal: 0,
    gameTime: '', gameVenue: '', gameName: '', gameWeather: '',
    ruleType: 'nfl', // 'nfl' or 'college'
    activeQ: 1, currentDriveId: 1,
    drives: {},
    plays: [],
    highlightedPlayIds: []
};

// UI Builder & Options state
let currentBuilderData = {};
let currentActiveOptions = [];
let editingPlayId = null, pendingDeleteId = null, insertAfterPlayId = null;
let currentBoxScoreFilter = 'all'; // 'all', 'away', 'home'
let currentActiveViewTab = 'pbp';  // 'pbp', 'boxscore', 'teamstats', 'fieldmap'
let currentFieldMapFilter = 'all'; // 'all', 'scores', 'away', 'home'
let currentFieldMapDriveId = null; // null: 最新または最初のドライブ
let highlightedMapPlayId = null;

/* ─── Load Rosters ────────────────────────── */
async function loadRosters() {
    try {
        const res = await fetch('rosters.json');
        if (res.ok) {
            const data = await res.json();
            if (data && data.teams) rostersDB = data;
        }
    } catch (e) { }
    updateTeamDatalist();
}

function findTeamInDB(query) {
    if (!query) return null;
    const q = String(query).trim().toUpperCase();
    const qNorm = q.replace(/[\s　]+/g, '');
    return (rostersDB.teams || []).find(t => {
        const tName = (t.name || '').toUpperCase();
        if (tName === q || tName.replace(/[\s　]+/g, '') === qNorm) return true;
        const tAbbr = (t.abbr || '').toUpperCase();
        if (tAbbr && (tAbbr === q || tAbbr.replace(/[\s　]+/g, '') === qNorm)) return true;
        if (t.aliases && t.aliases.some(a => {
            const aUpper = a.toUpperCase();
            return aUpper === q || aUpper.replace(/[\s　]+/g, '') === qNorm;
        })) return true;
        return false;
    }) || null;
}

function updateTeamDatalist() {
    const dl = document.getElementById('teamListDatalist');
    if (!dl) return;
    dl.innerHTML = (rostersDB.teams || []).map(t => {
        return `<option value="${esc(t.name)}">${esc(t.name)}</option>`;
    }).join('');
}

function onTeamNameInput(side) {
    const nameVal = (side === 'away' ? document.getElementById('awayName').value : document.getElementById('homeName').value).trim();
    const cityInput = side === 'away' ? document.getElementById('awayCity') : document.getElementById('homeCity');
    const matched = findTeamInDB(nameVal);
    if (matched && matched.city && !cityInput.value) {
        cityInput.value = matched.city;
        saveGame();
    }
    updatePossOpts();
    renderStepBuilder();
}

function getTeamAbbr(side) {
    const rawName = (side === 'away' ? state.awayName : state.homeName || '').trim();
    if (!rawName) return side === 'away' ? 'AWY' : 'HOM';
    const found = findTeamInDB(rawName);
    if (found && found.abbr) return found.abbr.slice(0, 3);
    return rawName.slice(0, 3).toUpperCase();
}

/* ─── Persist ─────────────────────────────── */
function loadState() {
    try {
        let r = localStorage.getItem(SK);
        if (!r) {
            // Check legacy v3 storage if v4 doesn't exist yet
            r = localStorage.getItem('pbp_creator_v3');
        }
        if (r) {
            const parsed = JSON.parse(r);
            state = { ...state, ...parsed };
        }
        if (!state.ruleType) state.ruleType = 'nfl';
        if (!state.manualStats) {
            state.manualStats = { isEditing: false, boxscore: null, teamstats: null };
        }
    } catch (e) { }
}
function persist() {
    try {
        localStorage.setItem(SK, JSON.stringify(state));
    } catch (e) {
        console.warn('localStorage persist warning:', e);
    }
}

function saveGame() {
    state.awayName = _v('awayName'); state.awayCity = _v('awayCity');
    state.homeName = _v('homeName'); state.homeCity = _v('homeCity');
    state.awayTotal = parseInt(_v('awayTotal')) || 0;
    state.homeTotal = parseInt(_v('homeTotal')) || 0;
    state.gameTime = _v('gameTime');
    state.gameVenue = _v('gameVenue');
    state.gameName = _v('gameName');
    state.gameWeather = _v('gameWeather');
    state.ruleType = state.ruleType || 'nfl';
    ['away', 'home'].forEach((t, ti) => {
        const p = ti === 0 ? 'a' : 'h';
        state.quarterScores[t] = [0, 1, 2, 3, 4].map(i => parseInt(_v(p + 'q' + i)) || 0);
    });
    persist();
}

function setRuleType(type) {
    state.ruleType = (type === 'college') ? 'college' : (type === 'japan' ? 'japan' : 'nfl');
    persist();
    syncRuleButtons();
    renderBoxScore();
    renderTeamStats();
    let msg = '🏈 NFL規程を適用しました';
    if (state.ruleType === 'college') msg = '🎓 カレッジ規程（NCAA）を適用しました';
    if (state.ruleType === 'japan') msg = '🇯🇵 日本の大学規程を適用しました';
    toast(msg);
}

function syncRuleButtons() {
    const cur = state.ruleType || 'nfl';
    const bNFL = document.getElementById('ruleBtnNFL');
    const bCol = document.getElementById('ruleBtnCollege');
    const bJpn = document.getElementById('ruleBtnJapan');
    if (bNFL) bNFL.classList.toggle('active', cur === 'nfl');
    if (bCol) bCol.classList.toggle('active', cur === 'college');
    if (bJpn) bJpn.classList.toggle('active', cur === 'japan');
    const badge = document.getElementById('bsRuleBadge');
    const tsBadge = document.getElementById('tsRuleBadge');
    const updateBadgeEl = (el) => {
        if (!el) return;
        if (cur === 'japan') {
            el.textContent = '🇯🇵 日本の大学規程';
            el.className = 'bs-rule-badge japan';
        } else if (cur === 'college') {
            el.textContent = '🎓 カレッジ規程 (NCAA)';
            el.className = 'bs-rule-badge college';
        } else {
            el.textContent = '🏈 NFL規程';
            el.className = 'bs-rule-badge nfl';
        }
    };
    updateBadgeEl(badge);
    updateBadgeEl(tsBadge);
}
function _v(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

/* ─── Pickers Setup ───────────────────────── */
function initSituationPickers() {
    // Time Min (15 to 0) & Sec (-- at top, 00 at top, then 59 down to 01)
    const minSel = document.getElementById('inp_time_min');
    const secSel = document.getElementById('inp_time_sec');
    if (minSel && secSel) {
        let minOpts = '<option value="">--</option>';
        for (let m = 15; m >= 0; m--) {
            const val = m < 10 ? '0' + m : '' + m;
            minOpts += `<option value="${val}">${val}</option>`;
        }
        minSel.innerHTML = minOpts;

        let secOpts = '<option value="">--</option><option value="00">00</option>';
        for (let s = 59; s >= 1; s--) {
            const val = s < 10 ? '0' + s : '' + s;
            secOpts += `<option value="${val}">${val}</option>`;
        }
        secSel.innerHTML = secOpts;
        minSel.value = '';
        secSel.value = '';
    }
    const timeHidden = document.getElementById('inp_time');
    if (timeHidden) timeHidden.value = '';

    // Distance inches, Goal, short, mid, long, 1..99
    const distSel = document.getElementById('inp_dist');
    if (distSel) {
        let dOpts = '<option value="">--</option><option value="inches">inches</option><option value="Goal">Goal</option><option value="short">short</option><option value="mid">mid</option><option value="long">long</option>';
        for (let d = 1; d <= 99; d++) dOpts += `<option value="${d}">${d}</option>`;
        distSel.innerHTML = dOpts;
        distSel.value = '';
    }

    // Ball at side & yards (1..50)
    const ydSel = document.getElementById('inp_ball_yd');
    if (ydSel) {
        let ydOpts = '<option value="">--</option>';
        for (let y = 1; y <= 50; y++) ydOpts += `<option value="${y}">${y}</option>`;
        ydSel.innerHTML = ydOpts;
        ydSel.value = '';
    }
    const sideSel = document.getElementById('inp_ball_side');
    if (sideSel) sideSel.value = '';
    const ylHidden = document.getElementById('inp_yardline');
    if (ylHidden) ylHidden.value = '';
}

function syncTimeInput() {
    const m = _v('inp_time_min');
    const s = _v('inp_time_sec');
    const hidden = document.getElementById('inp_time');
    if (!hidden) return;
    if (m === '' && s === '') {
        hidden.value = '';
    } else {
        const mStr = m !== '' ? m.padStart(2, '0') : '--';
        const sStr = s !== '' ? s.padStart(2, '0') : '--';
        hidden.value = `${mStr}:${sStr}`;
    }
}

function syncBallAt() {
    const side = _v('inp_ball_side');
    const yd = _v('inp_ball_yd');
    const hidden = document.getElementById('inp_yardline');
    if (!hidden) return;
    if (!side && !yd) { hidden.value = ''; return; }
    const sideName = side === 'away' ? (state.awayName || 'AWAY') : side === 'home' ? (state.homeName || 'HOME') : '';
    hidden.value = `${sideName} ${yd}`.trim();
}

/* ─── Player Formatter Helpers ────────────── */
function getTeamRoster(side) {
    if (!side) return {};
    const teamName = (side === 'away' ? state.awayName : state.homeName || '').trim();
    const found = findTeamInDB(teamName);
    return (found && found.roster) ? found.roster : {};
}

function formatPlayer(num, side) {
    if (!num) return '';
    const cleanNum = String(num).replace('#', '').trim();
    if (!cleanNum) return '';
    const roster = getTeamRoster(side);
    const name = roster[cleanNum];
    return name ? `#${cleanNum} ${name}` : `#${cleanNum}`;
}

// 0番から99番まで番号順にきれいに並べ、名前があれば表示（重複番号 *付きも該当番号の直後に配置）
function buildPlayerOptions(side, selectedVal = '') {
    const roster = getTeamRoster(side);
    let html = `<option value="">-- 番号 --</option>`;
    const handledKeys = new Set();

    for (let i = 0; i <= 99; i++) {
        const key = String(i);
        handledKeys.add(key);
        const name = roster[key];
        const label = name ? `#${key} ${name}` : `#${key}`;
        html += `<option value="${key}"${String(selectedVal) === key ? ' selected' : ''}>${esc(label)}</option>`;

        // 重複番号 (*付き) がロスターに存在する場合、該当番号の直後に配置 (例: #12 の次に #*12)
        const starKey = '*' + key;
        if (roster[starKey]) {
            handledKeys.add(starKey);
            const starName = roster[starKey];
            const starLabel = `#${starKey} ${starName}`;
            html += `<option value="${starKey}"${String(selectedVal) === starKey ? ' selected' : ''}>${esc(starLabel)}</option>`;
        }
    }

    // もし上記ループに含まれない追加キーがあれば追加
    Object.keys(roster).forEach(k => {
        if (!handledKeys.has(k)) {
            const label = `#${k} ${roster[k]}`;
            html += `<option value="${k}"${String(selectedVal) === k ? ' selected' : ''}>${esc(label)}</option>`;
        }
    });

    return html;
}

// -99から+99まで、--が初期選択（0の上に配置、--は空欄扱い、0は空欄ではない）
function buildYardOptions(selectedVal = '', includeNegative = true, includeZero = true) {
    const isBlank = (selectedVal === '' || selectedVal === undefined || selectedVal === null);
    let html = '';
    if (includeNegative) {
        for (let y = -99; y <= -1; y++) {
            html += `<option value="${y}"${!isBlank && String(selectedVal) === String(y) ? ' selected' : ''}>${y}</option>`;
        }
    }
    // -- yds -- を 0 の直上に配置（空欄扱い、未選択時のデフォルト）
    html += `<option value=""${isBlank ? ' selected' : ''}>-- yds --</option>`;
    if (includeZero) {
        const isZeroSel = !isBlank && String(selectedVal) === '0';
        html += `<option value="0"${isZeroSel ? ' selected' : ''}>0</option>`;
    }
    for (let y = 1; y <= 99; y++) {
        html += `<option value="${y}"${!isBlank && String(selectedVal) === String(y) ? ' selected' : ''}>+${y}</option>`;
    }
    return html;
}

// 汎用数値選択肢生成（1..99など）
function buildNumberOptions(selectedVal = '', min = 1, max = 99, placeholder = '-- yds --') {
    let html = `<option value="">${esc(placeholder)}</option>`;
    for (let i = min; i <= max; i++) {
        html += `<option value="${i}"${String(selectedVal) === String(i) ? ' selected' : ''}>${i}</option>`;
    }
    return html;
}

// 反則の種類リスト
const PENALTY_TYPES = [
    'False Start',
    'Offside',
    'Neutral Zone Infraction',
    'Encroachment',
    'Delay of the Game',
    'Holding',
    'Pass Interference',
    'Illegal Contact',
    'Illegal Formation',
    'Illegal Motion',
    'Illegal Shift',
    'Ineligible Receiver Downfield on Pass',
    'Illegal Substitution (交代違反)',
    'Intentional Grounding',
    'Illegal Forward Pass',
    'Block in the back',
    'Personal Foul',
    'PF- Block Below the Waist',
    'PF- Roughing the Passer',
    'PF- Roughing the Kicker',
    'PF- Unnecessary Roughness',
    'PF- Chop Block',
    'PF- Tripping',
    'PF- Horse Collar Tackle',
    'PF- Hip Drop Tackle',
    'PF- Face Mask',
    'PF- Targeting',
    'PF- Late Hit',
    'Unsportsmanlike Conduct',
    'Taunting',
    'Illegal Use of Hand',
    'Illegal Touching',
    'Running into the Kicker',
    'Kick Out of Bounds'
];

function buildPenaltyOptions(selectedVal = '') {
    let html = `<option value="">-- 反則の種類 --</option>`;
    let found = false;
    PENALTY_TYPES.forEach(p => {
        const isSel = String(selectedVal) === p;
        if (isSel) found = true;
        html += `<option value="${esc(p)}"${isSel ? ' selected' : ''}>${esc(p)}</option>`;
    });
    if (selectedVal && !found) {
        html += `<option value="${esc(selectedVal)}" selected>${esc(selectedVal)}</option>`;
    }
    return html;
}

// 説明文のHTML整形（{...} のプレイ取消履歴をイタリック表示）
function formatDescHTML(desc) {
    if (!desc) return '';
    return esc(desc).replace(/\{([^}]+)\}/g, '<i style="font-style:italic;opacity:0.85">{$1}</i>');
}

// 地点フォーマット（チーム名略称 + 0〜50yd）
function formatSpot(side, yd) {
    if (!side && (yd === undefined || yd === '' || yd === null)) return '';
    const sideName = side ? getTeamAbbr(side) : '';
    const ydStr = (yd !== undefined && yd !== '' && yd !== null) ? yd : '';
    return `${sideName} ${ydStr}`.trim();
}

// ビルダー用：陣地（チーム略称）＋ヤード（0〜50）セレクター
function buildSpotSelectors(sideField, ydField, curSide = '', curYd = '', handler = 'onBuilderFieldChange') {
    const sideOpts = `
        <option value="">-- 陣地 --</option>
        <option value="away"${curSide === 'away' ? ' selected' : ''}>${esc(getTeamAbbr('away'))}</option>
        <option value="home"${curSide === 'home' ? ' selected' : ''}>${esc(getTeamAbbr('home'))}</option>
    `;
    const ydOpts = `<option value="">-- yd --</option>` +
        Array.from({ length: 51 }, (_, i) => `<option value="${i}"${String(curYd) === String(i) ? ' selected' : ''}>${i}</option>`).join('');
    return `
        <select class="b-sel" id="b_${sideField}" onchange="${handler}('${sideField}')">${sideOpts}</select>
        <select class="b-sel" id="b_${ydField}" onchange="${handler}('${ydField}')">${ydOpts}</select>
    `;
}

// +オプション用：陣地（チーム略称）＋ヤード（0〜50）セレクター
function buildOptSpotSelectors(optId, curSide = '', curYd = '') {
    const sideOpts = `
        <option value="">-- 陣地 --</option>
        <option value="away"${curSide === 'away' ? ' selected' : ''}>${esc(getTeamAbbr('away'))}</option>
        <option value="home"${curSide === 'home' ? ' selected' : ''}>${esc(getTeamAbbr('home'))}</option>
    `;
    const ydOpts = `<option value="">-- yd --</option>` +
        Array.from({ length: 51 }, (_, i) => `<option value="${i}"${String(curYd) === String(i) ? ' selected' : ''}>${i}</option>`).join('');
    return `
        <select class="b-sel" onchange="onOptFieldChange(${optId}, 'ret_side', this.value)">${sideOpts}</select>
        <select class="b-sel" onchange="onOptFieldChange(${optId}, 'ret_yd', this.value)">${ydOpts}</select>
    `;
}

function onPlayTypeChange() {
    currentBuilderData = {};
    currentActiveOptions = [];
    renderStepBuilder();
    renderOptSection();
    generateDescFromBuilder();
}

function onPossessionChange() {
    updatePossOpts();
    renderStepBuilder();
    generateDescFromBuilder();
}

function getDefSide() {
    const poss = _v('frm_poss');
    if (poss === 'away') return 'home';
    if (poss === 'home') return 'away';
    return '';
}

function renderStepBuilder() {
    const type = _v('frm_type') || 'pass';
    const poss = _v('frm_poss') || 'away';
    const def = getDefSide();
    const container = document.getElementById('bStepsContainer');
    if (!container) return;

    let html = '';

    if (type === 'pass') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Passer (QB)</span>
            <select class="b-sel" id="b_passer" onchange="onBuilderFieldChange('passer')">${buildPlayerOptions(poss, currentBuilderData.passer)}</select>
            <span style="font-weight:700;color:var(--mt)">pass</span>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Trajectory</span>
            <select class="b-sel" id="b_traj" onchange="onBuilderFieldChange('traj')">
                <option value="">-- 距離 --</option>
                <option value="short"${currentBuilderData.traj==='short'?' selected':''}>short</option>
                <option value="deep"${currentBuilderData.traj==='deep'?' selected':''}>deep</option>
                <option value="screen"${currentBuilderData.traj==='screen'?' selected':''}>screen</option>
            </select>
            <select class="b-sel" id="b_dir" onchange="onBuilderFieldChange('dir')">
                <option value="">-- 方向 --</option>
                <option value="left"${currentBuilderData.dir==='left'?' selected':''}>left</option>
                <option value="middle"${currentBuilderData.dir==='middle'?' selected':''}>middle</option>
                <option value="right"${currentBuilderData.dir==='right'?' selected':''}>right</option>
            </select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Target (to)</span>
            <select class="b-sel" id="b_target" onchange="onBuilderFieldChange('target')">${buildPlayerOptions(poss, currentBuilderData.target)}</select>
            <span class="b-step-lbl" style="min-width:35px">Gain</span>
            <select class="b-sel" id="b_gain" onchange="onBuilderFieldChange('gain')">${buildYardOptions(currentBuilderData.gain, true, true)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Tackle (DEF)</span>
            <select class="b-sel" id="b_tackler1" onchange="onBuilderFieldChange('tackler1')">${buildPlayerOptions(def, currentBuilderData.tackler1)}</select>
            <select class="b-sel" id="b_tackler2" onchange="onBuilderFieldChange('tackler2')">${buildPlayerOptions(def, currentBuilderData.tackler2)}</select>
        </div>`;
    } else if (type === 'rush') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Runner</span>
            <select class="b-sel" id="b_runner" onchange="onBuilderFieldChange('runner')">${buildPlayerOptions(poss, currentBuilderData.runner)}</select>
            <select class="b-sel" id="b_rush_kind" onchange="onBuilderFieldChange('rush_kind')">
                <option value="rush"${currentBuilderData.rush_kind==='rush'?' selected':''}>rush</option>
                <option value="scramble"${currentBuilderData.rush_kind==='scramble'?' selected':''}>scramble</option>
                <option value="jet"${currentBuilderData.rush_kind==='jet'?' selected':''}>jet</option>
                <option value="toss"${currentBuilderData.rush_kind==='toss'?' selected':''}>toss</option>
            </select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Direction</span>
            <select class="b-sel" id="b_dir" onchange="onBuilderFieldChange('dir')">
                <option value="">-- 方向 --</option>
                <option value="left"${currentBuilderData.dir==='left'?' selected':''}>left</option>
                <option value="middle"${currentBuilderData.dir==='middle'?' selected':''}>middle</option>
                <option value="right"${currentBuilderData.dir==='right'?' selected':''}>right</option>
            </select>
            <select class="b-sel" id="b_gap" onchange="onBuilderFieldChange('gap')">
                <option value="">-- gap --</option>
                <option value="end"${currentBuilderData.gap==='end'?' selected':''}>end</option>
                <option value="guard"${currentBuilderData.gap==='guard'?' selected':''}>guard</option>
            </select>
            <span class="b-step-lbl" style="min-width:35px">Gain</span>
            <select class="b-sel" id="b_gain" onchange="onBuilderFieldChange('gain')">${buildYardOptions(currentBuilderData.gain, true, true)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Tackle (DEF)</span>
            <select class="b-sel" id="b_tackler1" onchange="onBuilderFieldChange('tackler1')">${buildPlayerOptions(def, currentBuilderData.tackler1)}</select>
            <select class="b-sel" id="b_tackler2" onchange="onBuilderFieldChange('tackler2')">${buildPlayerOptions(def, currentBuilderData.tackler2)}</select>
        </div>`;
    } else if (type === 'inc') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Passer</span>
            <select class="b-sel" id="b_passer" onchange="onBuilderFieldChange('passer')">${buildPlayerOptions(poss, currentBuilderData.passer)}</select>
            <span style="font-weight:700;color:var(--rd)">pass incomplete</span>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Trajectory</span>
            <select class="b-sel" id="b_traj" onchange="onBuilderFieldChange('traj')">
                <option value="">-- 距離 --</option>
                <option value="short"${currentBuilderData.traj==='short'?' selected':''}>short</option>
                <option value="deep"${currentBuilderData.traj==='deep'?' selected':''}>deep</option>
                <option value="screen"${currentBuilderData.traj==='screen'?' selected':''}>screen</option>
            </select>
            <span class="b-step-lbl" style="min-width:40px">Target</span>
            <select class="b-sel" id="b_target" onchange="onBuilderFieldChange('target')">${buildPlayerOptions(poss, currentBuilderData.target)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Pass Breakup</span>
            <span style="font-size:.75rem;color:var(--mt)">PB by</span>
            <select class="b-sel" id="b_pbu" onchange="onBuilderFieldChange('pbu')">${buildPlayerOptions(def, currentBuilderData.pbu)}</select>
        </div>`;
    } else if (type === 'intercept') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Passer</span>
            <select class="b-sel" id="b_passer" onchange="onBuilderFieldChange('passer')">${buildPlayerOptions(poss, currentBuilderData.passer)}</select>
            <span style="font-weight:700;color:var(--a2)">pass intercepted</span>
            <select class="b-sel" id="b_traj" onchange="onBuilderFieldChange('traj')">
                <option value="">-- 距離 --</option>
                <option value="short"${currentBuilderData.traj==='short'?' selected':''}>short</option>
                <option value="deep"${currentBuilderData.traj==='deep'?' selected':''}>deep</option>
                <option value="screen"${currentBuilderData.traj==='screen'?' selected':''}>screen</option>
            </select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">INT by (DEF)</span>
            <select class="b-sel" id="b_interceptor" onchange="onBuilderFieldChange('interceptor')">${buildPlayerOptions(def, currentBuilderData.interceptor)}</select>
            <span class="b-step-lbl" style="min-width:38px">Return</span>
            <span style="font-size:.75rem">for</span>
            <select class="b-sel" id="b_ret_yds" onchange="onBuilderFieldChange('ret_yds')">${buildYardOptions(currentBuilderData.ret_yds, true, true)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Target (OFF)</span>
            <span style="font-size:.75rem;color:var(--mt)">targeted to</span>
            <select class="b-sel" id="b_target" onchange="onBuilderFieldChange('target')">${buildPlayerOptions(poss, currentBuilderData.target)}</select>
            <span class="b-step-lbl" style="min-width:35px">Tackle (OFF)</span>
            <select class="b-sel" id="b_tackler1" onchange="onBuilderFieldChange('tackler1')">${buildPlayerOptions(poss, currentBuilderData.tackler1)}</select>
        </div>`;
    } else if (type === 'xp') {
        const isBlocked = currentBuilderData.xp_res === 'blocked';
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Kicker</span>
            <select class="b-sel" id="b_kicker" onchange="onBuilderFieldChange('kicker')">${buildPlayerOptions(poss, currentBuilderData.kicker)}</select>
            <span style="font-weight:700">kick is</span>
            <select class="b-sel" id="b_xp_res" onchange="onBuilderFieldChange('xp_res')">
                <option value="good"${currentBuilderData.xp_res==='good'?' selected':''}>good</option>
                <option value="no good"${currentBuilderData.xp_res==='no good'?' selected':''}>no good</option>
                <option value="blocked"${currentBuilderData.xp_res==='blocked'?' selected':''}>blocked</option>
            </select>
        </div>`;
        if (isBlocked) {
            html += `
            <div class="b-step-row">
                <span class="b-step-lbl">Recover by</span>
                <select class="b-sel" id="b_rec_side" onchange="onBuilderFieldChange('rec_side')">
                    <option value="def" selected>DEF (${esc(getTeamAbbr(def))})</option>
                    <option value="off">OFF (${esc(getTeamAbbr(poss))})</option>
                </select>
                <select class="b-sel" id="b_rec_num" onchange="onBuilderFieldChange('rec_num')">${buildPlayerOptions(currentBuilderData.rec_side==='off'?poss:def, currentBuilderData.rec_num)}</select>
                <label style="font-size:.75rem;display:inline-flex;align-items:center;gap:3px;cursor:pointer">
                    <input type="checkbox" id="b_two_pt" ${currentBuilderData.two_pt?'checked':''} onchange="onBuilderFieldChange('two_pt')"/> gets 2 point
                </label>
            </div>`;
        }
    } else if (type === '2pt') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">2pt Result</span>
            <select class="b-sel" id="b_two_pt_res" onchange="onBuilderFieldChange('two_pt_res')">
                <option value="success"${currentBuilderData.two_pt_res==='success'||!currentBuilderData.two_pt_res?' selected':''}>成功 (GOOD / SUCCESS)</option>
                <option value="failed"${currentBuilderData.two_pt_res==='failed'?' selected':''}>失敗 (NO GOOD / FAILED)</option>
            </select>
        </div>
        <div style="font-size:.78rem;color:var(--mt);margin-top:6px;line-height:1.4">
            ※ プレイの詳しい内容（パス/ランや選手名等）は、下の「自由記述欄」に直接入力してください。
        </div>`;
    } else if (type === 'fg') {
        const isBlocked = currentBuilderData.fg_res === 'blocked';
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Kicker</span>
            <select class="b-sel" id="b_kicker" onchange="onBuilderFieldChange('kicker')">${buildPlayerOptions(poss, currentBuilderData.kicker)}</select>
            <select class="b-sel" id="b_fg_dist" onchange="onBuilderFieldChange('fg_dist')">${buildNumberOptions(currentBuilderData.fg_dist, 1, 99, '-- yds --')}</select>
            <span style="font-weight:700">kick is</span>
            <select class="b-sel" id="b_fg_res" onchange="onBuilderFieldChange('fg_res')">
                <option value="good"${currentBuilderData.fg_res==='good'?' selected':''}>good</option>
                <option value="no good"${currentBuilderData.fg_res==='no good'?' selected':''}>no good</option>
                <option value="blocked"${currentBuilderData.fg_res==='blocked'?' selected':''}>blocked</option>
            </select>
        </div>`;
        if (isBlocked) {
            html += `
            <div class="b-step-row">
                <span class="b-step-lbl">Recover by</span>
                <select class="b-sel" id="b_rec_side" onchange="onBuilderFieldChange('rec_side')">
                    <option value="def" selected>DEF</option>
                    <option value="off">OFF</option>
                </select>
                <select class="b-sel" id="b_rec_num" onchange="onBuilderFieldChange('rec_num')">${buildPlayerOptions(currentBuilderData.rec_side==='off'?poss:def, currentBuilderData.rec_num)}</select>
                <span class="b-step-lbl" style="min-width:40px">Return to</span>
                ${buildSpotSelectors('ret_side', 'ret_yd', currentBuilderData.ret_side, currentBuilderData.ret_yd)}
            </div>`;
        }
    } else if (type === 'punt') {
        const isBlocked = currentBuilderData.is_blocked;
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Punter</span>
            <select class="b-sel" id="b_punter" onchange="onBuilderFieldChange('punter')">${buildPlayerOptions(poss, currentBuilderData.punter)}</select>
            <span style="font-weight:700">punt</span>
            <label style="font-size:.75rem;display:inline-flex;align-items:center;gap:3px;cursor:pointer">
                <input type="checkbox" id="b_is_blocked" ${isBlocked?'checked':''} onchange="onBuilderFieldChange('is_blocked')"/> blocked
            </label>
        </div>`;
        if (isBlocked) {
            html += `
            <div class="b-step-row">
                <span class="b-step-lbl">Blocked by</span>
                <select class="b-sel" id="b_blocker" onchange="onBuilderFieldChange('blocker')">${buildPlayerOptions(def, currentBuilderData.blocker)}</select>
                <span style="font-size:.75rem">to</span>
                ${buildSpotSelectors('ret_side', 'ret_yd', currentBuilderData.ret_side, currentBuilderData.ret_yd)}
            </div>`;
        } else {
            html += `
            <div class="b-step-row">
                <span class="b-step-lbl">Punt yds</span>
                <select class="b-sel" id="b_punt_yds" onchange="onBuilderFieldChange('punt_yds')">${buildNumberOptions(currentBuilderData.punt_yds, 1, 99, '-- yds --')}</select>
                <select class="b-sel" id="b_ret_action" onchange="onBuilderFieldChange('ret_action')">
                    <option value="">-- returnなし --</option>
                    <option value="return by"${currentBuilderData.ret_action==='return by'?' selected':''}>return by</option>
                    <option value="fair catch by"${currentBuilderData.ret_action==='fair catch by'?' selected':''}>fair catch by</option>
                </select>
                <select class="b-sel" id="b_ret_player" onchange="onBuilderFieldChange('ret_player')">${buildPlayerOptions(def, currentBuilderData.ret_player)}</select>
                ${currentBuilderData.ret_action === 'return by' ? `
                <span style="font-size:.75rem">for</span>
                <select class="b-sel" id="b_ret_yds" onchange="onBuilderFieldChange('ret_yds')">${buildYardOptions(currentBuilderData.ret_yds, true, true)}</select>
                ` : ''}
            </div>`;
        }
    } else if (type === 'kick') {
        const action = currentBuilderData.kick_action || 'return';
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Kicker (DEF)</span>
            <select class="b-sel" id="b_kicker" onchange="onBuilderFieldChange('kicker')">${buildPlayerOptions(def, currentBuilderData.kicker)}</select>
            <select class="b-sel" id="b_kick_kind" onchange="onBuilderFieldChange('kick_kind')">
                <option value="kick"${currentBuilderData.kick_kind==='kick'||!currentBuilderData.kick_kind?' selected':''}>kick</option>
                <option value="onside"${currentBuilderData.kick_kind==='onside'||currentBuilderData.kick_kind==='onside to'?' selected':''}>onside</option>
            </select>
            <span class="b-step-lbl" style="min-width:35px">Kick yds</span>
            <select class="b-sel" id="b_kick_yds" onchange="onBuilderFieldChange('kick_yds')">${buildNumberOptions(currentBuilderData.kick_yds, 1, 99, '-- yds --')}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Action</span>
            <select class="b-sel" id="b_kick_action" onchange="onBuilderFieldChange('kick_action')">
                <option value="return"${action==='return'?' selected':''}>Kicking Return (リターン)</option>
                <option value="TB"${action==='TB'?' selected':''}>Touchback (TB)</option>
                <option value="OoB"${action==='OoB'?' selected':''}>Out of Bounds (OoB)</option>
                <option value="recovered"${action==='recovered'?' selected':''}>recovered (オンサイド等)</option>
            </select>
            ${action === 'recovered' ? `
            <select class="b-sel" id="b_rec_team" onchange="onBuilderFieldChange('rec_team')">
                <option value="off"${currentBuilderData.rec_team==='off'?' selected':''}>OFF (${esc(getTeamAbbr(poss))})</option>
                <option value="def"${currentBuilderData.rec_team==='def'?' selected':''}>DEF (${esc(getTeamAbbr(def))})</option>
            </select>
            <select class="b-sel" id="b_ret_player" onchange="onBuilderFieldChange('ret_player')">${buildPlayerOptions(currentBuilderData.rec_team==='def' ? def : poss, currentBuilderData.ret_player)}</select>
            ` : ''}
            ${action === 'return' ? `
            <select class="b-sel" id="b_ret_player" onchange="onBuilderFieldChange('ret_player')">${buildPlayerOptions(poss, currentBuilderData.ret_player)}</select>
            <span style="font-size:.75rem">for</span>
            <select class="b-sel" id="b_ret_yds" onchange="onBuilderFieldChange('ret_yds')">${buildYardOptions(currentBuilderData.ret_yds, true, true)}</select>
            ` : ''}
        </div>`;
    } else if (type === 'kick_return') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Returner (OFF)</span>
            <select class="b-sel" id="b_ret_player" onchange="onBuilderFieldChange('ret_player')">${buildPlayerOptions(poss, currentBuilderData.ret_player)}</select>
            <span class="b-step-lbl" style="min-width:35px">Return</span>
            <span style="font-size:.75rem">for</span>
            <select class="b-sel" id="b_ret_yds" onchange="onBuilderFieldChange('ret_yds')">${buildYardOptions(currentBuilderData.ret_yds, true, true)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Kick by (DEF)</span>
            <select class="b-sel" id="b_kicker" onchange="onBuilderFieldChange('kicker')">${buildPlayerOptions(def, currentBuilderData.kicker)}</select>
            <span class="b-step-lbl" style="min-width:35px">Kick yds</span>
            <select class="b-sel" id="b_kick_yds" onchange="onBuilderFieldChange('kick_yds')">${buildNumberOptions(currentBuilderData.kick_yds, 1, 99, '-- yds --')}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Tackle (DEF)</span>
            <select class="b-sel" id="b_tackler1" onchange="onBuilderFieldChange('tackler1')">${buildPlayerOptions(def, currentBuilderData.tackler1)}</select>
            <select class="b-sel" id="b_tackler2" onchange="onBuilderFieldChange('tackler2')">${buildPlayerOptions(def, currentBuilderData.tackler2)}</select>
        </div>`;
    } else if (type === 'sack') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">QB</span>
            <select class="b-sel" id="b_passer" onchange="onBuilderFieldChange('passer')">${buildPlayerOptions(poss, currentBuilderData.passer)}</select>
            <span style="font-weight:700;color:var(--rd)">is sacked by</span>
            <select class="b-sel" id="b_sacker1" onchange="onBuilderFieldChange('sacker1')">${buildPlayerOptions(def, currentBuilderData.sacker1)}</select>
            <select class="b-sel" id="b_sacker2" onchange="onBuilderFieldChange('sacker2')">${buildPlayerOptions(def, currentBuilderData.sacker2)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Loss Yds</span>
            <select class="b-sel" id="b_gain" onchange="onBuilderFieldChange('gain')">${buildYardOptions(currentBuilderData.gain, true, true)}</select>
        </div>`;
    } else if (type === 'penalty') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Team</span>
            <select class="b-sel" id="b_pen_team" onchange="onBuilderFieldChange('pen_team')">
                <option value="away"${currentBuilderData.pen_team==='away'?' selected':''}>${esc(getTeamAbbr('away'))}</option>
                <option value="home"${currentBuilderData.pen_team==='home'?' selected':''}>${esc(getTeamAbbr('home'))}</option>
            </select>
            <select class="b-sel" id="b_pen_name" onchange="onBuilderFieldChange('pen_name')">${buildPenaltyOptions(currentBuilderData.pen_name)}</select>
        </div>
        <div class="b-step-row">
            <span class="b-step-lbl">Yards</span>
            <select class="b-sel" id="b_pen_yds" onchange="onBuilderFieldChange('pen_yds')">${buildNumberOptions(currentBuilderData.pen_yds, 1, 99, '-- yds --')}</select>
            <span style="font-size:.75rem">yds by</span>
            <select class="b-sel" id="b_pen_player" onchange="onBuilderFieldChange('pen_player')">${buildPlayerOptions(currentBuilderData.pen_team==='home'?'home':'away', currentBuilderData.pen_player)}</select>
        </div>`;
    } else if (type === 'timeout') {
        html += `
        <div class="b-step-row">
            <span class="b-step-lbl">Time out by</span>
            <select class="b-sel" id="b_to_team" onchange="onBuilderFieldChange('to_team')">
                <option value="away"${currentBuilderData.to_team==='away'?' selected':''}>${esc(getTeamAbbr('away'))}</option>
                <option value="home"${currentBuilderData.to_team==='home'?' selected':''}>${esc(getTeamAbbr('home'))}</option>
            </select>
            <span style="font-weight:700">#</span>
            <select class="b-sel" id="b_to_num" onchange="onBuilderFieldChange('to_num')">
                <option value="1"${currentBuilderData.to_num==='1'?' selected':''}>1</option>
                <option value="2"${currentBuilderData.to_num==='2'?' selected':''}>2</option>
                <option value="3"${currentBuilderData.to_num==='3'?' selected':''}>3</option>
            </select>
        </div>`;
    } else {
        html = `<div style="font-size:.8rem;color:var(--mt)">※ このプレイタイプは直接説明文欄に入力してください。</div>`;
    }

    container.innerHTML = html;
}

function onBuilderFieldChange(fieldName) {
    const el = document.getElementById('b_' + fieldName);
    if (!el) return;
    if (el.type === 'checkbox') {
        currentBuilderData[fieldName] = el.checked;
    } else {
        currentBuilderData[fieldName] = el.value;
    }

    if (['xp_res', 'fg_res', 'is_blocked', 'kick_action', 'ret_action', 'pen_team', 'rec_side'].includes(fieldName)) {
        renderStepBuilder();
    }
    generateDescFromBuilder();
}

/* ─── + Options Section Implementation ────── */
const OPTION_TYPES_MAP = {
    touchdown: { label: 'Touchdown', allowed: ['run', 'rush', 'pass', 'intercept', 'fg', 'punt', 'kick', 'sack'] },
    safety: { label: 'Safety', allowed: ['run', 'rush', 'pass', 'intercept', 'fg', 'punt', 'kick', 'sack'] },
    fumble: { label: 'Fumble', allowed: ['run', 'rush', 'pass', 'intercept', 'fg', 'punt', 'kick', 'xp', '2pt', 'sack'] },
    lateral: { label: 'Lateral Pass', allowed: ['pass'] },
    first_down: { label: 'First Down 獲得', allowed: ['all'] },
    penalty_nullify: { label: 'Penalty (Play取消)', allowed: ['all'] },
    penalty_add: { label: 'Penalty Add (加算)', allowed: ['all'] },
    injury: { label: 'Injured Player', allowed: ['all'] },
    muff: { label: 'Muff', allowed: ['punt', 'kick'] },
    return_fg: { label: 'Return', allowed: ['fg'] },
    return_kick: { label: 'Kick Return', allowed: ['kick'] }
};

function toggleOptMenu() {
    const menu = document.getElementById('optSelectorMenu');
    if (!menu) return;
    if (menu.style.display === 'none' || !menu.style.display) {
        renderAvailableOptPills();
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
}

function renderAvailableOptPills() {
    const menu = document.getElementById('optSelectorMenu');
    if (!menu) return;
    const playType = _v('frm_type') || 'pass';
    let pills = '';
    Object.keys(OPTION_TYPES_MAP).forEach(k => {
        const def = OPTION_TYPES_MAP[k];
        if (def.allowed.includes('all') || def.allowed.includes(playType)) {
            pills += `<button type="button" class="opt-pill" onclick="addOptionToChain('${k}')">+ ${esc(def.label)}</button>`;
        }
    });
    menu.innerHTML = pills || '<span style="font-size:.72rem;color:var(--mt)">利用可能なオプションはありません</span>';
}

function addOptionToChain(optKey) {
    currentActiveOptions.push({
        id: Date.now() + Math.random(),
        type: optKey,
        data: {}
    });
    toggleOptMenu();
    renderOptSection();
    generateDescFromBuilder();
}

function removeOptionFromChain(optId) {
    currentActiveOptions = currentActiveOptions.filter(o => o.id !== optId);
    renderOptSection();
    generateDescFromBuilder();
}

function onOptFieldChange(optId, field, val) {
    const found = currentActiveOptions.find(o => o.id === optId);
    if (found) {
        found.data[field] = val;
        if (field === 'rec_team' || field === 'team' || field === 'fumble_res') renderOptSection();
        generateDescFromBuilder();
    }
}

function renderOptSection() {
    const chainEl = document.getElementById('optActiveChain');
    if (!chainEl) return;
    const poss = _v('frm_poss') || 'away';
    const def = getDefSide();

    let html = '';
    currentActiveOptions.forEach(opt => {
        const d = opt.data || {};
        let bodyHtml = '';

        if (opt.type === 'touchdown') {
            bodyHtml = `<span style="font-weight:700;color:var(--yw)">[Touchdown]</span>`;
        } else if (opt.type === 'safety') {
            bodyHtml = `<span style="font-weight:700;color:#9333ea">[Safety]</span>`;
        } else if (opt.type === 'fumble') {
            const recTeam = d.rec_team || def;
            const isOff = recTeam === poss;
            bodyHtml = `
            <span style="font-weight:700;color:var(--rd)">fumbled</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'fumble_res', this.value)">
                <option value="recover"${(!d.fumble_res || d.fumble_res==='recover')?' selected':''}>recover</option>
                <option value="scoop"${d.fumble_res==='scoop'?' selected':''}>scoop</option>
                <option value="out of bounds"${d.fumble_res==='out of bounds'?' selected':''}>out of bounds</option>
            </select>
            ${d.fumble_res !== 'out of bounds' ? `
            <span style="font-size:.72rem">by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'rec_team', this.value)">
                <option value="${def}"${recTeam===def?' selected':''}>DEF (${esc(getTeamAbbr(def))})</option>
                <option value="${poss}"${recTeam===poss?' selected':''}>OFF (${esc(getTeamAbbr(poss))})</option>
            </select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'rec_player', this.value)">${buildPlayerOptions(recTeam, d.rec_player)}</select>
            ${isOff ? `
            <span style="font-weight:700;font-size:.75rem">rush</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'rush_yds', this.value)">${buildYardOptions(d.rush_yds !== undefined ? d.rush_yds : '', true, true)}</select>
            ` : `
            <span style="font-size:.72rem">return to</span>
            ${buildOptSpotSelectors(opt.id, d.ret_side, d.ret_yd)}
            `}
            ` : ''}`;
        } else if (opt.type === 'penalty_nullify') {
            const pTeam = d.team || poss;
            bodyHtml = `
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'team', this.value)">
                <option value="away"${pTeam==='away'?' selected':''}>${esc(getTeamAbbr('away'))}</option>
                <option value="home"${pTeam==='home'?' selected':''}>${esc(getTeamAbbr('home'))}</option>
            </select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'name', this.value)">${buildPenaltyOptions(d.name)}</select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'yds', this.value)">${buildNumberOptions(d.yds, 1, 99, '-- yds --')}</select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'player', this.value)">${buildPlayerOptions(pTeam, d.player)}</select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'status', this.value)">
                <option value=""${!d.status?' selected':''}>適用</option>
                <option value="declined"${d.status==='declined'?' selected':''}>declined (辞退)</option>
                <option value="offset"${d.status==='offset'?' selected':''}>offset (相殺)</option>
            </select>`;
        } else if (opt.type === 'penalty_add') {
            const pTeam = d.team || def;
            bodyHtml = `
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'team', this.value)">
                <option value="away"${pTeam==='away'?' selected':''}>${esc(getTeamAbbr('away'))}</option>
                <option value="home"${pTeam==='home'?' selected':''}>${esc(getTeamAbbr('home'))}</option>
            </select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'name', this.value)">${buildPenaltyOptions(d.name)}</select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'yds', this.value)">${buildNumberOptions(d.yds, 1, 99, '-- yds --')}</select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'player', this.value)">${buildPlayerOptions(pTeam, d.player)}</select>`;
        } else if (opt.type === 'injury') {
            const iTeam = d.team || poss;
            bodyHtml = `
            <span style="font-weight:700;color:var(--rd)">Injured by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'team', this.value)">
                <option value="away"${iTeam==='away'?' selected':''}>${esc(getTeamAbbr('away'))}</option>
                <option value="home"${iTeam==='home'?' selected':''}>${esc(getTeamAbbr('home'))}</option>
            </select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'player', this.value)">${buildPlayerOptions(iTeam, d.player)}</select>`;
        } else if (opt.type === 'lateral') {
            bodyHtml = `
            <span style="font-weight:700">lateral pass to</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'player', this.value)">${buildPlayerOptions(poss, d.player)}</select>
            <span style="font-weight:700;font-size:.75rem">gain</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'gain', this.value)">${buildYardOptions(d.gain !== undefined ? d.gain : '', true, true)}</select>
            <span style="font-size:.75rem">yds</span>`;
        } else if (opt.type === 'muff') {
            const rTeam = d.rec_team || poss;
            bodyHtml = `
            <span style="font-weight:700">muffed by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'muff_player', this.value)">${buildPlayerOptions(def, d.muff_player)}</select>
            <span style="font-size:.72rem">rec by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'rec_team', this.value)">
                <option value="off"${rTeam==='off'?' selected':''}>OFF (${esc(getTeamAbbr(poss))})</option>
                <option value="def"${rTeam==='def'?' selected':''}>DEF (${esc(getTeamAbbr(def))})</option>
            </select>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'rec_player', this.value)">${buildPlayerOptions(rTeam==='off'?poss:def, d.rec_player)}</select>`;
        } else if (opt.type === 'return_fg') {
            bodyHtml = `
            <span style="font-weight:700">return by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'ret_player', this.value)">${buildPlayerOptions(def, d.ret_player)}</select>
            <span style="font-size:.72rem">to</span>
            ${buildOptSpotSelectors(opt.id, d.ret_side, d.ret_yd)}`;
        } else if (opt.type === 'return_kick') {
            bodyHtml = `
            <span style="font-weight:700">return by</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'ret_player', this.value)">${buildPlayerOptions(poss, d.ret_player)}</select>
            <span style="font-size:.72rem">for</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'ret_yds', this.value)">${buildYardOptions(d.ret_yds !== undefined ? d.ret_yds : 0, true, true)}</select>`;
        } else if (opt.type === 'first_down') {
            bodyHtml = `
            <span style="font-weight:700;color:var(--gn)">[1st Down獲得]</span>
            <span style="font-size:.72rem">種別</span>
            <select class="b-sel" onchange="onOptFieldChange(${opt.id}, 'kind', this.value)">
                <option value="auto"${(!d.kind || d.kind==='auto')?' selected':''}>自動判定</option>
                <option value="rush"${d.kind==='rush'?' selected':''}>ラン</option>
                <option value="pass"${d.kind==='pass'?' selected':''}>パス</option>
                <option value="penalty"${d.kind==='penalty'?' selected':''}>反則</option>
            </select>`;
        }

        html += `
        <div class="opt-card">
            <span class="opt-card-title">${esc(OPTION_TYPES_MAP[opt.type]?.label || opt.type)}</span>
            <div class="opt-card-body">${bodyHtml}</div>
            <button type="button" class="opt-del-btn" onclick="removeOptionFromChain(${opt.id})" title="削除">✕</button>
        </div>`;
    });
    chainEl.innerHTML = html;
}

/* ─── Text Generator Engine ───────────────── */
function generateDescFromBuilder() {
    const type = _v('frm_type') || 'pass';
    const poss = _v('frm_poss') || 'away';
    const def = getDefSide();
    const b = currentBuilderData;
    let parts = [];

    // Check if nullify penalty offset
    const nullifyOpt = currentActiveOptions.find(o => o.type === 'penalty_nullify');
    if (nullifyOpt && nullifyOpt.data && nullifyOpt.data.status === 'offset') {
        const descEl = document.getElementById('frm_desc');
        const prevEl = document.getElementById('bPreviewText');
        const text = `Penalties offset. Replay the down.`;
        if (prevEl) prevEl.textContent = text;
        if (descEl && !descEl.dataset.userEdited) descEl.value = text;
        return;
    }

    // Base Play Type Sentences
    if (type === 'pass') {
        if (b.passer) parts.push(formatPlayer(b.passer, poss));
        parts.push('pass');
        if (b.traj) parts.push(b.traj);
        if (b.dir) parts.push(b.dir);
        if (b.target) parts.push(`to ${formatPlayer(b.target, poss)}`);
        if (b.gain !== undefined && b.gain !== '') parts.push(`for ${b.gain} yds`);
        const tacklers = [formatPlayer(b.tackler1, def), formatPlayer(b.tackler2, def)].filter(Boolean);
        if (tacklers.length) parts.push(`(${tacklers.join(', ')})`);
    } else if (type === 'rush') {
        if (b.runner) parts.push(formatPlayer(b.runner, poss));
        parts.push(b.rush_kind || 'rush');
        if (b.dir) parts.push(b.dir);
        if (b.gap) parts.push(b.gap);
        if (b.gain !== undefined && b.gain !== '') parts.push(`for ${b.gain} yds`);
        const tacklers = [formatPlayer(b.tackler1, def), formatPlayer(b.tackler2, def)].filter(Boolean);
        if (tacklers.length) parts.push(`(${tacklers.join(', ')})`);
    } else if (type === 'inc') {
        if (b.passer) parts.push(formatPlayer(b.passer, poss));
        parts.push('pass incomplete');
        if (b.traj) parts.push(b.traj);
        if (b.target) parts.push(`targeted to ${formatPlayer(b.target, poss)}`);
        if (b.pbu) parts.push(`PB by ${formatPlayer(b.pbu, def)}`);
    } else if (type === 'intercept') {
        if (b.passer) parts.push(formatPlayer(b.passer, poss));
        parts.push('pass intercepted');
        if (b.traj) parts.push(b.traj);
        if (b.interceptor) parts.push(`by ${formatPlayer(b.interceptor, def)}`);
        if (b.ret_yds !== undefined && b.ret_yds !== '') {
            parts.push(`return for ${b.ret_yds} yds`);
        } else {
            const spot = formatSpot(b.ret_side, b.ret_yd);
            if (spot) parts.push(`return to ${spot}`);
        }
        if (b.target) parts.push(`targeted to ${formatPlayer(b.target, poss)}`);
        if (b.tackler1) parts.push(`(${formatPlayer(b.tackler1, poss)})`);
    } else if (type === 'xp') {
        if (b.kicker) parts.push(formatPlayer(b.kicker, poss));
        parts.push(`kick is ${b.xp_res || 'good'}`);
        if (b.xp_res === 'blocked') {
            const rSide = b.rec_side === 'off' ? poss : def;
            const tName = getTeamAbbr(rSide);
            if (b.rec_num) parts.push(`recover by ${tName} ${formatPlayer(b.rec_num, rSide)}`);
            if (b.two_pt) parts.push('gets 2 point');
        }
    } else if (type === '2pt') {
        const res = b.two_pt_res === 'failed' ? 'failed' : 'successful';
        parts.push(`Two-point conversion attempt ${res}`);
    } else if (type === 'fg') {
        if (b.kicker) parts.push(formatPlayer(b.kicker, poss));
        if (b.fg_dist) parts.push(`${b.fg_dist} yds`);
        parts.push(`kick is ${b.fg_res || 'good'}`);
        if (b.fg_res === 'blocked') {
            const rSide = b.rec_side === 'off' ? poss : def;
            const tName = getTeamAbbr(rSide);
            if (b.rec_num) parts.push(`recover by ${tName} ${formatPlayer(b.rec_num, rSide)}`);
            const spot = formatSpot(b.ret_side, b.ret_yd);
            if (spot) parts.push(`return to ${spot}`);
        }
    } else if (type === 'punt') {
        if (b.punter) parts.push(formatPlayer(b.punter, poss));
        parts.push('punt');
        if (b.is_blocked) {
            parts.push('blocked');
            if (b.blocker) parts.push(`by ${formatPlayer(b.blocker, def)}`);
            const spot = formatSpot(b.ret_side, b.ret_yd);
            if (spot) parts.push(`to ${spot}`);
        } else {
            if (b.punt_yds) parts.push(`${b.punt_yds} yds`);
            if (b.ret_action && b.ret_player) {
                if (b.ret_action === 'fair catch by') {
                    parts.push(`fair catch by ${formatPlayer(b.ret_player, def)}`);
                } else {
                    const retYdStr = (b.ret_yds !== undefined && b.ret_yds !== '') ? ` for ${b.ret_yds} yds` : '';
                    parts.push(`return by ${formatPlayer(b.ret_player, def)}${retYdStr}`);
                }
            }
        }
    } else if (type === 'kick') {
        if (b.kicker) parts.push(formatPlayer(b.kicker, def));
        parts.push((b.kick_kind === 'onside' || b.kick_kind === 'onside to') ? 'onside kick' : 'kick');
        if (b.kick_yds) parts.push(`${b.kick_yds} yds`);
        else {
            const landSpot = formatSpot(b.land_side, b.land_yd);
            if (landSpot) parts.push(landSpot);
        }
        const act = b.kick_action || 'return';
        if (act === 'TB') {
            parts.push('Touchback');
        } else if (act === 'OoB') {
            parts.push('Out of Bounds');
        } else if (act === 'recovered') {
            const rTeam = b.rec_team === 'def' ? def : poss;
            const tName = getTeamAbbr(rTeam);
            parts.push(`recovered by ${tName}`);
            if (b.ret_player) parts.push(formatPlayer(b.ret_player, rTeam));
            const retSpot = formatSpot(b.ret_side, b.ret_yd);
            if (retSpot) parts.push(`to ${retSpot}`);
        } else {
            const retYdStr = (b.ret_yds !== undefined && b.ret_yds !== '') ? ` for ${b.ret_yds} yds` : '';
            parts.push('return by');
            if (b.ret_player) parts.push(formatPlayer(b.ret_player, poss));
            if (retYdStr) parts.push(retYdStr.trim());
        }
    } else if (type === 'kick_return') {
        if (b.kicker) {
            parts.push(formatPlayer(b.kicker, def));
            parts.push('kick');
            if (b.kick_yds) parts.push(`${b.kick_yds} yds,`);
        }
        parts.push('return by');
        if (b.ret_player) parts.push(formatPlayer(b.ret_player, poss));
        if (b.ret_yds !== undefined && b.ret_yds !== '') parts.push(`for ${b.ret_yds} yds`);
        const tacklers = [formatPlayer(b.tackler1, def), formatPlayer(b.tackler2, def)].filter(Boolean);
        if (tacklers.length) parts.push(`(${tacklers.join(', ')})`);
    } else if (type === 'sack') {
        if (b.passer) parts.push(formatPlayer(b.passer, poss));
        parts.push('is sacked by');
        const sackers = [formatPlayer(b.sacker1, def), formatPlayer(b.sacker2, def)].filter(Boolean);
        if (sackers.length) parts.push(sackers.join(', '));
        if (b.gain !== undefined && b.gain !== '') parts.push(`for ${b.gain} yds`);
    } else if (type === 'penalty') {
        const pTeamName = getTeamAbbr(b.pen_team);
        if (pTeamName) parts.push(pTeamName);
        if (b.pen_name) parts.push(b.pen_name);
        if (b.pen_yds) parts.push(`${b.pen_yds} yds`);
        if (b.pen_player) parts.push(`by ${formatPlayer(b.pen_player, b.pen_team)}`);
    } else if (type === 'timeout') {
        const toTeamName = getTeamAbbr(b.to_team);
        parts.push(`Time out by ${toTeamName} #${b.to_num || '1'}`);
    }

    let baseSentence = parts.filter(Boolean).join(' ');

    // Append + Options
    currentActiveOptions.forEach(opt => {
        const od = opt.data || {};
        if (opt.type === 'touchdown') {
            baseSentence = (baseSentence + ' [Touchdown]').trim();
        } else if (opt.type === 'safety') {
            baseSentence = (baseSentence + ' [Safety]').trim();
        } else if (opt.type === 'fumble') {
            const rTeam = od.rec_team || def;
            const tName = getTeamAbbr(rTeam);
            const isScoop = od.fumble_res === 'scoop';
            const actionVerb = isScoop ? 'scooped' : 'recovered';
            if (od.fumble_res === 'out of bounds') {
                baseSentence = (baseSentence + ' fumbled out of bounds').trim();
            } else if (rTeam === poss) {
                const ydsStr = (od.rush_yds !== undefined && od.rush_yds !== '' && od.rush_yds !== null) ? `${od.rush_yds} yds` : '';
                const fumPart = `fumbled ${actionVerb} by ${tName} ${formatPlayer(od.rec_player, rTeam)} ${ydsStr ? 'rush ' + ydsStr : 'rush'}`.trim();
                baseSentence = (baseSentence + ' ' + fumPart).trim();
            } else {
                const spot = formatSpot(od.ret_side, od.ret_yd);
                const fumPart = `fumbled ${actionVerb} by ${tName} ${formatPlayer(od.rec_player, rTeam)} ${spot ? 'return to ' + spot : ''}`.trim();
                baseSentence = (baseSentence + ' ' + fumPart).trim();
            }
        } else if (opt.type === 'lateral') {
            const ydsStr = (od.gain !== undefined && od.gain !== '' && od.gain !== null) ? `${od.gain} yds` : '';
            const latPart = `lateral pass to ${formatPlayer(od.player, poss)} ${ydsStr ? 'for ' + ydsStr : ''}`.trim();
            baseSentence = (baseSentence + ' ' + latPart).trim();
        } else if (opt.type === 'first_down') {
            baseSentence = (baseSentence + ' [1st down]').trim();
        } else if (opt.type === 'penalty_nullify') {
            const tName = getTeamAbbr(od.team);
            if (od.status === 'declined') {
                baseSentence += ` (${tName} ${od.name || 'Penalty'} Declined)`;
            } else {
                const penDesc = `${tName} ${od.name || 'Penalty'} ${od.yds ? od.yds + ' yds' : ''} by ${formatPlayer(od.player, od.team)}`.trim();
                if (baseSentence) {
                    baseSentence = `${penDesc} {${baseSentence}}`;
                } else {
                    baseSentence = penDesc;
                }
            }
        } else if (opt.type === 'penalty_add') {
            const tName = getTeamAbbr(od.team);
            baseSentence += ` (${tName} ${od.name || 'Penalty'} ${od.yds ? od.yds + ' yds' : ''} by ${formatPlayer(od.player, od.team)})`.trim();
        } else if (opt.type === 'muff') {
            const rSide = od.rec_team === 'off' ? poss : def;
            const tName = getTeamAbbr(rSide);
            baseSentence += ` muffed by ${formatPlayer(od.muff_player, def)}, recovered by ${tName} ${formatPlayer(od.rec_player, rSide)}`;
        } else if (opt.type === 'return_fg') {
            const spot = formatSpot(od.ret_side, od.ret_yd);
            baseSentence += ` return by ${formatPlayer(od.ret_player, def)} ${spot ? 'to ' + spot : ''}`.trim();
        } else if (opt.type === 'return_kick') {
            const retYdStr = (od.ret_yds !== undefined && od.ret_yds !== '') ? `for ${od.ret_yds} yds` : '';
            baseSentence += ` return by ${formatPlayer(od.ret_player, poss)} ${retYdStr}`.trim();
        } else if (opt.type === 'injury') {
            const tName = getTeamAbbr(od.team);
            const injText = `Injured by ${tName} ${formatPlayer(od.player, od.team)}`.trim();
            baseSentence = (baseSentence + ' ' + injText).trim();
        }
    });

    const prevEl = document.getElementById('bPreviewText');
    if (prevEl) prevEl.innerHTML = formatDescHTML(baseSentence) || '—';

    const descEl = document.getElementById('frm_desc');
    if (descEl && !descEl.dataset.userEdited) {
        descEl.value = baseSentence;
    }
}

// User manually typing in textarea sets userEdited flag
document.addEventListener('DOMContentLoaded', () => {
    const desc = document.getElementById('frm_desc');
    if (desc) {
        desc.addEventListener('input', () => {
            desc.dataset.userEdited = desc.value.trim() !== '' ? 'true' : '';
        });
    }
});

/* ─── Sync UI ─────────────────────────────── */
function syncUI() {
    document.getElementById('awayName').value = state.awayName || '';
    document.getElementById('awayCity').value = state.awayCity || '';
    document.getElementById('homeName').value = state.homeName || '';
    document.getElementById('homeCity').value = state.homeCity || '';
    document.getElementById('awayTotal').value = state.awayTotal || 0;
    document.getElementById('homeTotal').value = state.homeTotal || 0;
    document.getElementById('gameTime').value = state.gameTime || '';
    document.getElementById('gameVenue').value = state.gameVenue || '';
    document.getElementById('gameName').value = state.gameName || '';
    document.getElementById('gameWeather').value = state.gameWeather || '';

    ['away', 'home'].forEach((t, ti) => {
        const p = ti === 0 ? 'a' : 'h';
        (state.quarterScores[t] || [0, 0, 0, 0, 0]).forEach((v, i) => {
            const inp = document.getElementById(p + 'q' + i);
            if (inp) inp.value = v;
        });
    });

    setQ(state.activeQ || 1, false);
    updatePossOpts();

    // Ensure possession has a sensible default ('away')
    const possEl = document.getElementById('frm_poss');
    if (possEl && !possEl.value) {
        possEl.value = 'away';
    }

    initSituationPickers();
    renderStepBuilder();
    renderOptSection();
    generateDescFromBuilder();
    renderPBP();
    syncRuleButtons();
    syncManualEditButtons();
}

/* ─── Quarter ─────────────────────────────── */
function setQ(q, save = true) {
    state.activeQ = q;
    [1, 2, 3, 4, 5].forEach(i => {
        const btn = document.getElementById('qb' + i);
        if (btn) btn.classList.toggle('active', i === q);
    });
    if (save) persist();
}

function updatePossOpts() {
    const s = document.getElementById('frm_poss');
    if (s && s.options && s.options.length >= 3) {
        s.options[1].text = state.awayName || 'AWAY';
        s.options[2].text = state.homeName || 'HOME';
    }

    const ballSide = document.getElementById('inp_ball_side');
    if (ballSide && ballSide.options && ballSide.options.length >= 3) {
        ballSide.options[1].text = getTeamAbbr('away');
        ballSide.options[2].text = getTeamAbbr('home');
    }
}

/* ─── Add / Update / Insert Play ─────────── */
function submitPlay() {
    syncBallAt();

    // Auto-generate description from builder if frm_desc is empty or untouched
    generateDescFromBuilder();
    let desc = (document.getElementById('frm_desc').value || '').trim();
    if (!desc) {
        const prevText = (document.getElementById('bPreviewText').textContent || '').trim();
        if (prevText && prevText !== '—') {
            desc = prevText;
        }
    }

    let effectiveType = _v('frm_type') || 'pass';
    const hasTD = currentActiveOptions.some(o => o.type === 'touchdown');
    const hasSafety = currentActiveOptions.some(o => o.type === 'safety');
    const hasFumble = currentActiveOptions.some(o => o.type === 'fumble');
    const penNullifyOpt = currentActiveOptions.find(o => o.type === 'penalty_nullify');
    const isPenNotDeclined = penNullifyOpt && (penNullifyOpt.data || {}).status !== 'declined';

    if (isPenNotDeclined) {
        effectiveType = 'penalty';
    } else if (hasTD) {
        effectiveType = 'td';
    } else if (hasSafety) {
        effectiveType = 'safety';
    } else if (hasFumble) {
        effectiveType = 'fumble';
    }

    // Ultimate fallback so play addition NEVER fails on empty description
    if (!desc) {
        desc = TL[effectiveType] || effectiveType.toUpperCase() || 'Play';
    }

    // Possession fallback: default to away if not selected
    let team = _v('frm_poss');
    if (!team) {
        team = 'away';
        const possSel = document.getElementById('frm_poss');
        if (possSel) possSel.value = 'away';
    }

    // Sync any active step builder field values into currentBuilderData
    const builderInputs = document.querySelectorAll('#bStepsContainer select, #bStepsContainer input');
    builderInputs.forEach(el => {
        if (!el.id || !el.id.startsWith('b_')) return;
        const key = el.id.slice(2);
        if (el.type === 'checkbox') {
            currentBuilderData[key] = el.checked;
        } else if (el.value !== '') {
            currentBuilderData[key] = el.value;
        }
    });

    if (currentBuilderData.runner && !currentBuilderData.rusher) {
        currentBuilderData.rusher = currentBuilderData.runner;
    } else if (currentBuilderData.rusher && !currentBuilderData.runner) {
        currentBuilderData.runner = currentBuilderData.rusher;
    }

    const data = {
        quarter: state.activeQ || 1,
        time: _v('inp_time').trim(),
        down: _v('inp_down').trim(),
        dist: _v('inp_dist').trim(),
        yardline: _v('inp_yardline').trim(),
        ballSide: _v('inp_ball_side'),
        ballYd: parseInt(_v('inp_ball_yd'), 10) || null,
        team: team,
        type: effectiveType,
        baseType: _v('frm_type') || 'pass',
        desc: desc,
        scoreUpdate: _v('frm_score').trim(),
        builderData: { ...currentBuilderData },
        activeOptions: JSON.parse(JSON.stringify(currentActiveOptions))
    };

    let newPlayId = null;
    if (editingPlayId !== null) {
        const idx = state.plays.findIndex(p => p.id === editingPlayId);
        if (idx !== -1) {
            state.plays[idx] = { ...state.plays[idx], ...data };
            newPlayId = editingPlayId;
        }
        toast('✅ プレイを更新しました');
        cancelEdit();
    } else if (insertAfterPlayId !== null) {
        const idx = state.plays.findIndex(p => p.id === insertAfterPlayId);
        const ref = state.plays[idx];
        newPlayId = Date.now();
        state.plays.splice(idx + 1, 0, { id: newPlayId, driveId: ref ? ref.driveId : state.currentDriveId, ...data });
        toast('↓ プレイを挿入しました');
        clearInsertMode();
    } else {
        newPlayId = Date.now();
        state.plays.push({ id: newPlayId, driveId: state.currentDriveId, ...data });
        toast('✅ プレイを追加しました');
    }

    clearForm();
    persist();
    renderPBP();
    switchViewTab('pbp');

    // Scroll to the newly added play and flash highlight
    setTimeout(() => {
        const list = document.getElementById('pbpList');
        if (newPlayId) {
            const item = document.getElementById('pi' + newPlayId);
            if (item && list) {
                const itemTop = item.offsetTop - list.offsetTop;
                list.scrollTo({ top: Math.max(0, itemTop), behavior: 'smooth' });
                item.classList.add('flash-new');
                setTimeout(() => item.classList.remove('flash-new'), 1500);
            } else if (list) {
                list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
            }
        } else if (list) {
            list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
        }
    }, 60);
}

function clearForm() {
    ['frm_desc', 'frm_score', 'inp_yardline', 'inp_down', 'inp_dist', 'inp_ball_side', 'inp_ball_yd', 'inp_time_min', 'inp_time_sec', 'inp_time'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; delete el.dataset.userEdited; }
    });
    currentBuilderData = {};
    currentActiveOptions = [];
    renderStepBuilder();
    renderOptSection();
    generateDescFromBuilder();
}

/* ─── Edit mode ───────────────────────────── */
function startEdit(id) {
    const p = state.plays.find(x => x.id === id); if (!p) return;
    editingPlayId = id; insertAfterPlayId = null;
    document.getElementById('frm_poss').value = p.team || '';
    document.getElementById('frm_type').value = p.type || 'pass';
    document.getElementById('frm_desc').value = p.desc || '';
    document.getElementById('frm_score').value = p.scoreUpdate || '';
    document.getElementById('inp_time').value = p.time || '';
    const minSel = document.getElementById('inp_time_min');
    const secSel = document.getElementById('inp_time_sec');
    if (p.time && p.time.includes(':')) {
        const [m, s] = p.time.split(':');
        if (minSel) minSel.value = (m && m !== '--') ? m.padStart(2, '0') : '';
        if (secSel) secSel.value = (s && s !== '--') ? s.padStart(2, '0') : '';
    } else {
        if (minSel) minSel.value = '';
        if (secSel) secSel.value = '';
    }
    document.getElementById('inp_down').value = p.down || '';
    document.getElementById('inp_dist').value = p.dist || '';

    if (p.ballSide && p.ballYd) {
        document.getElementById('inp_ball_side').value = p.ballSide;
        document.getElementById('inp_ball_yd').value = p.ballYd;
        document.getElementById('inp_yardline').value = p.yardline || '';
    } else if (p.yardline) {
        document.getElementById('inp_yardline').value = p.yardline;
        const m = p.yardline.trim().match(/^(.*?)\s*(\d+)\s*$/);
        if (m) {
            const sideName = m[1].trim();
            const yd = m[2];
            const awayName = (state.awayName || 'AWAY').toUpperCase();
            const awayAbbr = getTeamAbbr('away').toUpperCase();
            const isAway = sideName.toUpperCase() === awayName || sideName.toUpperCase().includes(awayAbbr);
            document.getElementById('inp_ball_side').value = isAway ? 'away' : 'home';
            document.getElementById('inp_ball_yd').value = yd;
        } else {
            document.getElementById('inp_ball_side').value = '';
            document.getElementById('inp_ball_yd').value = '';
        }
    } else {
        document.getElementById('inp_ball_side').value = '';
        document.getElementById('inp_ball_yd').value = '';
    }

    currentBuilderData = p.builderData ? { ...p.builderData } : {};
    currentActiveOptions = p.activeOptions ? JSON.parse(JSON.stringify(p.activeOptions)) : [];

    setQ(p.quarter || 1);
    setFormMode('✏️ Edit Play', '✅ プレイを更新', true);
    renderStepBuilder();
    renderOptSection();
    renderPBP();
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelEdit() {
    editingPlayId = null;
    insertAfterPlayId = null;
    clearForm();
    setFormMode('＋ Add Play', '＋ プレイを追加', false);
    renderPBP();
}

/* ─── Insert After mode ──────────────────── */
function startInsertAfter(id) {
    insertAfterPlayId = id; editingPlayId = null;
    clearForm();
    setFormMode('↓ プレイをここに挿入', '↓ 挿入する', true);
    renderPBP();
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function clearInsertMode() {
    insertAfterPlayId = null;
    setFormMode('＋ Add Play', '＋ プレイを追加', false);
}

function setFormMode(title, btnText, showCancel) {
    document.getElementById('fmTitle').textContent = title;
    document.getElementById('submitBtn').textContent = btnText;
    document.getElementById('cancelBtn').style.display = showCancel ? 'flex' : 'none';
}

/* ─── Delete ──────────────────────────────── */
function askDel(id) {
    pendingDeleteId = id;
    const p = state.plays.find(x => x.id === id);
    document.getElementById('delDesc').textContent = p ? `「${p.desc.slice(0, 60)}${p.desc.length > 60 ? '…' : ''}」を削除します。取り消せません。` : 'このプレイを削除します。';
    document.getElementById('delMo').classList.add('open');
}
function confirmDel() {
    if (pendingDeleteId !== null) {
        state.plays = state.plays.filter(p => p.id !== pendingDeleteId);
        persist();
        renderPBP();
        toast('🗑 削除しました', '#ff4444');
    }
    pendingDeleteId = null; closeMo('delMo');
}

/* ─── Highlight (multiple, persisted) ────── */
function toggleHL(id) {
    const arr = state.highlightedPlayIds;
    const i = arr.indexOf(id);
    if (i === -1) arr.push(id); else arr.splice(i, 1);
    persist(); renderPBP();
}

/* ─── Drive ───────────────────────────────── */
function endDrive() {
    if (state.plays.filter(p => p.driveId === state.currentDriveId).length === 0) {
        toast('現在のドライブにプレイがありません', '#ff4444'); return;
    }
    if (!state.drives[state.currentDriveId]) {
        state.drives[state.currentDriveId] = {
            team: '', result: '', yards: '', driveTime: '', score: '', playCountOverride: null, collapsed: false
        };
    }
    state.currentDriveId++;
    persist(); renderPBP(); toast('🏁 ドライブを終了しました');
}

function toggleDrive(did) {
    if (!state.drives[did]) return;
    state.drives[did].collapsed = !state.drives[did].collapsed;
    persist(); renderPBP();
}

/* Drive metadata change handler */
document.getElementById('pbpList').addEventListener('change', e => {
    const d = e.target.dataset.drive, f = e.target.dataset.field;
    if (d && f) {
        const did = parseInt(d);
        if (!state.drives[did]) return;
        state.drives[did][f] = e.target.value;
        persist();
        if (f === 'team') renderPBP();
        renderTeamStats();
    }
});
document.getElementById('pbpList').addEventListener('input', e => {
    const d = e.target.dataset.drive, f = e.target.dataset.field;
    if (d && f && f !== 'team') {
        const did = parseInt(d);
        if (!state.drives[did]) return;
        state.drives[did][f] = e.target.value;
        persist();
        if (f === 'driveTime' || f === 'yards') {
            renderTeamStats();
        }
    }
});

/* ─── Render PBP ──────────────────────────── */
function teamLabel(k) { return k === 'away' ? state.awayName || 'AWAY' : k === 'home' ? state.homeName || 'HOME' : ''; }
function teamColor(k) { return k === 'home' ? 'var(--a2)' : 'var(--ac)'; }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderPBP() {
    const pbpList = document.getElementById('pbpList');
    if (!pbpList) return;

    const plays = state.plays || [];
    const total = plays.filter(p => !NP.has(p.type)).length;
    const cntEl = document.getElementById('pbpCount');
    if (cntEl) cntEl.textContent = total + ' play' + (total !== 1 ? 's' : '');

    if (plays.length === 0) {
        pbpList.innerHTML = '<div class="empty"><div class="empty-ic">🏈</div><div>右のフォームからプレイを追加してください</div></div>';
        return;
    }

    const driveOrder = [], driveMap = {};
    plays.forEach(p => {
        const d = p.driveId || 1;
        if (!driveMap[d]) { driveMap[d] = []; driveOrder.push(d); }
        driveMap[d].push(p);
    });

    let html = '', prevLastQ = null;

    driveOrder.forEach((did, di) => {
        const dPlays = driveMap[did];
        const autoCounted = dPlays.filter(p => !NP.has(p.type)).length;
        const isEnded = !!state.drives[did];
        const dmeta = state.drives[did] || {};
        const displayPlayCount = dmeta.playCountOverride !== undefined && dmeta.playCountOverride !== '' && dmeta.playCountOverride !== null
            ? dmeta.playCountOverride
            : autoCounted;
        const collapsed = isEnded && dmeta.collapsed;
        const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';

        if (di > 0 && prevLastQ !== null) {
            const firstQ = (dPlays[0] && dPlays[0].quarter) || 1;
            if (prevLastQ === 2 && firstQ >= 3) {
                html += `<div class="halftime-sep"><div class="sep-line sep-line-h"></div><span class="sep-lbl sep-lbl-h">HALFTIME</span><div class="sep-line sep-line-h"></div></div>`;
            } else {
                html += `<div class="drive-end-sep"><div class="sep-line sep-line-r"></div><span class="sep-lbl sep-lbl-r">Drive ${di} End</span><div class="sep-line sep-line-r"></div></div>`;
            }
        }
        prevLastQ = (dPlays[dPlays.length - 1] && dPlays[dPlays.length - 1].quarter) || 1;

        if (isEnded) {
            const teamOpts = `<option value=""${!dmeta.team ? ' selected' : ''}>—</option><option value="away"${dmeta.team === 'away' ? ' selected' : ''}>${esc(away)}</option><option value="home"${dmeta.team === 'home' ? ' selected' : ''}>${esc(home)}</option>`;
            html += `<div class="deh">
        <button class="dtog" onclick="toggleDrive(${did})">${collapsed ? '▶' : '▼'}</button>
        <select class="dteam" data-drive="${did}" data-field="team" title="チームを選択" style="color:${dmeta.team ? teamColor(dmeta.team) : 'var(--mt)'}">${teamOpts}</select>
        <span class="d-sep">|</span>
        <input class="dmi dmi-r" data-drive="${did}" data-field="result" value="${esc(dmeta.result || '')}" placeholder="Result..."/>
        <span class="d-sep">·</span>
        <span class="d-pc-wrap">
            <input class="dmi-playcount" type="number" data-drive="${did}" data-field="playCountOverride" value="${esc(displayPlayCount)}" placeholder="${autoCounted}" title="プレイ数を手動修正可能"/>
            <span style="font-size:.7rem;color:var(--mt)">plays</span>
        </span>
        <span class="d-sep">·</span>
        <input class="dmi dmi-n" data-drive="${did}" data-field="yards" value="${esc(dmeta.yards || '')}" placeholder="Yds" type="number"/>
        <span style="font-size:.74rem;color:var(--mt)">yds</span>
        <span class="d-sep">·</span>
        <input class="dmi dmi-n" data-drive="${did}" data-field="driveTime" value="${esc(dmeta.driveTime || '')}" placeholder="0:00"/>
        <span class="d-sep">·</span>
        <input class="dmi dmi-s" data-drive="${did}" data-field="score" value="${esc(dmeta.score || '')}" placeholder="スコア"/>
      </div>`;
            if (!collapsed) { html += renderDrivePlays(dPlays); }
        } else {
            html += `<div class="dch"><span class="dch-lbl">DRIVE ${di + 1} <span style="font-size:.6rem;color:var(--gn)">▶ IN PROGRESS</span></span><span class="dch-cnt">${autoCounted} plays</span><div class="dch-line"></div></div>`;
            html += renderDrivePlays(dPlays);
        }
    });

    pbpList.innerHTML = html;
    renderBoxScore();
    renderTeamStats();
    renderFieldMap();
    renderWinProbability();
    renderGameReport();
}

function renderDrivePlays(dPlays) {
    const hlIds = state.highlightedPlayIds || [];
    let html = '';
    dPlays.forEach(p => {
        const isHL = hlIds.includes(p.id);
        const isED = editingPlayId === p.id;
        const isIA = insertAfterPlayId === p.id;
        let cls = 'play-item';
        if (isHL) cls += ' hl'; if (isED) cls += ' editing'; if (isIA) cls += ' inserting';
        const tKey = p.type || 'other';
        const dnDist = [p.down, p.dist ? `& ${p.dist}` : ''].filter(Boolean).join(' ');
        const sit = [dnDist, p.yardline ? `at ${p.yardline}` : ''].filter(Boolean).join(' ');
        const badge = p.team ? `<div class="pt-badge" style="background:${teamColor(p.team)}22;color:${teamColor(p.team)}">${esc(teamLabel(p.team))}</div>` : '';
        const scoreRow = p.scoreUpdate ? `<div class="pt-sc">🏆 ${esc(p.scoreUpdate)}</div>` : '';
        const qLabel = p.quarter ? `<span class="pt-ql">${QL[p.quarter] || 'Q?'}</span> ` : '';

        html += `<div class="${cls}" id="pi${p.id}">
      <div><button class="hl-btn${isHL ? ' on' : ''}" onclick="toggleHL(${p.id})"><span class="hl-dot"></span></button></div>
      <div class="pt-col">
        <div>${qLabel}<span class="pt-time">${esc(p.time) || '—'}</span></div>
        <div class="pt-dd">${esc(sit) || '—'}</div>
        ${badge}
      </div>
      <div>
        <span class="pt-tag tg-${tKey}">${TL[tKey] || tKey.toUpperCase()}</span>
        <div class="pt-desc">${formatDescHTML(p.desc)}</div>
        ${scoreRow}
      </div>
      <div class="play-acts">
        <button class="ab ab-del" onclick="askDel(${p.id})" title="削除">✕</button>
        <button class="ab ab-edit" onclick="startEdit(${p.id})" title="編集">✏️</button>
        <button class="ab ab-ins" onclick="startInsertAfter(${p.id})" title="この下に挿入">↓</button>
      </div>
    </div>`;
    });
    return html;
}


/* ─── Individual Player Stats (Box Score) ─── */
function switchViewTab(tab) {
    currentActiveViewTab = tab;
    const pbpWrap = document.querySelector('.pbp-wrap');
    const bsWrap = document.getElementById('boxScoreWrap');
    const tsWrap = document.getElementById('teamStatsWrap');
    const fmWrap = document.getElementById('fieldMapWrap');
    const wpWrap = document.getElementById('winProbWrap');
    const grWrap = document.getElementById('gameReportWrap');
    const tabPBP = document.getElementById('tabBtnPBP');
    const tabBS = document.getElementById('tabBtnBoxScore');
    const tabTS = document.getElementById('tabBtnTeamStats');
    const tabFM = document.getElementById('tabBtnFieldMap');
    const tabWP = document.getElementById('tabBtnWinProb');
    const tabGR = document.getElementById('tabBtnReport');

    [tabPBP, tabBS, tabTS, tabFM, tabWP, tabGR].forEach(b => { if (b) b.classList.remove('active'); });
    if (pbpWrap) pbpWrap.style.display = 'none';
    if (bsWrap) bsWrap.style.display = 'none';
    if (tsWrap) tsWrap.style.display = 'none';
    if (fmWrap) fmWrap.style.display = 'none';
    if (wpWrap) wpWrap.style.display = 'none';
    if (grWrap) grWrap.style.display = 'none';

    if (tab === 'boxscore') {
        if (bsWrap) bsWrap.style.display = 'flex';
        if (tabBS) tabBS.classList.add('active');
        renderBoxScore();
    } else if (tab === 'teamstats') {
        if (tsWrap) tsWrap.style.display = 'flex';
        if (tabTS) tabTS.classList.add('active');
        renderTeamStats();
    } else if (tab === 'fieldmap') {
        if (fmWrap) fmWrap.style.display = 'flex';
        if (tabFM) tabFM.classList.add('active');
        renderFieldMap();
    } else if (tab === 'winprob') {
        if (wpWrap) wpWrap.style.display = 'flex';
        if (tabWP) tabWP.classList.add('active');
        renderWinProbability();
    } else if (tab === 'report') {
        if (grWrap) grWrap.style.display = 'flex';
        if (tabGR) tabGR.classList.add('active');
        renderGameReport();
    } else {
        if (pbpWrap) pbpWrap.style.display = 'flex';
        if (tabPBP) tabPBP.classList.add('active');
    }
    syncRuleButtons();
}

function setBoxScoreFilter(flt) {
    currentBoxScoreFilter = flt;
    ['All', 'Away', 'Home'].forEach(k => {
        const btn = document.getElementById('bsFlt' + k);
        if (btn) btn.classList.toggle('active', k.toLowerCase() === flt);
    });
    renderBoxScore();
}

function getPlayBaseType(p) {
    if (p.baseType) return p.baseType;
    if (p.type === 'kick_return') return 'kick_return';
    const b = p.builderData || {};
    if (b.runner !== undefined || b.rusher !== undefined) return 'rush';
    if (b.passer !== undefined) {
        if (b.sacker1 || b.sacker2) return 'sack';
        if (b.interceptor) return 'intercept';
        if (b.pbu) return 'inc';
        return 'pass';
    }
    if (b.punter !== undefined) return 'punt';
    if (b.kicker !== undefined) {
        if (b.kick_kind || b.kick_action) return 'kick';
        if (b.fg_dist || b.fg_res) return 'fg';
        return 'xp';
    }
    return p.type;
}

function isDefenseTDPlay(p) {
    const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
    if (!hasTD) return false;

    const bt = getPlayBaseType(p);
    const pTeam = p.team || p.poss || 'away';
    const defTeam = (pTeam === 'away') ? 'home' : 'away';
    const b = p.builderData || {};
    const intOpt = (p.activeOptions || []).find(o => o.type === 'intercept');
    const fumOpt = (p.activeOptions || []).find(o => o.type === 'fumble');
    const retFgOpt = (p.activeOptions || []).find(o => o.type === 'return_fg');
    const muffOpt = (p.activeOptions || []).find(o => o.type === 'muff');

    const isFumbleLost = fumOpt && (fumOpt.data || {}).fumble_res !== 'out of bounds' &&
        (((fumOpt.data || {}).rec_team || defTeam) === defTeam);

    if (bt === 'intercept' || !!intOpt || isFumbleLost || (p.type === 'turnover') || !!retFgOpt) {
        return true;
    }
    if (bt === 'punt') {
        const isOwnOffRecovered = (fumOpt && (fumOpt.data || {}).rec_team === pTeam) ||
            (muffOpt && (muffOpt.data || {}).rec_team === 'off');
        if (!isOwnOffRecovered) return true;
    }
    if (bt === 'fg') {
        const isOwnOffRecovered = (b.rec_side === 'off') ||
            (fumOpt && (fumOpt.data || {}).rec_team === pTeam);
        if (!isOwnOffRecovered) return true;
    }
    if (bt === 'xp' && b.rec_side !== 'off') {
        return true;
    }
    if (b.is_blocked || (b.fg_res === 'blocked' && b.rec_side !== 'off')) {
        return true;
    }
    return false;
}

function isTurnoverPlay(p) {
    const bt = getPlayBaseType(p);
    const pTeam = p.team || p.poss || 'away';
    const defTeam = (pTeam === 'away') ? 'home' : 'away';
    const intOpt = (p.activeOptions || []).find(o => o.type === 'intercept');
    const fumOpt = (p.activeOptions || []).find(o => o.type === 'fumble');
    const isFumbleLost = fumOpt && (fumOpt.data || {}).fumble_res !== 'out of bounds' &&
        (((fumOpt.data || {}).rec_team || defTeam) === defTeam);

    return (bt === 'intercept') || !!intOpt || isFumbleLost || (p.type === 'turnover') || isDefenseTDPlay(p);
}

function resolvePlayerInfo(num, side) {
    if (num === undefined || num === null || String(num).trim() === '') {
        return { key: '__unknown__', name: '<span class="bs-unknown">(unknown player)</span>', isUnknown: true };
    }
    const clean = String(num).replace('#', '').trim();
    if (!clean) {
        return { key: '__unknown__', name: '<span class="bs-unknown">(unknown player)</span>', isUnknown: true };
    }
    return { key: clean, name: esc(formatPlayer(clean, side)), isUnknown: false };
}

function initTeamStats(teamKey) {
    return {
        key: teamKey,
        name: teamKey === 'away' ? (state.awayName || 'AWAY') : (state.homeName || 'HOME'),
        abbr: getTeamAbbr(teamKey),
        passing: {},
        rushing: {},
        receiving: {},
        fumbles: {},
        defensive: {},
        interceptions: {},
        kickReturns: {},
        puntReturns: {},
        kicking: {},
        punting: {}
    };
}

function computeStats() {
    const stats = {
        away: initTeamStats('away'),
        home: initTeamStats('home'),
        totalCountedPlays: 0
    };

    (state.plays || []).forEach(p => {
        const penNull = (p.activeOptions || []).find(o => o.type === 'penalty_nullify');
        if (penNull && (penNull.data || {}).status !== 'declined') {
            return;
        }
        stats.totalCountedPlays++;

        const poss = p.team || p.poss || 'away';
        const def = poss === 'away' ? 'home' : 'away';
        const b = p.builderData || {};
        const baseType = getPlayBaseType(p);
        const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown');
        const fumbleOpt = (p.activeOptions || []).find(o => o.type === 'fumble');
        const isFumbleLostToDef = fumbleOpt && (fumbleOpt.data || {}).fumble_res !== 'out of bounds' &&
            (((fumbleOpt.data || {}).rec_team || def) === def);

        // 1. PASSING
        if (baseType === 'pass' || baseType === 'inc' || baseType === 'intercept') {
            const passer = resolvePlayerInfo(b.passer, poss);
            const pStats = stats[poss].passing[passer.key] = stats[poss].passing[passer.key] || {
                name: passer.name, cmp: 0, att: 0, yds: 0, td: 0, int: 0, sacks: 0, sackYds: 0, noYds: 0
            };
            pStats.att++;

            const lateralOpt = (p.activeOptions || []).find(o => o.type === 'lateral');
            const latData = lateralOpt ? (lateralOpt.data || {}) : null;

            if (baseType === 'pass') {
                pStats.cmp++;
                let totalPassYds = 0;
                let hasPassYds = false;
                if (b.gain !== undefined && b.gain !== '' && !isNaN(parseInt(b.gain))) {
                    totalPassYds += parseInt(b.gain);
                    hasPassYds = true;
                }
                if (latData && latData.gain !== undefined && latData.gain !== '' && !isNaN(parseInt(latData.gain))) {
                    totalPassYds += parseInt(latData.gain);
                    hasPassYds = true;
                }

                if (hasPassYds) {
                    pStats.yds += totalPassYds;
                } else {
                    pStats.noYds++;
                }
                // 最初にパス投げた人: TDならパスTD (相手ディフェンスのスコア時は付与しない)
                if (hasTD && !isFumbleLostToDef) pStats.td++;
            } else if (baseType === 'intercept') {
                pStats.int++;
            }

            // Receiving (パスを受けてlateralを投げた人、または通常のレシーバー)
            if (b.target || baseType === 'pass') {
                const recPlayer = resolvePlayerInfo(b.target, poss);
                const rStats = stats[poss].receiving[recPlayer.key] = stats[poss].receiving[recPlayer.key] || {
                    name: recPlayer.name, rec: 0, yds: 0, td: 0, long: null, tgts: 0, noYds: 0
                };
                rStats.tgts++;
                if (baseType === 'pass') {
                    rStats.rec++;
                    if (b.gain !== undefined && b.gain !== '' && !isNaN(parseInt(b.gain))) {
                        const g = parseInt(b.gain);
                        rStats.yds += g;
                        rStats.long = rStats.long === null ? g : Math.max(rStats.long, g);
                    } else {
                        rStats.noYds++;
                    }
                    // lateralがある場合: TDはボールを最後に受けたlateral receiverに付くため、最初のレシーバーには付けない
                    if (hasTD && !latData && !isFumbleLostToDef) {
                        rStats.td++;
                    }
                }
            }

            // Lateral Receiver (lateral passをレシーブした人)
            if (baseType === 'pass' && latData && latData.player) {
                const latPlayer = resolvePlayerInfo(latData.player, poss);
                const latStats = stats[poss].receiving[latPlayer.key] = stats[poss].receiving[latPlayer.key] || {
                    name: latPlayer.name, rec: 0, yds: 0, td: 0, long: null, tgts: 0, noYds: 0
                };
                // レシーブ回数0回（rec, tgtsは加算しない）
                if (latData.gain !== undefined && latData.gain !== '' && !isNaN(parseInt(latData.gain))) {
                    const lg = parseInt(latData.gain);
                    latStats.yds += lg;
                    latStats.long = latStats.long === null ? lg : Math.max(latStats.long, lg);
                } else {
                    latStats.noYds++;
                }
                // TDだったら、最後にlateralでボールを受けた人がレシーブTD
                if (hasTD && !isFumbleLostToDef) {
                    latStats.td++;
                }
            }

            // Def PBU
            if (baseType === 'inc' && b.pbu) {
                const defP = resolvePlayerInfo(b.pbu, def);
                const dStats = stats[def].defensive[defP.key] = stats[def].defensive[defP.key] || {
                    name: defP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                };
                dStats.pd++;
            }

            // Intercept
            if (baseType === 'intercept' && b.interceptor) {
                const intP = resolvePlayerInfo(b.interceptor, def);
                const dStats = stats[def].defensive[intP.key] = stats[def].defensive[intP.key] || {
                    name: intP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                };
                dStats.int++;
                dStats.pd++;
                if (hasTD) dStats.td++;

                const iStats = stats[def].interceptions[intP.key] = stats[def].interceptions[intP.key] || {
                    name: intP.name, int: 0, yds: 0, td: 0
                };
                iStats.int++;
                if (b.ret_yds !== undefined && b.ret_yds !== '' && !isNaN(parseInt(b.ret_yds))) {
                    iStats.yds += parseInt(b.ret_yds);
                } else if (b.ret_yd !== undefined && b.ret_yd !== '' && !isNaN(parseInt(b.ret_yd))) {
                    iStats.yds += parseInt(b.ret_yd);
                }
                if (hasTD) iStats.td++;
            }
        }

        // 2. SACK
        else if (baseType === 'sack') {
            const isCollege = state.ruleType === 'college';
            const isJapan = state.ruleType === 'japan';
            const isCollegeOrJapan = (isCollege || isJapan);
            const passer = resolvePlayerInfo(b.passer, poss);
            const lossYds = (b.gain !== undefined && b.gain !== '' && !isNaN(parseInt(b.gain))) ? Math.abs(parseInt(b.gain)) : 0;

            // QBの被サック数・被ロスヤード（NFL / College / Japan共通でpassingスタッツのSACKS列に記録）
            const pStats = stats[poss].passing[passer.key] = stats[poss].passing[passer.key] || {
                name: passer.name, cmp: 0, att: 0, yds: 0, td: 0, int: 0, sacks: 0, sackYds: 0, noYds: 0
            };
            pStats.sacks++;
            pStats.sackYds += lossYds;

            if (isCollegeOrJapan) {
                // College (NCAA) & Japan rule: サックはラン扱い（QBのラン試行・ロスヤードとしても加算）
                const rStats = stats[poss].rushing[passer.key] = stats[poss].rushing[passer.key] || {
                    name: passer.name, car: 0, yds: 0, td: 0, long: null, noYds: 0
                };
                rStats.car++;
                rStats.yds -= lossYds;
                const netLoss = -lossYds;
                rStats.long = rStats.long === null ? netLoss : Math.max(rStats.long, netLoss);
                if (hasTD) rStats.td++;
            }

            const s1 = b.sacker1 ? resolvePlayerInfo(b.sacker1, def) : null;
            const s2 = b.sacker2 ? resolvePlayerInfo(b.sacker2, def) : null;
            if (s1 && s2) {
                [s1, s2].forEach(sp => {
                    const dStats = stats[def].defensive[sp.key] = stats[def].defensive[sp.key] || {
                        name: sp.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                    };
                    dStats.sacks += 0.5;
                    dStats.ast++;
                    dStats.tot += isJapan ? 0.5 : 1; // 日本の大学: assistタックル時はtot 0.5カウント
                    dStats.tfl += isCollegeOrJapan ? 0.5 : 1; // College/Japan: 0.5 each, NFL: 1 each
                });
            } else if (s1 || s2) {
                const sp = s1 || s2;
                const dStats = stats[def].defensive[sp.key] = stats[def].defensive[sp.key] || {
                    name: sp.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                };
                dStats.sacks += 1;
                dStats.solo++;
                dStats.tot++;
                dStats.tfl += 1;
            }
        }

        // 3. RUSH
        else if (baseType === 'rush') {
            const rusherNum = b.runner || b.rusher;
            const rusher = resolvePlayerInfo(rusherNum, poss);
            const rStats = stats[poss].rushing[rusher.key] = stats[poss].rushing[rusher.key] || {
                name: rusher.name, car: 0, yds: 0, td: 0, long: null, noYds: 0
            };

            // scoopの時、元がランプレーだったら、そのキャリー回数は取消（scoopした選手にキャリー回数がつく）
            const isScoopByOffense = fumbleOpt && (fumbleOpt.data || {}).fumble_res === 'scoop' && ((fumbleOpt.data || {}).rec_team || def) === poss;
            if (!isScoopByOffense) {
                rStats.car++;
            }

            if (b.gain !== undefined && b.gain !== '' && b.gain !== null && !isNaN(parseInt(b.gain))) {
                const g = parseInt(b.gain);
                rStats.yds += g;
                rStats.long = rStats.long === null ? g : Math.max(rStats.long, g);
            } else {
                rStats.noYds++;
            }
            if (hasTD && !isScoopByOffense && !isFumbleLostToDef) rStats.td++;
        }

        // 4. PUNT
        else if (baseType === 'punt') {
            const punter = resolvePlayerInfo(b.punter, poss);
            const pStats = stats[poss].punting[punter.key] = stats[poss].punting[punter.key] || {
                name: punter.name, no: 0, yds: 0, long: null, noYds: 0
            };
            pStats.no++; // Blocked punt でもパント回数にカウント

            if (b.is_blocked) {
                // Blocked punt: パントヤードは0（未入力マーク*は付けない）
                pStats.long = pStats.long === null ? 0 : Math.max(pStats.long, 0);
                if (hasTD && b.blocker) {
                    const blkP = resolvePlayerInfo(b.blocker, def);
                    const dStats = stats[def].defensive[blkP.key] = stats[def].defensive[blkP.key] || {
                        name: blkP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                    };
                    dStats.td++;
                }
            } else {
                if (b.punt_yds !== undefined && b.punt_yds !== '' && b.punt_yds !== null && !isNaN(parseInt(b.punt_yds))) {
                    const py = parseInt(b.punt_yds);
                    pStats.yds += py;
                    pStats.long = pStats.long === null ? py : Math.max(pStats.long, py);
                } else {
                    pStats.noYds++;
                }

                if (b.ret_action === 'return by' || (b.ret_player && !b.ret_action)) {
                    const retP = resolvePlayerInfo(b.ret_player, def);
                    const prStats = stats[def].puntReturns[retP.key] = stats[def].puntReturns[retP.key] || {
                        name: retP.name, no: 0, yds: 0, long: null, td: 0, noYds: 0
                    };
                    prStats.no++;
                    if (b.ret_yds !== undefined && b.ret_yds !== '' && b.ret_yds !== null && !isNaN(parseInt(b.ret_yds))) {
                        const ry = parseInt(b.ret_yds);
                        prStats.yds += ry;
                        prStats.long = prStats.long === null ? ry : Math.max(prStats.long, ry);
                    } else {
                        prStats.noYds++;
                    }
                    if (hasTD) prStats.td++;
                }
            }
        }

        // 5. KICK & KICK_RETURN
        else if (baseType === 'kick' || baseType === 'kick_return') {
            const isReturn = (baseType === 'kick_return') || (b.kick_action === 'return' || (!b.kick_action && b.ret_player));
            if (isReturn && b.ret_player) {
                const retP = resolvePlayerInfo(b.ret_player, poss);
                const krStats = stats[poss].kickReturns[retP.key] = stats[poss].kickReturns[retP.key] || {
                    name: retP.name, no: 0, yds: 0, long: null, td: 0, noYds: 0
                };
                krStats.no++;
                if (b.ret_yds !== undefined && b.ret_yds !== '' && b.ret_yds !== null && !isNaN(parseInt(b.ret_yds))) {
                    const ry = parseInt(b.ret_yds);
                    krStats.yds += ry;
                    krStats.long = krStats.long === null ? ry : Math.max(krStats.long, ry);
                } else {
                    krStats.noYds++;
                }
                if (hasTD) krStats.td++;
            }
        }

        // 6. FG
        else if (baseType === 'fg') {
            const kicker = resolvePlayerInfo(b.kicker, poss);
            const kStats = stats[poss].kicking[kicker.key] = stats[poss].kicking[kicker.key] || {
                name: kicker.name, fgAtt: 0, fgMade: 0, long: 0, xpAtt: 0, xpMade: 0, pts: 0
            };
            kStats.fgAtt++;
            const fgRes = (b.fg_res || 'good').toLowerCase();
            if (fgRes === 'good') {
                kStats.fgMade++;
                kStats.pts += 3;
                if (b.fg_dist !== undefined && b.fg_dist !== '' && b.fg_dist !== null && !isNaN(parseInt(b.fg_dist))) {
                    kStats.long = Math.max(kStats.long, parseInt(b.fg_dist));
                }
            } else if (fgRes === 'blocked') {
                if (b.rec_num) {
                    const rSide = b.rec_side === 'off' ? poss : def;
                    const recP = resolvePlayerInfo(b.rec_num, rSide);
                    if (rSide === def) {
                        const dStats = stats[def].defensive[recP.key] = stats[def].defensive[recP.key] || {
                            name: recP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                        };
                        dStats.fr++;
                        if (hasTD) dStats.td++;
                    }
                }
            }
        }

        // 7. XP
        else if (baseType === 'xp') {
            const kicker = resolvePlayerInfo(b.kicker, poss);
            const kStats = stats[poss].kicking[kicker.key] = stats[poss].kicking[kicker.key] || {
                name: kicker.name, fgAtt: 0, fgMade: 0, long: 0, xpAtt: 0, xpMade: 0, pts: 0
            };
            kStats.xpAtt++;
            const xpRes = (b.xp_res || 'good').toLowerCase();
            if (xpRes === 'good') {
                kStats.xpMade++;
                kStats.pts += 1;
            }
        }

        // 8. TACKLES
        if (baseType !== 'sack') {
            const isCollege = state.ruleType === 'college';
            const isJapan = state.ruleType === 'japan';
            const isCollegeOrJapan = (isCollege || isJapan);
            const tSide = (baseType === 'intercept') ? poss : def;
            const t1 = b.tackler1 ? resolvePlayerInfo(b.tackler1, tSide) : null;
            const t2 = b.tackler2 ? resolvePlayerInfo(b.tackler2, tSide) : null;
            const isLoss = (b.gain !== undefined && b.gain !== '' && b.gain !== null && parseInt(b.gain) < 0);

            if (t1 && t2) {
                [t1, t2].forEach(tp => {
                    const dStats = stats[tSide].defensive[tp.key] = stats[tSide].defensive[tp.key] || {
                        name: tp.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                    };
                    dStats.ast++;
                    dStats.tot += isJapan ? 0.5 : 1; // 日本の大学: assistタックル時はtot 0.5カウント
                    if (isLoss) {
                        dStats.tfl += isCollegeOrJapan ? 0.5 : 1; // College/Japan: 0.5 each, NFL: 1 each
                    }
                });
            } else if (t1 || t2) {
                const tp = t1 || t2;
                const dStats = stats[tSide].defensive[tp.key] = stats[tSide].defensive[tp.key] || {
                    name: tp.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                };
                dStats.solo++;
                dStats.tot++;
                if (isLoss) dStats.tfl += 1;
            }
        }

        // 9. FUMBLES
        if (fumbleOpt) {
            const fd = fumbleOpt.data || {};
            let carrierNum = '';
            let carrierSide = poss;
            if (baseType === 'rush') {
                carrierNum = b.runner || b.rusher;
                carrierSide = poss;
            } else if (baseType === 'pass') {
                carrierNum = b.target;
                carrierSide = poss;
            } else if (baseType === 'sack') {
                carrierNum = b.passer;
                carrierSide = poss;
            } else if (baseType === 'punt') {
                carrierNum = b.ret_player;
                carrierSide = def;
            } else if (baseType === 'kick' || baseType === 'kick_return') {
                carrierNum = b.ret_player;
                carrierSide = poss;
            }

            const carrierP = resolvePlayerInfo(carrierNum, carrierSide);
            const fumStats = stats[carrierSide].fumbles[carrierP.key] = stats[carrierSide].fumbles[carrierP.key] || {
                name: carrierP.name, fum: 0, lost: 0, rec: 0
            };
            fumStats.fum++;

            const oppSide = carrierSide === 'away' ? 'home' : 'away';
            const isOOB = fd.fumble_res === 'out of bounds';
            if (!isOOB) {
                const recTeam = fd.rec_team || oppSide;
                const recNum = fd.rec_player;

                if (recTeam === oppSide) {
                    // 相手にリカバーされた: した側はlost+1、拾った相手はFUMBLES表でrec+1 & DEFENSIVE表でfr+1
                    fumStats.lost++;
                    const recP = resolvePlayerInfo(recNum, oppSide);
                    const oppFumStats = stats[oppSide].fumbles[recP.key] = stats[oppSide].fumbles[recP.key] || {
                        name: recP.name, fum: 0, lost: 0, rec: 0
                    };
                    oppFumStats.rec++;

                    const dStats = stats[oppSide].defensive[recP.key] = stats[oppSide].defensive[recP.key] || {
                        name: recP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
                    };
                    dStats.fr++;
                    if (hasTD) dStats.td++;
                } else if (recTeam === carrierSide) {
                    // 味方がリカバーした: 拾った味方選手はFUMBLES表でrec+1
                    const recP = resolvePlayerInfo(recNum, carrierSide);
                    const ownFumStats = stats[carrierSide].fumbles[recP.key] = stats[carrierSide].fumbles[recP.key] || {
                        name: recP.name, fum: 0, lost: 0, rec: 0
                    };
                    ownFumStats.rec++;

                    // scoop の場合は、そのあとの rush ヤードを RUSHING にカウント
                    if (fd.fumble_res === 'scoop') {
                        const rStats = stats[carrierSide].rushing[recP.key] = stats[carrierSide].rushing[recP.key] || {
                            name: recP.name, car: 0, yds: 0, td: 0, long: null, noYds: 0
                        };
                        rStats.car++;
                        if (fd.rush_yds !== undefined && fd.rush_yds !== '' && fd.rush_yds !== null && !isNaN(parseInt(fd.rush_yds))) {
                            const ry = parseInt(fd.rush_yds);
                            rStats.yds += ry;
                            rStats.long = rStats.long === null ? ry : Math.max(rStats.long, ry);
                        } else {
                            rStats.noYds++;
                        }
                        if (hasTD) rStats.td++;
                    }
                }
            }
        }

        // 10. RETURN FG (Field Goal Return)
        const retFgOpt = (p.activeOptions || []).find(o => o.type === 'return_fg');
        if (retFgOpt && retFgOpt.data && retFgOpt.data.ret_player) {
            const retP = resolvePlayerInfo(retFgOpt.data.ret_player, def);
            const dStats = stats[def].defensive[retP.key] = stats[def].defensive[retP.key] || {
                name: retP.name, tot: 0, solo: 0, ast: 0, sacks: 0, tfl: 0, pd: 0, int: 0, td: 0, fr: 0
            };
            if (hasTD) dStats.td++;
        }
    });

    return stats;
}

function formatYdsDisplay(yds, noYds) {
    if (noYds > 0) {
        return `${yds}<span class="bs-noyds-mark" title="${noYds}プレイでヤード未入力">*</span>`;
    }
    return String(yds);
}

function renderStatTable(title, headers, rows, totalsRow, hasAnyNoYds) {
    if (!rows || rows.length === 0) return '';
    return `
    <div class="bs-tbl-card">
        <div class="bs-tbl-title">${esc(title)}</div>
        <div class="bs-table-wrap">
            <table class="bs-table">
                <thead>
                    <tr>
                        ${headers.map(h => `<th>${esc(h)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(r => `
                        <tr>
                            ${r.map((c, i) => i === 0 ? `<td>${c}</td>` : `<td>${c}</td>`).join('')}
                        </tr>
                    `).join('')}
                    ${totalsRow ? `
                        <tr class="bs-tot-row">
                            ${totalsRow.map((c, i) => i === 0 ? `<td>${esc(c)}</td>` : `<td>${c}</td>`).join('')}
                        </tr>
                    ` : ''}
                </tbody>
            </table>
        </div>
        ${hasAnyNoYds ? `<div class="bs-footnote">* 印: ヤード未入力のプレイが含まれています</div>` : ''}
    </div>`;
}

function renderTeamBoxScoreSection(t, isHome) {
    const cls = isHome ? 'bs-team-heading home-side' : 'bs-team-heading';
    let tablesHtml = '';

    // 1. Passing
    const passRows = Object.values(t.passing);
    if (passRows.length > 0) {
        let totCmp = 0, totAtt = 0, totYds = 0, totTD = 0, totInt = 0, totSacks = 0, totSackYds = 0, totNoYds = 0;
        passRows.forEach(p => {
            totCmp += p.cmp; totAtt += p.att; totYds += p.yds; totTD += p.td; totInt += p.int; totSacks += p.sacks; totSackYds += p.sackYds; totNoYds += p.noYds;
        });
        const rows = passRows.map(p => [
            p.name,
            `${p.cmp}/${p.att}`,
            formatYdsDisplay(p.yds, p.noYds),
            p.att > 0 ? (p.yds / p.att).toFixed(1) : '-',
            p.td,
            p.int,
            `${p.sacks}-${p.sackYds}`
        ]);
        const totals = ['TEAM', `${totCmp}/${totAtt}`, formatYdsDisplay(totYds, totNoYds), totAtt > 0 ? (totYds / totAtt).toFixed(1) : '-', totTD, totInt, `${totSacks}-${totSackYds}`];
        tablesHtml += renderStatTable('PASSING', ['PASSING', 'CP/AT', 'YDS', 'AVG', 'TD', 'INT', 'SACKS'], rows, totals, totNoYds > 0);
    }

    // 2. Rushing
    const rushRows = Object.values(t.rushing);
    if (rushRows.length > 0) {
        let totCar = 0, totYds = 0, totTD = 0, totLong = null, totNoYds = 0;
        rushRows.forEach(p => {
            totCar += p.car; totYds += p.yds; totTD += p.td; totNoYds += p.noYds;
            if (p.long !== null) totLong = totLong === null ? p.long : Math.max(totLong, p.long);
        });
        const rows = rushRows.map(p => [
            p.name,
            p.car,
            formatYdsDisplay(p.yds, p.noYds),
            p.car > 0 ? (p.yds / p.car).toFixed(1) : '-',
            p.td,
            p.long !== null ? p.long : '-'
        ]);
        const totals = ['TEAM', totCar, formatYdsDisplay(totYds, totNoYds), totCar > 0 ? (totYds / totCar).toFixed(1) : '-', totTD, totLong !== null ? totLong : '-'];
        tablesHtml += renderStatTable('RUSHING', ['RUSHING', 'CAR', 'YDS', 'AVG', 'TD', 'LONG'], rows, totals, totNoYds > 0);
    }

    // 3. Receiving
    const recRows = Object.values(t.receiving);
    if (recRows.length > 0) {
        let totRec = 0, totYds = 0, totTD = 0, totLong = null, totTgts = 0, totNoYds = 0;
        recRows.forEach(p => {
            totRec += p.rec; totYds += p.yds; totTD += p.td; totTgts += p.tgts; totNoYds += p.noYds;
            if (p.long !== null) totLong = totLong === null ? p.long : Math.max(totLong, p.long);
        });
        const rows = recRows.map(p => [
            p.name,
            p.rec,
            formatYdsDisplay(p.yds, p.noYds),
            p.rec > 0 ? (p.yds / p.rec).toFixed(1) : '-',
            p.td,
            p.long !== null ? p.long : '-',
            p.tgts
        ]);
        const totals = ['TEAM', totRec, formatYdsDisplay(totYds, totNoYds), totRec > 0 ? (totYds / totRec).toFixed(1) : '-', totTD, totLong !== null ? totLong : '-', totTgts];
        tablesHtml += renderStatTable('RECEIVING', ['RECEIVING', 'REC', 'YDS', 'AVG', 'TD', 'LONG', 'TGTS'], rows, totals, totNoYds > 0);
    }

    // 4. Fumbles
    const fumRows = Object.values(t.fumbles);
    if (fumRows.length > 0) {
        let totFum = 0, totLost = 0, totRec = 0;
        fumRows.forEach(p => {
            totFum += p.fum; totLost += p.lost; totRec += p.rec;
        });
        const rows = fumRows.map(p => [
            p.name,
            p.fum,
            p.lost,
            p.rec
        ]);
        const totals = ['TEAM', totFum, totLost, totRec];
        tablesHtml += renderStatTable('FUMBLES', ['FUMBLES', 'FUM', 'LOST', 'REC'], rows, totals, false);
    }

    // 5. Defensive
    const defRows = Object.values(t.defensive);
    if (defRows.length > 0) {
        let totTOT = 0, totSolo = 0, totAst = 0, totSacks = 0, totTFL = 0, totPD = 0, totInt = 0, totTD = 0;
        defRows.forEach(p => {
            totTOT += p.tot; totSolo += p.solo; totAst += p.ast; totSacks += p.sacks; totTFL += p.tfl; totPD += p.pd; totInt += p.int; totTD += p.td;
        });
        const rows = defRows.map(p => [
            p.name,
            p.tot > 0 ? (p.tot % 1 === 0 ? p.tot : p.tot.toFixed(1)) : '0',
            p.solo,
            p.ast,
            p.sacks > 0 ? (p.sacks % 1 === 0 ? p.sacks : p.sacks.toFixed(1)) : '0',
            p.tfl > 0 ? (p.tfl % 1 === 0 ? p.tfl : p.tfl.toFixed(1)) : '0',
            p.pd,
            p.int,
            p.td
        ]);
        const totals = [
            'TEAM',
            totTOT > 0 ? (totTOT % 1 === 0 ? totTOT : totTOT.toFixed(1)) : '0',
            totSolo,
            totAst,
            totSacks > 0 ? (totSacks % 1 === 0 ? totSacks : totSacks.toFixed(1)) : '0',
            totTFL > 0 ? (totTFL % 1 === 0 ? totTFL : totTFL.toFixed(1)) : '0',
            totPD,
            totInt,
            totTD
        ];
        tablesHtml += renderStatTable('DEFENSIVE', ['DEFENSIVE', 'TOT', 'SOLO', 'AST', 'SACKS', 'TFL', 'PD', 'INT', 'TD'], rows, totals, false);
    }

    // 6. Interceptions
    const intRows = Object.values(t.interceptions);
    if (intRows.length > 0) {
        let totInt = 0, totYds = 0, totTD = 0;
        intRows.forEach(p => { totInt += p.int; totYds += p.yds; totTD += p.td; });
        const rows = intRows.map(p => [p.name, p.int, p.yds, p.td]);
        const totals = ['TEAM', totInt, totYds, totTD];
        tablesHtml += renderStatTable('INTERCEPTIONS', ['INTERCEPTIONS', 'INT', 'YDS', 'TD'], rows, totals, false);
    }

    // 7. Kick Returns
    const krRows = Object.values(t.kickReturns);
    if (krRows.length > 0) {
        let totNo = 0, totYds = 0, totLong = null, totTD = 0, totNoYds = 0;
        krRows.forEach(p => {
            totNo += p.no; totYds += p.yds; totTD += p.td; totNoYds += p.noYds;
            if (p.long !== null) totLong = totLong === null ? p.long : Math.max(totLong, p.long);
        });
        const rows = krRows.map(p => [
            p.name,
            p.no,
            formatYdsDisplay(p.yds, p.noYds),
            p.no > 0 ? (p.yds / p.no).toFixed(1) : '-',
            p.long !== null ? p.long : '-',
            p.td
        ]);
        const totals = ['TEAM', totNo, formatYdsDisplay(totYds, totNoYds), totNo > 0 ? (totYds / totNo).toFixed(1) : '-', totLong !== null ? totLong : '-', totTD];
        tablesHtml += renderStatTable('KICK RETURNS', ['KICK RETURNS', 'NO', 'YDS', 'AVG', 'LONG', 'TD'], rows, totals, totNoYds > 0);
    }

    // 8. Punt Returns
    const prRows = Object.values(t.puntReturns);
    if (prRows.length > 0) {
        let totNo = 0, totYds = 0, totLong = null, totTD = 0, totNoYds = 0;
        prRows.forEach(p => {
            totNo += p.no; totYds += p.yds; totTD += p.td; totNoYds += p.noYds;
            if (p.long !== null) totLong = totLong === null ? p.long : Math.max(totLong, p.long);
        });
        const rows = prRows.map(p => [
            p.name,
            p.no,
            formatYdsDisplay(p.yds, p.noYds),
            p.no > 0 ? (p.yds / p.no).toFixed(1) : '-',
            p.long !== null ? p.long : '-',
            p.td
        ]);
        const totals = ['TEAM', totNo, formatYdsDisplay(totYds, totNoYds), totNo > 0 ? (totYds / totNo).toFixed(1) : '-', totLong !== null ? totLong : '-', totTD];
        tablesHtml += renderStatTable('PUNT RETURNS', ['PUNT RETURNS', 'NO', 'YDS', 'AVG', 'LONG', 'TD'], rows, totals, totNoYds > 0);
    }

    // 9. Kicking
    const kRows = Object.values(t.kicking);
    if (kRows.length > 0) {
        let totFGA = 0, totFGM = 0, totLong = 0, totXPA = 0, totXPM = 0, totPts = 0;
        kRows.forEach(p => {
            totFGA += p.fgAtt; totFGM += p.fgMade; totLong = Math.max(totLong, p.long || 0); totXPA += p.xpAtt; totXPM += p.xpMade; totPts += p.pts;
        });
        const rows = kRows.map(p => [
            p.name,
            `${p.fgMade}/${p.fgAtt}`,
            p.fgAtt > 0 ? ((p.fgMade / p.fgAtt) * 100).toFixed(0) + '%' : '-',
            p.long || '-',
            `${p.xpMade}/${p.xpAtt}`,
            p.pts
        ]);
        const totals = ['TEAM', `${totFGM}/${totFGA}`, totFGA > 0 ? ((totFGM / totFGA) * 100).toFixed(0) + '%' : '-', totLong || '-', `${totXPM}/${totXPA}`, totPts];
        tablesHtml += renderStatTable('KICKING', ['KICKING', 'FG', 'PCT', 'LONG', 'XP', 'PTS'], rows, totals, false);
    }

    // 10. Punting
    const pRows = Object.values(t.punting);
    if (pRows.length > 0) {
        let totNo = 0, totYds = 0, totLong = 0, totNoYds = 0;
        pRows.forEach(p => {
            totNo += p.no; totYds += p.yds; totLong = Math.max(totLong, p.long || 0); totNoYds += p.noYds;
        });
        const rows = pRows.map(p => [
            p.name,
            p.no,
            formatYdsDisplay(p.yds, p.noYds),
            p.no > 0 ? (p.yds / p.no).toFixed(1) : '-',
            p.long || '-'
        ]);
        const totals = ['TEAM', totNo, formatYdsDisplay(totYds, totNoYds), totNo > 0 ? (totYds / totNo).toFixed(1) : '-', totLong || '-'];
        tablesHtml += renderStatTable('PUNTING', ['PUNTING', 'NO', 'YDS', 'AVG', 'LONG'], rows, totals, totNoYds > 0);
    }

    if (!tablesHtml) {
        tablesHtml = '<div style="font-size:.78rem;color:var(--mt);padding:10px 12px;background:var(--bg);border-radius:6px;border:1px dashed var(--bd)">このチームの記録されたスタッツはありません</div>';
    }

    return `
    <div class="bs-section">
        <div class="${cls}">
            <span>${esc(t.name)}</span>
            <span style="font-size:.75rem;opacity:.7">${esc(t.abbr)}</span>
        </div>
        ${tablesHtml}
    </div>`;
}

function renderBoxScore() {
    const container = document.getElementById('boxScoreContainer');
    if (!container) return;

    syncManualEditButtons();

    const isManual = state.manualStats && state.manualStats.isEditing;
    const stats = (isManual && state.manualStats.playerStats) ? state.manualStats.playerStats : computeStats();

    const cntEl = document.getElementById('bsTotalPlays');
    if (cntEl) cntEl.textContent = stats.totalCountedPlays + ' play' + (stats.totalCountedPlays !== 1 ? 's' : '');

    const btnAway = document.getElementById('bsFltAway');
    const btnHome = document.getElementById('bsFltHome');
    if (btnAway) btnAway.textContent = state.awayName || 'AWAY';
    if (btnHome) btnHome.textContent = state.homeName || 'HOME';

    if (stats.totalCountedPlays === 0) {
        container.innerHTML = `
        <div class="empty">
            <div class="empty-ic">📊</div>
            <div>まだスタッツ対象のプレイがありません</div>
        </div>`;
        return;
    }

    let html = '';
    if (isManual) {
        html += `
        <div class="stat-manual-bar">
            <span>✏️ <strong>手動編集モード有効</strong>: 現在のスタッツは固定されています（PBPからの自動再計算は一時停止中）。</span>
            <button type="button" class="stat-edit-btn" onclick="confirmResetManualStats()">🔄 自動再計算に戻す</button>
        </div>`;
    }

    const showAway = currentBoxScoreFilter === 'all' || currentBoxScoreFilter === 'away';
    const showHome = currentBoxScoreFilter === 'all' || currentBoxScoreFilter === 'home';

    if (showAway) {
        html += renderTeamBoxScoreSection(stats.away, false);
    }
    if (showHome) {
        html += renderTeamBoxScoreSection(stats.home, true);
    }

    container.innerHTML = html;
}

/* ─── Team Stats (チームスタッツ) ─── */
function computeTeamStats(playerStats) {
    if (!playerStats) playerStats = computeStats();

    function initTS(teamKey) {
        return {
            firstDownsTotal: 0,
            firstDownsRush: 0,
            firstDownsPass: 0,
            firstDownsPenalty: 0,
            thirdDownAtt: 0,
            thirdDownConv: 0,
            fourthDownAtt: 0,
            fourthDownConv: 0,
            totalPlays: 0,
            totalYards: 0,
            hasMissingYards: false,
            // Passing
            passCmp: 0,
            passAtt: 0,
            passYds: 0, // gross
            passNetYds: 0, // net (after sack loss in NFL)
            passInt: 0,
            passSacks: 0,
            passSackYds: 0,
            // Rushing
            rushAtt: 0,
            rushYds: 0,
            // Touchdowns
            tdTotal: 0,
            tdRush: 0,
            tdPass: 0,
            tdOther: 0,
            // Kicking / Special
            patMade: 0,
            patAtt: 0,
            twoPtMade: 0,
            twoPtAtt: 0,
            fgMade: 0,
            fgAtt: 0,
            punts: 0,
            // Penalties
            penaltiesCount: 0,
            penaltiesYards: 0,
            // Turnovers
            turnoversTotal: 0,
            interceptionsThrown: 0,
            fumblesLost: 0,
            // Defense
            safeties: 0,
            // Red Zone
            redZoneAtt: 0,
            redZoneScores: 0, // TD
            // Time of possession (seconds)
            possessionSeconds: 0
        };
    }

    const ts = {
        away: initTS('away'),
        home: initTS('home')
    };

    // 1. 集約: 個人スタッツから
    ['away', 'home'].forEach(teamKey => {
        const ps = playerStats[teamKey];
        const t = ts[teamKey];

        // Passing
        Object.values(ps.passing || {}).forEach(p => {
            t.passAtt += p.att || 0;
            t.passCmp += p.cmp || 0;
            t.passYds += p.yds || 0;
            t.passInt += p.int || 0;
            t.passSacks += p.sacks || 0;
            t.passSackYds += p.sackYds || 0;
            if (p.noYds > 0) t.hasMissingYards = true;
        });

        // Rushing
        Object.values(ps.rushing || {}).forEach(p => {
            t.rushAtt += (p.car !== undefined ? p.car : (p.att || 0));
            t.rushYds += p.yds || 0;
            t.tdRush += p.td || 0;
            if (p.noYds > 0) t.hasMissingYards = true;
        });

        // Passing TD (passer)
        Object.values(ps.passing || {}).forEach(p => {
            t.tdPass += p.td || 0;
        });

        // Kicking
        Object.values(ps.kicking || {}).forEach(p => {
            t.fgMade += p.fgMade || 0;
            t.fgAtt += p.fgAtt || 0;
            t.patMade += p.xpMade || 0;
            t.patAtt += p.xpAtt || 0;
        });

        // Punting
        Object.values(ps.punting || {}).forEach(p => {
            t.punts += p.no || 0;
            if (p.noYds > 0) t.hasMissingYards = true;
        });

        // Fumbles lost
        Object.values(ps.fumbles || {}).forEach(p => {
            t.fumblesLost += p.lost || 0;
        });

        t.interceptionsThrown = t.passInt;
        t.turnoversTotal = t.interceptionsThrown + t.fumblesLost;
    });

    // 2. ドライブごとの解析
    const driveMap = {};
    const driveOrder = [];
    (state.plays || []).forEach(p => {
        const d = p.driveId || 1;
        if (!driveMap[d]) {
            driveMap[d] = [];
            driveOrder.push(d);
        }
        driveMap[d].push(p);
    });

    // ヘルパー: オフェンス自身によるTDかどうか判定
    function isOffensiveTD(p, offTeam) {
        const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
        if (!hasTD) return false;

        const baseType = getPlayBaseType(p);
        const b = p.builderData || {};
        // キックオフ、パント、キックリターン、FG、XP等はオフェンスTDではない
        if (NP.has(p.type) || baseType === 'kick' || baseType === 'kick_return' || baseType === 'punt' || baseType === 'punt_return' || baseType === 'fg' || baseType === 'xp') return false;

        const defTeam = (offTeam === 'away') ? 'home' : 'away';
        const intOpt = (p.activeOptions || []).find(o => o.type === 'intercept');
        const fumOpt = (p.activeOptions || []).find(o => o.type === 'fumble');
        const retFgOpt = (p.activeOptions || []).find(o => o.type === 'return_fg');

        // 相手ディフェンスが奪ってTDにしたものは絶対にオフェンスTDではない
        if (baseType === 'intercept' || intOpt || retFgOpt) return false;
        if (b.is_blocked || (b.fg_res === 'blocked' && b.rec_side !== 'off')) return false;
        if (fumOpt && (fumOpt.data || {}).fumble_res !== 'out of bounds') {
            const recTeam = (fumOpt.data || {}).rec_team || defTeam;
            if (recTeam === defTeam) return false;
        }
        if (p.type === 'turnover') return false;

        // プレイを実行したチームがオフェンス自身か
        const pTeam = p.team || p.poss || offTeam;
        return pTeam === offTeam;
    }

    // ヘルパー: レッドゾーン進入判定 (相手陣1〜20ヤードに入ったか。自陣は絶対に除外)
    function isPlayInRedZone(p, offTeam) {
        const defTeam = (offTeam === 'away') ? 'home' : 'away';
        const defAbbr = getTeamAbbr(defTeam).toUpperCase();
        const defName = (defTeam === 'away' ? (state.awayName || '') : (state.homeName || '')).trim().toUpperCase();
        const offAbbr = getTeamAbbr(offTeam).toUpperCase();
        const offName = (offTeam === 'away' ? (state.awayName || '') : (state.homeName || '')).trim().toUpperCase();

        // 1. 直接保存された ballSide / ballYd による判定 (最優先)
        if (p.ballSide) {
            // 自陣（offTeam）なら絶対に false！
            if (p.ballSide === offTeam) {
                return false;
            }
            // 相手陣（defTeam）で 1 <= ballYd <= 20 の場合のみ true
            if (p.ballSide === defTeam) {
                const yd = parseInt(p.ballYd, 10);
                return (!isNaN(yd) && yd >= 1 && yd <= 20);
            }
        }

        // 2. yardline 文字列チェック (末尾の数値を抽出)
        const ylStr = (p.yardline || '').trim();
        if (ylStr) {
            const m = ylStr.match(/^(.*?)\s*(\d+)\s*$/);
            if (m) {
                const sideStr = m[1].trim().toUpperCase();
                const ydNum = parseInt(m[2], 10);

                // 自陣判定: 自チーム名、略称、OWN、自チームKeyに該当する場合は絶対に false！
                const isOwn = (sideStr === 'OWN') || (sideStr === offTeam.toUpperCase()) ||
                    (offAbbr && (sideStr.startsWith(offAbbr) || sideStr.includes(offAbbr))) ||
                    (offName && (sideStr.startsWith(offName) || sideStr.includes(offName) || offName.startsWith(sideStr)));
                if (isOwn) {
                    return false;
                }

                // 相手陣判定: 相手チーム名、略称、OPP、相手チームKeyに該当する場合
                const isOpp = (sideStr === 'OPP') || (sideStr === defTeam.toUpperCase()) ||
                    (defAbbr && (sideStr.startsWith(defAbbr) || sideStr.includes(defAbbr))) ||
                    (defName && (sideStr.startsWith(defName) || sideStr.includes(defName) || defName.startsWith(sideStr)));
                if (isOpp) {
                    return (!isNaN(ydNum) && ydNum >= 1 && ydNum <= 20);
                }
            }
        }

        // 3. builderData / フォームの yardSide, yardLine チェック
        const side = (p.yardSide || (p.builderData ? p.builderData.yard_side : '') || '').toLowerCase();
        if (side === 'own' || side === offTeam.toLowerCase()) {
            return false;
        }
        const yNum = parseInt(p.yardLine || (p.builderData ? p.builderData.yard_line : ''), 10);
        if ((side === 'opp' || side === defTeam.toLowerCase()) && !isNaN(yNum) && yNum >= 1 && yNum <= 20) {
            return true;
        }

        // 4. オフェンス自身のTDを獲得したプレイ（エンドゾーン到達）
        if (isOffensiveTD(p, offTeam)) {
            return true;
        }

        return false;
    }

    // 2. ドライブごとの解析 (TOP & レッドゾーン)
    driveOrder.forEach(did => {
        const dPlays = driveMap[did];
        const dm = state.drives[did] || {};
        if (dPlays.length === 0) return;

        const dTeam = dm.team || dm.poss || dPlays[0].team || dPlays[0].poss || 'away';

        // TOP (ポゼッション時間: dm.driveTime または dm.time)
        const dTime = dm.driveTime || dm.time || '';
        if (dTime) {
            const parts = dTime.split(':');
            if (parts.length === 2) {
                const sec = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
                ts[dTeam].possessionSeconds += sec;
            }
        }

        // レッドゾーンチェック: ドライブ中に敵陣20yd以内に入ったか
        let enteredRedZone = false;
        let driveHasOffTD = false;

        dPlays.forEach(p => {
            if (isPlayInRedZone(p, dTeam)) {
                enteredRedZone = true;
            }
            if (isOffensiveTD(p, dTeam)) {
                driveHasOffTD = true;
            }
        });

        if (enteredRedZone) {
            ts[dTeam].redZoneAtt++;
            if (driveHasOffTD) {
                ts[dTeam].redZoneScores++;
            }
        }
    });

    // 3. 各プレイ解析 (1st Down, 3rd/4th Down, 2pt, 反則, セーフティ, TD)
    driveOrder.forEach(did => {
        const dPlays = driveMap[did];
        let driveTeam = (state.drives[did] || {}).team || (state.drives[did] || {}).poss || (dPlays[0] ? (dPlays[0].team || dPlays[0].poss) : 'away');

        dPlays.forEach((p, pIdx) => {
            const pTeam = p.team || p.poss || driveTeam;
            const defTeam = (pTeam === 'away') ? 'home' : 'away';
            const baseType = getPlayBaseType(p);
            const b = p.builderData || {};

            // 1) 反則 (Penalties) 集計 (全プレイから漏れなく収集)
            // 1-a. penalty_nullify オプション
            const penNull = (p.activeOptions || []).find(o => o.type === 'penalty_nullify');
            if (penNull && penNull.data) {
                const pd = penNull.data;
                if (pd.status !== 'declined' && pd.status !== 'offset') {
                    const foulTeam = pd.team === 'home' ? 'home' : (pd.team === 'away' ? 'away' : defTeam);
                    ts[foulTeam].penaltiesCount++;
                    const yds = parseInt(pd.yds, 10);
                    if (!isNaN(yds)) ts[foulTeam].penaltiesYards += Math.abs(yds);
                }
            }
            // 1-b. penalty_add オプション
            const penAdd = (p.activeOptions || []).find(o => o.type === 'penalty_add');
            if (penAdd && penAdd.data) {
                const pd = penAdd.data;
                if (pd.status !== 'declined' && pd.status !== 'offset') {
                    const foulTeam = pd.team === 'home' ? 'home' : (pd.team === 'away' ? 'away' : defTeam);
                    ts[foulTeam].penaltiesCount++;
                    const yds = parseInt(pd.yds, 10);
                    if (!isNaN(yds)) ts[foulTeam].penaltiesYards += Math.abs(yds);
                }
            }
            // 1-c. penalty オプション
            const penOpt = (p.activeOptions || []).find(o => o.type === 'penalty');
            if (penOpt && penOpt.data) {
                const pd = penOpt.data;
                if (pd.status !== 'declined' && pd.status !== 'offset') {
                    const foulTeam = pd.team === 'home' ? 'home' : (pd.team === 'away' ? 'away' : (pd.against === 'def' ? defTeam : pTeam));
                    ts[foulTeam].penaltiesCount++;
                    const yds = parseInt(pd.yds, 10);
                    if (!isNaN(yds)) ts[foulTeam].penaltiesYards += Math.abs(yds);
                }
            }
            // 1-d. プレイスタイルが penalty の場合（オプションに反則がない独立した反則プレイのみ）
            if ((p.type === 'penalty' || baseType === 'penalty') && !penNull && !penOpt) {
                const res = (b.pen_res || '').toLowerCase();
                if (!res.includes('declined') && !res.includes('offset')) {
                    const penTeam = b.pen_team === 'home' ? 'home' : (b.pen_team === 'away' ? 'away' : pTeam);
                    ts[penTeam].penaltiesCount++;
                    const yds = parseInt(b.pen_yds, 10);
                    if (!isNaN(yds)) ts[penTeam].penaltiesYards += Math.abs(yds);
                }
            }

            // 2) 2pt Conversion
            if (p.type === '2pt' || baseType === '2pt') {
                ts[pTeam].twoPtAtt++;
                const res = (b.two_pt_res || p.desc || '').toLowerCase();
                const isGood = res.includes('good') || res.includes('success') || (p.activeOptions || []).some(o => o.type === 'touchdown');
                if (isGood) {
                    ts[pTeam].twoPtMade++;
                }
            }

            // 3) セーフティ
            const safeOpt = (p.activeOptions || []).find(o => o.type === 'safety');
            if (safeOpt || p.type === 'safety' || baseType === 'safety') {
                ts[defTeam].safeties++;
            }

            // 4) タッチダウン (TD)
            const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
            const isDefenseTD = isDefenseTDPlay(p);
            const isTurnover = isTurnoverPlay(p);

            if (hasTD) {
                let scoringTeam = isDefenseTD ? defTeam : pTeam;
                ts[scoringTeam].tdTotal++;
            }

            // 5) First Down 獲得判定
            const down = p.down || (p.builderData ? p.builderData.down : '');
            const dist = parseInt(p.distance || (p.builderData ? p.builderData.dist : ''), 10);
            const gain = parseInt(b.gain, 10);

            const fdOpt = (p.activeOptions || []).find(o => o.type === 'first_down');
            const isPenNullAccepted = penNull && (penNull.data || {}).status !== 'declined' && (penNull.data || {}).status !== 'offset';

            let is1stDownAchieved = false;
            let fdCategory = 'rush';

            // A. 明示的 first_down オプション
            if (fdOpt) {
                is1stDownAchieved = true;
                const kind = (fdOpt.data || {}).kind || 'auto';
                if (kind === 'rush') fdCategory = 'rush';
                else if (kind === 'pass') fdCategory = 'pass';
                else if (kind === 'penalty') fdCategory = 'penalty';
                else {
                    // auto判定
                    if (p.type === 'penalty' || baseType === 'penalty' || isPenNullAccepted || penAdd || penOpt) {
                        fdCategory = 'penalty';
                    } else if (baseType === 'pass' || baseType === 'inc') {
                        fdCategory = 'pass';
                    } else {
                        fdCategory = 'rush';
                    }
                }
            }
            // B. ペナルティオプションでの automatic 1st down
            else if ((penNull && (penNull.data || {}).first_down) || (penAdd && (penAdd.data || {}).first_down) || (penOpt && (penOpt.data || {}).first_down)) {
                is1stDownAchieved = true;
                fdCategory = 'penalty';
            }
            // C. プレイスタイルが反則で、1st down になった場合
            else if ((p.type === 'penalty' || baseType === 'penalty') && (b.first_down || (p.desc || '').includes('[1st down]'))) {
                is1stDownAchieved = true;
                fdCategory = 'penalty';
            }
            // D. 通常プレイ（プレイ取消でなく、ターンオーバーでない場合のみ）
            else if (!isPenNullAccepted && !isTurnover) {
                const isOffTD = isOffensiveTD(p, pTeam);
                // プレイスタイルのラン、パス、反則のみ！
                const isValidOffPlay = (baseType === 'rush' || baseType === 'pass' || baseType === 'penalty');

                if (isValidOffPlay && !isNaN(gain) && !isNaN(dist) && gain >= dist && dist > 0) {
                    is1stDownAchieved = true;
                    fdCategory = (baseType === 'pass') ? 'pass' : (baseType === 'penalty' ? 'penalty' : 'rush');
                } else if (isValidOffPlay && isOffTD) {
                    is1stDownAchieved = true;
                    fdCategory = (baseType === 'pass') ? 'pass' : (baseType === 'penalty' ? 'penalty' : 'rush');
                } else if (isValidOffPlay) {
                    const nextP = dPlays[pIdx + 1];
                    if (nextP && nextP.down === '1st' && (nextP.team || nextP.poss) === pTeam && !NP.has(p.type) && p.type !== 'fumble' && p.type !== 'turnover') {
                        is1stDownAchieved = true;
                        fdCategory = (baseType === 'pass') ? 'pass' : (baseType === 'penalty' ? 'penalty' : 'rush');
                    }
                }
            }

            if (is1stDownAchieved) {
                ts[pTeam].firstDownsTotal++;
                if (fdCategory === 'rush') ts[pTeam].firstDownsRush++;
                else if (fdCategory === 'pass') ts[pTeam].firstDownsPass++;
                else if (fdCategory === 'penalty') ts[pTeam].firstDownsPenalty++;
            }

            // 6) 3rd Down & 4th Down 効率 (プレイ取消は除外)
            if (!isPenNullAccepted) {
                if (down === '3rd') {
                    ts[pTeam].thirdDownAtt++;
                    if (is1stDownAchieved || isOffensiveTD(p, pTeam)) {
                        ts[pTeam].thirdDownConv++;
                    }
                } else if (down === '4th') {
                    // パントとFGは除外
                    if (baseType !== 'punt' && baseType !== 'fg' && p.type !== 'punt' && p.type !== 'fg') {
                        ts[pTeam].fourthDownAtt++;
                        if (is1stDownAchieved || isOffensiveTD(p, pTeam)) {
                            ts[pTeam].fourthDownConv++;
                        }
                    }
                }
            }
        });
    });

    // 4. NFL/カレッジ別のサック調整 & 総ヤード & TDその他計算
    const isNFL = (state.ruleType || 'nfl') === 'nfl';
    ['away', 'home'].forEach(k => {
        const t = ts[k];

        if (isNFL) {
            t.totalPlays = t.rushAtt + t.passAtt + t.passSacks;
            t.passNetYds = t.passYds; // NFLのチームパスヤードは投げたヤード（個人スタッツのまま）
            t.totalYards = t.rushYds + t.passYds - t.passSackYds; // トータルヤードにサックロスを反映
        } else {
            t.totalPlays = t.rushAtt + t.passAtt;
            t.passNetYds = t.passYds;
            t.totalYards = t.rushYds + t.passYds; // カレッジ/日本はサックロスが既にrushYdsに反映されている
        }

        t.tdOther = Math.max(0, t.tdTotal - (t.tdRush + t.tdPass));
    });

    return ts;
}

function formatTimeFromSec(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function parseTimeToSec(str) {
    if (!str) return 0;
    const p = String(str).trim().split(':');
    if (p.length === 2) {
        return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
    }
    return parseInt(str, 10) || 0;
}

function renderTeamStats() {
    const container = document.getElementById('teamStatsContainer');
    if (!container) return;

    syncManualEditButtons();

    let tsData;
    const isManual = state.manualStats && state.manualStats.isEditing;
    if (isManual && state.manualStats.teamstats) {
        tsData = state.manualStats.teamstats;
    } else {
        const pStats = computeStats();
        tsData = computeTeamStats(pStats);
    }

    const awayName = state.awayName || 'AWAY';
    const homeName = state.homeName || 'HOME';
    const awayAbbr = getTeamAbbr('away');
    const homeAbbr = getTeamAbbr('home');

    const totPlays = (tsData.away.totalPlays || 0) + (tsData.home.totalPlays || 0);
    const cntEl = document.getElementById('tsTotalPlays');
    if (cntEl) cntEl.textContent = `${totPlays} plays`;

    let manualBarHtml = '';
    if (isManual) {
        manualBarHtml = `
        <div class="stat-manual-bar">
            <span>✏️ <strong>手動編集モード有効</strong>: 表内の各数値を直接変更できます（PBPからの自動再計算は一時停止中）。</span>
            <button type="button" class="stat-edit-btn" onclick="confirmResetManualStats()">🔄 自動再計算に戻す</button>
        </div>`;
    }

    function renderRow(label, awayVal, homeVal, awayNum, homeNum, isSub, compType, fieldKey, customRenderer) {
        let awayHl = false, homeHl = false;
        if (compType === 'high' && awayNum !== homeNum && awayNum !== null && homeNum !== null) {
            awayHl = awayNum > homeNum;
            homeHl = homeNum > awayNum;
        } else if (compType === 'low' && awayNum !== homeNum && awayNum !== null && homeNum !== null) {
            awayHl = awayNum < homeNum;
            homeHl = homeNum < awayNum;
        }

        let aContent = awayVal;
        let hContent = homeVal;

        if (isManual && fieldKey) {
            if (customRenderer) {
                aContent = customRenderer('away', tsData.away);
                hContent = customRenderer('home', tsData.home);
            } else {
                aContent = `<input type="number" class="stat-inp" value="${tsData.away[fieldKey] !== undefined ? tsData.away[fieldKey] : ''}" onchange="updateManualTeamStat('away', '${fieldKey}', this.value)">`;
                hContent = `<input type="number" class="stat-inp" value="${tsData.home[fieldKey] !== undefined ? tsData.home[fieldKey] : ''}" onchange="updateManualTeamStat('home', '${fieldKey}', this.value)">`;
            }
        }

        const labelHtml = isSub ? `<span class="ts-sub-stat">└ ${label}</span>` : `<strong>${label}</strong>`;

        return `
        <tr>
            <td>${labelHtml}</td>
            <td class="${awayHl ? 'ts-val-hl' : ''}">${aContent}</td>
            <td class="${homeHl ? 'ts-val-hl' : ''}">${hContent}</td>
        </tr>`;
    }

    const aw = tsData.away;
    const hm = tsData.home;

    const awMiss = aw.hasMissingYards ? '*' : '';
    const hmMiss = hm.hasMissingYards ? '*' : '';

    const aw3rdPct = aw.thirdDownAtt > 0 ? ((aw.thirdDownConv / aw.thirdDownAtt) * 100).toFixed(0) : 0;
    const hm3rdPct = hm.thirdDownAtt > 0 ? ((hm.thirdDownConv / hm.thirdDownAtt) * 100).toFixed(0) : 0;

    const aw4thPct = aw.fourthDownAtt > 0 ? ((aw.fourthDownConv / aw.fourthDownAtt) * 100).toFixed(0) : 0;
    const hm4thPct = hm.fourthDownAtt > 0 ? ((hm.fourthDownConv / hm.fourthDownAtt) * 100).toFixed(0) : 0;

    const awPassPct = aw.passAtt > 0 ? ((aw.passCmp / aw.passAtt) * 100).toFixed(1) : '0.0';
    const hmPassPct = hm.passAtt > 0 ? ((hm.passCmp / hm.passAtt) * 100).toFixed(1) : '0.0';

    const awRushAvg = aw.rushAtt > 0 ? (aw.rushYds / aw.rushAtt).toFixed(1) : '0.0';
    const hmRushAvg = hm.rushAtt > 0 ? (hm.rushYds / hm.rushAtt).toFixed(1) : '0.0';

    const awPatPct = aw.patAtt > 0 ? ((aw.patMade / aw.patAtt) * 100).toFixed(0) : '-';
    const hmPatPct = hm.patAtt > 0 ? ((hm.patMade / hm.patAtt) * 100).toFixed(0) : '-';

    const awFgPct = aw.fgAtt > 0 ? ((aw.fgMade / aw.fgAtt) * 100).toFixed(0) : '-';
    const hmFgPct = hm.fgAtt > 0 ? ((hm.fgMade / hm.fgAtt) * 100).toFixed(0) : '-';

    const awRzPct = aw.redZoneAtt > 0 ? ((aw.redZoneScores / aw.redZoneAtt) * 100).toFixed(0) : '-';
    const hmRzPct = hm.redZoneAtt > 0 ? ((hm.redZoneScores / hm.redZoneAtt) * 100).toFixed(0) : '-';

    let html = `
    ${manualBarHtml}
    <div class="ts-tbl-card">
        <table class="ts-table">
            <thead>
                <tr>
                    <th style="width:40%">STATISTIC</th>
                    <th style="width:30%">${esc(awayName)} <span style="font-size:.7rem;opacity:.7">(${esc(awayAbbr)})</span></th>
                    <th style="width:30%">${esc(homeName)} <span style="font-size:.7rem;opacity:.7">(${esc(homeAbbr)})</span></th>
                </tr>
            </thead>
            <tbody>
                <!-- ファーストダウン -->
                ${renderRow('ファーストダウン (獲得数)', aw.firstDownsTotal, hm.firstDownsTotal, aw.firstDownsTotal, hm.firstDownsTotal, false, 'high', 'firstDownsTotal')}
                ${renderRow('ランによる獲得', aw.firstDownsRush, hm.firstDownsRush, aw.firstDownsRush, hm.firstDownsRush, true, 'high', 'firstDownsRush')}
                ${renderRow('パスによる獲得', aw.firstDownsPass, hm.firstDownsPass, aw.firstDownsPass, hm.firstDownsPass, true, 'high', 'firstDownsPass')}
                ${renderRow('反則による獲得', aw.firstDownsPenalty, hm.firstDownsPenalty, aw.firstDownsPenalty, hm.firstDownsPenalty, true, 'none', 'firstDownsPenalty')}

                <!-- 効率 -->
                ${renderRow('サードダウン成功率', `${aw.thirdDownConv}/${aw.thirdDownAtt} (${aw3rdPct}%)`, `${hm.thirdDownConv}/${hm.thirdDownAtt} (${hm3rdPct}%)`, parseFloat(aw3rdPct), parseFloat(hm3rdPct), false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.thirdDownConv}" onchange="updateManualTeamStat('${side}', 'thirdDownConv', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.thirdDownAtt}" onchange="updateManualTeamStat('${side}', 'thirdDownAtt', this.value)">
                    </div>`)}
                ${renderRow('フォースダウン成功率', `${aw.fourthDownConv}/${aw.fourthDownAtt} (${aw4thPct}%)`, `${hm.fourthDownConv}/${hm.fourthDownAtt} (${hm4thPct}%)`, parseFloat(aw4thPct), parseFloat(hm4thPct), false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.fourthDownConv}" onchange="updateManualTeamStat('${side}', 'fourthDownConv', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.fourthDownAtt}" onchange="updateManualTeamStat('${side}', 'fourthDownAtt', this.value)">
                    </div>`)}

                <!-- 総プレイ & ヤード -->
                ${renderRow('総攻撃回数 (Total Plays)', aw.totalPlays, hm.totalPlays, aw.totalPlays, hm.totalPlays, false, 'high', 'totalPlays')}
                ${renderRow('総獲得ヤード (Total Yards)', `${aw.totalYards}${awMiss}`, `${hm.totalYards}${hmMiss}`, aw.totalYards, hm.totalYards, false, 'high', 'totalYards')}

                <!-- パス成績 -->
                ${renderRow('パス (成功 - 試投 - ヤード)', `${aw.passCmp}-${aw.passAtt}-${aw.passNetYds}${awMiss}`, `${hm.passCmp}-${hm.passAtt}-${hm.passNetYds}${hmMiss}`, aw.passNetYds, hm.passNetYds, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:34px" title="Cmp" value="${t.passCmp}" onchange="updateManualTeamStat('${side}', 'passCmp', this.value)">-
                        <input type="number" class="stat-inp" style="width:34px" title="Att" value="${t.passAtt}" onchange="updateManualTeamStat('${side}', 'passAtt', this.value)">-
                        <input type="number" class="stat-inp" style="width:44px" title="Net Yds" value="${t.passNetYds}" onchange="updateManualTeamStat('${side}', 'passNetYds', this.value)">
                    </div>`)}
                ${renderRow('パス成功率', `${awPassPct}%`, `${hmPassPct}%`, parseFloat(awPassPct), parseFloat(hmPassPct), true, 'high', null)}
                ${renderRow('被インターセプト', aw.passInt, hm.passInt, aw.passInt, hm.passInt, true, 'low', 'passInt')}
                ${(state.ruleType === 'nfl') ? renderRow('被サック数 - ロスヤード', `${aw.passSacks} - ${aw.passSackYds} yds`, `${hm.passSacks} - ${hm.passSackYds} yds`, aw.passSacks, hm.passSacks, true, 'low', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.passSacks}" onchange="updateManualTeamStat('${side}', 'passSacks', this.value)"> - 
                        <input type="number" class="stat-inp" style="width:44px" value="${t.passSackYds}" onchange="updateManualTeamStat('${side}', 'passSackYds', this.value)"> yds
                    </div>`) : ''}

                <!-- ラン成績 -->
                ${renderRow('ラン (回数 - ヤード)', `${aw.rushAtt} - ${aw.rushYds}${awMiss}`, `${hm.rushAtt} - ${hm.rushYds}${hmMiss}`, aw.rushYds, hm.rushYds, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:38px" title="Att" value="${t.rushAtt}" onchange="updateManualTeamStat('${side}', 'rushAtt', this.value)"> - 
                        <input type="number" class="stat-inp" style="width:44px" title="Yds" value="${t.rushYds}" onchange="updateManualTeamStat('${side}', 'rushYds', this.value)">
                    </div>`)}
                ${renderRow('ラン平均獲得ヤード', `${awRushAvg} yds`, `${hmRushAvg} yds`, parseFloat(awRushAvg), parseFloat(hmRushAvg), true, 'high', null)}

                <!-- タッチダウン -->
                ${renderRow('タッチダウン (TD合計)', aw.tdTotal, hm.tdTotal, aw.tdTotal, hm.tdTotal, false, 'high', 'tdTotal')}
                ${renderRow('ラン TD', aw.tdRush, hm.tdRush, aw.tdRush, hm.tdRush, true, 'high', 'tdRush')}
                ${renderRow('パス TD', aw.tdPass, hm.tdPass, aw.tdPass, hm.tdPass, true, 'high', 'tdPass')}
                ${renderRow('その他 TD (リターン/守備)', aw.tdOther, hm.tdOther, aw.tdOther, hm.tdOther, true, 'none', 'tdOther')}

                <!-- キッキング / 特殊 -->
                ${renderRow('ポイント・アフター (PAT Kick)', `${aw.patMade}/${aw.patAtt} (${awPatPct}%)`, `${hm.patMade}/${hm.patAtt} (${hmPatPct}%)`, aw.patMade, hm.patMade, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.patMade}" onchange="updateManualTeamStat('${side}', 'patMade', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.patAtt}" onchange="updateManualTeamStat('${side}', 'patAtt', this.value)">
                    </div>`)}
                ${renderRow('2ポイント・コンバージョン', `${aw.twoPtMade}/${aw.twoPtAtt}`, `${hm.twoPtMade}/${hm.twoPtAtt}`, aw.twoPtMade, hm.twoPtMade, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.twoPtMade}" onchange="updateManualTeamStat('${side}', 'twoPtMade', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.twoPtAtt}" onchange="updateManualTeamStat('${side}', 'twoPtAtt', this.value)">
                    </div>`)}
                ${renderRow('フィールドゴール (FG)', `${aw.fgMade}/${aw.fgAtt} (${awFgPct}%)`, `${hm.fgMade}/${hm.fgAtt} (${hmFgPct}%)`, aw.fgMade, hm.fgMade, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.fgMade}" onchange="updateManualTeamStat('${side}', 'fgMade', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.fgAtt}" onchange="updateManualTeamStat('${side}', 'fgAtt', this.value)">
                    </div>`)}
                ${renderRow('パント回数', `${aw.punts}${awMiss}`, `${hm.punts}${hmMiss}`, aw.punts, hm.punts, false, 'low', 'punts')}

                <!-- 反則 & ターンオーバー -->
                ${renderRow('反則 - ヤード', `${aw.penaltiesCount} - ${aw.penaltiesYards} yds`, `${hm.penaltiesCount} - ${hm.penaltiesYards} yds`, aw.penaltiesYards, hm.penaltiesYards, false, 'low', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.penaltiesCount}" onchange="updateManualTeamStat('${side}', 'penaltiesCount', this.value)"> - 
                        <input type="number" class="stat-inp" style="width:44px" value="${t.penaltiesYards}" onchange="updateManualTeamStat('${side}', 'penaltiesYards', this.value)"> yds
                    </div>`)}
                ${renderRow('被ターンオーバー (合計)', aw.turnoversTotal, hm.turnoversTotal, aw.turnoversTotal, hm.turnoversTotal, false, 'low', 'turnoversTotal')}
                ${renderRow('被インターセプト', aw.interceptionsThrown, hm.interceptionsThrown, aw.interceptionsThrown, hm.interceptionsThrown, true, 'low', 'interceptionsThrown')}
                ${renderRow('ファンブルロスト', aw.fumblesLost, hm.fumblesLost, aw.fumblesLost, hm.fumblesLost, true, 'low', 'fumblesLost')}

                <!-- セーフティー -->
                ${renderRow('セーフティー奪取', aw.safeties, hm.safeties, aw.safeties, hm.safeties, false, 'high', 'safeties')}

                <!-- レッドゾーン & TOP -->
                ${renderRow('レッドゾーン成功率 (TD/進入)', `${aw.redZoneScores}/${aw.redZoneAtt} (${awRzPct}%)`, `${hm.redZoneScores}/${hm.redZoneAtt} (${hmRzPct}%)`, parseFloat(awRzPct) || 0, parseFloat(hmRzPct) || 0, false, 'high', null, (side, t) => `
                    <div style="display:flex;align-items:center;gap:3px;justify-content:center">
                        <input type="number" class="stat-inp" style="width:36px" value="${t.redZoneScores}" onchange="updateManualTeamStat('${side}', 'redZoneScores', this.value)">/
                        <input type="number" class="stat-inp" style="width:36px" value="${t.redZoneAtt}" onchange="updateManualTeamStat('${side}', 'redZoneAtt', this.value)">
                    </div>`)}
                ${renderRow('時間支配率 (Time of Possession)', formatTimeFromSec(aw.possessionSeconds), formatTimeFromSec(hm.possessionSeconds), aw.possessionSeconds, hm.possessionSeconds, false, 'high', null, (side, t) => `
                    <input type="text" class="stat-inp" style="width:65px" value="${formatTimeFromSec(t.possessionSeconds)}" onchange="updateManualTeamStat('${side}', 'possessionSeconds', parseTimeToSec(this.value))">`)}
            </tbody>
        </table>
    </div>`;

    container.innerHTML = html;
}

/* ─── Manual Stats Edit Mode Controls ───── */
function syncManualEditButtons() {
    const isManual = state.manualStats && state.manualStats.isEditing;
    const btnBS = document.getElementById('btnToggleManualEditBS');
    const btnTS = document.getElementById('btnToggleManualEditTS');
    [btnBS, btnTS].forEach(btn => {
        if (!btn) return;
        if (isManual) {
            btn.innerHTML = '🔄 自動再計算に戻す';
            btn.classList.add('editing');
        } else {
            btn.innerHTML = '✏️ 手動編集';
            btn.classList.remove('editing');
        }
    });
}

function handleManualEditButtonClick() {
    const isManual = state.manualStats && state.manualStats.isEditing;
    if (isManual) {
        document.getElementById('resetManualMo').classList.add('open');
    } else {
        document.getElementById('manualEditMo').classList.add('open');
    }
}

function confirmManualEditMode() {
    const pStats = computeStats();
    const tStats = computeTeamStats(pStats);

    const away = state.awayName || 'AWAY';
    const home = state.homeName || 'HOME';
    const tsStr = new Date().toISOString().replace(/[:.]/g, '-');
    const fn = `stats_backup_${away}_vs_${home}_${tsStr}.json`;
    const backupData = {
        exportedAt: new Date().toISOString(),
        gameState: state,
        computedPlayerStats: pStats,
        computedTeamStats: tStats
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fn;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);

    state.manualStats = {
        isEditing: true,
        playerStats: JSON.parse(JSON.stringify(pStats)),
        teamstats: JSON.parse(JSON.stringify(tStats))
    };
    persist();
    closeMo('manualEditMo');
    syncManualEditButtons();
    renderBoxScore();
    renderTeamStats();
    toast('✏️ 手動編集モードに切り替えました（バックアップJSONを保存）');
}

function confirmResetManualStats() {
    state.manualStats = {
        isEditing: false,
        playerStats: null,
        teamstats: null
    };
    persist();
    closeMo('resetManualMo');
    syncManualEditButtons();
    renderBoxScore();
    renderTeamStats();
    toast('🔄 自動再計算モードに戻しました');
}

function updateManualTeamStat(teamKey, fieldKey, val) {
    if (!state.manualStats || !state.manualStats.isEditing) return;
    if (!state.manualStats.teamstats) {
        state.manualStats.teamstats = computeTeamStats(computeStats());
    }
    const num = parseFloat(val);
    state.manualStats.teamstats[teamKey][fieldKey] = isNaN(num) ? val : num;
    persist();
}

/* ─── Visual Field Map ────────────────────── */
function setFieldMapFilter(flt) {
    currentFieldMapFilter = flt;
    ['All', 'Scores', 'Away', 'Home'].forEach(k => {
        const btn = document.getElementById('fmFlt' + k);
        if (btn) btn.classList.toggle('active', k.toLowerCase() === flt);
    });
    renderFieldMap();
}

function selectFieldMapDrive(did) {
    currentFieldMapDriveId = parseInt(did, 10);
    highlightedMapPlayId = null;
    renderFieldMap();
}

function highlightMapPlay(pid) {
    highlightedMapPlayId = (highlightedMapPlayId === pid) ? null : pid;
    renderFieldMap();
    if (highlightedMapPlayId) {
        setTimeout(() => {
            const el = document.getElementById('fmPlayItem_' + pid);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }
}

function parsePlayLocation(p, offTeam, prevLoc) {
    let loc = null; // 0 (own goal) to 100 (opp goal)
    let isEstimated = false;
    let isMissing = false;

    // 1. ballSide & ballYd
    if (p.ballSide && p.ballYd !== undefined && p.ballYd !== '') {
        const yd = parseInt(p.ballYd, 10);
        if (!isNaN(yd)) {
            loc = (p.ballSide === offTeam) ? yd : (100 - yd);
        }
    }

    // 2. yardline string (e.g. "AWY 25", "OPP 40")
    if (loc === null && p.yardline) {
        const yl = p.yardline.trim();
        const m = yl.match(/^(.*?)\s*(\d+)$/);
        if (m) {
            const sideStr = m[1].trim().toUpperCase();
            const yd = parseInt(m[2], 10);
            const defTeam = (offTeam === 'away') ? 'home' : 'away';
            const offAbbr = getTeamAbbr(offTeam).toUpperCase();
            const defAbbr = getTeamAbbr(defTeam).toUpperCase();

            if (sideStr === 'OWN' || sideStr === offTeam.toUpperCase() || (offAbbr && sideStr.includes(offAbbr))) {
                loc = yd;
            } else if (sideStr === 'OPP' || sideStr === defTeam.toUpperCase() || (defAbbr && sideStr.includes(defAbbr))) {
                loc = 100 - yd;
            } else {
                loc = yd;
            }
        }
    }

    // 3. builderData
    if (loc === null && p.builderData) {
        const b = p.builderData;
        const side = (b.yard_side || '').toLowerCase();
        const yNum = parseInt(b.yard_line, 10);
        if (!isNaN(yNum)) {
            loc = (side === 'own' || side === offTeam) ? yNum : (100 - yNum);
        }
    }

    // 4. Fallback to prevLoc
    if (loc === null) {
        if (prevLoc !== null) {
            loc = prevLoc;
            isEstimated = true;
        } else {
            loc = 25; // デフォルト (自陣25yd)
            isEstimated = true;
            isMissing = true;
        }
    }

    return { loc: Math.max(0, Math.min(100, loc)), isEstimated, isMissing };
}

function renderFieldMap() {
    const container = document.getElementById('fieldMapContainer');
    const bar = document.getElementById('fmDrivesBar');
    const cntEl = document.getElementById('fmDrivesCount');
    if (!container || !bar) return;

    const plays = state.plays || [];
    if (plays.length === 0) {
        bar.innerHTML = '<div style="font-size:.78rem;color:var(--mt);padding:4px 8px">記録されたプレイがありません</div>';
        container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--mt)">
            <div style="font-size:2rem;margin-bottom:10px">🏟️</div>
            <div style="font-size:.9rem;font-weight:700">プレイを入力するとフィールドマップが自動生成されます</div>
            <div style="font-size:.78rem;margin-top:6px;opacity:.8">各ドライブの攻撃の軌跡、獲得ヤード、TD等のビッグプレイを視覚的に確認できます</div>
        </div>`;
        if (cntEl) cntEl.textContent = '0 drives';
        return;
    }

    // ドライブごとのグルーピング
    const driveMap = {};
    const driveOrder = [];
    plays.forEach(p => {
        const did = p.driveId || 1;
        if (!driveMap[did]) {
            driveMap[did] = [];
            driveOrder.push(did);
        }
        driveMap[did].push(p);
    });

    if (cntEl) cntEl.textContent = `${driveOrder.length} drive${driveOrder.length !== 1 ? 's' : ''}`;

    // ドライブごとのメタデータ解析
    const driveInfos = driveOrder.map(did => {
        const dPlays = driveMap[did];
        const dm = state.drives[did] || {};
        const dTeam = dm.team || dm.poss || dPlays[0].team || dPlays[0].poss || 'away';
        const isAway = (dTeam === 'away');

        // 結果判定
        let result = dm.score || '';
        let hasTD = false;
        let hasFG = false;
        let hasTO = false;
        let hasDefTD = false;

        dPlays.forEach(p => {
            const bt = getPlayBaseType(p);
            const isTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || p.type === 'td';
            const isDefTD = isDefenseTDPlay(p);
            const isTO = isTurnoverPlay(p);

            if (isDefTD) {
                hasDefTD = true;
            } else if (isTD) {
                hasTD = true;
            }
            if (isTO) hasTO = true;
            if (bt === 'fg' && (p.builderData ? (p.builderData.fg_res || 'good').toLowerCase() === 'good' : true)) hasFG = true;
        });

        if (!result) {
            if (hasDefTD) result = 'DEF TD';
            else if (hasTD) result = 'TD';
            else if (hasFG) result = 'FG';
            else if (hasTO) result = 'TO';
            else {
                const lastP = dPlays[dPlays.length - 1];
                const lastBt = getPlayBaseType(lastP);
                if (lastBt === 'punt') result = 'Punt';
                else if (lastBt === 'fg') result = 'Miss FG';
                else result = `${dPlays.length}pl`;
            }
        }

        return {
            did,
            team: dTeam,
            isAway,
            plays: dPlays,
            meta: dm,
            result,
            hasTD: hasTD || hasDefTD,
            hasOffTD: hasTD,
            hasDefTD,
            hasFG,
            hasTO
        };
    });

    // フィルター適用
    const filteredDrives = driveInfos.filter(d => {
        if (currentFieldMapFilter === 'scores') return (d.hasTD || d.hasFG);
        if (currentFieldMapFilter === 'away') return d.isAway;
        if (currentFieldMapFilter === 'home') return !d.isAway;
        return true;
    });

    // 選択ドライブの決定
    let activeDrive = null;
    if (currentFieldMapDriveId !== null) {
        activeDrive = driveInfos.find(d => d.did === currentFieldMapDriveId);
    }
    if (!activeDrive && filteredDrives.length > 0) {
        activeDrive = filteredDrives[filteredDrives.length - 1]; // デフォルトは最新ドライブ
        currentFieldMapDriveId = activeDrive.did;
    }

    // ドライブバーの描画
    bar.innerHTML = driveInfos.map(d => {
        const isActive = activeDrive && (activeDrive.did === d.did);
        const tAbbr = getTeamAbbr(d.team);
        const tdCls = d.hasTD ? ' has-td' : '';
        const actCls = isActive ? ' active' : '';
        const star = d.hasDefTD ? '🛡️★ ' : (d.hasOffTD ? '★ ' : (d.hasFG ? '🎯 ' : ''));
        return `
        <button type="button" class="fm-drive-pill${tdCls}${actCls}" onclick="selectFieldMapDrive(${d.did})">
            <span>D${d.did}</span>
            <span style="opacity:.85">${tAbbr}</span>
            <span>${star}${esc(d.result)}</span>
        </button>`;
    }).join('');

    if (!activeDrive) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--mt)">該当するドライブがありません</div>';
        return;
    }

    // 選択されたドライブの各プレイのヤード計算
    const offTeam = activeDrive.team;
    const isAway = (offTeam === 'away');
    let runningLoc = null;

    const playSteps = activeDrive.plays.map((p, idx) => {
        const b = p.builderData || {};
        const bt = getPlayBaseType(p);

        // 始点ヤード
        const { loc: startLoc, isEstimated: isEstLoc, isMissing: isMissLoc } = parsePlayLocation(p, offTeam, runningLoc);

        // 獲得ヤード
        let gain = null;
        let isMissingGain = false;
        let isEstimatedGain = false;

        if (b.gain !== undefined && b.gain !== '' && !isNaN(parseInt(b.gain, 10))) {
            gain = parseInt(b.gain, 10);
        } else if (p.gain !== undefined && p.gain !== '' && !isNaN(parseInt(p.gain, 10))) {
            gain = parseInt(p.gain, 10);
        } else if (bt === 'inc') {
            gain = 0;
        } else {
            isMissingGain = true;
            gain = 0;
        }

        const isRawTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
        const isDefTD = isDefenseTDPlay(p);
        const isOffTD = isRawTD && !isDefTD;
        const isTO = isTurnoverPlay(p);
        const isFirstDown = !isDefTD && !isTO && ((p.activeOptions || []).some(o => o.type === 'first_down') || (gain >= parseInt(p.dist || '10', 10) && parseInt(p.dist || '10', 10) > 0));

        // 終点ヤード
        let endLoc = startLoc + gain;
        if (isOffTD) endLoc = 100;
        else if (isDefTD) endLoc = 0; // 相手守備がオフェンス側のエンドゾーン（0yd地点）へリターンTD
        endLoc = Math.max(0, Math.min(100, endLoc));

        runningLoc = endLoc;

        return {
            play: p,
            idx,
            baseType: bt,
            startLoc,
            endLoc,
            gain,
            hasRawTD: isRawTD,
            hasOffTD: isOffTD,
            hasDefTD: isDefTD,
            hasTO: isTO,
            hasFD: isFirstDown,
            isMissingGain,
            isMissingLoc: isMissLoc,
            isEstimatedLoc: isEstLoc,
            desc: p.desc || ''
        };
    });

    // SVGフィールドの寸法 (viewBox 0 0 1200 360)
    // 0〜100: AWAY Endzone, 100〜1100: Playing Field (100yds), 1100〜1200: HOME Endzone
    function locToX(loc) {
        if (isAway) {
            // AWAY: 左(100)から右(1100)へ前進
            return 100 + (loc * 10);
        } else {
            // HOME: 右(1100)から左(100)へ前進
            return 1100 - (loc * 10);
        }
    }

    const nPlays = playSteps.length;
    const minY = 75;
    const maxY = 285;
    const stepY = nPlays > 1 ? (maxY - minY) / (nPlays - 1) : 0;

    // SVG内のグラフィック要素を構築
    const awayName = (state.awayName || 'AWAY').toUpperCase();
    const homeName = (state.homeName || 'HOME').toUpperCase();

    let svgLines = '';
    let svgMarkers = '';

    playSteps.forEach((st, i) => {
        const y = (nPlays === 1) ? 180 : (minY + i * stepY);
        const x1 = locToX(st.startLoc);
        const x2 = locToX(st.endLoc);
        const isHL = (highlightedMapPlayId === st.play.id);

        let strokeColor = '#00b0ff'; // ラン: Blue
        let markerId = isAway ? 'arr-run-r' : 'arr-run-l';
        let dashStyle = '';

        if (st.hasDefTD || st.hasTO) {
            strokeColor = '#ef4444'; // ターンオーバー/守備TD: Red
            markerId = isAway ? 'arr-loss-l' : 'arr-loss-r';
            dashStyle = 'stroke-dasharray="5,3"';
        } else if (st.baseType === 'pass') {
            strokeColor = '#00e676'; // パス: Green
            markerId = isAway ? 'arr-pass-r' : 'arr-pass-l';
        } else if (st.baseType === 'inc') {
            strokeColor = '#94a3b8'; // 失敗: Gray dashed
            dashStyle = 'stroke-dasharray="4,4"';
            markerId = '';
        } else if (st.baseType === 'sack' || st.gain < 0) {
            strokeColor = '#ff1744'; // ロス/サック: Red
            markerId = isAway ? 'arr-loss-l' : 'arr-loss-r';
            dashStyle = 'stroke-dasharray="5,3"';
        } else if (st.baseType === 'penalty') {
            strokeColor = '#facc15'; // 反則: Yellow
            markerId = isAway ? 'arr-pen-r' : 'arr-pen-l';
            dashStyle = 'stroke-dasharray="3,3"';
        } else if (st.baseType === 'punt' || st.baseType === 'fg') {
            strokeColor = '#c084fc'; // キック/パント: Purple
            markerId = isAway ? 'arr-kick-r' : 'arr-kick-l';
        }

        const strokeWidth = isHL ? 5 : 3;
        const opacity = (highlightedMapPlayId && !isHL) ? 0.35 : 0.95;

        // 始点ピン
        svgMarkers += `
        <circle cx="${x1}" cy="${y}" r="${isHL ? 6 : 4}" fill="#ffffff" stroke="${strokeColor}" stroke-width="2" opacity="${opacity}" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
            <title>#${i+1} 開始地点: ${st.startLoc}yd (${st.desc})</title>
        </circle>`;

        // ライン
        if (Math.abs(x2 - x1) >= 4) {
            const markerAttr = markerId ? `marker-end="url(#${markerId})"` : '';
            svgLines += `
            <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" ${dashStyle} ${markerAttr} opacity="${opacity}" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <title>#${i+1}: ${st.gain >= 0 ? '+' : ''}${st.gain}yd - ${st.desc}</title>
            </line>`;
        }

        // 終点アイコン (TD, DEF TD, TO, 1st Down, ❓)
        if (st.hasDefTD) {
            svgMarkers += `
            <g transform="translate(${x2}, ${y})" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <circle cx="0" cy="0" r="14" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
                <text x="0" y="4" font-size="10" font-weight="900" fill="#fff" text-anchor="middle">🛡️</text>
                <text x="0" y="-18" font-size="10" font-weight="800" fill="#fca5a5" text-anchor="middle">DEFENSE TD</text>
            </g>`;
        } else if (st.hasOffTD) {
            svgMarkers += `
            <g transform="translate(${x2}, ${y})" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <circle cx="0" cy="0" r="14" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/>
                <text x="0" y="4" font-size="11" font-weight="900" fill="#000" text-anchor="middle">★</text>
                <text x="0" y="-18" font-size="10" font-weight="800" fill="#fde68a" text-anchor="middle">TOUCHDOWN</text>
            </g>`;
        } else if (st.hasTO) {
            svgMarkers += `
            <g transform="translate(${x2}, ${y})" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <polygon points="0,-10 10,8 -10,8" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
                <text x="0" y="6" font-size="9" font-weight="900" fill="#fff" text-anchor="middle">!</text>
                <text x="0" y="-14" font-size="9" font-weight="800" fill="#fca5a5" text-anchor="middle">TO</text>
            </g>`;
        } else if (st.isMissingGain) {
            svgMarkers += `
            <g transform="translate(${x1}, ${y})" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
                <text x="0" y="4" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">?</text>
            </g>`;
        } else if (st.hasFD) {
            svgMarkers += `
            <circle cx="${x2}" cy="${y}" r="6" fill="#facc15" stroke="#000" stroke-width="1.5" opacity="${opacity}" style="cursor:pointer" onclick="highlightMapPlay(${st.play.id})">
                <title>1st Down 獲得地点</title>
            </circle>`;
        }
    });

    // 全体ヤードラインSVG生成
    let yardLinesSvg = '';
    // 5ydライン (100 to 1100, step 50)
    for (let yd = 5; yd < 100; yd += 5) {
        const x = 100 + yd * 10;
        const isTen = (yd % 10 === 0);
        yardLinesSvg += `<line x1="${x}" y1="20" x2="${x}" y2="340" stroke="rgba(255,255,255,${isTen ? 0.35 : 0.15})" stroke-width="${isTen ? 1.5 : 0.8}"/>`;

        // ハッシュマーク
        yardLinesSvg += `<line x1="${x}" y1="120" x2="${x}" y2="126" stroke="#fff" stroke-width="1"/>`;
        yardLinesSvg += `<line x1="${x}" y1="234" x2="${x}" y2="240" stroke="#fff" stroke-width="1"/>`;

        // ヤード数字 (10, 20, 30, 40, 50, 40, 30, 20, 10)
        if (isTen) {
            const numVal = yd <= 50 ? yd : (100 - yd);
            yardLinesSvg += `
            <text x="${x}" y="55" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.4)" text-anchor="middle">${numVal}</text>
            <text x="${x}" y="315" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="rgba(255,255,255,0.4)" text-anchor="middle">${numVal}</text>`;
        }
    }

    // HTML組み立て
    const tName = isAway ? (state.awayName || 'AWAY') : (state.homeName || 'HOME');
    const attackDirText = isAway ? `左 ➔ 右 (敵陣 ${homeName} 側へ前進)` : `右 ➔ 左 (敵陣 ${awayName} 側へ前進)`;
    const totalGainYards = playSteps.reduce((acc, st) => acc + (st.gain || 0), 0);

    let html = `
    <!-- フィールド描画カード -->
    <div class="fm-field-card">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 8px 6px;color:#a7f3d0;font-size:.74rem;font-weight:600">
            <span>🏟️ DRIVE ${activeDrive.did}: <strong>${esc(tName)}</strong> の攻撃</span>
            <span>攻撃方向: ${attackDirText}</span>
        </div>
        <div class="fm-svg-wrap">
            <svg viewBox="0 0 1200 360" class="fm-svg-field">
                <defs>
                    <!-- マーカー定義 (矢印の頭) -->
                    <marker id="arr-run-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#00b0ff"/></marker>
                    <marker id="arr-run-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#00b0ff"/></marker>
                    <marker id="arr-pass-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#00e676"/></marker>
                    <marker id="arr-pass-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#00e676"/></marker>
                    <marker id="arr-loss-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff1744"/></marker>
                    <marker id="arr-loss-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff1744"/></marker>
                    <marker id="arr-pen-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#facc15"/></marker>
                    <marker id="arr-pen-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#facc15"/></marker>
                    <marker id="arr-kick-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c084fc"/></marker>
                    <marker id="arr-kick-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c084fc"/></marker>
                </defs>

                <!-- 芝生背景 -->
                <rect x="0" y="0" width="1200" height="360" fill="#1b4d24"/>

                <!-- AWAY Endzone (左: 0〜100) -->
                <rect x="0" y="0" width="100" height="360" fill="#1e3a5f"/>
                <text x="50" y="190" transform="rotate(-90 50 190)" font-family="'Orbitron', sans-serif" font-size="20" font-weight="900" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="4">${esc(awayName)}</text>

                <!-- HOME Endzone (右: 1100〜1200) -->
                <rect x="1100" y="0" width="100" height="360" fill="#581c1c"/>
                <text x="1150" y="190" transform="rotate(90 1150 190)" font-family="'Orbitron', sans-serif" font-size="20" font-weight="900" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="4">${esc(homeName)}</text>

                <!-- 外枠ライン & ゴールライン -->
                <rect x="100" y="20" width="1000" height="320" fill="none" stroke="#ffffff" stroke-width="2"/>
                <line x1="100" y1="20" x2="100" y2="340" stroke="#ffd700" stroke-width="4"/>
                <line x1="1100" y1="20" x2="1100" y2="340" stroke="#ffd700" stroke-width="4"/>

                <!-- ヤードライン -->
                ${yardLinesSvg}

                <!-- プレイのライン & マーカー -->
                ${svgLines}
                ${svgMarkers}
            </svg>
        </div>

        <!-- 凡例 (Legend) -->
        <div class="fm-legend-bar">
            <span class="fm-leg-item"><span class="fm-leg-dot" style="background:#00e676"></span> パス成功</span>
            <span class="fm-leg-item"><span class="fm-leg-dot" style="background:#00b0ff"></span> ラン</span>
            <span class="fm-leg-item"><span class="fm-leg-dot" style="background:#ff1744"></span> サック/ロス</span>
            <span class="fm-leg-item"><span class="fm-leg-dot" style="background:#94a3b8"></span> パス失敗</span>
            <span class="fm-leg-item"><span class="fm-leg-dot" style="background:#facc15"></span> 1st Down獲得</span>
            <span class="fm-leg-item"><span style="color:#f59e0b">★</span> タッチダウン</span>
            <span class="fm-leg-item"><span style="color:#ef4444">🛡️★</span> 守備TD</span>
            <span class="fm-leg-item"><span style="color:#ef4444">!</span> ターンオーバー</span>
            <span class="fm-leg-item"><span style="color:#f59e0b;font-weight:700">❓</span> ヤード未入力</span>
        </div>
    </div>

    <!-- ドライブサマリーカード -->
    <div class="fm-summary-card">
        <div>
            <div class="fm-summary-title">DRIVE ${activeDrive.did}: ${esc(tName)}</div>
            <div style="font-size:.74rem;color:var(--mt);margin-top:2px">結果: <strong>${esc(activeDrive.result)}</strong></div>
        </div>
        <div class="fm-summary-badges">
            <span class="fm-badge">プレイ数: ${playSteps.length} plays</span>
            <span class="fm-badge">推定前進: ${totalGainYards >= 0 ? '+' : ''}${totalGainYards} yds</span>
            ${activeDrive.meta.driveTime ? `<span class="fm-badge">時間: ${esc(activeDrive.meta.driveTime)}</span>` : ''}
            <span class="fm-badge" style="background:${activeDrive.hasDefTD ? '#dc2626' : (activeDrive.hasOffTD ? '#d97706' : (activeDrive.hasTO ? '#ef4444' : 'rgba(255,255,255,0.08)'))};color:#fff">
                ${esc(activeDrive.result)}
            </span>
        </div>
    </div>

    <!-- プレイリスト (クリックでハイライト & 編集ジャンプ) -->
    <div class="fm-plays-list">
        <div style="font-size:.75rem;font-weight:700;color:var(--mt);margin-bottom:2px">▼ プレイ一覧（クリックでフィールド上の軌跡をハイライト）</div>
        ${playSteps.map((st, i) => {
            const isHL = (highlightedMapPlayId === st.play.id);
            const hlCls = isHL ? ' highlighted' : '';
            const p = st.play;
            const dnDist = [p.down, p.dist ? `& ${p.dist}` : ''].filter(Boolean).join(' ');
            const sit = [dnDist, p.yardline ? `at ${p.yardline}` : ''].filter(Boolean).join(' ');

            return `
            <div class="fm-play-item${hlCls}" id="fmPlayItem_${p.id}" onclick="highlightMapPlay(${p.id})">
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-weight:700;color:var(--ac);min-width:22px">#${i+1}</span>
                    <span class="pt-tag tg-${st.baseType}" style="font-size:.68rem;padding:2px 6px">${st.baseType.toUpperCase()}</span>
                    <span style="font-size:.72rem;color:var(--mt)">${esc(sit) || '—'}</span>
                    <span style="font-weight:600">${formatDescHTML(st.desc)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:6px">
                    ${st.isMissingGain ? `
                        <span class="fm-warn-badge" title="獲得ヤードが入力されていません。クリックして編集" onclick="event.stopPropagation();startEdit(${p.id})">
                            ⚠️ ヤード未入力
                        </span>` : `
                        <span style="font-weight:700;color:${st.gain > 0 ? 'var(--gn)' : (st.gain < 0 ? 'var(--rd)' : 'var(--mt)')}">
                            ${st.gain > 0 ? '+' : ''}${st.gain} yd
                        </span>`}
                    ${st.hasDefTD ? '<span style="color:#ef4444;font-weight:800;font-size:.75rem">🛡️★ DEF TD</span>' : (st.hasOffTD ? '<span style="color:#f59e0b;font-weight:800;font-size:.75rem">★ TD</span>' : (st.hasTO ? '<span style="color:#ef4444;font-weight:800;font-size:.75rem">! TO</span>' : ''))}
                    <button class="ab ab-edit" style="width:22px;height:22px;font-size:.7rem" onclick="event.stopPropagation();startEdit(${p.id})" title="編集">✏️</button>
                </div>
            </div>`;
        }).join('')}
    </div>`;

    container.innerHTML = html;
}

/* ─── Win Probability Chart ──────────────── */
let highlightedWinProbPlayId = null;

function highlightWinProbPlay(pid) {
    highlightedWinProbPlayId = (highlightedWinProbPlayId === pid) ? null : pid;
    renderWinProbability();
    if (highlightedWinProbPlayId) {
        setTimeout(() => {
            const el = document.getElementById('wpTurnItem_' + pid);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
    }
}

// Qと残り時間（MM:SS）から試合全体の経過秒数（0〜3600+）と残り秒数を計算
function parseTimeToSecondsLeft(quarter, timeStr, playIndex, totalPlays) {
    const q = parseInt(quarter, 10) || 1;
    let min = 15, sec = 0;
    let hasExplicitTime = false;

    if (timeStr && typeof timeStr === 'string') {
        const m = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
        if (m) {
            min = parseInt(m[1], 10);
            sec = parseInt(m[2], 10);
            hasExplicitTime = true;
        }
    }

    if (!hasExplicitTime && totalPlays > 0) {
        // 時間未入力の場合、プレイ順から推定
        const qPlays = (state.plays || []).filter(p => (parseInt(p.quarter, 10) || 1) === q);
        const idxInQ = qPlays.findIndex(p => p.id === (state.plays[playIndex] ? state.plays[playIndex].id : -1));
        const relPos = qPlays.length > 1 ? (Math.max(0, idxInQ) / (qPlays.length - 1)) : 0.5;
        const totalSecInQ = Math.max(10, Math.round(900 * (1 - relPos)));
        min = Math.floor(totalSecInQ / 60);
        sec = totalSecInQ % 60;
    }

    const qSecLeft = Math.max(0, Math.min(900, min * 60 + sec));
    let totalSecLeft = 0;

    if (q <= 4) {
        totalSecLeft = (4 - q) * 900 + qSecLeft;
    } else {
        // OT (延長)
        totalSecLeft = Math.max(10, qSecLeft);
    }

    const elapsedSec = (q <= 4) ? (3600 - totalSecLeft) : (3600 + (900 - qSecLeft));
    return {
        secLeft: Math.max(1, totalSecLeft),
        elapsedSec: Math.max(0, elapsedSec)
    };
}

// 各プレイ時点でのアウェイ勝率（0〜1）を算出する簡易ロジスティック回帰モデル
function computeWinProbabilityAtPlay(awayScore, homeScore, secLeft, poss, ballSide, ballYd, down, dist, isDefTD, isTO) {
    const scoreDiff = awayScore - homeScore; // +ならAwayリード

    // 試合終了（残り0秒）
    if (secLeft <= 0) {
        if (scoreDiff > 0) return 1.0;
        if (scoreDiff < 0) return 0.0;
        return 0.5;
    }

    // 基準スコア差正規化 (残り時間の平方根に反比例して1点あたりの重みが爆発する)
    const timeFactor = Math.sqrt(Math.max(25, secLeft));
    let z = (scoreDiff * 58) / timeFactor;

    // ボールポゼッション & フィールドポジションの微小ボーナス
    if (poss) {
        // 守備TDまたはターンオーバー直後は、相手守備側に攻撃権が移行する
        let effectivePoss = poss;
        if (isDefTD || isTO) {
            effectivePoss = (poss === 'away') ? 'home' : 'away';
        }

        const isAwayPoss = (effectivePoss === 'away');
        let possBonus = 0.5; // ボールを持っているチームに少し有利

        // 自陣/敵陣ヤード
        if (ballSide && ballYd !== undefined && ballYd !== '') {
            const yd = parseInt(ballYd, 10);
            if (!isNaN(yd)) {
                // 相手ゴールまでの距離
                const distToGoal = (ballSide === effectivePoss) ? (100 - yd) : yd;
                if (distToGoal <= 20) possBonus += 1.2; // RedZone
                else if (distToGoal <= 40) possBonus += 0.6; // FG圏内
            }
        }
        z += (isAwayPoss ? 1 : -1) * (possBonus * 50 / timeFactor);
    }

    // シグモイド関数 (ロジスティック関数)
    const probAway = 1 / (1 + Math.exp(-0.18 * z));
    return Math.max(0.001, Math.min(0.999, probAway));
}

function renderWinProbability() {
    const container = document.getElementById('winProbContainer');
    const cntEl = document.getElementById('wpPlaysCount');
    const statusEl = document.getElementById('wpStatusBar');
    if (!container) return;

    const plays = state.plays || [];
    if (cntEl) cntEl.textContent = plays.length + ' play' + (plays.length !== 1 ? 's' : '');

    const awayName = state.awayName || 'AWAY';
    const homeName = state.homeName || 'HOME';
    const awayAbbr = getTeamAbbr('away') || 'AWY';
    const homeAbbr = getTeamAbbr('home') || 'HME';

    if (plays.length === 0) {
        if (statusEl) statusEl.innerHTML = '';
        container.innerHTML = `
        <div class="empty">
            <div class="empty-ic">📈</div>
            <div>まだプレイが記録されていません。<br/>プレイを追加するとリアルタイム勝率推移チャートが自動生成されます。</div>
        </div>`;
        return;
    }

    // 1. 各プレイ時点でのスコアと勝率を順次シミュレート
    let curAwayScore = 0;
    let curHomeScore = 0;
    const totalPlays = plays.length;

    const probPoints = [];
    // 初期状態 (Kickoff前: 50%)
    probPoints.push({
        playId: null,
        playIndex: -1,
        quarter: 1,
        timeStr: '15:00',
        elapsedSec: 0,
        awayScore: 0,
        homeScore: 0,
        probAway: 0.5,
        probHome: 0.5,
        play: null,
        shift: 0
    });

    let prevProb = 0.5;

    plays.forEach((p, idx) => {
        const b = p.builderData || {};
        const poss = p.team || b.poss || 'away';
        const def = (poss === 'away') ? 'home' : 'away';
        const hasRawTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
        const isDefTD = isDefenseTDPlay(p);
        const isTO = isTurnoverPlay(p);

        // スコア更新の反映
        if (p.scoreUpdate) {
            const m = p.scoreUpdate.match(/(\d+)\s*[-–]\s*(\d+)/);
            if (m) {
                curAwayScore = parseInt(m[1], 10);
                curHomeScore = parseInt(m[2], 10);
            }
        } else if (hasRawTD) {
            // scoreUpdate が明記されていない場合の自動フォールバック加算 (+6)
            if (isDefTD) {
                if (def === 'away') curAwayScore += 6;
                else curHomeScore += 6;
            } else {
                if (poss === 'away') curAwayScore += 6;
                else curHomeScore += 6;
            }
        }

        const tInfo = parseTimeToSecondsLeft(p.quarter, p.time, idx, totalPlays);
        const ballSide = p.ballSide || b.yard_side || '';
        const ballYd = (p.ballYd !== undefined && p.ballYd !== '') ? p.ballYd : b.yard_line;

        const pAway = computeWinProbabilityAtPlay(
            curAwayScore, curHomeScore, tInfo.secLeft,
            poss, ballSide, ballYd, p.down, p.dist, isDefTD, isTO
        );
        const pHome = 1.0 - pAway;
        const shift = pAway - prevProb; // +ならAwayが勝率アップ、-ならHomeが勝率アップ

        probPoints.push({
            playId: p.id,
            playIndex: idx,
            quarter: p.quarter || 1,
            timeStr: p.time || '',
            elapsedSec: tInfo.elapsedSec,
            awayScore: curAwayScore,
            homeScore: curHomeScore,
            probAway: pAway,
            probHome: pHome,
            play: p,
            shift: shift,
            isDefTD: isDefTD,
            isTO: isTO
        });

        prevProb = pAway;
    });

    // 最新勝率
    const latestPt = probPoints[probPoints.length - 1];
    const curAwayPct = (latestPt.probAway * 100).toFixed(1);
    const curHomePct = (latestPt.probHome * 100).toFixed(1);

    // ヘッダー勝率バー
    if (statusEl) {
        statusEl.innerHTML = `
            <span style="color:#38bdf8">${esc(awayAbbr)}: ${curAwayPct}%</span>
            <span style="color:var(--mt)">vs</span>
            <span style="color:#f87171">${esc(homeAbbr)}: ${curHomePct}%</span>
        `;
    }

    // 2. SVG チャート作成
    // X軸: 0秒 〜 3600秒（OTあればその分延長）
    const maxElapsed = Math.max(3600, latestPt.elapsedSec);
    const svgW = 920;
    const svgH = 240;
    const padL = 45;
    const padR = 25;
    const padT = 25;
    const padB = 30;
    const plotW = svgW - padL - padR;
    const plotH = svgH - padT - padB;

    // 座標計算関数
    const getX = (sec) => padL + (Math.min(sec, maxElapsed) / maxElapsed) * plotW;
    // Y軸: 1.0 (Away 100%) が上 (padT), 0.0 (Home 100%) が下 (padT + plotH)
    const getY = (prob) => padT + (1.0 - prob) * plotH;

    // 折れ線パス生成
    let linePath = `M ${getX(probPoints[0].elapsedSec).toFixed(1)} ${getY(probPoints[0].probAway).toFixed(1)}`;
    for (let i = 1; i < probPoints.length; i++) {
        const pt = probPoints[i];
        linePath += ` L ${getX(pt.elapsedSec).toFixed(1)} ${getY(pt.probAway).toFixed(1)}`;
    }

    // 領域塗りつぶし（Away側: 上、Home側: 下）
    const midY = getY(0.5);
    let areaAwayPath = `M ${getX(probPoints[0].elapsedSec).toFixed(1)} ${midY.toFixed(1)} L ${getX(probPoints[0].elapsedSec).toFixed(1)} ${getY(probPoints[0].probAway).toFixed(1)}`;
    for (let i = 1; i < probPoints.length; i++) {
        areaAwayPath += ` L ${getX(probPoints[i].elapsedSec).toFixed(1)} ${getY(probPoints[i].probAway).toFixed(1)}`;
    }
    areaAwayPath += ` L ${getX(latestPt.elapsedSec).toFixed(1)} ${midY.toFixed(1)} Z`;

    // クォーター区切り線 (Q1終了: 900s, Q2終了: 1800s, Q3終了: 2700s, 試合終了: 3600s)
    let qLinesHtml = '';
    const qMarks = [
        { sec: 900, label: 'END Q1' },
        { sec: 1800, label: 'HALF' },
        { sec: 2700, label: 'END Q3' },
        { sec: 3600, label: 'END Q4' }
    ];
    if (maxElapsed > 3600) {
        qMarks.push({ sec: 4500, label: 'OT' });
    }

    qMarks.forEach(qm => {
        if (qm.sec <= maxElapsed) {
            const qX = getX(qm.sec);
            qLinesHtml += `
                <line x1="${qX}" y1="${padT}" x2="${qX}" y2="${padT + plotH}" stroke="#334155" stroke-dasharray="3,3" stroke-width="1" />
                <text x="${qX}" y="${padT + plotH + 16}" fill="#64748b" font-size="10" text-anchor="middle" font-weight="600">${qm.label}</text>
            `;
        }
    });

    // 重要プレイ（ターニングポイント）抽出: 変動幅が絶対値7%以上、またはTD/TO
    const turningPoints = [];
    for (let i = 1; i < probPoints.length; i++) {
        const pt = probPoints[i];
        const p = pt.play;
        const absShift = Math.abs(pt.shift);
        const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td') || p.scoreUpdate;
        const isDefTD = pt.isDefTD;
        const isTO = pt.isTO;

        if (absShift >= 0.07 || hasTD || isDefTD || isTO) {
            turningPoints.push({
                ...pt,
                absShift: absShift,
                isTD: !!hasTD,
                isDefTD: !!isDefTD,
                isTO: !!isTO
            });
        }
    }

    // 変動幅降順でTop 5抽出
    const topTurns = [...turningPoints].sort((a, b) => b.absShift - a.absShift).slice(0, 5);

    // チャート上のピンアイコン
    let pinsHtml = '';
    turningPoints.forEach(pt => {
        const cx = getX(pt.elapsedSec);
        const cy = getY(pt.probAway);
        const isHL = highlightedWinProbPlayId === pt.playId;
        const pinColor = pt.shift >= 0 ? '#38bdf8' : '#f87171';
        const r = isHL ? 7 : (pt.isDefTD ? 6 : (pt.isTD ? 5.5 : 4));

        pinsHtml += `
            <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${pinColor}" stroke="#fff" stroke-width="${isHL ? 2.5 : 1.5}"
                style="cursor:pointer;transition:transform .15s" onclick="highlightWinProbPlay(${pt.playId})">
                <title>${esc(pt.timeStr)} Q${pt.quarter}: ${esc(pt.play ? pt.play.desc : '')} (${(pt.shift * 100).toFixed(1)}%)</title>
            </circle>
        `;
    });

    // 選択されたプレイの強調バー
    let hlMarkerHtml = '';
    if (highlightedWinProbPlayId) {
        const targetPt = probPoints.find(p => p.playId === highlightedWinProbPlayId);
        if (targetPt) {
            const hx = getX(targetPt.elapsedSec);
            const hy = getY(targetPt.probAway);
            hlMarkerHtml = `
                <line x1="${hx.toFixed(1)}" y1="${padT}" x2="${hx.toFixed(1)}" y2="${padT + plotH}" stroke="#00d4ff" stroke-width="2" stroke-dasharray="2,2" />
                <circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="8" fill="none" stroke="#00d4ff" stroke-width="2.5" />
            `;
        }
    }

    let html = `
    <!-- リアルタイム勝率メーター -->
    <div style="background:var(--cd);padding:10px 14px;border-radius:8px;border:1px solid var(--bd)">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:.85rem;font-weight:700;margin-bottom:4px">
            <span style="color:#38bdf8">🔵 ${esc(awayName)} ${curAwayPct}%</span>
            <span style="color:var(--mt);font-size:.75rem">現在スコア: ${latestPt.awayScore} - ${latestPt.homeScore}</span>
            <span style="color:#f87171">${curHomePct}% ${esc(homeName)} 🔴</span>
        </div>
        <div class="wp-meter-bar">
            <div class="wp-meter-away" style="width:${curAwayPct}%"></div>
            <div class="wp-meter-home" style="width:${curHomePct}%"></div>
        </div>
    </div>

    <!-- Win Probability SVG Chart -->
    <div class="wp-chart-card">
        <div class="wp-svg-wrap">
            <svg class="wp-svg-chart" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
                <!-- 背景グリッド -->
                <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#050b14" rx="4" />

                <!-- Y軸補助線 (100%, 75%, 50%, 25%, 0%) -->
                <!-- 100% (Away win) -->
                <line x1="${padL}" y1="${padT}" x2="${padL + plotW}" y2="${padT}" stroke="#1e293b" stroke-width="1" />
                <text x="${padL - 8}" y="${padT + 4}" fill="#38bdf8" font-size="9" text-anchor="end" font-weight="700">100%</text>

                <!-- 75% -->
                <line x1="${padL}" y1="${padT + plotH * 0.25}" x2="${padL + plotW}" y2="${padT + plotH * 0.25}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
                <text x="${padL - 8}" y="${padT + plotH * 0.25 + 3}" fill="#64748b" font-size="9" text-anchor="end">75%</text>

                <!-- 50%基準線 (タイ) -->
                <line x1="${padL}" y1="${midY}" x2="${padL + plotW}" y2="${midY}" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5" />
                <text x="${padL - 8}" y="${midY + 3}" fill="#94a3b8" font-size="9" text-anchor="end" font-weight="700">50%</text>

                <!-- 25% -->
                <line x1="${padL}" y1="${padT + plotH * 0.75}" x2="${padL + plotW}" y2="${padT + plotH * 0.75}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
                <text x="${padL - 8}" y="${padT + plotH * 0.75 + 3}" fill="#64748b" font-size="9" text-anchor="end">25%</text>

                <!-- 0% (Home win) -->
                <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#1e293b" stroke-width="1" />
                <text x="${padL - 8}" y="${padT + plotH + 4}" fill="#f87171" font-size="9" text-anchor="end" font-weight="700">100%</text>

                <!-- クォーター境界破線 -->
                ${qLinesHtml}

                <!-- 折れ線グラフ -->
                <path d="${linePath}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />

                <!-- 選択ハイライトマーカー -->
                ${hlMarkerHtml}

                <!-- 重要プレイピン -->
                ${pinsHtml}

                <!-- X軸ラベル -->
                <text x="${padL}" y="${padT + plotH + 16}" fill="#64748b" font-size="10" text-anchor="start">KO</text>
            </svg>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;font-size:.7rem;color:var(--mt)">
            <span>▲ ${esc(awayAbbr)} 優勢</span>
            <span>ピンをクリックするとプレイをハイライトできます</span>
            <span>▼ ${esc(homeAbbr)} 優勢</span>
        </div>
    </div>

    <!-- ターニングポイント Top 5 -->
    <div class="wp-turns-card">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
            <span>⚡ 試合のターニングポイント (Top Plays)</span>
            <span style="font-size:.72rem;color:var(--mt);font-weight:400">勝率スイング幅順</span>
        </div>
        ${topTurns.length === 0 ? `
            <div style="font-size:.75rem;color:var(--mt);padding:8px">大きな勝率変動プレイはまだありません</div>
        ` : topTurns.map((tp, idx) => {
        const isAwaySwing = tp.shift > 0;
        const swingPct = (Math.abs(tp.shift) * 100).toFixed(1);
        const teamLabelStr = isAwaySwing ? awayAbbr : homeAbbr;
        const badgeCls = isAwaySwing ? 'wp-shift-away' : 'wp-shift-home';
        const isSelected = highlightedWinProbPlayId === tp.playId;

        return `
            <div class="wp-turn-item" id="wpTurnItem_${tp.playId}" style="${isSelected ? 'background:rgba(0,144,200,0.1);border-left:3px solid var(--ac);padding-left:8px' : ''}" onclick="highlightWinProbPlay(${tp.playId})">
                <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
                    <span style="font-weight:800;color:var(--mt);font-size:.75rem;width:18px">#${idx + 1}</span>
                    <span class="wp-shift-badge ${badgeCls}">
                        ${isAwaySwing ? '▲' : '▼'} ${teamLabelStr} +${swingPct}%
                    </span>
                    <span style="font-size:.72rem;color:var(--mt);flex-shrink:0">Q${tp.quarter} ${esc(tp.timeStr)}</span>
                    <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.76rem;color:var(--tx)">
                        ${esc(tp.play ? tp.play.desc : '')}
                    </span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
                    <span style="font-size:.72rem;font-weight:700;color:${isAwaySwing ? '#38bdf8' : '#f87171'}">
                        ${(tp.probAway * 100).toFixed(0)}% vs ${(tp.probHome * 100).toFixed(0)}%
                    </span>
                    <button class="ab ab-edit" style="width:20px;height:20px;font-size:.68rem" onclick="event.stopPropagation();startEdit(${tp.playId})" title="編集">✏️</button>
                </div>
            </div>`;
    }).join('')}
    </div>`;

    container.innerHTML = html;
}

/* ─── Game Report & Dynamic Analysis ─────────── */
let latestGeneratedReportText = '';

function copyGameReportToClipboard() {
    if (!latestGeneratedReportText) {
        toast('⚠️ コピーするレポート内容がありません');
        return;
    }
    navigator.clipboard.writeText(latestGeneratedReportText).then(() => {
        toast('📋 戦評・分析レポート全文をクリップボードにコピーしました！');
    }).catch(err => {
        // Fallback for file:// protocol or clipboard restrictions
        const ta = document.createElement('textarea');
        ta.value = latestGeneratedReportText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast('📋 戦評・分析レポート全文をコピーしました！');
    });
}

function generateDynamicAnalysisFactors(awayName, homeName, aw, hm, pStats) {
    const factors = [];

    // 1. ターンオーバー差（Turnover Margin）
    const toDiff = aw.turnoversTotal - hm.turnoversTotal;
    if (aw.turnoversTotal > 0 || hm.turnoversTotal > 0) {
        if (toDiff !== 0) {
            const moreTeam = toDiff > 0 ? awayName : homeName;
            const lessTeam = toDiff > 0 ? homeName : awayName;
            const diffAbs = Math.abs(toDiff);
            factors.push({
                type: 'warning',
                priority: 100 + diffAbs * 10,
                title: `💥 ターンオーバー差（${lessTeam} +${diffAbs} / ${moreTeam} -${diffAbs}）`,
                text: `${moreTeam}が合計${toDiff > 0 ? aw.turnoversTotal : hm.turnoversTotal}回のターンオーバーを献上。ボールセキュリティの差がモメンタムと失点に直結し、勝敗を分ける決定打となった。`
            });
        } else if (aw.turnoversTotal >= 2) {
            factors.push({
                type: 'warning',
                priority: 75,
                title: `💥 両軍ともに複数ターンオーバー（各${aw.turnoversTotal}回）`,
                text: `互いにボールロストが相次ぐ激しい攻防戦。相手のミスからいかに確実に得点を奪えたかが試される試合展開となった。`
            });
        }
    }

    // 2. 3rd Down 成功率の差
    if (aw.thirdDownAtt >= 3 && hm.thirdDownAtt >= 3) {
        const aw3rdPct = Math.round((aw.thirdDownConv / aw.thirdDownAtt) * 100);
        const hm3rdPct = Math.round((hm.thirdDownConv / hm.thirdDownAtt) * 100);
        const pctDiff = Math.abs(aw3rdPct - hm3rdPct);
        if (pctDiff >= 15) {
            const betterTeam = aw3rdPct > hm3rdPct ? awayName : homeName;
            const worseTeam = aw3rdPct > hm3rdPct ? homeName : awayName;
            const bPct = Math.max(aw3rdPct, hm3rdPct);
            const wPct = Math.min(aw3rdPct, hm3rdPct);
            factors.push({
                type: 'key',
                priority: 90 + pctDiff,
                title: `🎯 サードダウン成功率の明暗（${betterTeam} ${bPct}% vs ${worseTeam} ${wPct}%）`,
                text: `${betterTeam}は勝負どころの3rd Downを高い確率で更新して攻撃時間を維持。対する${worseTeam}はプレッシャーを受け、シリーズを継続できず攻撃権を手放す場面が目立った。`
            });
        }
    }

    // 3. パスオフェンス vs パスプロテクション（サック）
    const awPassYds = aw.passNetYds !== undefined ? aw.passNetYds : aw.passYds;
    const hmPassYds = hm.passNetYds !== undefined ? hm.passNetYds : hm.passYds;
    const passDiff = Math.abs(awPassYds - hmPassYds);
    if (passDiff >= 80 && (awPassYds >= 150 || hmPassYds >= 150)) {
        const domTeam = awPassYds > hmPassYds ? awayName : homeName;
        const domYds = Math.max(awPassYds, hmPassYds);
        factors.push({
            type: 'key',
            priority: 85,
            title: `🚀 空中戦の制圧（${domTeam} パス${domYds} yds獲得）`,
            text: `${domTeam}が効果的なパスアタックでフィールドを広く使い、一撃でのロングゲインや要所でのパス成功でオフェンスを強力に牽引した。`
        });
    }

    // サック数
    if (aw.sacksAllowed >= 3 || hm.sacksAllowed >= 3) {
        const heavySackedTeam = aw.sacksAllowed >= hm.sacksAllowed ? awayName : homeName;
        const sackCount = Math.max(aw.sacksAllowed, hm.sacksAllowed);
        factors.push({
            type: 'warning',
            priority: 80,
            title: `🛡️ パスラッシュの猛攻（${heavySackedTeam} 被サック${sackCount}回）`,
            text: `守備側の激しいブリッツとパスラッシュにより、${heavySackedTeam}のQBが厳しいプレッシャーに晒され、ドライブのリズムが幾度も寸断された。`
        });
    }

    // 4. ランゲームの支配力（地上戦）
    const rushDiff = Math.abs(aw.rushYds - hm.rushYds);
    if (rushDiff >= 60 && (aw.rushYds >= 100 || hm.rushYds >= 100)) {
        const groundTeam = aw.rushYds > hm.rushYds ? awayName : homeName;
        const gYds = Math.max(aw.rushYds, hm.rushYds);
        factors.push({
            type: 'success',
            priority: 78,
            title: `🏃 地上戦の圧倒（${groundTeam} ラン${gYds} yds獲得）`,
            text: `フィジカルなOLのブロックとRBの粘り強いキャリーにより、ランゲームで確実に時間を削りながら前進。試合のペースを支配した。`
        });
    }

    // 5. レッドゾーン（敵陣20yd以内）決定力
    if (aw.redZoneAtt >= 2 || hm.redZoneAtt >= 2) {
        const awRzPct = aw.redZoneAtt > 0 ? Math.round((aw.redZoneScores / aw.redZoneAtt) * 100) : 0;
        const hmRzPct = hm.redZoneAtt > 0 ? Math.round((hm.redZoneScores / hm.redZoneAtt) * 100) : 0;
        if (Math.abs(awRzPct - hmRzPct) >= 25) {
            const betterRz = awRzPct > hmRzPct ? awayName : homeName;
            factors.push({
                type: 'key',
                priority: 72,
                title: `🔴 レッドゾーン決定力の差（${betterRz} 高効率）`,
                text: `ゴール前20yd以内でのTD/得点効率がスコアの差となった。相手ディフェンスのゴール前での踏ん張りに対し、確実にタッチダウンを取り切る勝負強さが光った。`
            });
        } else if ((aw.redZoneAtt >= 3 && awRzPct <= 40) || (hm.redZoneAtt >= 3 && hmRzPct <= 40)) {
            factors.push({
                type: 'warning',
                priority: 70,
                title: `⛔ レッドゾーンでの決定力不足（FG止まり）`,
                text: `敵陣深く攻め込みながらもエンドゾーンを破れず、FGに甘んじるドライブが散見。追加点のチャンスを逸したことが終盤の展開に影を落とした。`
            });
        }
    }

    // 6. ペナルティ（反則のコスト）
    const penDiff = Math.abs(aw.penaltiesYards - hm.penaltiesYards);
    if ((aw.penaltiesYards >= 50 || hm.penaltiesYards >= 50) || penDiff >= 30) {
        const badPenTeam = aw.penaltiesYards > hm.penaltiesYards ? awayName : homeName;
        const pYds = Math.max(aw.penaltiesYards, hm.penaltiesYards);
        factors.push({
            type: 'warning',
            priority: 65,
            title: `🚩 反則による陣地ロス（${badPenTeam} ${pYds} yds後退）`,
            text: `痛恨のホールディングやフォルススタートにより、前進の勢いを自ら止めてしまう場面が痛手となった。規律の維持が大きな反省材料となる。`
        });
    }

    // 7. 特殊ビッグプレイ（守備TD・リターンTD等）
    if (aw.tdOther > 0 || hm.tdOther > 0) {
        const defTdTeam = aw.tdOther >= hm.tdOther ? awayName : homeName;
        factors.push({
            type: 'key',
            priority: 95,
            title: `⚡ ディフェンス／スペシャルチームの電撃TD`,
            text: `${defTdTeam}がターンオーバーやキックリターンから電撃的なタッチダウンを奪取。一気にモメンタムを大きく引き寄せる決定打となった。`
        });
    }

    // 優先度順にソートして Top 4 を採用
    factors.sort((a, b) => b.priority - a.priority);
    return factors.slice(0, 4);
}

function renderGameReport() {
    const container = document.getElementById('gameReportContainer');
    const cntEl = document.getElementById('grPlaysCount');
    if (!container) return;

    const plays = state.plays || [];
    if (cntEl) cntEl.textContent = plays.length + ' play' + (plays.length !== 1 ? 's' : '');

    const awayName = state.awayName || 'AWAY';
    const homeName = state.homeName || 'HOME';
    const awayTotal = state.awayTotal || 0;
    const homeTotal = state.homeTotal || 0;
    const isOT = (state.quarterScores.away[4] > 0 || state.quarterScores.home[4] > 0 || state.activeQ >= 5);

    if (plays.length === 0) {
        latestGeneratedReportText = '';
        container.innerHTML = `
        <div class="empty">
            <div class="empty-ic">📝</div>
            <div>まだプレイが記録されていません。<br/>プレイを入力すると自動で客観的戦評サマリーと試合の勝因・課題分析レポートが生成されます。</div>
        </div>`;
        return;
    }

    const pStats = computeStats();
    const tStats = computeTeamStats(pStats);
    const aw = tStats.away;
    const hm = tStats.home;

    // 1. 勝敗ステータス判定
    let outcome = 'tie';
    let winner = '', loser = '';
    let winScore = 0, loseScore = 0;
    if (awayTotal > homeTotal) {
        outcome = 'away_win';
        winner = awayName; loser = homeName;
        winScore = awayTotal; loseScore = homeTotal;
    } else if (homeTotal > awayTotal) {
        outcome = 'home_win';
        winner = homeName; loser = awayName;
        winScore = homeTotal; loseScore = awayTotal;
    }

    const scoreMargin = Math.abs(awayTotal - homeTotal);

    // 試合の主要スコアリングプレイの抽出
    const scoringPlays = plays.filter(p => {
        const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || p.type === 'td';
        const bt = getPlayBaseType(p);
        const isFG = bt === 'fg' && (p.builderData ? (p.builderData.fg_res || 'good').toLowerCase() === 'good' : true);
        return hasTD || isFG;
    });

    // 2. 中立・客観的戦評サマリーの生成
    let summaryHeadline = '';
    let summaryLead = '';
    let summaryBody = '';

    if (outcome === 'tie') {
        summaryHeadline = `【試合サマリー：両軍一歩も譲らず ${awayTotal}-${homeTotal} の同点で決着】`;
        summaryLead = `本日行われた一戦は、${awayName}と${homeName}が互いに一歩も引かない激闘を繰り広げ、${awayTotal}-${homeTotal}の引き分けでタイムアップを迎えた。`;
    } else {
        const otText = isOT ? '延長戦（OT）の激闘を制し、' : '';
        const marginText = scoreMargin <= 3 ? '劇的な接戦の末に' : (scoreMargin >= 17 ? '投打が噛み合い快勝し、' : '');
        summaryHeadline = `【試合サマリー：${winner}が${marginText}${winScore}-${loseScore}で${loser}を下す】`;
        summaryLead = `本日行われた一戦は、${winner}が勝負どころで集中力を発揮し、${otText}${winScore}-${loseScore}で${loser}に競り勝った。`;
    }

    // 展開の解説
    const awPassYds = aw.passNetYds !== undefined ? aw.passNetYds : aw.passYds;
    const hmPassYds = hm.passNetYds !== undefined ? hm.passNetYds : hm.passYds;
    const awRushYds = aw.rushYds;
    const hmRushYds = hm.rushYds;

    // 前半と後半の流れ（Q1-Q2 vs Q3-Q4）
    const awQ = state.quarterScores.away;
    const hmQ = state.quarterScores.home;
    const aw1stHalf = (awQ[0] || 0) + (awQ[1] || 0);
    const hm1stHalf = (hmQ[0] || 0) + (hmQ[1] || 0);

    let halfFlow = '';
    if (aw1stHalf > hm1stHalf) {
        halfFlow = `序盤は${awayName}が主導権を握り、前半を${aw1stHalf}-${hm1stHalf}とリードして折り返す展開。`;
    } else if (hm1stHalf > aw1stHalf) {
        halfFlow = `序盤は${homeName}が持ち前のディフェンスとリズム良い攻撃で前半を${hm1stHalf}-${aw1stHalf}とリードして折り返した。`;
    } else {
        halfFlow = `前半は両軍ともに手堅い立ち上がりを見せ、${aw1stHalf}-${hm1stHalf}の同点でハーフタイムを迎えた。`;
    }

    let turningPointDesc = '';
    if (scoringPlays.length > 0) {
        const lastScore = scoringPlays[scoringPlays.length - 1];
        turningPointDesc = `勝負の終盤、第4Q${lastScore.time ? `残り${lastScore.time}` : ''}に飛び出したスコアリングプレイが試合の帰勢を決定づけた。`;
    }

    // 総合スタッツ所見
    let statsOverview = `トータルヤードでは${awayName}が${aw.totalYards} yds（パス${awPassYds} / ラン${awRushYds}）、${homeName}が${hm.totalYards} yds（パス${hmPassYds} / ラン${hmRushYds}）を記録。`;

    summaryBody = `${halfFlow}後半に入ると互いの意地がぶつかり合い、一進一退の攻防が繰り広げられた。${turningPointDesc}${statsOverview}`;

    const fullSummaryText = `${summaryHeadline}\n\n${summaryLead}\n\n${summaryBody}`;

    // 3. 動的傾向分析レポートの生成
    const factors = generateDynamicAnalysisFactors(awayName, homeName, aw, hm, pStats);

    // テキスト形式でのコピー用文字列作成
    let reportCopyText = `========================================\n`;
    reportCopyText += `🏈 GAME REPORT & ANALYSIS\n`;
    reportCopyText += `MATCHUP: ${awayName} (${awayTotal}) vs ${homeName} (${homeTotal})\n`;
    if (state.gameVenue) reportCopyText += `VENUE: ${state.gameVenue}\n`;
    if (state.gameTime) reportCopyText += `DATE: ${state.gameTime}\n`;
    reportCopyText += `========================================\n\n`;
    reportCopyText += `【戦評サマリー】\n${fullSummaryText}\n\n`;
    reportCopyText += `【勝敗を分けた主要ファクター・傾向分析】\n`;
    factors.forEach((f, idx) => {
        reportCopyText += `${idx + 1}. ${f.title}\n   ${f.text}\n\n`;
    });
    reportCopyText += `【主要チームスタッツサマリー】\n`;
    reportCopyText += `・トータル獲得ヤード: ${awayName} ${aw.totalYards} yds vs ${homeName} ${hm.totalYards} yds\n`;
    reportCopyText += `・パス獲得ヤード: ${awayName} ${awPassYds} yds vs ${homeName} ${hmPassYds} yds\n`;
    reportCopyText += `・ラン獲得ヤード: ${awayName} ${awRushYds} yds vs ${homeName} ${hmRushYds} yds\n`;
    reportCopyText += `・ファーストダウン更新: ${awayName} ${aw.firstDownsTotal}回 vs ${homeName} ${hm.firstDownsTotal}回\n`;
    reportCopyText += `・3rd Down 成功率: ${awayName} ${aw.thirdDownConv}/${aw.thirdDownAtt} vs ${homeName} ${hm.thirdDownConv}/${hm.thirdDownAtt}\n`;
    reportCopyText += `・ターンオーバー: ${awayName} ${aw.turnoversTotal}回 vs ${homeName} ${hm.turnoversTotal}回\n`;
    reportCopyText += `・反則: ${awayName} ${aw.penaltiesCount}回 (${aw.penaltiesYards} yds) vs ${homeName} ${hm.penaltiesCount}回 (${hm.penaltiesYards} yds)\n`;

    latestGeneratedReportText = reportCopyText;

    // 4. HTML レンダリング
    let html = `
    <!-- 戦評サマリーカード -->
    <div class="gr-card">
        <div class="gr-card-title">
            <span>📝 公式戦評サマリー（中立・客観視点）</span>
            <span style="font-size:.72rem;color:var(--mt);font-weight:400">速報・広報リリース用</span>
        </div>
        <div class="gr-summary-text">${esc(fullSummaryText)}</div>
    </div>

    <!-- 動的要因分析カード -->
    <div class="gr-card">
        <div class="gr-card-title">
            <span>⚡ 勝敗を分けた主要ファクター（Dynamic Factors）</span>
            <span style="font-size:.72rem;color:var(--mt);font-weight:400">試合のスタッツ差から自動抽出</span>
        </div>
        ${factors.length === 0 ? `
            <div style="font-size:.76rem;color:var(--mt);padding:8px">極端なスタッツの偏りはありませんでした</div>
        ` : factors.map(f => `
            <div class="gr-factor-item ${f.type}">
                <div class="gr-factor-title">${esc(f.title)}</div>
                <div style="color:var(--tx);font-size:.78rem">${esc(f.text)}</div>
            </div>
        `).join('')}
    </div>

    <!-- 基礎スタッツ対比カード -->
    <div class="gr-card">
        <div class="gr-card-title">
            <span>📊 チームスタッツ要約（Head to Head）</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.78rem">
            <div style="background:rgba(255,255,255,0.02);padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05)">
                <div style="font-weight:700;color:#38bdf8;margin-bottom:6px">🔵 ${esc(awayName)}</div>
                <div>総獲得ヤード: <strong>${aw.totalYards} yds</strong></div>
                <div style="color:var(--mt)">（パス ${awPassYds} / ラン ${awRushYds}）</div>
                <div style="margin-top:4px">3rd Down: <strong>${aw.thirdDownConv}/${aw.thirdDownAtt}</strong></div>
                <div>TO: <strong>${aw.turnoversTotal}回</strong> / 反則: <strong>${aw.penaltiesCount}回</strong></div>
            </div>
            <div style="background:rgba(255,255,255,0.02);padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05)">
                <div style="font-weight:700;color:#f87171;margin-bottom:6px">🔴 ${esc(homeName)}</div>
                <div>総獲得ヤード: <strong>${hm.totalYards} yds</strong></div>
                <div style="color:var(--mt)">（パス ${hmPassYds} / ラン ${hmRushYds}）</div>
                <div style="margin-top:4px">3rd Down: <strong>${hm.thirdDownConv}/${hm.thirdDownAtt}</strong></div>
                <div>TO: <strong>${hm.turnoversTotal}回</strong> / 反則: <strong>${hm.penaltiesCount}回</strong></div>
            </div>
        </div>
    </div>`;

    container.innerHTML = html;
}

/* ─── Modals ──────────────────────────────── */
function openNewGameModal() { document.getElementById('newGameMo').classList.add('open'); }
function closeMo(id) { document.getElementById(id).classList.remove('open'); }
function confirmNew() {
    state = {
        awayName: '', awayCity: '', homeName: '', homeCity: '',
        quarterScores: { away: [0, 0, 0, 0, 0], home: [0, 0, 0, 0, 0] },
        awayTotal: 0, homeTotal: 0,
        gameTime: '', gameVenue: '', gameName: '', gameWeather: '',
        activeQ: 1, currentDriveId: 1, drives: {}, plays: [], highlightedPlayIds: []
    };
    persist(); syncUI(); closeMo('newGameMo'); toast('🆕 新しいゲームを開始しました');
}

/* ─── Save as HTML ────────────────────────── */
function saveAsHTML() {
    const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';
    const aqs = state.quarterScores.away, hqs = state.quarterScores.home;
    const hlIds = state.highlightedPlayIds;
    function se(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{([^}]+)\}/g, '<i style="font-style:italic;opacity:0.85">{$1}</i>');
    }
    function tl(k) { return k === 'away' ? away : k === 'home' ? home : ''; }
    function tc(k) { return k === 'home' ? '#6d3fd4' : '#0090c8'; }
    const tcMap = {
        pass: 'rgba(0,144,200,.14);color:#0090c8',
        inc: 'rgba(229,62,62,.14);color:#e53e3e',
        sack: 'rgba(220,90,0,.14);color:#c05500',
        rush: 'rgba(22,163,74,.14);color:#16a34a',
        td: 'rgba(217,119,6,.18);color:#d97706',
        safety: 'rgba(147,51,234,.18);color:#7e22ce',
        xp: 'rgba(217,119,6,.10);color:#a06010',
        '2pt': 'rgba(217,119,6,.14);color:#a06010',
        fg: 'rgba(109,63,212,.14);color:#6d3fd4',
        punt: 'rgba(100,116,139,.15);color:#64748b',
        kick: 'rgba(100,116,139,.15);color:#64748b',
        kick_return: 'rgba(100,116,139,.15);color:#64748b',
        turnover: 'rgba(229,62,62,.18);color:#b91c1c',
        fumble: 'rgba(229,62,62,.18);color:#b91c1c',
        intercept: 'rgba(109,63,212,.14);color:#6d3fd4',
        penalty: 'rgba(229,62,62,.12);color:#e53e3e',
        timeout: 'rgba(217,119,6,.12);color:#d97706',
        other: 'rgba(100,116,139,.12);color:#64748b'
    };

    // 1. Play-by-Play HTML 生成
    const driveOrder = [], driveMap = {};
    state.plays.forEach(p => {
        const d = p.driveId || 1;
        if (!driveMap[d]) { driveMap[d] = []; driveOrder.push(d); }
        driveMap[d].push(p);
    });

    let playsHTML = '';
    if (state.plays.length === 0) {
        playsHTML = '<div style="padding:40px;text-align:center;color:#6b7280">No plays recorded.</div>';
    } else {
        let prevQ = null;
        driveOrder.forEach((did, di) => {
            const dp = driveMap[did];
            const dm = state.drives[did] || {};
            const dCount = dm.playCountOverride !== undefined && dm.playCountOverride !== '' && dm.playCountOverride !== null
                ? dm.playCountOverride
                : dp.filter(p => !NP.has(p.type)).length;
            const firstQ = (dp[0] && dp[0].quarter) || 1;

            if (di > 0) {
                if (prevQ === 2 && firstQ >= 3) {
                    playsHTML += `<div style="padding:10px 18px;display:flex;align-items:center;gap:11px;background:linear-gradient(90deg,rgba(255,202,40,.06),rgba(124,77,255,.06));border-top:2px solid rgba(255,202,40,.3);border-bottom:2px solid rgba(255,202,40,.3)"><div style="flex:1;height:1px;background:rgba(255,202,40,.2)"></div><span style="font-family:'Orbitron',sans-serif;font-size:.72rem;color:#b45309;font-weight:700;letter-spacing:2px">HALFTIME</span><div style="flex:1;height:1px;background:rgba(255,202,40,.2)"></div></div>`;
                } else {
                    playsHTML += `<div style="padding:8px 18px;display:flex;align-items:center;gap:11px;background:rgba(239,68,68,.05);border-top:1px solid rgba(239,68,68,.2);border-bottom:1px solid rgba(239,68,68,.2)"><div style="flex:1;height:1px;background:rgba(239,68,68,.2)"></div><span style="font-size:.68rem;font-weight:700;color:#dc2626;letter-spacing:1.5px">DRIVE ${di} END</span><div style="flex:1;height:1px;background:rgba(239,68,68,.2)"></div></div>`;
                }
            }
            prevQ = (dp[dp.length - 1] && dp[dp.length - 1].quarter) || 1;
            const teamClr = dm.team ? tc(dm.team) : '#6b7280';
            playsHTML += `<div style="display:flex;align-items:center;gap:8px;padding:9px 14px;background:#eef2f8;border-bottom:1px solid #d1d9e6;flex-wrap:wrap">
        <span style="font-family:'Orbitron',sans-serif;font-size:1rem;font-weight:700;color:${teamClr};text-transform:uppercase;min-width:60px">${se(dm.team ? tl(dm.team) : '—')}</span>
        <span style="color:#d1d9e6">|</span><span style="font-size:.78rem;color:#1e293b">${se(dm.result || '—')}</span>
        <span style="color:#d1d9e6">·</span><span style="font-size:.7rem;color:#64748b">${dCount} plays</span>
        ${dm.yards ? `<span style="color:#d1d9e6">·</span><span style="font-size:.76rem;color:#1e293b">${se(dm.yards)} yds</span>` : ''} 
        ${dm.driveTime ? `<span style="color:#d1d9e6">·</span><span style="font-size:.76rem;color:#1e293b">${se(dm.driveTime)}</span>` : ''}
        ${dm.score ? `<span style="color:#d1d9e6">·</span><span style="font-size:.76rem;color:#d97706;font-weight:600">${se(dm.score)}</span>` : ''}
      </div>`;
            dp.forEach(p => {
                const tKey = p.type || 'other';
                const isHL = hlIds.includes(p.id);
                const dnDist = [p.down, p.dist ? '& ' + p.dist : ''].filter(Boolean).join(' ');
                const sit = [dnDist, p.yardline ? 'at ' + p.yardline : ''].filter(Boolean).join(' ');
                const badge = p.team ? `<div style="display:inline-block;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:3px;background:${tc(p.team)}22;color:${tc(p.team)};text-transform:uppercase;margin-top:3px">${se(tl(p.team))}</div>` : '';
                const scoreRow = p.scoreUpdate ? `<div style="font-size:.71rem;color:#d97706;font-weight:600;margin-top:3px">🏆 ${se(p.scoreUpdate)}</div>` : '';
                const hlStyle = isHL ? 'border-left:3px solid #0090c8;background:rgba(0,144,200,.10);' : '';
                playsHTML += `<div style="padding:11px 14px;border-bottom:1px solid #d1d9e6;display:grid;grid-template-columns:82px 1fr;gap:9px;align-items:start;${hlStyle}">
          <div style="text-align:center">
            <div>${p.quarter ? `<span style="font-size:.6rem;color:#64748b;font-weight:600">${QL[p.quarter] || ''} </span>` : ''}<span style="font-family:'Orbitron',sans-serif;font-size:.76rem;color:#0090c8;font-weight:700">${se(p.time) || '—'}</span></div>
            <div style="font-size:.66rem;color:#64748b;margin-top:2px">${se(sit) || '—'}</div>${badge}
          </div>
          <div>
            <span style="display:inline-block;font-size:.63rem;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:.5px;background:${tcMap[tKey] || tcMap.other};margin-bottom:4px">${TL[tKey] || tKey.toUpperCase()}</span>
            <div style="font-size:.84rem;line-height:1.55;color:#1e293b">${se(p.desc)}</div>${scoreRow}
          </div>
        </div>`;
            });
        });
    }

    // 2. 個人スタッツ (Box Score All) HTML 生成
    const isManualStats = state.manualStats && state.manualStats.isEditing;
    const playerStats = (isManualStats && state.manualStats.playerStats) ? state.manualStats.playerStats : computeStats();
    let boxScoreHTML = '';
    if (playerStats.totalCountedPlays === 0) {
        boxScoreHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:.85rem">まだスタッツ対象のプレイがありません</div>';
    } else {
        boxScoreHTML = `
        <div style="padding:16px">
            ${renderTeamBoxScoreSection(playerStats.away, false)}
            <div style="height:20px"></div>
            ${renderTeamBoxScoreSection(playerStats.home, true)}
        </div>`;
    }

    // 3. チームスタッツ (Team Stats) HTML 生成
    const tsData = (isManualStats && state.manualStats.teamstats) ? state.manualStats.teamstats : computeTeamStats(playerStats);
    const aw = tsData.away, hm = tsData.home;
    const awayAbbr = getTeamAbbr('away') || 'AWY';
    const homeAbbr = getTeamAbbr('home') || 'HME';

    function renderStaticTsRow(label, awayVal, homeVal, awayNum, homeNum, isSub, compType) {
        let awayHl = false, homeHl = false;
        if (compType === 'high' && awayNum !== homeNum && awayNum !== null && homeNum !== null) {
            awayHl = awayNum > homeNum; homeHl = homeNum > awayNum;
        } else if (compType === 'low' && awayNum !== homeNum && awayNum !== null && homeNum !== null) {
            awayHl = awayNum < homeNum; homeHl = homeNum < awayNum;
        }
        const labelHtml = isSub ? `<span style="padding-left:16px;color:#64748b;font-size:.78rem">└ ${se(label)}</span>` : `<strong style="font-size:.82rem;color:#1e293b">${se(label)}</strong>`;
        const aStyle = awayHl ? 'font-weight:700;color:#0090c8;background:rgba(0,144,200,.06)' : 'color:#1e293b';
        const hStyle = homeHl ? 'font-weight:700;color:#6d3fd4;background:rgba(109,63,212,.06)' : 'color:#1e293b';
        return `<tr>
            <td style="padding:7px 12px;border-bottom:1px solid #e2e8f0;text-align:left">${labelHtml}</td>
            <td style="padding:7px 12px;border-bottom:1px solid #e2e8f0;text-align:center;${aStyle}">${se(awayVal)}</td>
            <td style="padding:7px 12px;border-bottom:1px solid #e2e8f0;text-align:center;${hStyle}">${se(homeVal)}</td>
        </tr>`;
    }

    const awMiss = aw.hasMissingYards ? '*' : '';
    const hmMiss = hm.hasMissingYards ? '*' : '';
    const aw3rdPct = aw.thirdDownAtt > 0 ? ((aw.thirdDownConv / aw.thirdDownAtt) * 100).toFixed(0) : 0;
    const hm3rdPct = hm.thirdDownAtt > 0 ? ((hm.thirdDownConv / hm.thirdDownAtt) * 100).toFixed(0) : 0;
    const aw4thPct = aw.fourthDownAtt > 0 ? ((aw.fourthDownConv / aw.fourthDownAtt) * 100).toFixed(0) : 0;
    const hm4thPct = hm.fourthDownAtt > 0 ? ((hm.fourthDownConv / hm.fourthDownAtt) * 100).toFixed(0) : 0;
    const awPassPct = aw.passAtt > 0 ? ((aw.passCmp / aw.passAtt) * 100).toFixed(1) : '0.0';
    const hmPassPct = hm.passAtt > 0 ? ((hm.passCmp / hm.passAtt) * 100).toFixed(1) : '0.0';
    const awRushAvg = aw.rushAtt > 0 ? (aw.rushYds / aw.rushAtt).toFixed(1) : '0.0';
    const hmRushAvg = hm.rushAtt > 0 ? (hm.rushYds / hm.rushAtt).toFixed(1) : '0.0';
    const awPatPct = aw.patAtt > 0 ? ((aw.patMade / aw.patAtt) * 100).toFixed(0) : '-';
    const hmPatPct = hm.patAtt > 0 ? ((hm.patMade / hm.patAtt) * 100).toFixed(0) : '-';
    const awFgPct = aw.fgAtt > 0 ? ((aw.fgMade / aw.fgAtt) * 100).toFixed(0) : '-';
    const hmFgPct = hm.fgAtt > 0 ? ((hm.fgMade / hm.fgAtt) * 100).toFixed(0) : '-';
    const awRzPct = aw.redZoneAtt > 0 ? ((aw.redZoneScores / aw.redZoneAtt) * 100).toFixed(0) : '-';
    const hmRzPct = hm.redZoneAtt > 0 ? ((hm.redZoneScores / hm.redZoneAtt) * 100).toFixed(0) : '-';

    let teamStatsHTML = `
    <div style="padding:14px;overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:.82rem">
            <thead>
                <tr style="background:#eef2f8;border-bottom:2px solid #cbd5e1">
                    <th style="padding:8px 12px;text-align:left;color:#475569;font-weight:700;width:40%">STATISTIC</th>
                    <th style="padding:8px 12px;text-align:center;color:#0090c8;font-weight:700;width:30%">${se(away)} <span style="font-size:.7rem;color:#64748b">(${se(awayAbbr)})</span></th>
                    <th style="padding:8px 12px;text-align:center;color:#6d3fd4;font-weight:700;width:30%">${se(home)} <span style="font-size:.7rem;color:#64748b">(${se(homeAbbr)})</span></th>
                </tr>
            </thead>
            <tbody>
                ${renderStaticTsRow('ファーストダウン (獲得数)', aw.firstDownsTotal, hm.firstDownsTotal, aw.firstDownsTotal, hm.firstDownsTotal, false, 'high')}
                ${renderStaticTsRow('ランによる獲得', aw.firstDownsRush, hm.firstDownsRush, aw.firstDownsRush, hm.firstDownsRush, true, 'high')}
                ${renderStaticTsRow('パスによる獲得', aw.firstDownsPass, hm.firstDownsPass, aw.firstDownsPass, hm.firstDownsPass, true, 'high')}
                ${renderStaticTsRow('反則による獲得', aw.firstDownsPenalty, hm.firstDownsPenalty, aw.firstDownsPenalty, hm.firstDownsPenalty, true, 'none')}
                ${renderStaticTsRow('サードダウン成功率', `${aw.thirdDownConv}/${aw.thirdDownAtt} (${aw3rdPct}%)`, `${hm.thirdDownConv}/${hm.thirdDownAtt} (${hm3rdPct}%)`, parseFloat(aw3rdPct), parseFloat(hm3rdPct), false, 'high')}
                ${renderStaticTsRow('フォースダウン成功率', `${aw.fourthDownConv}/${aw.fourthDownAtt} (${aw4thPct}%)`, `${hm.fourthDownConv}/${hm.fourthDownAtt} (${hm4thPct}%)`, parseFloat(aw4thPct), parseFloat(hm4thPct), false, 'high')}
                ${renderStaticTsRow('総攻撃回数 (Total Plays)', aw.totalPlays, hm.totalPlays, aw.totalPlays, hm.totalPlays, false, 'high')}
                ${renderStaticTsRow('総獲得ヤード (Total Yards)', `${aw.totalYards}${awMiss}`, `${hm.totalYards}${hmMiss}`, aw.totalYards, hm.totalYards, false, 'high')}
                ${renderStaticTsRow('パス (成功 - 試投 - ヤード)', `${aw.passCmp}-${aw.passAtt}-${aw.passNetYds}${awMiss}`, `${hm.passCmp}-${hm.passAtt}-${hm.passNetYds}${hmMiss}`, aw.passNetYds, hm.passNetYds, false, 'high')}
                ${renderStaticTsRow('パス成功率', `${awPassPct}%`, `${hmPassPct}%`, parseFloat(awPassPct), parseFloat(hmPassPct), true, 'high')}
                ${renderStaticTsRow('被インターセプト', aw.passInt, hm.passInt, aw.passInt, hm.passInt, true, 'low')}
                ${(state.ruleType === 'nfl') ? renderStaticTsRow('被サック数 - ロスヤード', `${aw.passSacks} - ${aw.passSackYds} yds`, `${hm.passSacks} - ${hm.passSackYds} yds`, aw.passSacks, hm.passSacks, true, 'low') : ''}
                ${renderStaticTsRow('ラン (回数 - ヤード)', `${aw.rushAtt} - ${aw.rushYds}${awMiss}`, `${hm.rushAtt} - ${hm.rushYds}${hmMiss}`, aw.rushYds, hm.rushYds, false, 'high')}
                ${renderStaticTsRow('ラン平均獲得ヤード', `${awRushAvg} yds`, `${hmRushAvg} yds`, parseFloat(awRushAvg), parseFloat(hmRushAvg), true, 'high')}
                ${renderStaticTsRow('タッチダウン (TD合計)', aw.tdTotal, hm.tdTotal, aw.tdTotal, hm.tdTotal, false, 'high')}
                ${renderStaticTsRow('ラン TD', aw.tdRush, hm.tdRush, aw.tdRush, hm.tdRush, true, 'high')}
                ${renderStaticTsRow('パス TD', aw.tdPass, hm.tdPass, aw.tdPass, hm.tdPass, true, 'high')}
                ${renderStaticTsRow('その他 TD (リターン/守備)', aw.tdOther, hm.tdOther, aw.tdOther, hm.tdOther, true, 'none')}
                ${renderStaticTsRow('ポイント・アフター (PAT Kick)', `${aw.patMade}/${aw.patAtt} (${awPatPct}%)`, `${hm.patMade}/${hm.patAtt} (${hmPatPct}%)`, aw.patMade, hm.patMade, false, 'high')}
                ${renderStaticTsRow('2ポイント・コンバージョン', `${aw.twoPtMade}/${aw.twoPtAtt}`, `${hm.twoPtMade}/${hm.twoPtAtt}`, aw.twoPtMade, hm.twoPtMade, false, 'high')}
                ${renderStaticTsRow('フィールドゴール (FG)', `${aw.fgMade}/${aw.fgAtt} (${awFgPct}%)`, `${hm.fgMade}/${hm.fgAtt} (${hmFgPct}%)`, aw.fgMade, hm.fgMade, false, 'high')}
                ${renderStaticTsRow('パント回数', `${aw.punts}${awMiss}`, `${hm.punts}${hmMiss}`, aw.punts, hm.punts, false, 'low')}
                ${renderStaticTsRow('反則 - ヤード', `${aw.penaltiesCount} - ${aw.penaltiesYards} yds`, `${hm.penaltiesCount} - ${hm.penaltiesYards} yds`, aw.penaltiesYards, hm.penaltiesYards, false, 'low')}
                ${renderStaticTsRow('被ターンオーバー (合計)', aw.turnoversTotal, hm.turnoversTotal, aw.turnoversTotal, hm.turnoversTotal, false, 'low')}
                ${renderStaticTsRow('被インターセプト', aw.interceptionsThrown, hm.interceptionsThrown, aw.interceptionsThrown, hm.interceptionsThrown, true, 'low')}
                ${renderStaticTsRow('ファンブルロスト', aw.fumblesLost, hm.fumblesLost, aw.fumblesLost, hm.fumblesLost, true, 'low')}
                ${renderStaticTsRow('セーフティー奪取', aw.safeties, hm.safeties, aw.safeties, hm.safeties, false, 'high')}
                ${renderStaticTsRow('レッドゾーン成功率 (TD/進入)', `${aw.redZoneScores}/${aw.redZoneAtt} (${awRzPct}%)`, `${hm.redZoneScores}/${hm.redZoneAtt} (${hmRzPct}%)`, parseFloat(awRzPct) || 0, parseFloat(hmRzPct) || 0, false, 'high')}
                ${renderStaticTsRow('時間支配率 (Time of Possession)', formatTimeFromSec(aw.possessionSeconds), formatTimeFromSec(hm.possessionSeconds), aw.possessionSeconds, hm.possessionSeconds, false, 'high')}
            </tbody>
        </table>
    </div>`;

    // 4. 勝率推移グラフ (Win Probability) HTML & SVG 生成
    const plays = state.plays || [];
    let winProbHTML = '';
    if (plays.length === 0) {
        winProbHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:.85rem">まだプレイが記録されていません</div>';
    } else {
        let curAwayScore = 0, curHomeScore = 0;
        const totalPlaysCount = plays.length;
        const probPoints = [{
            playId: null, playIndex: -1, quarter: 1, timeStr: '15:00', elapsedSec: 0,
            awayScore: 0, homeScore: 0, probAway: 0.5, probHome: 0.5, play: null, shift: 0
        }];
        let prevProb = 0.5;

        plays.forEach((p, idx) => {
            const b = p.builderData || {};
            const poss = p.team || b.poss || 'away';
            const def = (poss === 'away') ? 'home' : 'away';
            const hasRawTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td');
            const isDefTD = isDefenseTDPlay(p);
            const isTO = isTurnoverPlay(p);

            if (p.scoreUpdate) {
                const m = p.scoreUpdate.match(/(\d+)\s*[-–]\s*(\d+)/);
                if (m) { curAwayScore = parseInt(m[1], 10); curHomeScore = parseInt(m[2], 10); }
            } else if (hasRawTD) {
                if (isDefTD) {
                    if (def === 'away') curAwayScore += 6; else curHomeScore += 6;
                } else {
                    if (poss === 'away') curAwayScore += 6; else curHomeScore += 6;
                }
            }

            const tInfo = parseTimeToSecondsLeft(p.quarter, p.time, idx, totalPlaysCount);
            const ballSide = p.ballSide || b.yard_side || '';
            const ballYd = (p.ballYd !== undefined && p.ballYd !== '') ? p.ballYd : b.yard_line;
            const down = p.down || b.down || 1;
            const dist = p.dist || b.distance || 10;

            const pPoss = isDefTD ? def : (isTO ? def : poss);
            const pAway = computeWinProbabilityAtPlay(
                curAwayScore, curHomeScore, tInfo.secLeft,
                pPoss, ballSide, ballYd, down, dist, isDefTD, isTO
            );
            const pHome = 1.0 - pAway;
            const shift = pAway - prevProb;
            prevProb = pAway;

            probPoints.push({
                playId: p.id, playIndex: idx, quarter: p.quarter || 1, timeStr: p.time || '',
                elapsedSec: tInfo.elapsedSec, awayScore: curAwayScore, homeScore: curHomeScore,
                probAway: pAway, probHome: pHome, play: p, shift: shift,
                isDefTD: isDefTD, isTO: isTO
            });
        });

        const latestPt = probPoints[probPoints.length - 1];
        const curAwayPct = (latestPt.probAway * 100).toFixed(1);
        const curHomePct = (latestPt.probHome * 100).toFixed(1);

        const svgW = 800, svgH = 260;
        const padL = 45, padR = 25, padT = 20, padB = 30;
        const plotW = svgW - padL - padR, plotH = svgH - padT - padB;
        let maxElapsed = 3600;
        probPoints.forEach(pt => { if (pt.elapsedSec > maxElapsed) maxElapsed = pt.elapsedSec + 60; });

        function getX(sec) { return padL + (sec / maxElapsed) * plotW; }
        function getY(prob) { return padT + (1 - prob) * plotH; }

        let linePath = `M ${getX(probPoints[0].elapsedSec).toFixed(1)} ${getY(probPoints[0].probAway).toFixed(1)}`;
        for (let i = 1; i < probPoints.length; i++) {
            linePath += ` L ${getX(probPoints[i].elapsedSec).toFixed(1)} ${getY(probPoints[i].probAway).toFixed(1)}`;
        }

        const midY = getY(0.5);
        let qLinesHtml = '';
        const qMarks = [
            { sec: 900, label: 'END Q1' }, { sec: 1800, label: 'HALF' },
            { sec: 2700, label: 'END Q3' }, { sec: 3600, label: 'END Q4' }
        ];
        if (maxElapsed > 3600) qMarks.push({ sec: 4500, label: 'OT' });
        qMarks.forEach(qm => {
            if (qm.sec <= maxElapsed) {
                const qX = getX(qm.sec);
                qLinesHtml += `<line x1="${qX}" y1="${padT}" x2="${qX}" y2="${padT + plotH}" stroke="#334155" stroke-dasharray="3,3" stroke-width="1" />
                <text x="${qX}" y="${padT + plotH + 16}" fill="#64748b" font-size="10" text-anchor="middle" font-weight="600">${qm.label}</text>`;
            }
        });

        const turningPoints = [];
        for (let i = 1; i < probPoints.length; i++) {
            const pt = probPoints[i], p = pt.play, absShift = Math.abs(pt.shift);
            const hasTD = (p.activeOptions || []).some(o => o.type === 'touchdown') || (p.type === 'td') || p.scoreUpdate;
            if (absShift >= 0.07 || hasTD || pt.isDefTD || pt.isTO) {
                turningPoints.push({ ...pt, absShift: absShift });
            }
        }
        const topTurns = [...turningPoints].sort((a, b) => b.absShift - a.absShift).slice(0, 5);

        let pinsHtml = '';
        turningPoints.forEach(pt => {
            const cx = getX(pt.elapsedSec), cy = getY(pt.probAway);
            const pinColor = pt.shift >= 0 ? '#0090c8' : '#e11d48';
            pinsHtml += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4.5" fill="${pinColor}" stroke="#fff" stroke-width="1.5">
                <title>${se(pt.timeStr)} Q${pt.quarter}: ${se(pt.play ? pt.play.desc : '')} (${(pt.shift * 100).toFixed(1)}%)</title>
            </circle>`;
        });

        winProbHTML = `
        <div style="padding:16px">
            <!-- 勝率メーター -->
            <div style="background:#f8fafc;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:14px">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:.85rem;font-weight:700;margin-bottom:6px">
                    <span style="color:#0090c8">🔵 ${se(away)} ${curAwayPct}%</span>
                    <span style="color:#64748b;font-size:.76rem">最終スコア: ${latestPt.awayScore} - ${latestPt.homeScore}</span>
                    <span style="color:#6d3fd4">${curHomePct}% ${se(home)} 🟣</span>
                </div>
                <div style="height:10px;border-radius:5px;overflow:hidden;background:#e2e8f0;display:flex">
                    <div style="width:${curAwayPct}%;background:linear-gradient(90deg,#0090c8,#38bdf8)"></div>
                    <div style="width:${curHomePct}%;background:linear-gradient(90deg,#a855f7,#6d3fd4)"></div>
                </div>
            </div>

            <!-- SVGチャート -->
            <div style="background:#0b1324;border-radius:8px;padding:12px;overflow:hidden;margin-bottom:16px;border:1px solid #1e293b">
                <div style="width:100%;max-width:100%;overflow-x:auto">
                    <svg viewBox="0 0 ${svgW} ${svgH}" style="display:block;width:100%;height:auto;min-width:550px" xmlns="http://www.w3.org/2000/svg">
                        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#050b14" rx="4" />
                        <line x1="${padL}" y1="${padT}" x2="${padL + plotW}" y2="${padT}" stroke="#1e293b" stroke-width="1" />
                        <text x="${padL - 8}" y="${padT + 4}" fill="#38bdf8" font-size="9" text-anchor="end" font-weight="700">100%</text>
                        <line x1="${padL}" y1="${padT + plotH * 0.25}" x2="${padL + plotW}" y2="${padT + plotH * 0.25}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
                        <text x="${padL - 8}" y="${padT + plotH * 0.25 + 3}" fill="#64748b" font-size="9" text-anchor="end">75%</text>
                        <line x1="${padL}" y1="${midY}" x2="${padL + plotW}" y2="${midY}" stroke="#475569" stroke-dasharray="4,4" stroke-width="1.5" />
                        <text x="${padL - 8}" y="${midY + 3}" fill="#94a3b8" font-size="9" text-anchor="end" font-weight="700">50%</text>
                        <line x1="${padL}" y1="${padT + plotH * 0.75}" x2="${padL + plotW}" y2="${padT + plotH * 0.75}" stroke="#1e293b" stroke-dasharray="2,2" stroke-width="1" />
                        <text x="${padL - 8}" y="${padT + plotH * 0.75 + 3}" fill="#64748b" font-size="9" text-anchor="end">25%</text>
                        <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#1e293b" stroke-width="1" />
                        <text x="${padL - 8}" y="${padT + plotH + 4}" fill="#f87171" font-size="9" text-anchor="end" font-weight="700">100%</text>
                        ${qLinesHtml}
                        <path d="${linePath}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
                        ${pinsHtml}
                        <text x="${padL}" y="${padT + plotH + 16}" fill="#64748b" font-size="10" text-anchor="start">KO</text>
                    </svg>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px 0;font-size:.7rem;color:#94a3b8">
                    <span>▲ ${se(awayAbbr)} 優勢</span>
                    <span>● 重要ターニングポイント</span>
                    <span>▼ ${se(homeAbbr)} 優勢</span>
                </div>
            </div>

            <!-- ターニングポイント Top 5 -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px">
                <div style="font-size:.84rem;font-weight:700;margin-bottom:8px;color:#1e293b">⚡ 試合のターニングポイント (Top Plays)</div>
                ${topTurns.length === 0 ? '<div style="font-size:.76rem;color:#64748b;padding:6px">大きな勝率変動プレイはありませんでした</div>' : topTurns.map((tp, idx) => {
                    const isAwaySwing = tp.shift > 0;
                    const swingPct = (Math.abs(tp.shift) * 100).toFixed(1);
                    const teamLabelStr = isAwaySwing ? awayAbbr : homeAbbr;
                    const badgeBg = isAwaySwing ? 'rgba(0,144,200,.12)' : 'rgba(225,29,72,.12)';
                    const badgeClr = isAwaySwing ? '#0090c8' : '#e11d48';
                    return `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-bottom:1px solid #e2e8f0;font-size:.78rem;gap:8px">
                        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1">
                            <span style="font-weight:800;color:#64748b;font-size:.75rem">#${idx + 1}</span>
                            <span style="background:${badgeBg};color:${badgeClr};font-weight:700;font-size:.7rem;padding:2px 6px;border-radius:4px;white-space:nowrap">${isAwaySwing ? '▲' : '▼'} ${se(teamLabelStr)} +${swingPct}%</span>
                            <span style="font-size:.72rem;color:#64748b;flex-shrink:0">Q${tp.quarter} ${se(tp.timeStr)}</span>
                            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#1e293b">${se(tp.play ? tp.play.desc : '')}</span>
                        </div>
                        <div style="font-size:.72rem;font-weight:700;color:${isAwaySwing ? '#0090c8' : '#6d3fd4'};flex-shrink:0">
                            ${(tp.probAway * 100).toFixed(0)}% - ${(tp.probHome * 100).toFixed(0)}%
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }

    // 5. 公式戦評・傾向分析レポート (Game Report) HTML 生成
    let gameReportHTML = '';
    if (plays.length === 0) {
        gameReportHTML = '<div style="padding:30px;text-align:center;color:#64748b;font-size:.85rem">まだ戦評を作成するためのプレイがありません</div>';
    } else {
        const awayTotal = state.awayTotal || 0;
        const homeTotal = state.homeTotal || 0;
        const isOT = (state.quarterScores.away[4] || 0) > 0 || (state.quarterScores.home[4] || 0) > 0;
        let outcome = 'tie', winner = '', loser = '', winScore = 0, loseScore = 0;
        if (awayTotal > homeTotal) {
            outcome = 'away_win'; winner = away; loser = home; winScore = awayTotal; loseScore = homeTotal;
        } else if (homeTotal > awayTotal) {
            outcome = 'home_win'; winner = home; loser = away; winScore = homeTotal; loseScore = awayTotal;
        }
        const scoreMargin = Math.abs(awayTotal - homeTotal);

        let summaryHeadline = '';
        let summaryLead = '';
        if (outcome === 'tie') {
            summaryHeadline = `【試合サマリー：両軍一歩も譲らず ${awayTotal}-${homeTotal} の同点で決着】`;
            summaryLead = `本日行われた一戦は、${away}と${home}が互いに一歩も引かない激闘を繰り広げ、${awayTotal}-${homeTotal}の引き分けでタイムアップを迎えた。`;
        } else {
            const otText = isOT ? '延長戦（OT）の激闘を制し、' : '';
            const marginText = scoreMargin <= 3 ? '劇的な接戦の末に' : (scoreMargin >= 17 ? '投打が噛み合い快勝し、' : '');
            summaryHeadline = `【試合サマリー：${winner}が${marginText}${winScore}-${loseScore}で${loser}を下す】`;
            summaryLead = `本日行われた一戦は、${winner}が勝負どころで集中力を発揮し、${otText}${winScore}-${loseScore}で${loser}に競り勝った。`;
        }

        const awQ = state.quarterScores.away;
        const hmQ = state.quarterScores.home;
        const aw1stHalf = (awQ[0] || 0) + (awQ[1] || 0);
        const hm1stHalf = (hmQ[0] || 0) + (hmQ[1] || 0);
        let halfFlow = '';
        if (aw1stHalf > hm1stHalf) {
            halfFlow = `序盤は${away}が主導権を握り、前半を${aw1stHalf}-${hm1stHalf}とリードして折り返す展開。`;
        } else if (hm1stHalf > aw1stHalf) {
            halfFlow = `序盤は${home}が持ち前のディフェンスとリズム良い攻撃で前半を${hm1stHalf}-${aw1stHalf}とリードして折り返した。`;
        } else {
            halfFlow = `前半は両軍ともに手堅い立ち上がりを見せ、${aw1stHalf}-${hm1stHalf}の同点でハーフタイムを迎えた。`;
        }

        const factors = generateDynamicAnalysisFactors(aw, hm, away, home, outcome);
        const topFactor = factors.length > 0 ? factors[0].text : '';
        let finalBody = `${summaryLead} ${halfFlow} 後半も白熱した攻防が続いたが、${topFactor ? topFactor + ' ' : ''}最終的に${outcome === 'tie' ? '同点のままタイムアップとなった。' : winner + 'が逃げ切った。'}`;

        const awPassYds = aw.passNetYds !== undefined ? aw.passNetYds : aw.passYds;
        const hmPassYds = hm.passNetYds !== undefined ? hm.passNetYds : hm.passYds;

        gameReportHTML = `
        <div style="padding:16px">
            <!-- 戦評サマリーカード -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:14px">
                <div style="font-size:.88rem;font-weight:700;color:#1e293b;margin-bottom:8px">📝 公式戦評サマリー（中立・客観視点）</div>
                <div style="font-size:.82rem;line-height:1.75;color:#334155;white-space:pre-wrap;background:#fff;padding:12px;border-radius:6px;border:1px solid #e2e8f0"><strong>${se(summaryHeadline)}</strong>\n\n${se(finalBody)}</div>
            </div>

            <!-- 動的要因分析カード -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:14px">
                <div style="font-size:.88rem;font-weight:700;color:#1e293b;margin-bottom:8px">⚡ 勝敗を分けた主要ファクター（Dynamic Factors）</div>
                ${factors.length === 0 ? '<div style="font-size:.76rem;color:#64748b">極端なスタッツの偏りはありませんでした</div>' : factors.map(f => {
                    const borderClr = f.type === 'key' ? '#f59e0b' : (f.type === 'warning' ? '#ef4444' : '#10b981');
                    const bgClr = f.type === 'key' ? 'rgba(245,158,11,.06)' : (f.type === 'warning' ? 'rgba(239,68,68,.06)' : 'rgba(16,185,129,.06)');
                    return `
                    <div style="padding:9px 12px;background:${bgClr};border-left:3px solid ${borderClr};border-radius:4px;margin-bottom:8px">
                        <div style="font-weight:700;font-size:.82rem;color:#1e293b;margin-bottom:3px">${se(f.title)}</div>
                        <div style="font-size:.78rem;color:#334155;line-height:1.5">${se(f.text)}</div>
                    </div>`;
                }).join('')}
            </div>

            <!-- チームスタッツ要約 -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px">
                <div style="font-size:.88rem;font-weight:700;color:#1e293b;margin-bottom:10px">📊 チームスタッツ要約（Head to Head）</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:.78rem">
                    <div style="background:#fff;padding:10px;border-radius:6px;border:1px solid #e2e8f0">
                        <div style="font-weight:700;color:#0090c8;margin-bottom:6px">🔵 ${se(away)}</div>
                        <div>総獲得ヤード: <strong>${aw.totalYards} yds</strong> (パス ${awPassYds} / ラン ${aw.rushYds})</div>
                        <div style="margin-top:3px">3rd Down: <strong>${aw.thirdDownConv}/${aw.thirdDownAtt}</strong></div>
                        <div style="margin-top:3px">TO: <strong>${aw.turnoversTotal}回</strong> / 反則: <strong>${aw.penaltiesCount}回</strong></div>
                    </div>
                    <div style="background:#fff;padding:10px;border-radius:6px;border:1px solid #e2e8f0">
                        <div style="font-weight:700;color:#6d3fd4;margin-bottom:6px">🟣 ${se(home)}</div>
                        <div>総獲得ヤード: <strong>${hm.totalYards} yds</strong> (パス ${hmPassYds} / ラン ${hm.rushYds})</div>
                        <div style="margin-top:3px">3rd Down: <strong>${hm.thirdDownConv}/${hm.thirdDownAtt}</strong></div>
                        <div style="margin-top:3px">TO: <strong>${hm.turnoversTotal}回</strong> / 反則: <strong>${hm.penaltiesCount}回</strong></div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    const qRow = (qs) => qs.map(v => `<td style="text-align:center;padding:5px 7px;border-bottom:1px solid #d1d9e6">${v}</td>`).join('');
    const fn = `pbp_${away}_vs_${home}_${new Date().toISOString().slice(0, 10)}.html`.replace(/[^a-zA-Z0-9_.\-]/g, '_');

    const customStyles = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:#f5f7fb;color:#1e293b;min-height:100vh;padding-bottom:50px}
    .save-card{background:#fff;border:1px solid #d1d9e6;border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
    .save-card-hdr{padding:12px 18px;background:#eef2f8;border-bottom:1px solid #d1d9e6;display:flex;align-items:center;justify-content:space-between}
    .save-card-title{font-size:.88rem;font-weight:700;letter-spacing:.5px;color:#1e293b;display:flex;align-items:center;gap:6px}
    .save-card-badge{font-size:.72rem;color:#64748b;background:#f5f7fb;padding:2px 8px;border-radius:20px;font-weight:600}
    
    /* Box Score Styles */
    .bs-section{margin-bottom:20px}
    .bs-team-heading{font-size:.92rem;font-weight:800;padding:8px 12px;background:rgba(0,144,200,0.08);border-left:4px solid #0090c8;border-radius:0 6px 6px 0;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;color:#1e293b}
    .bs-team-heading.home-side{background:rgba(109,63,212,0.08);border-left-color:#6d3fd4}
    .bs-tbl-card{background:#fff;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:12px;overflow:hidden}
    .bs-tbl-title{font-size:.74rem;font-weight:800;letter-spacing:1px;color:#64748b;padding:7px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-transform:uppercase}
    .bs-table-wrap{overflow-x:auto}
    .bs-table{width:100%;border-collapse:collapse;font-size:.8rem}
    .bs-table th{background:#f8fafc;padding:5px 8px;text-align:right;color:#64748b;font-weight:700;font-size:.7rem;border-bottom:1px solid #e2e8f0;white-space:nowrap}
    .bs-table th:first-child{text-align:left}
    .bs-table td{padding:5px 8px;text-align:right;border-bottom:1px solid #f1f5f9;color:#1e293b;white-space:nowrap}
    .bs-table td:first-child{text-align:left;font-weight:600}
    .bs-table tr:hover td{background:#f8fafc}
    .bs-tot-row td{font-weight:700;border-top:1px solid #cbd5e1;background:#f8fafc}
    .bs-unknown{color:#94a3b8;font-style:italic}
    .bs-noyds-mark{color:#ef4444;font-weight:700}
    .bs-footnote{font-size:.68rem;color:#64748b;padding:4px 12px 6px;text-align:right}
    `;

    const doc = `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>🏈 ${se(away)} vs ${se(home)} – Complete Game Archive</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Orbitron:wght@700&display=swap" rel="stylesheet"/>
<style>${customStyles}</style>
</head><body>
<div style="background:linear-gradient(135deg,#fff,#f0f4ff);border-bottom:1px solid #d1d9e6;padding:13px 18px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 6px rgba(0,0,0,.06)">
  <div style="display:flex;align-items:center;gap:10px">
    <span style="font-family:'Orbitron',sans-serif;font-size:1rem;color:#0090c8;letter-spacing:2px">🏈 PBP Creator</span>
    <span style="font-size:.72rem;color:#64748b">Complete Game Archive</span>
  </div>
  <span style="font-size:.72rem;color:#64748b">Saved ${new Date().toLocaleString('ja-JP')}</span>
</div>
<div style="max-width:880px;margin:20px auto;padding:0 14px">

  <!-- 1. スコアボード & ゲーム概要 -->
  <div class="save-card">
    <div style="background:linear-gradient(135deg,#eef4ff,#f0f7ff);padding:14px 18px">
      <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif">
        <thead><tr style="font-size:.67rem;font-weight:700;color:#64748b;text-transform:uppercase">
          <th style="text-align:left;padding:4px 7px;border-bottom:1px solid #d1d9e6;min-width:110px">TEAM</th>
          <th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q1</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q2</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q3</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">Q4</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">OT</th><th style="padding:4px 7px;border-bottom:1px solid #d1d9e6">T</th>
        </tr></thead>
        <tbody>
          <tr><td style="padding:5px 7px"><div style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#1e293b">${se(away)}</div><div style="font-size:.68rem;color:#64748b">${se(state.awayCity)}</div></td>${qRow(aqs)}<td style="text-align:center;padding:5px 10px;font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;color:#0090c8">${state.awayTotal}</td></tr>
          <tr><td style="padding:5px 7px"><div style="font-size:.9rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#1e293b">${se(home)}</div><div style="font-size:.68rem;color:#64748b">${se(state.homeCity)}</div></td>${qRow(hqs)}<td style="text-align:center;padding:5px 10px;font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:700;color:#6d3fd4">${state.homeTotal}</td></tr>
        </tbody>
      </table>
      ${(state.gameTime || state.gameVenue || state.gameName || state.gameWeather || state.ruleType) ? `<div style="display:flex;flex-wrap:wrap;gap:8px 18px;padding:10px 14px 12px;border-top:1px solid #d1d9e6;margin-top:8px">${state.gameTime ? `<span style="font-size:.75rem;color:#64748b">🗓 <span style="color:#1e293b">${se(state.gameTime)}</span></span>` : ''} ${state.gameVenue ? `<span style="font-size:.75rem;color:#64748b">🏟 <span style="color:#1e293b">${se(state.gameVenue)}</span></span>` : ''} ${state.gameName ? `<span style="font-size:.75rem;color:#64748b">🏆 <span style="color:#1e293b">${se(state.gameName)}</span></span>` : ''} ${state.gameWeather ? `<span style="font-size:.75rem;color:#64748b">🌤 <span style="color:#1e293b">${se(state.gameWeather)}</span></span>` : ''} <span style="font-size:.75rem;color:#64748b">📜 <span style="color:#1e293b">${state.ruleType === 'japan' ? '日本の大学' : (state.ruleType === 'college' ? 'College (NCAA)' : 'NFL')}</span></span></div>` : ''}
    </div>
  </div>

  <!-- 2. PLAY BY PLAY -->
  <div class="save-card">
    <div class="save-card-hdr">
      <span class="save-card-title">📋 PLAY BY PLAY</span>
      <span class="save-card-badge">${state.plays.filter(p => !NP.has(p.type)).length} plays</span>
    </div>
    ${playsHTML}
  </div>

  <!-- 3. 個人スタッツ (BOX SCORE ALL) -->
  <div class="save-card">
    <div class="save-card-hdr">
      <span class="save-card-title">📊 個人スタッツ (BOX SCORE)</span>
      <span class="save-card-badge">${playerStats.totalCountedPlays} counted plays</span>
    </div>
    ${boxScoreHTML}
  </div>

  <!-- 4. チームスタッツ (TEAM STATS) -->
  <div class="save-card">
    <div class="save-card-hdr">
      <span class="save-card-title">📈 チームスタッツ (TEAM STATS)</span>
      <span class="save-card-badge">Head to Head Comparison</span>
    </div>
    ${teamStatsHTML}
  </div>

  <!-- 5. 勝率推移グラフ (WIN PROBABILITY) -->
  <div class="save-card">
    <div class="save-card-hdr">
      <span class="save-card-title">📉 勝率推移グラフ (WIN PROBABILITY)</span>
      <span class="save-card-badge">${plays.length} plays analyzed</span>
    </div>
    ${winProbHTML}
  </div>

  <!-- 6. 公式戦評・傾向分析レポート (GAME REPORT) -->
  <div class="save-card">
    <div class="save-card-hdr">
      <span class="save-card-title">📝 公式戦評・傾向分析レポート (GAME REPORT)</span>
      <span class="save-card-badge">Summary & Dynamic Analysis</span>
    </div>
    ${gameReportHTML}
  </div>

</div></body></html>`;

    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fn;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('💾 HTMLファイルを保存しました');
}

/* ─── Toast ───────────────────────────────── */
let tt;
function toast(msg, bg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.style.background = bg || 'var(--gn)';
    el.classList.add('show'); clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove('show'), 2500);
}

/* ─── JSON Export / Import ────────────────── */
function exportJSON() {
    const away = state.awayName || 'AWAY', home = state.homeName || 'HOME';
    const fn = `pbp_${away}_vs_${home}_${new Date().toISOString().slice(0, 10)}.json`
        .replace(/[^a-zA-Z0-9_.\-]/g, '_');
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fn;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast('📤 JSONを保存しました');
}

function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleJSONImport(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
        try {
            const loaded = JSON.parse(ev.target.result);
            if (!loaded.plays || !loaded.quarterScores) throw new Error('invalid');
            state = {
                ...state,
                ...loaded,
                ruleType: loaded.ruleType || state.ruleType || 'nfl',
                highlightedPlayIds: loaded.highlightedPlayIds || [],
                drives: loaded.drives || {},
                manualStats: loaded.manualStats || { isEditing: false, playerStats: null, teamstats: null }
            };
            persist();
            syncRuleButtons();
            syncUI();
            toast('📥 JSONを読み込みました');
        } catch (e) {
            toast('❌ ファイルの読み込みに失敗しました', '#ff4444');
        }
    };
    reader.readAsText(file);
    input.value = '';
}

/* ─── Init ────────────────────────────────── */
loadState();
syncUI(); // Synchronously render UI immediately!
loadRosters().then(() => {
    syncUI(); // Re-sync with loaded rosters
});

if (window.location.protocol === 'file:') {
    const banner = document.getElementById('fileProtocolBanner');
    if (banner) banner.style.display = 'block';
}
