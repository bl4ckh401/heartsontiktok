{
	"info": {
		"_postman_id": "da2f5c77-4d05-402e-a61c-2d230e8dff65",
		"name": "0.0.0",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "30102567",
		"_collection_link": "https://crimson-astronaut-8110.postman.co/workspace/My-Workspace~ef814e1c-c119-4c0a-82df-d424d62c9804/collection/30102567-da2f5c77-4d05-402e-a61c-2d230e8dff65?action=share&source=collection_link&creator=30102567"
	},
	"item": [
		{
			"name": "merchants",
			"item": [
				{
					"name": "Generate Bearer Token",
					"request": {
						"auth": {
							"type": "basic",
							"basic": [
								{
									"key": "password",
									"value": "cometappmain",
									"type": "string"
								},
								{
									"key": "username",
									"value": "app",
									"type": "string"
								},
								{
									"key": "showPassword",
									"value": false,
									"type": "boolean"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{BASE_URL}}/api/v1",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Initiate Stk Push | C2B",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mzg3NDMxMzksInVzZXJuYW1lIjoiY29sbHMifQ.vsZtyHgFDIJqyFf1W4osna0roCDzg-ZXhHwWMI4hxyk",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"impalaMerchantId\":\"{{username}}\",\n    \"displayName\":\"AVIATOR\",\n    \"currency\":\"KES\",\n    \"amount\":10,\n    \"payerPhone\":\"254768899729\", \n    \"mobileMoneySP\":\"M-Pesa\",\n    \"externalId\":\"ImpadlTdest2\",\n    \"callbackUrl\":\"https://e37f-197-232-22-252.ngrok-free.app\"\n}  ",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{BASE_URL}}/api/v1/mobile/initiate",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1",
								"mobile",
								"initiate"
							]
						}
					},
					"response": []
				},
				{
					"name": "Send to Mobile  | B2C",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc1MDQzMjUsIm1lcmNoYW50SUQiOiJuY2dhbWVzX3NhbmRib3giLCJ1c2VybmFtZSI6Im5jZ2FtZXNfc2FuZGJveCJ9.OZK6O9IZZCM6Gf3Iftku8FBFuIsYhULXJ53TFgKoO7g",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"impalaMerchantId\":\"{{username}}\",\n    \"currency\":\"KES\",\n    \"amount\":10,\n    \"recipientPhone\":\"254768899729\", \n    \"mobileMoneySP\":\"M-Pesa\",\n    \"externalId\":\"joeltest404\",\n    \"callbackUrl\":\"https://97e6-217-21-116-242.ngrok-free.app/\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{BASE_URL}}/api/v1/mobile/transfer",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1",
								"mobile",
								"transfer"
							]
						}
					},
					"response": []
				},
				{
					"name": "Card Payment",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzgxMjM3NDQsInVzZXJuYW1lIjoiY29sbHMifQ.0BSF1fMX55WkbTOAoFQeBfHOW1vX-MeXDQUa5Y8mjSg",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"impalaMerchantId\":\"{{username}}\",\n    // \"displayName\":\"AVIATOR\",\n    \"currency\":\"USD\",\n    \"amount\":1,\n    // \"payerPhone\":\"254768899729\", \n    \"mobileMoneySP\":\"card\",\n    \"externalId\":\"ImpadlTdest2\",\n    \"callbackUrl\":\"https://8bd0-2c0f-fe38-2413-2c98-7114-6990-db59-11c.ngrok-free.app/mc/log.php\"\n}                                                                                            ",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{BASE_URL}}/api/v1/card/initiate",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1",
								"card",
								"initiate"
							]
						}
					},
					"response": []
				},
				{
					"name": "payins bal",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc1ODI3ODYsIm1lcmNoYW50SUQiOiJuY2dhbWVzX3NhbmRib3giLCJ1c2VybmFtZSI6Im5jZ2FtZXNfc2FuZGJveCJ9.ZfcYzy0qAGTTHHu1mn3yNiVyr25zkYdl8xF9spVKap4",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "https://merchantsapi.swapuzi.com/api/v1/read/payins/balance",
							"protocol": "https",
							"host": [
								"merchantsapi",
								"swapuzi",
								"com"
							],
							"path": [
								"api",
								"v1",
								"read",
								"payins",
								"balance"
							]
						}
					},
					"response": []
				},
				{
					"name": "payour bal",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc1ODI3ODYsIm1lcmNoYW50SUQiOiJuY2dhbWVzX3NhbmRib3giLCJ1c2VybmFtZSI6Im5jZ2FtZXNfc2FuZGJveCJ9.ZfcYzy0qAGTTHHu1mn3yNiVyr25zkYdl8xF9spVKap4",
									"type": "string"
								}
							]
						},
						"method": "GET",
						"header": [],
						"url": {
							"raw": "https://merchantsapi.swapuzi.com/api/v1/read/payouts/balance",
							"protocol": "https",
							"host": [
								"merchantsapi",
								"swapuzi",
								"com"
							],
							"path": [
								"api",
								"v1",
								"read",
								"payouts",
								"balance"
							]
						}
					},
					"response": []
				},
				{
					"name": "card callback simulator succes",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": ""
						}
					},
					"response": []
				},
				{
					"name": "callback simulator success",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"Body\": {\n    \"stkCallback\": {\n      \"MerchantRequestID\": \"43eb-4e88-93af-c21af0171a6d66314058\",\n      \"CheckoutRequestID\": \"ws_CO_21012025132712034768899729\",\n      \"ResultCode\": 0,\n      \"ResultDesc\": \"The service request is processed successfully.\",\n      \"CallbackMetadata\": {\n        \"Item\": [\n          {\n            \"Name\": \"Amount\",\n            \"Value\": 1.00\n          },\n          {\n            \"Name\": \"MpesaReceiptNumber\",\n            \"Value\": \"NLJ7RT61SV\"\n          },\n          {\n            \"Name\": \"TransactionDate\",\n            \"Value\": 20250121132712\n          },\n          {\n            \"Name\": \"PhoneNumber\",\n            \"Value\": 254768899729\n          }\n        ]\n      }\n    }\n  }\n}\n",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{BASE_URL}}/api/v1/mobile/callback",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1",
								"mobile",
								"callback"
							]
						}
					},
					"response": []
				},
				{
					"name": "callback simulator failed",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"Body\": {\n    \"stkCallback\": {\n      \"MerchantRequestID\": \"8bb5-4b92-b7ce-12224022021d29394860\",\n      \"CheckoutRequestID\": \"ws_CO_21012025132712034768899729\",\n      \"ResultCode\": 1032,\n      \"ResultDesc\": \"Request canceled by user.\"\n    }\n  }\n}\n",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{BASE_URL}}/api/v1/mobile/callback",
							"host": [
								"{{BASE_URL}}"
							],
							"path": [
								"api",
								"v1",
								"mobile",
								"callback"
							]
						}
					},
					"response": []
				},
				{
					"name": "update Callback",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "wEh8AXg9wDnPvdjTdyOq7Yw4i8gW",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"ShortCode\": \"4904606\",\n    \"ResponseType\": \"Cancelled/Completed\",\n    \"ConfirmationURL\": \"https://payments.mam-laka.com/api/v1/mobile/callback\",\n    \"ValidationURL\": \"https://payments.mam-laka.com/api/v1/mobile/callback\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "https://api.safaricom.co.ke/mpesa/c2b/v2/registerurl",
							"protocol": "https",
							"host": [
								"api",
								"safaricom",
								"co",
								"ke"
							],
							"path": [
								"mpesa",
								"c2b",
								"v2",
								"registerurl"
							]
						}
					},
					"response": []
				},
				{
					"name": "tags",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": ""
						}
					},
					"response": []
				}
			]
		}
	]
}