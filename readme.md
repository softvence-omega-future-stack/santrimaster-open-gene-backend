# Project Name : `Open Gene`

Live URL: *https://*

---


## 📑 Table of Contents

- [Data Types](#data-types)
    - [Account Model](#account-model)


- [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
        - [Register](#register)
        - [Login](#login)
        - [Change Password](#change-password)
        - [Forgot Password](#forgot-password)
        - [Reset Password](#reset-password)
        - [Get My Profile](#get-my-profile)
        - [Update Profile](#update-profile)


 ---


## Data Types 

### Account Model
```ts
export type TAccount = {
    fullName: string;
    affiliation: string;
    orcid: string;
    bio?: string;
    email: string;
    password: string;
    profileImage?: string;
    lastLoginTime?: Date;
    lastPasswordChange?: Date;
    isDeleted?: boolean;
    accountStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    isTermAgree?: boolean,
    role: "GUEST" | "RESEARCHER" | "CLINICIAN" | "ENGINEER" | "REVIEWER" | "DONAR" | "ADMIN";
    // coming from if admin confirmed
    additionalInfo?: {
        motivation?: string;
        experience?: string;
        resume?: string;
        googleScholar?: string;
        portfolio?: string;
        availability?: string;
        isAgree?: boolean
    }
}

```

## API Endpoints

### Authentication

#### Register
---
*Method*: `POST` <br/>
*Path*: `/auth/register` <br/>

`Request body` - Application/json <br/>

```json
{
    "fullName":"Abumahid Islam",
    "email":"dev.abumahid@gmail.com",
    "password":"123456",
    "affiliation":"236548963",
    "orcid":"156466"
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Account registration successful",
    "data": {
        ... // your posted data here
        "_id": "68d51236d6509568159a4a05",
        "createdAt": "2025-09-25T09:58:14.987Z",
        "updatedAt": "2025-09-25T09:58:14.987Z"
    },
    "meta": null
}
```


#### Login
---
*Method*: `POST` <br/>
*Path*: `/auth/login` <br/>

`Request body` - Application/json <br/>

```json
{
    "email":"dev.abumahid@gmail.com",
    "password":"123456"
}
``` 

*Response*
```json
{
    "success": true,
    "message": "User is logged in successful !",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldi5hYnVtYWhpZEBnbWFpbC5jb20iLCJyb2xlIjoiR1VFU1QiLCJpYXQiOjE3NTg3OTQ0NDIsImV4cCI6MTc1OTM5OTI0Mn0.Z1zxPmdMVYMwElHFfPdQHbjakVwS_-pDsOPzw5FAXcc",
        "role": "GUEST"
    },
    "meta": null
}
```

`Note that` : A accessToken and refreshToken save on in the cookie. You can pass both token in the header. No need to use extra authorization header.

#### Change Password
---
*Method*: `POST` <br/>
*Path*: `/auth/change-password` <br/>
*header*: `Authorization / cookie` <br/>

`Request body` - Application/json <br/>

```json
{
    "oldPassword":"123456",
    "newPassword":"000000"
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Password changed successfully!",
    "data": "Password changed successful.",
    "meta": null
}
```

#### Forgot Password
---
*Method*: `POST` <br/>
*Path*: `/auth/forgot-password` <br/>

`Request body` - Application/json <br/>

```json
{
    "email": "softvence.abumahid@gmail.com",
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Reset link is sent in your email inbox.",
    "data": null,
    "meta": null
}
```

#### Reset Password
---
*Method*: `POST` <br/>
*Path*: `/auth/reset-password` <br/>

`Request body` - Application/json <br/>

```json
{
    "token": "string",
    "email": "softvence.abumahid@gmail.com",
    "newPassword": "000000"
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Password reset successfully!",
    "data": null,
    "meta": null
}
```

#### Get My Profile
---
*Method*: `POST` <br/>
*Path*: `/auth/me` <br/>
*header*: `Authorization / cookie` <br/>

*Response*
```json
{
    "success": true,
    "message": "User profile fetched successfully!",
    "data": {
        "additionalInfo": {
            "isAgree": false
        },
        "_id": "68d51236d6509568159a4a05",
        "fullName": "Abumahid Islam",
        "affiliation": "236548963",
        "orcid": "156466",
        "email": "dev.abumahid@gmail.com",
        "password": "",
        "isDeleted": false,
        "accountStatus": "ACTIVE",
        "isTermAgree": false,
        "role": "GUEST",
        "createdAt": "2025-09-25T09:58:14.987Z",
        "updatedAt": "2025-09-25T10:49:24.723Z",
        "lastLoginTime": "2025-09-25T10:49:24.722Z",
        "lastPasswordChange": "2025-09-25T10:41:42.000Z"
    },
    "meta": null
}
```

#### Update Profile
---
*Method*: `PATCH` <br/>
*Path*: `/auth/register` <br/>

`Request body` - Multipart form data <br/>


| Name     | Type   | Description     |
|----------|--------|-----------------|
| image | File  | any type of image  |
|data | Object  | example object  |


```json
{
    "fullName": "string",
    // note that : email is not changeable
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Profile update successful",
    "data": {
        ... // your updated data
    },
    "meta": null
}
```