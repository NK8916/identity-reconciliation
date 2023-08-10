# identity-reconciliation

# This service built using Nestjs framework using typescript language.

## url for the deployed service:- 

https://identity-reconciliation-hjf4.onrender.com

## Sample Curl :-

```
curl --location 'https://identity-reconciliation-hjf4.onrender.com/identity' \
--header 'Content-Type: application/json' \
--data-raw '{"phoneNumber":"+919873535330","email":"test@gmail.com"}'
```

## Steps to set-up locally :-
- Install the nestjs using command 
    ```
    npm i -g @nestjs/cli
    ```
- Clone the Respository and after run the following command
    ```
    npm install
    ```
- Execute the following command to run the server locally.
    ```
    npm run start:dev
    ```