import datetime
import os
import logging
import json

logger = logging.getLogger()
logger.setLevel('INFO')


def handler(event, context):
    logger.info("Request: %s", event)
    region = os.environ['AWS_REGION']

    param_q = None
    if event.get('queryStringParameters') and event.get('queryStringParameters').get('q'):
       param_q = event['queryStringParameters']['q']

    response = {
        "headers": {
            'Access-Control-Allow-Headers': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        "statusCode": 200,
        "body": json.dumps(
            {"content": "It works",
             "region": region,
             "param_q": param_q,
             "time": str(datetime.datetime.now())
             })
    }

    logger.info("Response: %s", response)

    return response
