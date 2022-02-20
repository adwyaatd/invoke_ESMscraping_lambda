// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response = null;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
  try {
    ret = await handle(event, context);
    console.log(ret);
    // const ret = await axios(url);
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: ret
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    console.log("error======");
    console.log(err);
    return err;
  }

  return response;
};

async function handle(event, context) {
  // const headers = event.headers;
  // const body = JSON.parse(event.body);

  console.log("handle");
  // 検索キーワードをDBから取得
  keywords = fetchKeywords();

  // ドメインをDBから取得
  domains = fetchDomains();

  // キーワードとドメインごとに繰り返し処理でSQSを登録
  ret = await sendSQS(keywords, domains);

  // 登録完了したらレスポンスを返す
  return ret;
}

let fetchKeywords = () => {
  return "keyword1";
};

let fetchDomains = () => {
  return "domain1";
};

let sendSQS = (keywords, domains) => {
  return `keywords: ${keywords} domains:${domains}`;
};
