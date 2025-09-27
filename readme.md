# Project Name : `Open Gene`

Live URL: *https://https://santrimaster-open-gene-backend.onrender.com/api*

---


## 📑 Table of Contents

- [Data Types](#data-types)
    - [Account Model](#account-model)
    - [Protocol Model](#protocol-model)
    - [Message Model](#message-model)
    - [Sponsor Model](#sponsor-model)


- [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
        - [Register](#register)
        - [Login](#login)
        - [Change Password](#change-password)
        - [Forgot Password](#forgot-password)
        - [Reset Password](#reset-password)
        - [Get My Profile](#get-my-profile)
        - [Update Profile](#update-profile)
    - [Protocol Endpoints](#protocol-endpoints)
        - [Create Protocol](#create-protocol)
        - [Get All Protocols](#get-all-protocols)
        - [Get Single Protocol](#get-single-protocol)
        - [Update Protocol](#update-protocol)
        - [Delete Protocol](#delete-protocol)
    - [Message Endpoints](#message-endpoints)
        - [Send Message](#send-message)
        - [Get All Messages](#get-all-messages)
    - [Sponsor Endpoints](#sponsor-endpoints)
        - [Create Sponsor](#create-sponsor)
        - [Get All Sponsors](#get-all-sponsors)
        - [Delete Sponsor](#delete-sponsor)


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

### Protocol Model
```ts
export type TProtocol = {
    _id: Types.ObjectId,
    protocolTitle: string,
    protocolDescription: string,
    category: string,
    tags: string[],
    technique: string,
    modality: string,
    organism: string,
    phase: string,
    estimatedTime: string,
    difficulty: string,
    bslLevel: string,
    materials?: {
        itemName: string,
        quantity: number,
        catalog: string,
        supplier: string,
    }[],
    equipment?: {
        equipmentName: string,
        note: string
    }[],
    doiLink?: string,
    additionalReference?: string,
    stepProcedure: string,
    attachment?: string,
    license: string,
    authors: Types.ObjectId,
    coAuthors?: Types.ObjectId[],
    isConfirmed: boolean,
    isAcknowledged: boolean,
    isConfidential: boolean,
    createdAt: Date,
    updatedAt: Date
}
```
### Message Model
```ts
export type TMessage = {
    _id: Types.ObjectId
    fullName: string;
    email: string;
    subject: string;
    message: string;
    attachments?: string
    isTermAgreed: boolean,
    createdAt: Date,
    updatedAt: Date
};
```
### Sponsor Model
```ts
export type TSponsor = {
    _id:Types.ObjectId
    companyName: string,
    contactName: string,
    email: string,
    sponsorshipLevel: string,
    message: string,
    createdAt: Date,
    updatedAt: Date
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
|data | Text  | example object  |


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

### Message Endpoints

#### Send Message
---
*Method*: `POST` <br/>
*Path*: `/message` <br/>

`Request body` - Multipart form data <br/>

| Name     | Type   | Description     |
|----------|--------|-----------------|
| image | File  | any type of image  |
|data | Text  | example object  |



```json
{
    "fullName": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "subject": "Inquiry about product",
    "message": "Hi, I would like more information about your product.",
    "isTermAgreed": true
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Message sent successfully!",
    "data": {
        "fullName": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "subject": "Inquiry about product",
        "message": "Hi, I would like more information about your product.",
        "attachments": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758870101041-Screenshot%202025-08-28%20124535.png",
        "isTermAgreed": true,
        "_id": "68d63a57ff15bcca2840c854",
        "createdAt": "2025-09-26T07:01:43.487Z",
        "updatedAt": "2025-09-26T07:01:43.487Z",
        "__v": 0
    },
    "meta": null
}
```

#### Get All Messages
---
*Method*: `GET` <br/>
*Path*: `/message` <br/>
*Header*: `Authorization / cookie` // Only admin access this<br/>

`Query Params` - page and limit <br/>

*Response*
```json
{
    "success": true,
    "message": "Message sent successfully!",
    "data": {
        "result": [
            {
                "_id": "68d63a57ff15bcca2840c854",
                "fullName": "Alice Johnson",
                "email": "alice.johnson@example.com",
                "subject": "Inquiry about product",
                "message": "Hi, I would like more information about your product.",
                "attachments": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758870101041-Screenshot%202025-08-28%20124535.png",
                "isTermAgreed": true,
                "createdAt": "2025-09-26T07:01:43.487Z",
                "updatedAt": "2025-09-26T07:01:43.487Z",
                "__v": 0
            }         
        ],
    },
    "meta": {
        "page": null,
        "limit": null,
        "total": 3,
        "totalPages": null
    }
}
```

## Protocol Endpoints

#### Create Protocol
---
*Method*: `POST` <br/>
*Path*: `/protocol` <br/>
**Header**: `Authorization / cookie`<br/>
`Request body` - Multipart form data <br/>

| Name     | Type   | Description     |
|----------|--------|-----------------|
| image | File  | any type of image  |
|data | Text  | example object  |


```json
{
  "protocolTitle": "Cell Culture Preparation",
  "protocolDescription": "This protocol describes the preparation of mammalian cell cultures under sterile conditions.",
  "category": "Cell Biology",
  "tags": ["cell culture", "sterile technique", "lab preparation"],
  "technique": "Aseptic Technique",
  "modality": "In-vitro",
  "organism": "Human (HeLa cells)",
  "phase": "Experimental",
  "estimatedTime": "2 hours",
  "difficulty": "Intermediate",
  "bslLevel": "BSL-2",
  "materials": [
    {
      "itemName": "DMEM Medium",
      "quantity": 1,
      "catalog": "12345",
      "supplier": "Sigma-Aldrich"
    },
    {
      "itemName": "Fetal Bovine Serum (FBS)",
      "quantity": 1,
      "catalog": "67890",
      "supplier": "Thermo Fisher"
    }
  ],
  "equipment": [
    {
      "equipmentName": "Laminar Flow Hood",
      "note": "Class II A2"
    }
  ],
  "doiLink": "https://doi.org/10.1000/j.jmb.2023.05.001",
  "additionalReference": "Smith J. et al. (2022) Cell Culture Basics.",
  "stepProcedure": "1. Sterilize hood. 2. Prepare medium. 3. Thaw cells. 4. Plate cells. 5. Incubate at 37°C with 5% CO2.",
  "attachment": "protocol_steps.pdf",
  "license": "CC-BY-4.0",
  "isConfirmed": true,
  "isAcknowledged": true,
  "isConfidential": false
}
``` 

*Response*
```json
{
    "success": true,
    "message": "Protocol sent successfully!",
    "data": {
        ....// your posted data
        "_id": "68d75bbca576db19b17d5efa",
        "createdAt": "2025-09-27T03:36:28.086Z",
        "updatedAt": "2025-09-27T03:36:28.086Z"
    },
    "meta": null
}
```

#### Get All Protocols
---
*Method*: `GET` <br/>
*Path*: `/protocol` <br/>

*Response*
```json
{
    "success": true,
    "message": "Protocol sent successfully!",
    "data": [
        {
            "_id": "68d75cc5a576db19b17d5f0e",
            "protocolTitle": "Cell Culture Preparation",
            "protocolDescription": "This protocol describes the preparation of mammalian cell cultures under sterile conditions.",
            "category": "Cell Biology",
            "tags": [
                "cell culture",
                "sterile technique",
                "lab preparation"
            ],
            "technique": "Aseptic Technique",
            "modality": "In-vitro",
            "organism": "Human (HeLa cells)",
            "phase": "Experimental",
            "estimatedTime": "2 hours",
            "difficulty": "Intermediate",
            "bslLevel": "BSL-2",
            "materials": [
                {
                    "itemName": "DMEM Medium",
                    "quantity": 1,
                    "catalog": "12345",
                    "supplier": "Sigma-Aldrich"
                },
                {
                    "itemName": "Fetal Bovine Serum (FBS)",
                    "quantity": 1,
                    "catalog": "67890",
                    "supplier": "Thermo Fisher"
                }
            ],
            "equipment": [
                {
                    "equipmentName": "Laminar Flow Hood",
                    "note": "Class II A2"
                }
            ],
            "doiLink": "https://doi.org/10.1000/j.jmb.2023.05.001",
            "additionalReference": "Smith J. et al. (2022) Cell Culture Basics.",
            "stepProcedure": "1. Sterilize hood. 2. Prepare medium. 3. Thaw cells. 4. Plate cells. 5. Incubate at 37°C with 5% CO2.",
            "attachment": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758944446372-Screenshot%202025-08-28%20124535.png",
            "license": "CC-BY-4.0",
            "authors": "68d51236d6509568159a4a05",
            "coAuthors": [],
            "isConfirmed": true,
            "isAcknowledged": true,
            "isConfidential": false,
            "createdAt": "2025-09-27T03:40:53.819Z",
            "updatedAt": "2025-09-27T03:40:53.819Z"
        },
        {.....}
    ],
    "meta": {
        "total": 6,
        "page": null,
        "limit": null,
        "totalPages": null
    }
}
```

#### Get Single Protocols
---
*Method*: `GET` <br/>
*Path*: `/protocol/:id` <br/>

`Note that :` You need to replace `:id` with the actual protocol id.

*Response*
```json
{
    "success": true,
    "message": "Protocol fetched successfully!",
    "data": {
        "_id": "68d75bbca576db19b17d5efa",
        "protocolTitle": "Cell Culture Preparation",
        "protocolDescription": "This protocol describes the preparation of mammalian cell cultures under sterile conditions.",
        "category": "Cell Biology",
        "tags": [
            "cell culture",
            "sterile technique",
            "lab preparation"
        ],
        "technique": "Aseptic Technique",
        "modality": "In-vitro",
        "organism": "Human (HeLa cells)",
        "phase": "Experimental",
        "estimatedTime": "2 hours",
        "difficulty": "Intermediate",
        "bslLevel": "BSL-2",
        "materials": [
            {
                "itemName": "DMEM Medium",
                "quantity": 1,
                "catalog": "12345",
                "supplier": "Sigma-Aldrich"
            },
            {
                "itemName": "Fetal Bovine Serum (FBS)",
                "quantity": 1,
                "catalog": "67890",
                "supplier": "Thermo Fisher"
            }
        ],
        "equipment": [
            {
                "equipmentName": "Laminar Flow Hood",
                "note": "Class II A2"
            }
        ],
        "doiLink": "https://doi.org/10.1000/j.jmb.2023.05.001",
        "additionalReference": "Smith J. et al. (2022) Cell Culture Basics.",
        "stepProcedure": "1. Sterilize hood. 2. Prepare medium. 3. Thaw cells. 4. Plate cells. 5. Incubate at 37°C with 5% CO2.",
        "attachment": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758944185626-Screenshot%202025-08-28%20124535.png",
        "license": "CC-BY-4.0",
        "authors": {
            "_id": "68d51236d6509568159a4a05",
            "fullName": "Hello jonogon",
            "affiliation": "236548963",
            "orcid": "156466",
            "email": "dev.abumahid@gmail.com",
            "isDeleted": false,
            "accountStatus": "ACTIVE",
            "isTermAgree": false,
            "role": "GUEST",
            "additionalInfo": {
                "isAgree": false
            },
            "createdAt": "2025-09-25T09:58:14.987Z",
            "updatedAt": "2025-09-27T03:30:39.891Z",
            "lastLoginTime": "2025-09-27T03:30:39.891Z",
            "lastPasswordChange": "2025-09-25T10:41:42.000Z",
            "profileImage": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758862921489-Screenshot%202025-08-28%20124535.png"
        },
        "coAuthors": [
            {
                "_id": "68d51236d6509568159a4a05",
                "fullName": "Hello jonogon",
                "affiliation": "236548963",
                "orcid": "156466",
                "email": "dev.abumahid@gmail.com",
                "isDeleted": false,
                "accountStatus": "ACTIVE",
                "isTermAgree": false,
                "role": "GUEST",
                "additionalInfo": {
                    "isAgree": false
                },
                "createdAt": "2025-09-25T09:58:14.987Z",
                "updatedAt": "2025-09-27T03:30:39.891Z",
                "lastLoginTime": "2025-09-27T03:30:39.891Z",
                "lastPasswordChange": "2025-09-25T10:41:42.000Z",
                "profileImage": "https://open-gene.s3.eu-north-1.amazonaws.com/photos/1758862921489-Screenshot%202025-08-28%20124535.png"
            }
        ],
        "isConfirmed": true,
        "isAcknowledged": true,
        "isConfidential": false,
        "createdAt": "2025-09-27T03:36:28.086Z",
        "updatedAt": "2025-09-27T03:36:28.086Z"
    },
    "meta": null
}
```



#### Update Protocol
---
*Method*: `PATCH` <br/>
*Path*: `/protocol/:id` <br/>
*Header*: `Authorization / cookies` <br/>
`Note that :` You need to replace `:id` with the actual protocol id.

`Request body` - Form data <br/> 

| Key | Type | Description |
| --- | --- | --- |
|image|File|any type of image|
|data|Text|example object|

```json
// All data are optional 
```

*Response*
```json
{
    "success": true,
    "message": "Protocol updated successfully!",
    "data": {
        ... // updated data here
    },
    "meta": null
}
```

#### Delete Protocol
---
*Method*: `DELETE` <br/>
*Path*: `/protocol/:id` <br/>
*Header*: `Authorization / cookies` <br/>
`Note that :` You need to replace `:id` with the actual protocol id.

*Response*
```json
{
    "success": true,
    "message": "Protocol deleted successfully!",
    "data": null,
    "meta": null
}
```


### Sponsor Endpoints

#### Create Sponsor
---
*Method*: `POST` <br/>
*Path*: `/sponsor` <br/>

`Request body` - Application/json <br/>

```json
{
  "companyName": "TechNova Solutions",
  "contactName": "Alice Johnson",
  "email": "alice.johnson@technova.com",
  "sponsorshipLevel": "Gold",
  "message": "We are excited to support this initiative and look forward to future collaborations."
}

``` 

*Response*
```json
{
    "success": true,
    "message": "Sponsor saved successfully!",
    "data": {
        "companyName": "TechNova Solutions",
        "contactName": "Alice Johnson",
        "email": "alice.johnson@technova.com",
        "sponsorshipLevel": "Gold",
        "message": "We are excited to support this initiative and look forward to future collaborations.",
        "_id": "68d77ee9b4b711c6b001e781",
        "createdAt": "2025-09-27T06:06:33.777Z",
        "updatedAt": "2025-09-27T06:06:33.777Z",
        "__v": 0
    },
    "meta": null
}
```
#### Get All Sponsors
---
*Method*: `GET` <br/>
*Path*: `/sponsor` <br/>

*Response*
```json
{
    "success": true,
    "message": "Sponsor fetched successfully!",
    "data": [
        {
            "_id": "68d77ee9b4b711c6b001e781",
            "companyName": "TechNova Solutions",
            "contactName": "Alice Johnson",
            "email": "alice.johnson@technova.com",
            "sponsorshipLevel": "Gold",
            "message": "We are excited to support this initiative and look forward to future collaborations.",
            "createdAt": "2025-09-27T06:06:33.777Z",
            "updatedAt": "2025-09-27T06:06:33.777Z",
            "__v": 0
        },
        {...}
    ],
    "meta": {
        "total": 1,
        "page": null,
        "limit": null,
        "totalPages": null
    }
}
```
#### Delete Sponsor
---
*Method*: `DELETE` <br/>
*Path*: `/sponsor/:id` <br/>
`Note that :` You need to replace `:id` with the actual sponsor id.<br/>

*header* : `Authorization / cookies` // only admin can delete

*Response*
```json
{
    "success": true,
    "message": "Sponsor delete successfully!",
    "data": null,
    "meta": null
}
```