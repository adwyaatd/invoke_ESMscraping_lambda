'use strict';

const axios = require('axios')
const url = 'http://checkip.amazonaws.com/';

const response = null;

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
async function main(event, context) {
  try {
    const ret = await handle(event, context);
    console.log(ret);

    const test = {
      "no1": 1,
      "no2": 2,
      "no3": 3
    }
    console.log(typeof test);
    console.log(JSON.stringify(test, null, 2));
    const ret2 = await axios(url);
    console.log(typeof ret2);
    console.log(JSON.stringify(ret2, null, 2));
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: ret,
        message: ret2
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    console.log("error======");
    console.log(`err: ${err}`);
    console.log(`err type: ${typeof err}`);
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
  console.log('event');
  console.log(`event: ${typeof event}`);
  console.log(`event: ${JSON.stringify(event)}`);

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

main();