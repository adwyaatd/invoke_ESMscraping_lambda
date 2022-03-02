'use strict';

const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';

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
    const ret = await handle(event, context);
    // const test = {
    //   "no1": 1,
    //   "no2": 2,
    //   "no3": 3
    // }
    // process.stdout.write(JSON.stringify(test, null, 2));
    const ret2 = await axios(url);
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: ret,
        location: ret2.data.trim()
      })
    }
  } catch (err) {
    console.log("error======");
    console.err(`err: ${err}`);
    process.stdout.write(`\n ${err}`);
    console.log("error======");
    return err;
  }

  return response;
};

function fetchKeywords() {
  console.log("enter fetchKeywords");
  return "keyword1";
};

function fetchDomains() {
  console.log("enter fetchDomains");
  return "domain1";
};

function sendSQS(keywords, domains) {
  console.log("enter sendSQS");
  return `keywords: ${keywords} domains:${domains}`;
};

async function handle(event, context) {
  // const headers = event.headers;
  // const body = JSON.parse(event.body);

  // 検索キーワードをDBから取得
  const keywords = fetchKeywords();
  console.log(`keywords: ${keywords}`);

  // ドメインをDBから取得
  const domains = fetchDomains();

  // キーワードとドメインごとに繰り返し処理でSQSを登録
  const ret = sendSQS(keywords, domains);

  // 登録完了したらレスポンスを返す
  return ret;
}
