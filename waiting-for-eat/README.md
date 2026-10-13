<div align="center">
<img src="https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/ba2a5a80-b72b-49ae-82e9-2cdb38c96cd6" style="width:600px">
</div>
<p align="center">
 <a href="https://waiting-for-eat.web.app/">Website</a> | <a href=#about-waiting-for-eat>About</a> | <a href="#demo">Demo</a> | <a href="#contact">Contact</a>
</p>

# Waiting for Eat

Waiting for Eat is a restaurant reservation website for both "bosses" and "diners".</br>

- Bosses

  - Upload restaurant details, menus, and events.
  - Manage time slots, seating capacity, and reservations.

- Diners
  - Search for restaurants of interest.
  - Make reservations.
  - Review the restaurants they’ve been to.
  - Create their list of personal preferences.
  - Compose reviews and food diaries.

## About Waiting for Eat

- Applied `React Router` for SPA and fulfilled protected root to restrict actions based on user roles.
- Implemented global state management with `Zustand`.
- Used `Firebase Cloud Firestore` to manage the database.
- Managed native and Google user registration via `Firebase Authentication`.
- Utilized `Tailwind CSS`, `NextUI`, and `Ant Design` for UI.
- Applied `Framer Motion` for the animation to provide users with a smoother experience.
- Fulfilled real-time reservation information update with `Firestore onSnapshot`.
- Realized restaurants searching function through `Google Maps JavaScript API`, `Places API`, and `Geocoding API`.
- Implemented editor `React Draft Wysiwyg` for composing food reviews.
- Utilized `FullCalendar` to display current customer information and apply Drag&Drop to manage reservations status.
- Deployed website through `Firebase Hosting`.

## Built with

![](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black)
![](https://img.shields.io/badge/React%20Router-CA4245.svg?style=for-the-badge&logo=React-Router&logoColor=white)
![](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=Vite&logoColor=white)
![](https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![](https://img.shields.io/badge/Firebase-FFCA28.svg?style=for-the-badge&logo=Firebase&logoColor=black)
![](https://img.shields.io/badge/🐻 zustand-black.svg?style=for-the-badge =black)
![](https://img.shields.io/badge/Git-F05032.svg?style=for-the-badge&logo=Git&logoColor=white)
![](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black)
![](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white)
![](https://img.shields.io/badge/Google%20Maps-4285F4.svg?style=for-the-badge&logo=Google-Maps&logoColor=white)

### Base

- React
- Vite
- Firebase
- JavaScript
- Tailwind CSS

### Libraries

- React Draft Wysiwyg
- Zustand
- NextUI
- Ant Design
- Framer Motion
- FullCalendar

## Flow Chart

![chart flow](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/5a04564b-0a22-46de-a37b-f094aba6a10d)

## Demo

<a href="https://waiting-for-eat.web.app/">
 
![https://waiting-for-eat.web.app/](https://img.shields.io/badge/🍕&nbsp;Website-orange.svg?style=for-the-badge&logoColor=black)

</a>

### Test Account

- Boss:
  - Email: boss888@mail.com
  - Password: 888888
- Diner:
  - Email: diner168@mail.com
  - Password: 168168

### **Diner**

1. **【Homepage】**

   - Search for restaurants by name, city / county, or food categorization.
     ![diner-01](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/e960a7ef-ebed-4007-9825-0abf4afaa227)

2. **【Map page】**

   - Show related restaurant list with location.
   - If the diner is logged in, there will be thumbs icons on the list to indicate personal preferences.
   - Click on the image of the restaurant to obtain more related information about it.
     ![diner-02](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/7728b0c2-5604-4831-aff3-8ceab552b783)

3. **【Food diary page】** - Scroll to the bottom, where you can click on the restaurant photo to return to the restaurant page, or click on the button on the right to make a reservation.
   ![diner-04](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/a0a4058e-097c-4fd6-8c7b-20d10dc52bcf)

4. **【Diner page】**
   - Check the list of booked restaurants.
   - For visited restaurants, mark preferences or write reviews and food diaries.
     ![diner-05](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/c57970ed-5dba-4900-881d-84a5644e0571)

### **Boss**

1. **【Boss page】**
   - Upload restaurant information, menus, or events.
   - Update time slots and seating capacity.
   - Drag the reservation to change the dining time or seat, or click the buttons on it to confirm attendance or cancel.
     ![boss-01](https://github.com/HsiaoChuanWang/Eat-Project/assets/140884229/da77b5da-7a0d-44b2-94ea-bec97b4bcc5f)

## Contact

 <a href="mailto:j2130970@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-EA4335.svg?style=for-the-badge&logo=Gmail&logoColor=white" /></a>

  <a href="https://www.linkedin.com/in/hsiao-chuan-wang/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2.svg?style=for-the-badge&logo=LinkedIn&logoColor=white" />
  </a>
