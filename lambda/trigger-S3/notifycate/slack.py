import os
import requests

SLACK_APP_TOKEN = os.environ["SLACK_APP_MOJIMOJI_TOKEN"]


class UserNotFoundError(Exception):
    """UserNotFoundError"""


def get_channel_id(user_id):
    url = "https://slack.com/api/conversations.open"
    data = {
        "token": SLACK_APP_TOKEN,
        "users": user_id,
    }
    response = requests.post(url, data=data)
    try:
        response_json = response.json()
        print(f"get_channel_id({user_id}): responce = {response_json}")
    except Exception as e:
        print(e)
        print("response for conversations.open:", response)
        raise UserNotFoundError()
    if not response_json["ok"]:
        print("response json in get_channel_id()")
        print(response_json)
        print("user_id:", user_id)
        raise UserNotFoundError()

    return response_json["channel"]["id"]


def post_DM(id, text):
    url = "https://slack.com/api/chat.postMessage"
    if id[0] == "U":
        channel_id = get_channel_id(id)
    else:
        channel_id = id
    data = {
        "token": SLACK_APP_TOKEN,
        "text": text,
        "channel": channel_id,
    }
    response = requests.post(url, data=data)
    return response


if __name__ == "__main__":
    print(post_DM("U01AH94NELX", "これはテストです").text)
