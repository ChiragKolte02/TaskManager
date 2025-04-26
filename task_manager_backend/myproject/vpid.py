from pywebpush import webpush, WebPushException
import json
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

# Manually generate VAPID keys
def generate_vapid_keys():
    private_key = base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8')
    public_key = base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8')

    return public_key, private_key

public_key, private_key = generate_vapid_keys()

print(f"Public Key: {public_key}")
print(f"Private Key: {private_key}")
