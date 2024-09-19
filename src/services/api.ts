import axios from "axios";
import dotenv from "dotenv";
import querystring from "querystring";

dotenv.config();

const awplClient = axios.create({
  baseURL: process.env.SERVER_LOTTE_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    Authorization: process.env.SERVER_AUTHORIZATION,
  },
});

export function crawlDataProductCode(data) {
  return awplClient.post("/v1/p/mart/es/vi_vih/products/search", data);
}

const awplClientMykiot = axios.create({
  baseURL: process.env.SERVER_MYKIOT_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
    ["Store-Id"]: "393008",
  },
});

export function crawlDataProductMykiot(data) {
  return awplClientMykiot.post("/api/v1/products/search", data);
}

const awplClientSieuThiDucThanh = axios.create({
  baseURL: process.env.SERVER_SIEUTHIDUCTHANH_URL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
  },
});

const awplClientFbGraphql = axios.create({
  baseURL: process.env.SERVER_FB_GRAPHQL,
  headers: {
    maxBodyLength: Infinity,
    "Content-Type": "application/json",
  },
});

export function crawlDataProductSieuThiDucThanh({ product_bar_code }) {
  return awplClientSieuThiDucThanh.get("/search", {
    params: {
      type: "product",
      view: "json",
      q: product_bar_code,
    },
    headers: {
      ["sec-ch-ua-mobile"]: "?1",
      authority: "sieuthiducthanh.com",
      accept: "*/*",
      cookie:
        "cart_currency=VND; _landing_page=%2Fsearch%3Ftype%3Dproduct%26q%3D893501880160%26view%3Djson; _orig_referrer=https%3A%2F%2Fsieuthiducthanh.com%2Fsearch%3Fquery%3D8935018801603; cart=473f42a6f815906f734b019413820eb7; cart_sig=e805b6faeaef55bba376ca0b23152a9d",
    },
  });
}

export async function crawlDataGroupId({ cursor, searchText = "" }) {
  const url = "https://www.facebook.com/api/graphql/";

  const headers = {
    accept: "*/*",
    "accept-language": "en,vi;q=0.9,en-US;q=0.8",
    "content-type": "application/x-www-form-urlencoded",
    cookie:
      "datr=93emZuYtC3monePxe-stds5b; sb=93emZvXYIcFK7aqjsRFZu1NW; ps_l=1; ps_n=1; wl_cbv=v2%3Bclient_version%3A2587%3Btimestamp%3A1723265759; locale=vi_VN; ar_debug=1; c_user=100083130741074; xs=30%3ATf0VIqkvIRtIsA%3A2%3A1726643951%3A-1%3A6308; fr=1k25PQH2XfI0UJ5Nw.AWXSvda4KFkJ7oQM3E7vxRfM3kw.Bm6YyM..AAA.0.0.Bm6n7x.AWWHLOP5maI; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1726643957334%2C%22v%22%3A1%7D; wd=785x1491",
    origin: "https://www.facebook.com",
    priority: "u=1, i",
    referer:
      "https://www.facebook.com/groups/search/groups_home/?q=H%E1%BB%99i%20t%C3%ACm%20ng%C6%B0%E1%BB%9Di%20gi%C3%BAp%20vi%E1%BB%87c%20nh%C3%A0",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "sec-ch-ua-full-version-list":
      '"Chromium";v="128.0.6613.138", "Not;A=Brand";v="24.0.0.0", "Google Chrome";v="128.0.6613.138"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": '""',
    "sec-ch-ua-platform": '"macOS"',
    "sec-ch-ua-platform-version": '"13.4.1"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "x-asbd-id": "129477",
    "x-fb-friendly-name": "SearchCometResultsInitialResultsQuery",
    "x-fb-lsd": "0ay_H1GgSNouCUzdV8HlAw",
  };

  const data = querystring.stringify({
    av: "100083130741074",
    __aaid: "0",
    __user: "100083130741074",
    __a: "1",
    __req: "8v",
    __hs: "19984.HYP:comet_pkg.2.1..2.1",
    dpr: "2",
    __ccg: "EXCELLENT",
    __rev: "1016584690",
    __s: "pehmnp:lw4xrc:rdztib",
    __hsi: "7415879311211560492",
    __dyn:
      "7AzHK4HwBgDx-5Q1hyoyEqxd4Ag5S3G2O5U4e2C3-ubyQdwSAx-bwNw9G2Saxa1NwJwpUe8hw8u250n82nwb-q7oc81xoswMwto88422y11wBz822wtU4a3a4oaEnxO0Bo4O2-2l2UtwxwhU31wiE567Udo5qfK0zEkxe2Gexe5E5e7oqBwJK14xm3y3aexfxmu3W3y2616DBx_wHwfC2-VEbUGdG0HE88cA0z8c84p1e4UK2K364UrwFgbU5-269wkopg6C13xe3a3G1eKufxa3mUqwjVqwLwHw",
    __csr:
      "g573If8uxBgNdazOhWsADd94lE9Nahn7NkhVvdQLtiNcL68JcKh5rQB9Qy4bAAvWFZpdul4OpaaqBOp_mmjqrc-JimHnCAAhAht5Gh94Qq8yevQTuAZGjyoxa9gHUBrDK-KFADEDiV4heq8CGBGVaVFqJaqRFaqVpeaXUlCxa9yoyKjAzpEhy4iuRBG5KiWza-26qJ6mqdy62m8G68jWUq-F9pk8wQz-4qyu5dzoszGgSay46azEc8KqUB28C8GbAGU9pojyE8HxK58gDVFbxi22bxe3q4UOswGeBwQx61ry8uho-bwEwPwAxaexG2p0DBzEK5UjxmdDyWxmq9Cz8O4Uyq7Uyi0g-4FEC48Ou2Ku5oco4uap79k8IEK9mTkXgaUaEqgjyaO1m3eU2Ly8y1z-1Kwji0Rxq18wai58465onU7umcxh0Hwho7F521ww5YK0IVaokZxq2C1bwtz1d1e12wcmEggj50akEG1JBU2-Jy82iw8W3-1gw3RXw4QwmU8Hh69KDxhdxqRByE0aw8J0LU5i0arxG1Xw1uO0Re0t60fkweC0bdw2iE0tYw0Mpw0ml89U19Ue8jxmq0IE1j80H60P8bo0B20arw5uClw7APwby0sW0g6uew3Z8jxC1BoSbDw2do1io0Km3q06TE-0vC032q1KK0pIwd9824CHF0Lg1w80bz86aawlrwww9-0oG3R0iU0UO0hS0amU2sppQaw2kE",
    __comet_req: "15",
    fb_dtsg: "NAcMt1sjSQRycnsZ-mDyzEPoe5aelhzzldxjmsCKG4eF93E_vxlcLtQ:30:1726643951",
    jazoest: "25842",
    lsd: "0ay_H1GgSNouCUzdV8HlAw",
    __spin_r: "1016584690",
    __spin_b: "trunk",
    __spin_t: "1726643953",
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "SearchCometResultsInitialResultsQuery",
    variables: JSON.stringify({
      count: 1,
      allow_streaming: false,
      args: {
        callsite: "comet:groups_search",
        config: {
          exact_match: false,
          high_confidence_config: null,
          intercept_config: null,
          sts_disambiguation: null,
          watch_config: null,
        },
        context: {
          bsid: "1801e5d5-2437-404f-84ad-76db10bb6af6",
          tsid: "0.30743673869412214",
        },
        experience: {
          client_defined_experiences: ["ADS_PARALLEL_FETCH"],
          encoded_server_defined_params: null,
          fbid: null,
          type: "GROUPS_TAB_GLOBAL",
        },
        filters: [],
        text: searchText,
      },
      cursor: cursor,

      feedbackSource: 23,
      fetch_filters: true,
      renderLocation: "search_results_page",
      scale: 2,
      stream_initial_count: 0,
      useDefaultActor: false,
      __relay_internal__pv__CometImmersivePhotoCanUserDisable3DMotionrelayprovider: false,
      __relay_internal__pv__IsWorkUserrelayprovider: false,
      __relay_internal__pv__IsMergQAPollsrelayprovider: false,
      __relay_internal__pv__CometUFIReactionsEnableShortNamerelayprovider: false,
      __relay_internal__pv__CometUFIShareActionMigrationrelayprovider: true,
      __relay_internal__pv__IncludeCommentWithAttachmentrelayprovider: true,
      __relay_internal__pv__StoriesArmadilloReplyEnabledrelayprovider: true,
      __relay_internal__pv__EventCometCardImage_prefetchEventImagerelayprovider: false,
    }),
    server_timestamps: true,
    doc_id: "8646474315383063",
  });

  try {
    const response = await axios.post(url, data, { headers });
    const responseData = response.data;
    // Trích xuất cursor từ response
    const endCursor = responseData?.data?.serpResponse.results.page_info?.end_cursor;
    const hasNextPage = responseData?.data?.serpResponse.results.page_info?.has_next_page;

    return {
      data: responseData,
      endCursor: endCursor,
      hasNextPage: hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching Facebook data:", error);
  }
}
